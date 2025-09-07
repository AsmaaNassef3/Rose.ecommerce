// app.routes.ts - Fixed version
import { Routes } from '@angular/router';
export const routes: Routes = [
  // Authentication routes with AuthComponent layout
  {
    path: 'auth',
    loadComponent: () => import('./layouts/auth/auth.component').then(m => m.AuthComponent),
    children: [
       {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadComponent: () => import('./core/authantion/components/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register', 
        loadComponent: () => import('./core/authantion/components/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'forgetpas',
        loadComponent: () => import('./core/authantion/components/forgetpas/forgetpas.component').then(m => m.ForgetpasComponent)
      }
    ]
  },
  
  // Main application routes with BlankComponent layout
  {
    path: '',
  loadComponent: () => import('./layouts/blank/blank.component').then(m => m.BlankComponent),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'about',
        loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
      },
      {
        path: 'allcategory',
        loadComponent: () => import('./pages/allcategory/allcategory.component').then(m => m.AllcategoryComponent)
      },
      {
        path: 'cart',
        loadComponent: () => import('./pages/chart/chart.component').then(m => m.ChartComponent)
      }
      ,
      {
        path: 'details/:id',
        loadComponent: () => import('./pages/details/details.component').then(m => m.DetailsComponent)
      },
      {
        path: 'shippingaddress',
        loadComponent: () => import('./pages/shippingaddress/shippingaddress.component').then(m => m.ShippingaddressComponent)
      },
      {
        path: 'wishlist',
        loadComponent: () => import('./pages/wishlist/wishlist.component').then(m => m.WishlistComponent)
      },
        {
        path: 'contact',
        loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent)
      },
      
      {
        path: 'allOrders',
        loadComponent: () => import('./pages/allorders/allorders.component').then(m => m.AllordersComponent)
      },
      {
        path: 'updateprofile',
        loadComponent: () => import('./pages/updateprofile/updateprofile.component').then(m => m.UpdateprofileComponent),children: [
  {
        path: '',
        redirectTo: 'userdatalogin',
        pathMatch: 'full'
      },
          {
            path: 'updatepass',
            loadComponent: () => import('./pages/updatepass/updatepass.component').then(m => m.UpdatepassComponent)
          },
          {
            path: 'userdatalogin',
            loadComponent: () => import('./pages/userdatalogin/userdatalogin.component').then(m => m.UserdataloginComponent)
          }
        ]
      },
      
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      }
    ]
  },
  
  // Catch-all route for 404
  {
    path: '**',
    loadComponent: () => import('./pages/notfound/notfound.component').then(m => m.NotfoundComponent)
  }
];
