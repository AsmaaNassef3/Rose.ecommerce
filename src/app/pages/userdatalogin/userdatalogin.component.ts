import Swal from 'sweetalert2';
import { userdata } from './../../shared/interfaces/updatedata/userdata';
import { Component, Inject, inject, OnInit, PLATFORM_ID, signal, computed } from '@angular/core';
import { UpdateprofileService } from '../../core/services/updateprofile/updateprofile.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthBtnComponent } from '../../shared/ui/auth-btn/auth-btn.component';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthUseCaseService } from '../../core/authantion/domain/auth-use-case-service';
import { TokenService } from '../../core/services/token/token.service';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../../core/services/translate/traslation.service';

@Component({
  selector: 'app-userdatalogin',
  imports: [ReactiveFormsModule, AuthBtnComponent, CommonModule, TranslateModule],
  templateUrl: './userdatalogin.component.html',
  styleUrl: './userdatalogin.component.scss'
})
export class UserdataloginComponent implements OnInit {
  private updateprofileService = inject(UpdateprofileService)
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authUseCaseService = inject(AuthUseCaseService);
  private readonly tokenService = inject(TokenService);
  private readonly translationService = inject(TranslationService);
  
  userDataProfile = signal({} as userdata)
  previewImage: string | ArrayBuffer | null = null;
  
  // Add RTL support
  isRTL = computed(() => this.translationService.isRTL());

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }
  
  registerForm: FormGroup = this.formBuilder.group({
    firstName: [null, [Validators.required, Validators.pattern(/^[A-Za-z\u0600-\u06FF\s]{2,19}$/)]],
    lastName: [null, [Validators.required, Validators.pattern(/^[A-Za-z\u0600-\u06FF\s]{2,19}$/)]],
    email: [null, [Validators.required, Validators.email]],
    phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
  });

  getLogedUserData() {
    this.updateprofileService.getLogedUserData().subscribe({
      next: (res) => {
        console.log('User Data:', res.user);
        this.userDataProfile.set(res.user);
        this.registerForm.get('firstName')?.patchValue(this.userDataProfile().firstName);
        this.registerForm.get('lastName')?.patchValue(this.userDataProfile().lastName);
        this.registerForm.get('email')?.patchValue(this.userDataProfile().email);
        this.registerForm.get('phone')?.patchValue(this.userDataProfile().phone);
        this.previewImage = this.userDataProfile().photo || 'assets/images/default-profile.png'; 
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  onImageSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  updateprofile() {
    if (this.registerForm.valid) {
      const data = { ...this.registerForm.value };
      if (data.phone.startsWith('01')) {
        data.phone = '+2' + data.phone;
      }
      this.updateprofileService.editProfileData(data).subscribe({
        next: (res) => {
          console.log('Profile updated successfully:', res);
          if (res.message === 'success') {
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('token', res.token);
            }
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 500);
          }
        },
        error: (err) => {
          console.error('Error updating profile:', err);
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  updateMyPhoto() {
    const formData = new FormData();
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (file) {
      formData.append('photo', file);
      this.updateprofileService.updateProfilePhoto(formData).subscribe({
        next: (res) => {
          console.log('Profile photo updated successfully:', res);
          Swal.fire({
            title: this.translationService.getCurrentLang() === 'ar' ? 'تم!' : 'Success!',
            text: this.translationService.getCurrentLang() === 'ar' ? 'تم تحديث صورة الملف الشخصي بنجاح' : 'Profile photo updated successfully',
            icon: 'success'
          });
          this.getLogedUserData();
        },
        error: (err) => {
          console.error('Error updating profile photo:', err);
        }
      });
    } else {
      Swal.fire({
        title: this.translationService.getCurrentLang() === 'ar' ? 'خطأ!' : 'Error!',
        text: this.translationService.getCurrentLang() === 'ar' ? 'يرجى اختيار صورة للرفع' : 'Please select a photo to upload',
        icon: 'error'
      });
    }
  }

  DeleteMyAccount() {
    const isArabic = this.translationService.getCurrentLang() === 'ar';
    Swal.fire({
      title: isArabic ? "هل أنت متأكد؟" : "Are you sure?",
      text: isArabic ? "لن تتمكن من التراجع عن هذا!" : "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: isArabic ? "نعم، احذف!" : "Yes, delete it!",
      cancelButtonText: isArabic ? "إلغاء" : "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateprofileService.DeleteAccount().subscribe({
          next: (res) => {
            console.log('Account deleted successfully:', res);
            if (isPlatformBrowser(this.platformId)) {
              localStorage.removeItem('token');
              this.tokenService.updateCurrentUser();
            }
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 3000);
          },
          error: (err) => {
            console.error('Error deleting account:', err);
          }
        });
        Swal.fire({
          title: isArabic ? "تم الحذف!" : "Deleted!",
          text: isArabic ? "تم حذف حسابك." : "Your account has been deleted.",
          icon: "success"
        });
      }
    });
  }

  logOut() {
    this.updateprofileService.logOut().subscribe({
      next: (res) => {
        console.log('Account logged out successfully:', res);
        if (isPlatformBrowser(this.platformId)) {
            // this.tokenService.clearToken();
        }
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 500);
      },
      error: (err) => {
        console.error('Error logging out:', err);
      }
    })
  }

  ngOnInit(): void {
    this.getLogedUserData()
  }
}
