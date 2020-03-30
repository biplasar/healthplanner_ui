import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Location, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/model/patient';
import { GENDER, MARITAL_STATUS, DISEASE_TYPE } from '../../shared/constant';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnInit {

  constructor(
    private activeRoute: ActivatedRoute,
    private service: PatientService,
    private location: Location,
    private datePipe: DatePipe) {
  }

  patient: Patient;
  public registerForm: FormGroup;
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

    let id: string = this.activeRoute.snapshot.params['id'];
    this.service.getDataById(id).subscribe(
      response => {
        console.log(JSON.stringify(response));
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
          dateOfBirth: new FormControl(this.datePipe.transform(this.patient.dateOfBirth,'dd-MM-yyyy')),
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
      }
    );
  }

  onCancel() {
    this.location.back();
  }

}
