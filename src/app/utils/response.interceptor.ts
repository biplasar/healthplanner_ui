import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/do';
import { Router } from '@angular/router';
import { MessageBox, MessageBoxButton } from '../shared/message-box';
import { MatDialog } from '@angular/material';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

    constructor(
        private router: Router,
        private dialog: MatDialog,
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).do((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
            }
        }, error => {
            let errorMsg = '';
            if (error.error instanceof ErrorEvent)
                errorMsg = "An error occurred : ", error.error.message;
            else
                errorMsg = `Backend returned code ${error.status}, ` + `body was: ${error.error}`;
            /*
            if (typeof err.message !== 'undefined')
                errorMsg = err.message;
            else if (typeof err.error !== 'undefined')
                errorMsg = err.error;
            else
                errorMsg = err.error.message;
                */
            MessageBox.show(this.dialog, "Error", errorMsg, MessageBoxButton.Ok, "350px");

        });
    }

}