import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdabtorService {

  constructor() { }

adabt(data:any){

return{
message:data.message,
token:data.token,
email:data.user.email,
}}
}
