import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PlatformService } from '../services/platForm/platform.service';


export const authGuard: CanActivateFn = () => {
  const platformService = inject(PlatformService);
  const router = inject(Router);

  const isPlatformValid = platformService.isBrowser();
  const token = localStorage.getItem('token');

  if (isPlatformValid && token) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};