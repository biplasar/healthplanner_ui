import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/model/patient';
import { MatDialog } from '@angular/material';
import { DialogComponent } from 'src/app/shared/dialogs/dialog.component';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnInit {

  constructor(
    private activeRoute: ActivatedRoute,
    private service: PatientService,
    private router: Router,
    private dialog: MatDialog) {
  }

  patient: Patient;
  public dialogConfig;

  ngOnInit() {

    this.dialogConfig = {
      height: '200px',
      width: '400px',
      disableClose: true,
      panelClass: 'custom-modalbox',
      data: {}
    }

    let id: string = this.activeRoute.snapshot.params['id'];
    this.service.getData().subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.patient = response;
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

}
