import { Component, OnInit, Output, EventEmitter, AfterViewChecked, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  logedUser: User = null;
  @Output() public sidenavToggle = new EventEmitter();

  constructor(
    private _sharedService: SharedService,
  ) {
    _sharedService.changeEmitted$.subscribe(
      user => {
        this.logedUser = user;
      });
  }

  ngOnInit() {
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }
  
}
