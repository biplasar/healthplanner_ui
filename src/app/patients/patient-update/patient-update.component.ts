import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router'
import { DialogComponent } from '../../shared/dialogs/dialog.component';
import { Location } from '@angular/common';
import { ErrorHandlerService } from '../../shared/dialogs/error-handler.service';
import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/model/patient';
import { PatientName } from 'src/app/model/patient_name';
import { PostalAddress } from 'src/app/model/postal_address';
import { GENDER, MARITAL_STATUS, DISEASE_TYPE } from 'src/app/constant';

@Component({
  selector: 'app-patient-update',
  templateUrl: './patient-update.component.html',
  styleUrls: ['./patient-update.component.css']
})
export class PatientUpdateComponent implements OnInit {

  public patientId: String;
  patient: Patient;
  public registerForm: FormGroup;
  private dialogConfig;
  public genders = GENDER;
  public marital_status = MARITAL_STATUS;
  public disease_type = DISEASE_TYPE;

  constructor(
    private activeRoute: ActivatedRoute,
    private dialog: MatDialog,
    private service: PatientService,
    private location: Location
  ) { }

  ngOnInit() {

    this.registerForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      line1: new FormControl(''),
      line2: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      zip: new FormControl(''),
      gender: new FormControl(''),
      dateOfBirth: new FormControl(''),
      mailId: new FormControl(''),
      phone: new FormControl(''),
      maritalStatus: new FormControl('')
    });

    this.dialogConfig = {
      height: '200px',
      width: '400px',
      disableClose: true,
      panelClass: 'custom-modalbox',
      data: {}
    }

    let id: string = this.activeRoute.snapshot.params['id'];
    this.patientId = id;
    this.service.getDataById(id).subscribe(
      response => {
        this.patient = response;
        this.registerForm = new FormGroup({
          firstName: new FormControl(this.patient.patientName.firstName, [Validators.required, Validators.maxLength(50)]),
          lastName: new FormControl(this.patient.patientName.lastName, [Validators.required, Validators.maxLength(60)]),
          line1: new FormControl(this.patient.postalAddress.line1, [Validators.required, Validators.maxLength(150)]),
          line2: new FormControl(this.patient.postalAddress.line2, [Validators.required, Validators.maxLength(150)]),
          city: new FormControl(this.patient.postalAddress.city, [Validators.required, Validators.maxLength(50)]),
          state: new FormControl(this.patient.postalAddress.state, [Validators.required, Validators.maxLength(50)]),
          zip: new FormControl(this.patient.postalAddress.zip, [Validators.required, Validators.maxLength(6)]),
          gender: new FormControl(this.patient.gender, [Validators.required]),
          dateOfBirth: new FormControl(this.patient.dateOfBirth, [Validators.required]),
          mailId: new FormControl(this.patient.mailId, [Validators.required, Validators.maxLength(60)]),
          phone: new FormControl(this.patient.phone, [Validators.required, Validators.maxLength(60)]),
          maritalStatus: new FormControl(this.patient.maritalStatus, [Validators.required])
        });
        for (var i = 0; i < this.disease_type.length; i++) {
          if (this.patient.medHistory.indexOf(this.disease_type[i].name) != -1) {
            this.disease_type[i].checked = true;
          }
        }
      },
      error => {
        this.registerForm.disable();
        let errorMsg = '';
        if (typeof error.error.message !== 'undefined')
          errorMsg = error.error.message;
        else if (typeof error.error !== 'undefined')
          errorMsg = error.error;
        else
          errorMsg = error.message;
        this.dialogConfig.data = { 'title': "Error", 'option': 'close', 'message': errorMsg };
        let dialogRef = this.dialog.open(DialogComponent, this.dialogConfig);
      }
    );

  }

  public hasError(controlName: string, errorName: string) {
    return this.registerForm.controls[controlName].hasError(errorName);
  }

  public register(registerFormValue) {
    if (this.registerForm.valid) {
      var patient = new Patient;
      patient.id = this.patientId;
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
      this.service.updateData(this.patientId, patient).subscribe(
        response => {
          this.dialogConfig.data = { 'title': "Alert", 'option': 'close', 'message': 'Successfully updated the reord ' + this.patientId};
          this.dialog.open(DialogComponent, this.dialogConfig);
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
      let dialogRef = this.dialog.open(DialogComponent, this.dialogConfig);
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

  onCancel() {
    this.location.back();
  }

}
