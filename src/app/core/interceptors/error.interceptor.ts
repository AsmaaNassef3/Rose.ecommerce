// interceptors/error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID, Injector } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, throwError, timer } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const injector = inject(Injector); 
  const toastr = inject(ToastrService)
  const platformId = inject(PLATFORM_ID);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {  
      console.log(error.error.error)  
      return throwError(() => toastr.error(error.error.error));
    })
  );
};


