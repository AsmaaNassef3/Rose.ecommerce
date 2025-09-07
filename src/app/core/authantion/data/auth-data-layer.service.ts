import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { AuthRepo } from '../domain/auth-repo';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthDataLayerService implements AuthRepo {

  constructor(private httpClient: HttpClient) { }

  register(data:object):Observable<any>{
    return this.httpClient.post(`${environment.baseUrl}api/v1/auth/signup`,data)
  }

  login(data:object):Observable<any>{
    return this.httpClient.post(`${environment.baseUrl}api/v1/auth/signin`,data)
  }


  changePas(data:object):Observable<any>{
    return this.httpClient.patch(`${environment.baseUrl}api/v1/auth/changePassword`,data)
  }
  deleteAccount():Observable<any>{
    return this.httpClient.delete(`${environment.baseUrl}api/v1/auth/deleteMe`)
  }
  editProfile(data:object):Observable<any>{
    return this.httpClient.put(`${environment.baseUrl}api/v1/auth/editProfile`,data)
  }
  logout():Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}api/v1/auth/logout`)
  }

  getLoggedUserInfo():Observable<any>{
    return this.httpClient.get(`${environment.baseUrl}api/v1/auth/profileData`)
  }
  forgetPas(data:object):Observable<any>{
    return this.httpClient.post(`${environment.baseUrl}api/v1/auth/forgotPassword`,data)
  }
  verifyCode(data:object):Observable<any>{
    return this.httpClient.post(`${environment.baseUrl}api/v1/auth/verifyResetCode`,data)
  }
  resetPas(data:object):Observable<any>{
    return this.httpClient.put(`${environment.baseUrl}api/v1/auth/resetPassword`,data)
  }

}




