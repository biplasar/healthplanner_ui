import { Component, OnInit, ViewChild } from '@angular/core';
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
export class PatientListComponent implements OnInit {

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

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data, filter: string) => {
      const accumulator = (currentTerm, key) => {
        return this.nestedFilterCheck(currentTerm, data, key);
      };
      const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) !== -1;
    }

    this.dialogConfig = {
      height: '200px',
      width: '400px',
      disableClose: true,
      panelClass: 'custom-modalbox',
      data: {}
    }

    this.getPatientList();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  pageChange(event: any) {
    /*this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize
    this.createTable();*/
  }

  public getPatientList() {

    this.service.getData().subscribe(
      response => {
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
        this.dialogConfig.data = { 'title': "Error", 'option': 'close', 'message': errorMsg };
        this.dialog.open(DialogComponent, this.dialogConfig);
      }
    );
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
    this.dialogConfig.data = { 'title': "Confirm Action", 'option': 'yes/no', 'message': 'Do you want to delete the record ?' };
    let dialogRef = this.dialog.open(DialogComponent, this.dialogConfig);
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this.service.deleteData(id).subscribe(
          response => {
            this.dialogConfig.data = { 'title': "Alert", 'option': 'close', 'message': 'Successfully deleted the reord ' + id };
            let dialogRef = this.dialog.open(DialogComponent, this.dialogConfig);
            dialogRef.afterClosed().subscribe(result => {
              this.getPatientList();
            });
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
      }
    });

  }

  nestedFilterCheck(search, data, key) {
    if (typeof data[key] === 'object') {
      for (const k in data[key]) {
        if (data[key][k] !== null) {
          search = this.nestedFilterCheck(search, data[key], k);
        }
      }
    } else {
      search += data[key];
    }
    return search;
  }
}