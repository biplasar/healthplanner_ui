import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../../shared/dialogs/dialog.component';
import { ErrorHandlerService } from '../../shared/dialogs/error-handler.service';
import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/model/patient';
import { PatientName } from 'src/app/model/patient_name';
import { PostalAddress } from 'src/app/model/postal_address';
import { GENDER, MARITAL_STATUS, DISEASE_TYPE } from 'src/app/constant';

@Component({
  selector: 'app-patient-create',
  templateUrl: './patient-create.component.html',
  styleUrls: ['./patient-create.component.css']
})
export class PatientCreateComponent implements OnInit {

  public registerForm: FormGroup;
  private dialogConfig;
  public genders = GENDER;
  public marital_status = MARITAL_STATUS;
  public disease_type = DISEASE_TYPE;

  constructor(
    private dialog: MatDialog,
    private service: PatientService,
  ) { }

  ngOnInit() {

    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      line1: new FormControl('', [Validators.required, Validators.maxLength(150)]),
      line2: new FormControl('', [Validators.required, Validators.maxLength(150)]),
      city: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      state: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      zip: new FormControl('', [Validators.required, Validators.maxLength(6)]),
      gender: new FormControl('', [Validators.required]),
      dateOfBirth: new FormControl('', [Validators.required]),
      mailId: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      phone: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      maritalStatus: new FormControl('', [Validators.required])
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
    return this.registerForm.controls[controlName].hasError(errorName);
  }

  public onCancel() {
    //this.location.back();
  }

  public register(registerFormValue) {
    if (this.registerForm.valid) {
      var patient = new Patient;
      var patientName = new PatientName;
      patientName.firstName = registerFormValue.firstName;
      patientName.lastName = registerFormValue.lastName;
      patient.patientName = patientName;
      var postalAddress = new PostalAddress;
      postalAddress.line1 = registerFormValue.line1;
      postalAddress.line2 = registerFormValue.line2;
      postalAddress.city = registerFormValue.city;
      postalAddress.state = registerFormValue.state;
      postalAddress.zip = registerFormValue.zip;
      patient.postalAddress = postalAddress;
      patient.gender = registerFormValue.gender;
      patient.dateOfBirth = registerFormValue.dateOfBirth;
      patient.mailId = registerFormValue.mailId;
      patient.phone = registerFormValue.phone;
      patient.maritalStatus = registerFormValue.maritalStatus;
      patient.medHistory = [];
      for (var i = 0; i < this.disease_type.length; i++) {
        if (this.disease_type[i].checked)
          patient.medHistory.push(this.disease_type[i].name);
      }
      this.service.saveData(patient).subscribe(
        response => {
          this.dialogConfig.data = { 'title': "Alert", 'option': 'close', 'message': 'Successfully added the reord ' };
          this.dialog.open(DialogComponent, this.dialogConfig);
          this.registerForm.reset();
        },
        error => {
          let errorMsg = '';
          if (typeof error.error.message !== 'undefined')
            errorMsg = error.error.message;
          else if (typeof error.error !== 'undefined')
            errorMsg = error.error;
          else
            errorMsg = error.message;
          this.dialogConfig.data = { 'title': "Error", 'option': 'close', 'message': errorMsg };
          this.dialog.open(DialogComponent, this.dialogConfig);
        }
      );
    } else {
      this.dialogConfig.data = { 'title': "Error", 'option': 'close', 'message': 'Some Input data are invalid' };
      this.dialog.open(DialogComponent, this.dialogConfig);
    }
  }

  onChange(event) {
    for (var i = 0; i < this.disease_type.length; i++) {
      if (this.disease_type[i].name == event.source.value) {
        if (event.checked)
          this.disease_type[i].checked = true;
        else
          this.disease_type[i].checked = false;
        break;
      }
    }
  }

}
