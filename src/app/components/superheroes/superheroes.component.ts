import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrudService } from '../../services/crud.service';

// Pager service (pagination)
import { PagerService } from '../../services/pager.service';

// Search (user defined)
import { SearchService } from '../../services/search.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-superheroes',
  templateUrl: './superheroes.component.html',
  styleUrls: ['./superheroes.component.scss'],
  providers: [SearchService]
})
export class SuperheroesComponent implements OnInit, OnDestroy { 

  cForm: FormGroup;     // Create new user form
  rForm: FormGroup;     // Update user form
  private _sub;         // Subscription to service
  private _sub_search;  // Subscription to service
  res: any;             // Property for our submitted forms
  
  // Form fields
  id:any;
  name:string = '';
  realname:string = '';
  actor:string = '';
  img:string = '';

  // Form toggle
  editForm_isVisible:boolean = false;
  createForm_isVisible:boolean = false;

  // Modal style vars (required for bootstrap)
  public visible = false;
  public visibleAnimate = false;

  // Image overlay for update image
  public is_preview = false;

  // Create image
  imageUrl_create: any; // Image variable for create new user form
  public cImageFile;    // Store the image file data for upload
  
  // Alert messages for create new user
  alert_name:string = 'The name is required';
  alert_realname:string = 'The real name is required';
  alert_actor:string = 'The actor is required';
  alert_image:string = 'This image URL is required';

  // Pager (pagination)
  allItems;          // array of all items to be paged
  pager: any = {};   // pager object
  pagedItems: any[]; // paged items

  // Kill pagination of search results === 0
  kill_pagination:boolean = false;

  // Search (user defined)
  results: any; //results: Object;
  searchTerm$ = new Subject<string>();

  // Output search term if NO RESULTS
  searchTerm_display:any;

  constructor(private fb: FormBuilder, el: ElementRef, private crudService: CrudService,
    private pagerService: PagerService, private searchService: SearchService) {

    // Search function (user defined)
    this._sub_search = this.searchService.search(this.searchTerm$, 'name')
    .subscribe(
      data => {
        
        if(data[0] === 'no results') {
          this.res = [];
          this.kill_pagination = true;
        } else {
          this.res = data;
          this.kill_pagination = false;
        }
        
        // Pager (pagination)
        this.allItems = data; // set items to json response
        this.setPage(1);      // initialize to page 1

        // Output search term if NO RESULTS
        this.searchTerm_display = (<HTMLInputElement>document.getElementById('searchTerm')).value;

        if(this.searchTerm_display === '') { 
          let sort = (<HTMLInputElement>document.getElementById('sort')).value;
          this.sortRecord(sort);
        }
      },
      error => { console.log('SEARCH error'); }
      );
      this.rForm = this.fb.group({
        name: [''],
        realname: [''],
        actor: [''],
        img: ['']
      });

  }

