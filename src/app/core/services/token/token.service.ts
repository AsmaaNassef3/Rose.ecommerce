import { inject, Injectable, signal, WritableSignal, PLATFORM_ID, Inject } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { isPlatformBrowser } from '@angular/common';
import { Currentuser } from '../../../shared/interfaces/currentuser/currentuser';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private token: string | null = null;

  currentUser: WritableSignal<Currentuser> = signal({} as Currentuser);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.token = localStorage.getItem('token');
      // Initialize current user on service creation
      this.updateCurrentUser();
    }
  }

  updateCurrentUser(): void {
    if (this.token) {
      try {
        const decodedToken = jwtDecode(this.token);
        this.currentUser.set(decodedToken as Currentuser);
        console.log('Current user updated:', this.currentUser());
      } catch (error) {
        console.error('Error decoding token:', error);
        this.clearToken();
      }
    } else {
      this.currentUser.set({} as Currentuser);
    }
  }

  isAuthenticated(): boolean {
    // Check if token exists, is not expired, and currentUser has meaningful data
    if (!this.token || this.isTokenExpired()) {
      return false;
    }
    return Object.keys(this.currentUser()).length > 0;
  }

  setToken(token: string): void {
    this.token = token;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
    }
    this.updateCurrentUser();
    console.log('Token set successfully, user authenticated:', this.isAuthenticated());
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken(): void {
    this.token = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.onLogedOut();
    console.log('Token cleared, user logged out');
  }

  onLogedOut(): void {
    this.currentUser.set({} as Currentuser);
  }

  // Method to check if token is expired
  isTokenExpired(): boolean {
    if (!this.token) return true;
    
    try {
      const decodedToken: any = jwtDecode(this.token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp < currentTime;
    } catch {
      return true;
    }
  }

  // Method to refresh token (call this periodically or when needed)
  refreshAuthenticationState(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedToken = localStorage.getItem('token');
      if (storedToken !== this.token) {
        this.token = storedToken;
        this.updateCurrentUser();
      }
    }
  }
}