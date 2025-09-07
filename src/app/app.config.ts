// app.config.ts - إصدار محدث
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { productsReducer } from './store/products/products.reduser';
import { provideEffects } from '@ngrx/effects';
import { ProductsEffects } from './store/products/product.effects';
import { headerInterceptor } from './core/interceptors/header.interceptor';
import { AuthRepo } from './core/authantion/domain/auth-repo';
import { AuthDataLayerService } from './core/authantion/data/auth-data-layer.service';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { provideToastr } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
 import { TranslateHttpLoader } from '@ngx-translate/http-loader';


 export function HttpLoaderFactory(http: HttpClient) {
   return new TranslateHttpLoader(http, './i18n/', '.json');
 }

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([headerInterceptor, errorInterceptor, loadingInterceptor])), 
    provideAnimations(),
    importProvidersFrom(
      NgxSpinnerModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
       })
    ),
    // إضافة إعداد Toastr
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
      progressBar: true
    }),
    provideStore({
      products: productsReducer
    }),
    provideEffects(ProductsEffects),
    {
      provide: AuthRepo,
      useClass: AuthDataLayerService
    }
  ]
};
