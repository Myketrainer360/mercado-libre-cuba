// ==========================================
// FILE: src/app/core/guards/auth.guard.ts
// ==========================================
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Salva l'URL che l'utente stava cercando di accedere
  const returnUrl = state.url;
  console.log('🔒 Accesso negato. Redirect a login. URL richiesto:', returnUrl);

  // Redirect al login con il returnUrl come parametro
  router.navigate(['/login'], {
    queryParams: { returnUrl },
  });

  return false;
};
