import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { AuthDataLayerService } from '../../data/auth-data-layer.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthBtnComponent } from '../../../../shared/ui/auth-btn/auth-btn.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgetpas',
  standalone: true,
  imports: [AuthBtnComponent, ReactiveFormsModule],
  templateUrl: './forgetpas.component.html',
  styleUrl: './forgetpas.component.scss'
})
export class ForgetpasComponent {
private readonly authDataLayerService = inject(AuthDataLayerService)
private readonly formBuilder = inject(FormBuilder)
private readonly router = inject(Router)
step:WritableSignal<number>=signal(1)

@Output() backToLogin = new EventEmitter<void>();


verifyEmail:FormGroup= this.formBuilder.group({
  email:[null,[Validators.required,Validators.email]]
})
verifyCode:FormGroup= this.formBuilder.group({
  resetCode:[null,[Validators.required ,Validators.pattern(/^[0-9]{6}$/)]]
})
verifyPass:FormGroup= this.formBuilder.group({
   email:[null,[Validators.required,Validators.email]],
  newPassword:[null,[Validators.required ,Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,}$/)]]
})



VerifyEmailSubmit():void{
  if(this.verifyEmail.valid){
let userEmail = this.verifyEmail.get('email')?.value;


  this.authDataLayerService.forgetPas(this.verifyEmail.value).subscribe({
    next:(res)=>{
      console.log(res)
      if(res.message=='success'){
this.verifyPass.get('email')?.patchValue(userEmail)

        this.step.set(2)
      }
    },
    error:(err)=>{
      console.log(err)
    }
  })
}
}

verifyCodeSubmit():void{
  if(this.verifyCode.valid){
  this.authDataLayerService.verifyCode(this.verifyCode.value).subscribe({
    next:(res)=>{
      console.log(res)
      if(res.status=='Success'){
        this.step.set(3)
      }
    },
    error:(err)=>{
      console.log(err)
    }
  })
}

}

verifayResetPass():void{
if(this.verifyPass.valid){

  this.authDataLayerService.resetPas(this.verifyPass.value).subscribe({
    next:(res)=>{
      console.log(res)
//       if(res.message=='success'){
// this.router.navigate(['/login'])
//       }
    },
    error:(err)=>{
      console.log(err)
    }
  })
}


}






}

