import { Observable } from "rxjs";

export abstract class AuthRepo{
 abstract login(data:any):Observable<any>;
 abstract register(data:any):Observable<any>;
 abstract changePas(data:any):Observable<any>;
 abstract deleteAccount():Observable<any>;
 abstract editProfile(data:any):Observable<any>;
  abstract logout():Observable<any>;
   abstract getLoggedUserInfo():Observable<any>;
    abstract forgetPas(data:any):Observable<any>;
     abstract verifyCode(data:any):Observable<any>;
      abstract resetPas(data:any):Observable<any>;
}
