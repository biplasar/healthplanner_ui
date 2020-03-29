import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from '../model/user';
import { SharedService } from '../services/shared.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../shared/dialogs/dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  logedUser: User;
  @Output() public sidenavToggle = new EventEmitter();
  private dialogConfig;

  constructor(
    private router: Router,
    private _sharedService: SharedService,
    private dialog: MatDialog,
  ) {
    _sharedService.changeEmitted$.subscribe(
      user => {
        this.logedUser = user;
      });
  }

  ngOnInit() {
    this.logedUser = JSON.parse(localStorage.getItem("logedUser"));

    this.dialogConfig = {
      height: '200px',
      width: '400px',
      disableClose: true,
      panelClass: 'custom-modalbox',
      data: {}
    }
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

  public logout() {
    this.dialogConfig.data = { 'title': "Confirm Action", 'option': 'yes/no', 'message': 'Do you want to Logout ?' };
    let dialogRef = this.dialog.open(DialogComponent, this.dialogConfig);
    dialogRef.afterClosed().subscribe(
      dialogResult => {
        if (dialogResult == true) {
          localStorage.removeItem("logedUser");
          this._sharedService.emitChange(null);
          this.router.navigate(['']);
        }
      });
  }

}
