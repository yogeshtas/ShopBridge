import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { catchError, filter, take, switchMap, finalize } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import { NgbActiveModal, NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from 'ngx-toastr';
@Injectable({
    providedIn: 'root'
})
export class AuthInterceptorService {

    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private toastr: ToastrService, private injector: Injector, private router: Router,
        private modalService: NgbModal) { }
    // auth = this.injector.get(AuthService);

    // stopThisRequest: boolean = false;

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        var authRequest = this.addAuthenticationToken(request);

        return next.handle(authRequest).pipe(
            catchError(err => {
                if (err.status === 401) {
                    this.modalService.dismissAll();
                    this.toastr.info('', "Session Expired !!!", {
                        enableHtml: true
                    })
                    this.router.navigate(['']);
                    return this.refreshTokenSubject.pipe(
                        filter(result => result !== null),
                        take(1),
                        switchMap(() => next.handle(this.addAuthenticationToken(authRequest)))
                    );
                }
                const error = err || err.statusText;
                return throwError(error);
            }),
            finalize(
                () => { }
            )
        )

    }

    private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
        if (request.url.match(environment.licenseAPI) || request.url.match(environment.archiverestoreApiUrl)) {
            return request;
        }

        if (request.url.match(environment.grafanaAPI)) {
            return request
        }

        return request.clone({
            headers: request.headers.set("Authorization", "Bearer " + sessionStorage.token)
        });
    }
}
