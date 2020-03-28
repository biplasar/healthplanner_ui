import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from '../../shared/dialogs/dialog.component';
import { ErrorHandlerService } from '../../shared/dialogs/error-handler.service';
import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/model/patient';
import { PatientName } from 'src/app/model/patient_name';
import { PostalAddress } from 'src/app/model/postal_address';
import { GENDER, MARITAL_STATUS, DISEASE_TYPE } from 'src/app/constant';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private activeRoute: ActivatedRoute,
    private service: PatientService,
    private router: Router,
    private dialog: MatDialog,
    private location: Location) {
  }

  patient: Patient;
  public registerForm: FormGroup;
  private dialogConfig;
  public genders = GENDER;
  public marital_status = MARITAL_STATUS;
  public disease_type = DISEASE_TYPE;

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
    this.registerForm.disable();

    this.dialogConfig = {
      height: '200px',
      width: '400px',
      disableClose: true,
      panelClass: 'custom-modalbox',
      data: {}
    }

    let id: string = this.activeRoute.snapshot.params['id'];
    this.service.getDataById(id).subscribe(
      response => {
        this.patient = response;
        this.registerForm = new FormGroup({
          firstName: new FormControl(this.patient.patientName.firstName),
          lastName: new FormControl(this.patient.patientName.lastName),
          line1: new FormControl(this.patient.postalAddress.line1),
          line2: new FormControl(this.patient.postalAddress.line2),
          city: new FormControl(this.patient.postalAddress.city),
          state: new FormControl(this.patient.postalAddress.state),
          zip: new FormControl(this.patient.postalAddress.zip),
          gender: new FormControl(this.patient.gender),
          dateOfBirth: new FormControl(this.patient.dateOfBirth),
          mailId: new FormControl(this.patient.mailId),
          phone: new FormControl(this.patient.phone),
          maritalStatus: new FormControl(this.patient.maritalStatus)
        });
        this.registerForm.disable();
        for (var i = 0; i < this.disease_type.length; i++) {
          if (this.patient.medHistory.indexOf(this.disease_type[i].name) != -1) {
            this.disease_type[i].checked = true;
          }
        }
      },
      error => {
        let errorMsg = '';
        if (typeof error.error.message !== 'undefined')
          errorMsg = error.error.message;
        else if (typeof error.error !== 'undefined')
          errorMsg = error.error;
        else
          errorMsg = error.message;
        this.dialogConfig.data = { 'title': "Error", 'message': errorMsg };
        let dialogRef = this.dialog.open(DialogComponent, this.dialogConfig);
      }
    );
  }

  onCancel() {
    this.location.back();
  }

}