  //== Modal Functions (show / hide the create new user form)
  showModal() {
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
  }
  hideModal() {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }
  onModalContainerClicked(event: MouseEvent) {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hideModal();
    }
  }

  //== Forms
  showCreateForm() {
    this.createForm_isVisible = !this.createForm_isVisible;
  }
  cancelCreateForm() {
    this.cForm.reset();
    this.imageUrl_create = '';
    this.hideModal();
    this.createForm_isVisible = !this.createForm_isVisible;
  }

  showEditForm(index) {
    let val = index;
    let resindex = this.res.findIndex(function(item, i) { return item.id === val });
    this.res[resindex].editForm_isVisible = !this.res[resindex].editForm_isVisible;
    let focusElement = 'focus'+index;
    setTimeout(() => document.getElementById(focusElement).focus(), 100);
  }
  cancelEditForm(index) {
    let val = index;
    let resindex = this.res.findIndex(function(item, i) { return item.id === val });
    this.res[resindex].editForm_isVisible = !this.res[resindex].editForm_isVisible;
  }

  resetForm(form) {
    form = this.fb.group({
      name: [''],
      realname: [''],
      actor: [''],
      img: ['']
    });
  }

  //== Crud Functions
  createRecord(event) {
    event.preventDefault();
    this.hideModal();

    let name = this.cForm.get('name').value;
    let realname = this.cForm.get('realname').value;
    let actor = this.cForm.get('actor').value;
    let img = this.cForm.get('img').value;

    this.cForm = this.fb.group({
      editable: 1,
      name: [name],
      realname: [realname],
      actor: [actor],
      img: [img]
    });

    // if fields are left empty
    if(actor=='' || actor == null) { 
      this.cForm.patchValue({ actor: 'unknown' });
    }
    if(realname=='' || realname == null) { 
      this.cForm.patchValue({ realname: 'unknown' });
    }

    let formValue = this.cForm.value;
    this._sub = this.crudService.createData(formValue)
    .subscribe(
      data => {
        this.res = data;
        this._sub.unsubscribe();
        let sort = (<HTMLInputElement>document.getElementById('sort')).value = 'recent';
        this.sortRecord('recent');
        
      },
      error => { this._sub.unsubscribe(); console.log('CREATE error'); }
      
    );
    this.cForm = this.fb.group({
      name: [name],
      realname: [realname],
      actor: [actor],
      img: [img]
    });
  }

  sortRecord(value) {
    let type; 
    switch (value) {
      case 'recent': value='id'; type='DESC'; break;
      case 'name': type='ASC'; break;
      case 'realname': type='ASC'; break;
      case 'actor': type='ASC'; break;
    }
    let JSONObj = {"orderBy":value, "type":type};

    this._sub = this.crudService.readDataSort(JSONObj)
    .subscribe(
      data => {
        this.res = data;
        this.allItems = this.res;
        this._sub.unsubscribe();
        this.setPage(1);
      },
      error => { this._sub.unsubscribe(); console.log('SORT error'); }
    );
    this.resetForm(this.rForm);
  }

  readRecord() {
    this._sub = this.crudService.readData(null)
    .subscribe(
      data => {
        this.res = data;
        this.allItems = this.res;
        this._sub.unsubscribe();
        this.setPage(1);
      },
      error => { this._sub.unsubscribe(); console.log('READ error'); }
    );
    this.resetForm(this.rForm);
  }

  updateRecord(id) {
    let val = id;
    let resindex = this.res.findIndex(function(item, i) { return item.id === val });
    this.res[resindex].editForm_isVisible = !this.res[resindex].editForm_isVisible;

    let name = this.rForm.get('name').value;
    let realname = this.rForm.get('realname').value;
    let actor = this.rForm.get('actor').value;
    let img = this.rForm.get('img').value;

    if(name!='') { this.res[resindex].name = name; }
    if(realname!='') { this.res[resindex].realname = realname; }
    if(actor!='') { this.res[resindex].actor = actor; }
    if(img!='') {
      this.res[resindex].img = img;
    } else {
      this.rForm.patchValue({
        img: this.res[resindex].img
      });
    }

    // Update the DB
    let formValue = this.rForm.value;
    this._sub = this.crudService.updateData( formValue, id )
    .subscribe(
      data => {
        this._sub.unsubscribe();
      },
      error => {
        this._sub.unsubscribe();
        console.log('UPDATE error');
      }
    );
    this.resetForm(this.rForm);
  }
  
  deleteRecord(id) {
    let deleteElement = 'superhero'+id;
    document.getElementById(deleteElement).style.display = "none";

    this._sub = this.crudService.deleteData(id)
    .subscribe(
      data => {
        this._sub.unsubscribe();
        this.readRecord();
      },
      error => { this._sub.unsubscribe(); console.log('DELETE error'); this.readRecord(); }
    );
  }

  //== Pager (pagination)
  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }

    this.pager = this.pagerService.getPager(this.allItems.length, page, 6);
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  //== Initialize and Destroy functions
  ngOnInit() {
    this.editForm_isVisible = false;
    this.resetForm(this.rForm);

    this.cForm = this.fb.group({
      'name' : [null, Validators.required],
      'realname' : [null],
      'actor' : [null],
      'img' : [null, Validators.required],
      'validate' : ''
    });
    this.imageUrl_create = '';

    // Read (pull) data from DB
    this.readRecord();
  }

  ngOnDestroy() {
    if (this._sub) {
      this._sub.unsubscribe();
    }
  }

}
