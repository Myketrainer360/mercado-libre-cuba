import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Redirect alla home quando l'utente arriva alla root
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },

  // ==========================================
  // ROUTES PUBBLICHE (AUTENTICAZIONE)
  // ==========================================
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'password-reset',
    loadComponent: () =>
      import('./features/auth/password-reset/password-reset.component').then(
        (m) => m.PasswordResetComponent
      ),
  },

  // ==========================================
  // ROUTES PUBBLICHE (PRINCIPALI)
  // ==========================================
  // Lazy loading: Angular caricherà questi componenti solo quando servono
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./features/search/search.component').then(
        (m) => m.SearchComponent
      ),
  },
  {
    path: 'ad/:id', // :id è un parametro dinamico
    loadComponent: () =>
      import('./features/ad-detail/ad-detail.component').then(
        (m) => m.AdDetailComponent
      ),
  },

  // ==========================================
  // ROUTES PROTETTE (RICHIEDONO LOGIN)
  // ==========================================
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'create-ad',
    loadComponent: () =>
      import('./features/create-ad/create-ad.component').then(
        (m) => m.CreateAdComponent
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'messages',
    loadComponent: () =>
      import('./features/messages/messages.component').then(
        (m) => m.MessagesComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'my-ads-list',
    loadComponent: () =>
      import(
        './features/profile/components/my-ads-list/my-ads-list.component'
      ).then((m) => m.MyAdsListComponent),
    canActivate: [AuthGuard],
  },

  // {
  //   path: 'favorites',
  //   loadComponent: () => import('./features/favorites/favorites.component')
  //     .then(m => m.FavoritesComponent),
  //   canActivate: [AuthGuard]
  // },

  // Pagina 404 per percorsi non trovati
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
