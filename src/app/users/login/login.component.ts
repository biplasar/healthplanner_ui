import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router'
import { User } from '../../model/user';
import { SharedService } from '../../services/shared.service';
import { DialogComponent } from '../../shared/dialogs/dialog.component';
import { ErrorHandlerService } from '../../shared/dialogs/error-handler.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  private dialogConfig;
  logedUser: User = null;
  @Output() updateView = new EventEmitter();

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private _sharedService: SharedService,
  ) {
    localStorage.removeItem('logedUser');
    this._sharedService.emitChange(null);
  }

  ngOnInit() {

    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });

    this.dialogConfig = {
      height: '200px',
      width: '400px',
      disableClose: true,
      panelClass: 'custom-modalbox',
      data: {}
    }
  }

  public hasError(controlName: string, errorName: string) {
    return this.loginForm.controls[controlName].hasError(errorName);
  }

  public onCancel() {
    //this.location.back();
  }

  public login(loginFormValue) {
    if (this.loginForm.valid) {
      if (loginFormValue.username === "admin" && loginFormValue.password === "admin") {
        this.dialogConfig.data = { 'title': "Alert", 'message': 'Login Successfully' };
        let dialogRef = this.dialog.open(DialogComponent, this.dialogConfig);
        dialogRef.afterClosed()
          .subscribe(result => {
            this.logedUser = new User();
            this.logedUser.username = loginFormValue.username;
            this.logedUser.password = loginFormValue.password;
            localStorage.setItem('logedUser', JSON.stringify(this.logedUser));
            this._sharedService.emitChange(this.logedUser);
            this.router.navigate(['/home']);
          });
      }
      else {
        this.dialogConfig.data = { 'title': "Error", 'message': 'Invalid User Name or Password' };
        let dialogRef = this.dialog.open(DialogComponent, this.dialogConfig);
      }
    }
  }

}
