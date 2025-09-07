import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private httpClient : HttpClient) { }

createCashOrder(orderData: any): Observable<any> {
  return this.httpClient.post(`${environment.baseUrl}api/v1/orders`, orderData);
}

checkoutOrder(orderData: any): Observable<any> {
  return this.httpClient.post(`${environment.baseUrl}api/v1/orders/checkout?url=http://localhost:4200`, orderData);
}

getUserOrders(): Observable<any> {      

  return this.httpClient.get(`${environment.baseUrl}api/v1/orders`);

}

}
