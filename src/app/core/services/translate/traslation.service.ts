import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  defaultLang = 'en';
  currentLang = signal('en');
  isRTL = signal(false);
  
  // Language options
  languages = [
    { code: 'en', label: 'English', flag: '🇺🇸', dir: 'ltr' },
    { code: 'ar', label: 'العربية', flag: '🇪🇬', dir: 'rtl' }
  ];

  private languageChange = new BehaviorSubject<string>('en');
  languageChange$ = this.languageChange.asObservable();

  constructor(
    private translateService: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeLanguage();
    }
  }

  private initializeLanguage() {
    // Get saved language or detect browser language
    const savedLang = localStorage.getItem('lng');
    const browserLang = navigator.language.split('-')[0];
    
    this.defaultLang = savedLang || (this.languages.find(l => l.code === browserLang)?.code || 'en');
    
    this.setLanguage(this.defaultLang);
  }

  setLanguage(lang: string) {
    if (this.languages.find(l => l.code === lang)) {
      this.currentLang.set(lang);
      this.translateService.setDefaultLang(lang);
      this.translateService.use(lang);
      
      // Set RTL/LTR direction
      const selectedLang = this.languages.find(l => l.code === lang);
      this.isRTL.set(selectedLang?.dir === 'rtl');
      
      // Update document direction and lang attribute
      if (isPlatformBrowser(this.platformId)) {
        document.documentElement.dir = selectedLang?.dir || 'ltr';
        document.documentElement.lang = lang;
        localStorage.setItem('lng', lang);
      }
      
      this.languageChange.next(lang);
    }
  }

  changeLang(lang: string) {
    this.setLanguage(lang);
  }

  getCurrentLang(): string {
    return this.currentLang();
  }

  getLanguages() {
    return this.languages;
  }
}
