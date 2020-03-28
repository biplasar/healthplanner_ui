import { Component, OnInit, Output, EventEmitter, AfterViewChecked, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { SharedService } from '../services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  logedUser: User;
  @Output() public sidenavToggle = new EventEmitter();

  constructor(
    private router: Router,
    private _sharedService: SharedService,
  ) {
    _sharedService.changeEmitted$.subscribe(
      user => {
        this.logedUser = user;
      });
  }

  ngOnInit() {
    this.logedUser = JSON.parse(localStorage.getItem("logedUser"));
    alert(this.logedUser);
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

  public logout() {
    this._sharedService.emitChange(null);
    localStorage.removeItem("logedUser");
    this.router.navigate(['']);
  }
}
