// ==========================================
// FILE: src/app/core/services/auth.service.ts
// ==========================================
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  phone?: string;
  location: {
    province: string;
    city: string;
  };
  isVerified: boolean;
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  username: string;
  displayName: string;
  password: string;
  confirmPassword: string;
  province: string;
  city: string;
  acceptTerms: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Observable per lo stato dell'utente corrente
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Signal per lo stato di autenticazione (Angular 17+)
  public isAuthenticated = signal<boolean>(false);

  // Token di autenticazione
  private tokenKey = 'auth_token';
  private refreshTokenKey = 'refresh_token';

  constructor(private router: Router) {
    this.loadUserFromStorage();
  }

  // ==========================================
  // LOGIN
  // ==========================================

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    // Simulazione chiamata API
    // In produzione, sostituisci con: return this.http.post<AuthResponse>('/api/auth/login', credentials)

    console.log('🔐 Tentativo di login con:', credentials.email);

    return of({
      user: {
        id: 'user_' + Date.now(),
        email: credentials.email,
        username: credentials.email.split('@')[0],
        displayName: credentials.email.split('@')[0],
        avatar: '',
        location: {
          province: 'La Habana',
          city: 'Vedado',
        },
        isVerified: true,
        createdAt: new Date(),
      },
      token: 'fake_jwt_token_' + Date.now(),
      refreshToken: 'fake_refresh_token_' + Date.now(),
    }).pipe(
      delay(1000), // Simula latenza di rete
      tap((response) => {
        this.handleAuthSuccess(response, credentials.rememberMe);
        console.log('✅ Login exitoso');
      })
    );
  }

  // ==========================================
  // REGISTER
  // ==========================================

  register(data: RegisterData): Observable<AuthResponse> {
    // Validazione
    if (data.password !== data.confirmPassword) {
      return throwError(() => new Error('Las contraseñas no coinciden'));
    }

    if (!data.acceptTerms) {
      return throwError(
        () => new Error('Debes aceptar los términos y condiciones')
      );
    }

    console.log('📝 Registro nuevo usuario:', data.username);

    // Simulazione chiamata API
    return of({
      user: {
        id: 'user_' + Date.now(),
        email: data.email,
        username: data.username,
        displayName: data.displayName,
        avatar: '',
        location: {
          province: data.province,
          city: data.city,
        },
        isVerified: false,
        createdAt: new Date(),
      },
      token: 'fake_jwt_token_' + Date.now(),
      refreshToken: 'fake_refresh_token_' + Date.now(),
    }).pipe(
      delay(1500),
      tap((response) => {
        this.handleAuthSuccess(response, true);
        console.log('✅ Registro exitoso');
      })
    );
  }

  // ==========================================
  // LOGOUT
  // ==========================================

  logout(): void {
    console.log('👋 Cerrando sesión...');

    // Rimuovi i token
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    sessionStorage.removeItem(this.tokenKey);

    // Resetta lo stato
    this.currentUserSubject.next(null);
    this.isAuthenticated.set(false);

    // Redirect al login
    this.router.navigate(['/login']);
  }

  // ==========================================
  // PASSWORD RESET
  // ==========================================

  requestPasswordReset(
    email: string
  ): Observable<{ success: boolean; message: string }> {
    console.log('📧 Solicitud de restablecimiento de contraseña para:', email);

    // Simulazione invio email
    return of({
      success: true,
      message:
        'Se ha enviado un correo con instrucciones para restablecer tu contraseña',
    }).pipe(delay(1500));
  }

  resetPassword(
    token: string,
    newPassword: string
  ): Observable<{ success: boolean }> {
    console.log('🔑 Restableciendo contraseña con token:', token);

    // Simulazione reset password
    return of({
      success: true,
    }).pipe(delay(1000));
  }

  // ==========================================
  // VERIFICA EMAIL
  // ==========================================

  verifyEmail(token: string): Observable<{ success: boolean }> {
    console.log('✉️ Verificando email con token:', token);

    return of({
      success: true,
    }).pipe(
      delay(1000),
      tap(() => {
        const currentUser = this.currentUserSubject.value;
        if (currentUser) {
          currentUser.isVerified = true;
          this.currentUserSubject.next(currentUser);
        }
      })
    );
  }

  resendVerificationEmail(): Observable<{ success: boolean; message: string }> {
    return of({
      success: true,
      message: 'Se ha enviado un nuevo correo de verificación',
    }).pipe(delay(1000));
  }

  // ==========================================
  // GESTIONE TOKEN E STORAGE
  // ==========================================

  private handleAuthSuccess(
    response: AuthResponse,
    rememberMe?: boolean
  ): void {
    // Salva il token
    if (rememberMe) {
      localStorage.setItem(this.tokenKey, response.token);
      if (response.refreshToken) {
        localStorage.setItem(this.refreshTokenKey, response.refreshToken);
      }
    } else {
      sessionStorage.setItem(this.tokenKey, response.token);
    }

    // Aggiorna lo stato
    this.currentUserSubject.next(response.user);
    this.isAuthenticated.set(true);
  }

  private loadUserFromStorage(): void {
    const token =
      localStorage.getItem(this.tokenKey) ||
      sessionStorage.getItem(this.tokenKey);

    if (token) {
      // In produzione, qui dovresti validare il token con il backend
      // Per ora simuliamo un utente
      const mockUser: User = {
        id: 'stored_user',
        email: 'user@example.com',
        username: 'usuario',
        displayName: 'Usuario Demo',
        location: {
          province: 'La Habana',
          city: 'Vedado',
        },
        isVerified: true,
        createdAt: new Date(),
      };

      this.currentUserSubject.next(mockUser);
      this.isAuthenticated.set(true);
    }
  }

  getToken(): string | null {
    return (
      localStorage.getItem(this.tokenKey) ||
      sessionStorage.getItem(this.tokenKey)
    );
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // ==========================================
  // VALIDAZIONI
  // ==========================================

  checkEmailExists(email: string): Observable<boolean> {
    // Simulazione controllo email
    console.log('Verificando disponibilidad de email:', email);
    return of(false).pipe(delay(500)); // false = disponibile
  }

  checkUsernameExists(username: string): Observable<boolean> {
    // Simulazione controllo username
    console.log('Verificando disponibilidad de username:', username);
    return of(false).pipe(delay(500)); // false = disponibile
  }
}
