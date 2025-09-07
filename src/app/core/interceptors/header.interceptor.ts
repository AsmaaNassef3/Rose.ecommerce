import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { PlatformService } from '../services/platForm/platform.service';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  const platformService = inject(PlatformService);

 
  if (platformService.isBrowser()) {
    const token = localStorage.getItem('token');
    if (token) {
      req = req.clone({
        setHeaders: {
       Authorization: `Bearer ${token}`,
        }
      });
    }
  }

  return next(req);
};
