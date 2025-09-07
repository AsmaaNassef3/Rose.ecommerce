import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private httpClient : HttpClient) { }

  submitContactForm(data: object): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/contact`, data);
  }
  
}
