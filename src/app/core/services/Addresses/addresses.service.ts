import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Addresses } from '../../../shared/interfaces/Addresses/addresses';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressesService {

  constructor(private httpClient: HttpClient) { }

  getLogedInUserAddress(): Observable<any> {

    return this.httpClient.get(`${environment.baseUrl}api/v1/addresses`); 
  }

  addAddress(address: any): Observable<any> {
   
    return this.httpClient.patch(`${environment.baseUrl}api/v1/addresses`, address);
  }


removeAddress(addressId: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}api/v1/addresses/${addressId}`);
  }

  updateAddress(addressId: string, addressData: any): Observable<any> {
    return this.httpClient.patch(`${environment.baseUrl}api/v1/addresses/${addressId}`, addressData);
  }

}
