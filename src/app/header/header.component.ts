import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

  public logout() {
    if (confirm("Do you want to Logout ?")) {
      localStorage.removeItem("logedUser");
      this._sharedService.emitChange(null);
      this.router.navigate(['']);
    } else
      return false;
  }
}
