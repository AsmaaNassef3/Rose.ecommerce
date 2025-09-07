import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../../core/authantion/components/login/login.component';
import { RegisterComponent } from '../../core/authantion/components/register/register.component';
import { ForgetpasComponent } from '../../core/authantion/components/forgetpas/forgetpas.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, LoginComponent, RegisterComponent, ForgetpasComponent],
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  currentView = signal<'login' | 'register' | 'forgot'>('login');

  @Output() closeModal = new EventEmitter<void>(); // 👈 ده هيقول للأب يقفل الـ modal

  switchTo(view: 'login' | 'register' | 'forgot') {
    console.log('Switched to view:', view);
    this.currentView.set(view);
  }

  view() {
    return this.currentView();
  }

  // 👇 ده هيتنفذ لما التسجيل ينجح
  onRegisterSuccess() {
    this.switchTo('login');     // يتحول لـ login
    
  }
  onLoginSuccess() {
  this.closeModal.emit(); // يقفل الموديال فورًا
}
}
