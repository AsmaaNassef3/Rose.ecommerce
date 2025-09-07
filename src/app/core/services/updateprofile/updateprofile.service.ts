import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateprofileService {

  constructor(private http: HttpClient) { }
  getLogedUserData(): Observable<any> {
    return this.http.get(`${environment.baseUrl}api/v1/auth/profile-data`);
      }

editProfileData(data: any): Observable<any> {
    return this.http.put(`${environment.baseUrl}api/v1/auth/editProfile`, data); 
  }  


changePassword(data:any):Observable<any>{
  return this.http.patch(`${environment.baseUrl}api/v1/auth/change-password`, data);
}

DeleteAccount():Observable<any>{
  return this.http.delete(`${environment.baseUrl}api/v1/auth/deleteMe`);  

}
updateProfilePhoto(formData: FormData): Observable<any> {
  return this.http.put(`${environment.baseUrl}api/v1/auth/upload-photo`, formData);
}

logOut(): Observable<any> {
  return this.http.get(`${environment.baseUrl}api/v1/auth/logout`);

}}