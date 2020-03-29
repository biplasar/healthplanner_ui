import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { DialogComponent } from '../shared/dialogs/dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {

  @Output() sidenavClose = new EventEmitter();
  private dialogConfig;

  constructor(
    private router: Router,
    private _sharedService: SharedService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.dialogConfig = {
      height: '200px',
      width: '400px',
      disableClose: true,
      panelClass: 'custom-modalbox',
      data: {}
    }
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }

  public logout() {
    this.dialogConfig.data = { 'title': "Confirm Action", 'option': 'yes/no', 'message': 'Do you want to Logout ?' };
    let dialogRef = this.dialog.open(DialogComponent, this.dialogConfig);
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        localStorage.removeItem("logedUser");
        this._sharedService.emitChange(null);
        this.router.navigate(['']);
      }
    });
  }

}
