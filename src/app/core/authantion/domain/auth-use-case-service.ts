import { inject, Injectable } from '@angular/core';

import { catchError, map, Observable, of } from 'rxjs';
import { AdabtorService } from '../data/adabtor.service';
import { AuthRepo } from './auth-repo';

@Injectable({
  providedIn: 'root'
})
export class AuthUseCaseService {
private readonly authRepo = inject(AuthRepo);
private readonly adabtorService = inject(AdabtorService)
  constructor() { }
executeLogin(data:object):Observable<any>{
return this.authRepo.login(data).pipe(
  map((res)=>this.adabtorService.adabt(res)),
  catchError((err)=>of(err))
)}

excuteRegister(data:object):Observable<any>{
return this.authRepo.register(data).pipe(
  map((res)=>this.adabtorService.adabt(res)),
  catchError((err)=>of(err))
)}


excuteforgetPas(data:object):Observable<any>{
return this.authRepo.forgetPas(data).pipe(
  map((res)=>this.adabtorService.adabt(res)),
  catchError((err)=>of(err))
)}
}

