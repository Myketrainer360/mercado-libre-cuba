import { Routes } from '@angular/router';

export const routes: Routes = [
  // Redirect alla home quando l'utente arriva alla root
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },

  // Lazy loading: Angular caricherà questi componenti solo quando servono
  // È come aprire una stanza solo quando ci devi entrare
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
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
  },
  {
    path: 'create-ad',
    loadComponent: () =>
      import('./features/create-ad/create-ad.component').then(
        (m) => m.CreateAdComponent
      ),
  },
  {
    path: 'messages',
    loadComponent: () =>
      import('./features/messages/messages.component').then(
        (m) => m.MessagesComponent
      ),
  },

  // Pagina 404 per percorsi non trovati
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
