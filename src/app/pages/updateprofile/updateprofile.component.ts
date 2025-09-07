import { Component, computed, HostListener, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { TranslationService } from '../../core/services/translate/traslation.service';
import { TranslateModule } from '@ngx-translate/core';
import { TokenService } from '../../core/services/token/token.service';

@Component({
  selector: 'app-updateprofile',
  imports: [RouterOutlet, RouterLink, TranslateModule],
  templateUrl: './updateprofile.component.html',
  styleUrl: './updateprofile.component.scss'
})
export class UpdateprofileComponent {
  isSidebarOpen = false;
  private translationService = inject(TranslationService);
   private tokenService = inject(TokenService);
     private router = inject(Router);
  isRTL = computed(() => this.translationService.isRTL());

  // GET SIDEBAR CLASSES BASED ON RTL AND OPEN STATE
  getSidebarClasses(): string {
    const baseClasses = 'z-[1050]'; // Higher z-index than overlay
    
    // Position classes
    const positionClasses = this.isRTL() ? 'right-0' : 'left-0';
    
    // Border classes
    const borderClasses = this.isRTL() ? 'border-l border-gray-200/60' : 'border-r border-gray-200/60';
    
    // Transform classes for mobile
    let transformClasses: string;
    if (this.isSidebarOpen) {
      transformClasses = 'translate-x-0';
    } else {
      // Hide sidebar off-screen based on direction
      transformClasses = this.isRTL() ? 'translate-x-full' : '-translate-x-full';
    }
    
    return `${baseClasses} ${positionClasses} ${borderClasses} ${transformClasses}`;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.handleBodyScroll();
  }

  closeSidebar() {
    this.isSidebarOpen = false;
    this.handleBodyScroll();
  }

  private handleBodyScroll() {
    if (typeof document !== 'undefined') {
      const body = document.body;
      const html = document.documentElement;
      
      if (this.isSidebarOpen) {
        // Prevent scrolling
        body.style.overflow = 'hidden';
        body.style.position = 'relative';
        html.style.overflow = 'hidden';
      } else {
        // Restore scrolling
        body.style.overflow = '';
        body.style.position = '';
        html.style.overflow = '';
      }
    }
  }

  onMobileNavClick() {
    // Close sidebar on mobile when navigation item is clicked
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      this.closeSidebar();
    }
  }

  signOut() {
    // Add your sign out logic here
    console.log('Signing out...');
      this.tokenService.clearToken();
    
    // Optionally navigate to home or login page
    this.router.navigate(['/home']);
    this.onMobileNavClick(); // Close sidebar after action
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Close sidebar on resize to prevent issues & restore scroll
    if (event.target.innerWidth >= 640) {
      this.isSidebarOpen = false;
      this.handleBodyScroll();
    }
  }

  @HostListener('window:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    // Close sidebar on escape key
    if (this.isSidebarOpen) {
      this.closeSidebar();
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Handle accessibility
    if (event.key === 'Escape' && this.isSidebarOpen) {
      this.closeSidebar();
    }
  }

  ngOnDestroy() {
    // Clean up body styles on component destroy
    this.handleBodyScroll();
  }
}
