import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, inject, PLATFORM_ID, computed } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthBtnComponent } from '../../shared/ui/auth-btn/auth-btn.component';
import { UpdateprofileService } from '../../core/services/updateprofile/updateprofile.service';
import { TokenService } from '../../core/services/token/token.service';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../../core/services/translate/traslation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-updatepass',
  imports: [CommonModule, ReactiveFormsModule, AuthBtnComponent, RouterLink, TranslateModule],
  templateUrl: './updatepass.component.html',
  styleUrl: './updatepass.component.scss'
})
export class UpdatepassComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private updateprofileService = inject(UpdateprofileService)
  private readonly tokenService = inject(TokenService);
  private readonly translationService = inject(TranslationService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Add RTL support
  isRTL = computed(() => this.translationService.isRTL());

  registerForm: FormGroup = this.formBuilder.group({
    password: [null, [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,}$/)]],
    newPassword: [null, [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=-]).{8,}$/)]],
  })

  // Add these properties to your component
  showCurrentPassword = false;
  showNewPassword = false;

  updatePassword(){
    if (this.registerForm.valid) {
      this.updateprofileService.changePassword(this.registerForm.value).subscribe({
        next: (res) => {
          console.log('UpdatePassword', res);
          const isArabic = this.translationService.getCurrentLang() === 'ar';
          Swal.fire({
            title: isArabic ? 'تم!' : 'Success!',
            text: isArabic ? 'تم تحديث كلمة المرور بنجاح' : 'Password updated successfully',
            icon: 'success'
          });
          
          if (res.message === 'success') {
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('token', res.token);
              this.tokenService.updateCurrentUser();
            }
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 500);
          }
        },
        error: (err) => {
          console.log(err);
          const isArabic = this.translationService.getCurrentLang() === 'ar';
          Swal.fire({
            title: isArabic ? 'خطأ!' : 'Error!',
            text: isArabic ? 'كلمة المرور القديمة غير صحيحة' : 'Current password is incorrect',
            icon: 'error'
          });
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  // Add password strength method
  getPasswordStrength(): string {
    const password = this.registerForm.get('newPassword')?.value || '';
    if (!password) return '';
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return this.translationService.getCurrentLang() === 'ar' ? 'ضعيف' : 'Weak';
    if (strength <= 3) return this.translationService.getCurrentLang() === 'ar' ? 'متوسط' : 'Fair';
    return this.translationService.getCurrentLang() === 'ar' ? 'قوي' : 'Strong';
  }
}
