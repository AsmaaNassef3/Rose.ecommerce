import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Output, EventEmitter } from '@angular/core';
import { AuthUseCaseService } from '../../domain/auth-use-case-service';
import { AuthBtnComponent } from '../../../../shared/ui/auth-btn/auth-btn.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AuthBtnComponent, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private readonly authUseCaseService = inject(AuthUseCaseService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  @Output() switchToLogin = new EventEmitter<void>();


  registerForm: FormGroup = this.formBuilder.group({
    firstName: [null, [Validators.required, Validators.pattern(/^[A-Z][a-z]{2,19}$/)]],
    lastName: [null, [Validators.required, Validators.pattern(/^[A-Z][a-z]{2,19}$/)]],
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,}$/)]],
    rePassword: [null, [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,}$/)]],
    phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    gender: ['', [Validators.required]],
  }, { validators: [this.confirmPassword] });

  confirmPassword(group: AbstractControl) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;
    return password === rePassword ? null : { misMatch: true };
  }

  registerSubmit(): void {
    if (this.registerForm.valid) {
      const data = { ...this.registerForm.value };

      
      if (data.phone.startsWith('01')) {
        data.phone = '+2' + data.phone;
      }

      this.authUseCaseService.excuteRegister(data).subscribe({
        next: (res) => {
          console.log('formRegister', res);
          if (res.message == 'success') {
          setTimeout(() => {
    this.switchToLogin.emit(); 
  }, 500);
          }
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
