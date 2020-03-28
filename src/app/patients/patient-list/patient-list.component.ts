import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../model/patient';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/shared/dialogs/dialog.component';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styles: []
})
export class PatientListComponent implements OnInit, AfterViewInit {

  constructor(
    private service: PatientService,
    private router: Router,
    private dialog: MatDialog) {
  }

  public dialogConfig;
  public displayedColumns = ['patientName', 'postalAddress', 'gender', 'dateOfBirth', 'mailId', 'phone', 'maritalStatus', 'medicalHistory',
    'details', 'update', 'delete'];
  public dataSource = new MatTableDataSource<Patient>();

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  pageIndex = 0;
  totalLength: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];


  ngOnInit() {

    this.dialogConfig = {
      height: '200px',
      width: '400px',
      disableClose: true,
      panelClass: 'custom-modalbox',
      data: {}
    }

    this.service.getData().subscribe(
      response => {
        //console.log(JSON.stringify(data.patients));
        // this.patients = data.patients;
        this.dataSource.data = response.patients;
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

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    if (value.length < 3)
      return;
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  pageChange(event: any) {
    /*this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize
    this.createTable();*/
  }

  public redirectToDetails = (id: string) => {
    let url: string = `/patient/details/${id}`;
    this.router.navigate([url]);
  }

  public redirectToUpdate = (id: string) => {
    let url: string = `/patient/update/${id}`;
    this.router.navigate([url]);
  }

  public redirectToDelete = (id: string) => {
    let url: string = `/patient/delete/${id}`;
    this.router.navigate([url]);
  }

}