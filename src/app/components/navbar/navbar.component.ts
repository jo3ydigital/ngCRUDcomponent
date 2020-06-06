import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// used for capturing click events away from dropdown menu (to hide it)
import {Directive, ElementRef, Output, EventEmitter, HostListener} from '@angular/core';
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

  constructor(private _eref: ElementRef, private fb: FormBuilder, private router: Router) { }
  // hamburger menu
  ToggleHamburgerMenu() {
    this.h_menu_open = !this.h_menu_open;
  }

  closeHamburgerMenu() {
    let checkbox = <HTMLInputElement>document.getElementById('menu-toggle');
    checkbox.checked = !checkbox.checked;
    // change the "X" back to the original state
    this.h_menu_open = false;
  }

  
  toggleHmenuState() {
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
    this.dropMenu_isOpen = false;
    this.dropMenu_isClosed = true;
  }

  // capture click events
  @HostListener('document:click', ['$event'])

  onClick(event) {
    var target = event.target;
      
    if (!target.closest(".dropdown") || this.dropMenu_isOpen == false) {
      // hide the dropdown when clicking away from it
      this.hideDrop();
    }
  }

  ngOnInit() {
    // give the formGroup a formGroup instance
    this.lForm = this.fb.group({
      username: [''],
      password: ['']
    });
  }

}
