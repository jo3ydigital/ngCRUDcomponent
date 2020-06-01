import { Component, OnInit } from '@angular/core';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// form-specific functions
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// used for capturing click events away from dropdown menu (to hide it)
import {Directive, ElementRef, Output, EventEmitter, HostListener} from '@angular/core';

import { LoginService } from '../../services/login.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  // drop shadows for different pages
  drop_light: boolean = false;
  drop_blue: boolean = true;
  drop_orange: boolean = false;

  // hamburger menu
  h_menu_open: boolean = false;

  lForm: FormGroup;     // Update user form
  private _sub;         // Subscription to service
  res: any;             // Property for our submitted forms

  hMenu_isOpen = false;
  hMenuClass = 'navHmenu_closed collapse navbar-collapse';

  dropMenu_isOpen = false;
  dropMenu_isClosed = true;
  drop_class = 'dropdown';

  loginContainer_isVisible = false;
  login_isVisible = false;

  is_loggedIn = false;

  constructor(private _eref: ElementRef, private fb: FormBuilder, private loginService: LoginService, private router: Router) { }

  //== NEW NAVBAR
  // **************************************
  ToggleHamburgerMenu() {
    this.h_menu_open = !this.h_menu_open;
  }

  // close hamburger menu if menu button (link) is clicked
  closeHamburgerMenu() {
    let checkbox = <HTMLInputElement>document.getElementById('menu-toggle');
    checkbox.checked = !checkbox.checked;
    // change the "X" back to the original state
    this.h_menu_open = false;
  }
  // **************************************
  // END NEW NAVBAR


  // hamburger menu
  toggleHmenuState() { // click handler
    let bool = this.hMenu_isOpen;
    this.hMenu_isOpen = bool === false ? true : false;
  }

  // dropdown
  dropMenuState() {
    let bool = this.dropMenu_isOpen;
    this.dropMenu_isOpen = bool === false ? true : false;

    let bool2 = this.dropMenu_isClosed;
    this.dropMenu_isClosed = bool2 === true ? false : true;
  }

  // hide dropdown
  hideDrop() {
    var ddMenu = document.getElementById('ddMenu');
    //ddMenu.className = "dropdown closed";
    this.dropMenu_isOpen = false; //console.log('click event fired!');
    this.dropMenu_isClosed = true;
  }

  // login toggle
  toggleLoginState() {
    let bool = this.login_isVisible;
    this.login_isVisible = bool === false ? true : false
  }

  // just a silly test -> generate a random background color for the toolbar
  // public getRandomColor(){
  //     var letters = '0123456789ABCDEF'.split('');
  //     var color = '#';
  //     for (var i = 0; i < 6; i++){
  //         color += letters[Math.floor(Math.random() * 16)];
  //     }
  //     console.log('randomcolor = '+color);
  //     return color;
  // }
  // randomcolor = this.getRandomColor();

  // capture click events
  @HostListener('document:click', ['$event'])

  onClick(event) {
    var target = event.target;
    // if (!target.closest(".dropdown-menu") && !target.closest(".dropdown")) {  // check click origin
      
    if (!target.closest(".dropdown") || this.dropMenu_isOpen == false) {
      // hide the dropdown when clicking away from it
      this.hideDrop();
    }
  }

  // Submit the login form
  checkLogin(event) {
    event.preventDefault();

    let username = this.lForm.get('username').value;
    let password = this.lForm.get('password').value;

    this.lForm = this.fb.group({
      username: [username],
      password: [password]
    });

    this.toggleLoginState();

    //console.log('BEFORE -> username: '+username+' | password: '+password);
    let formValue = this.lForm.value;
    this._sub = this.loginService.login(formValue)
    .subscribe(
      data => { 
        this.res = data;
        this.res === 1 ? this.is_loggedIn=true : this.is_loggedIn=false;
        //console.log('subscribe call: '+this.res+' is_loggedIn: '+this.is_loggedIn);
      },
      error => { console.log('An error occurred on the server'); }
    );
    this.lForm = this.fb.group({
      username: [],
      password: []
    });
  }

  logout() {
    this._sub = this.loginService.logout();
    this.is_loggedIn=false;
  }

  ngOnInit() {
    // give the formGroup a formGroup instance
    this.lForm = this.fb.group({
      username: [''],
      password: ['']
    });
    // Validate form fields
    // this.lForm = this.fb.group({
    //   'uname' : [null, Validators.required],
    //   'pass' : [null, Validators.required]
    // });
  }

}
