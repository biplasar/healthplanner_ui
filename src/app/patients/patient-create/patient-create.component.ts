import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router'
import { DialogComponent } from '../../shared/dialogs/dialog.component';
import { ErrorHandlerService } from '../../shared/dialogs/error-handler.service';
import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/model/patient';
import { PatientName } from 'src/app/model/patient_name';
import { PostalAddress } from 'src/app/model/postal_address';

@Component({
  selector: 'app-patient-create',
  templateUrl: './patient-create.component.html',
  styleUrls: ['./patient-create.component.css']
})
export class PatientCreateComponent implements OnInit {

  public registerForm: FormGroup;
  private dialogConfig;
  public genderList: [
    { option: '1', value: 'Male' },
    { option: '2', value: 'Female' }
  ];
  public maritalStatusList: [
    { option: 'Married', value: '1' },
    { option: 'Unmarried', value: '2' }
  ];
  public medHistoryList = ['None', 'Allergies', 'Anemia', 'Anxiety', 'Arthritis', 'Asthma', 'Cancer - Type', 'COPD (Emphysema)',
    'Diabetes', 'Liver Disease', 'Osteoarthritis', 'Osteoporosis', 'Thyroid Disease'];

  constructor(
    private formBuilder: FormBuilder,
    private location: Location,
    private dialog: MatDialog,
    private router: Router,
    private service: PatientService
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
      maritalStatus: new FormControl('', [Validators.required]),
      medHistory: this.formBuilder.array([])
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
      //console.log(JSON.stringify(patient));
      this.service.saveData(patient).subscribe(
        response => {
          alert(response);
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
    } else {
      this.dialogConfig.data = { 'title': "Error", 'message': 'Some Input data are invalid' };
      let dialogRef = this.dialog.open(DialogComponent, this.dialogConfig);
    }
  }

  onChange(event) {
    const medHistory = <FormArray>this.registerForm.get('medHistory') as FormArray;
    if (event.checked) {
      medHistory.push(new FormControl(event.source.value))
    } else {
      const i = medHistory.controls.findIndex(x => x.value === event.source.value);
      medHistory.removeAt(i);
    }
    //alert(JSON.stringify(medHistory));
  }
}
