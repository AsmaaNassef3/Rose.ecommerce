import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  const platformId = inject(PLATFORM_ID);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log(error.error.error);
      
      // ✅ Skip toastr for "invalid token .. login again" message
      if (error.error.error === 'invalid token .. login again') {
        return throwError(() => error);
      }
      
      // Show toastr for all other errors
      toastr.error(error.error.error);
      return throwError(() => error);
    })
  );
};
