import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse, HttpResponseBase } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
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
        }, (err: any) => {
            let errorMsg = '';
            if (typeof err.error !== 'undefined')
                errorMsg = err.error.message;
            else if (typeof err.message !== 'undefined')
                errorMsg = err.message;
            else
                errorMsg = err.error;

            MessageBox.show(this.dialog, "Error", errorMsg, MessageBoxButton.Ok, "350px");

        });
    }

}