import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();

  constructor(
    private router: Router,
    private _sharedService: SharedService,
  ) { }

  ngOnInit() {
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
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
