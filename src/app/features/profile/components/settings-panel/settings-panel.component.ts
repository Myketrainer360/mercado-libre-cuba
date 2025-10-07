import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  User,
  NotificationPreferences,
  PrivacySettings,
} from '../../../../models/user.interface';
/**
 * Componente per gestire le impostazioni dell'utente
 * Include: profilo, notifiche, privacy, sicurezza, account
 */
@Component({
  selector: 'app-settings-panel',
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-panel.component.html',
  styleUrl: './settings-panel.component.scss',
})
export class SettingsPanelComponent {
  // ==========================================
  // INPUTS & OUTPUTS
  // ==========================================

  @Input() user: User | null = null;

  @Output() onUpdateProfile = new EventEmitter<Partial<User>>();
  @Output() onUpdateNotifications = new EventEmitter<NotificationPreferences>();
  @Output() onUpdatePrivacy = new EventEmitter<PrivacySettings>();
  @Output() onChangePassword = new EventEmitter<void>();
  @Output() onDeleteAccount = new EventEmitter<void>();

  // ==========================================
  // PROPRIETÀ
  // ==========================================

  activeSection:
    | 'profile'
    | 'notifications'
    | 'privacy'
    | 'security'
    | 'account' = 'profile';

  localUser: any = {
    displayName: '',
    username: '',
    email: '',
    phone: '',
    bio: '',
    location: { province: '', city: '' },
    socialLinks: { whatsapp: '', telegram: '' },
    avatar: '',
  };

  notificationPrefs: NotificationPreferences = {
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    newMessages: true,
    adExpiration: true,
    newMatchingAds: false,
  };

  privacySettings: PrivacySettings = {
    showOnlineStatus: true,
    showLastSeen: true,
    allowSearchByEmail: true,
    allowSearchByPhone: false,
    showTransactionHistory: true,
  };

  cubanProvinces = [
    'Pinar del Río',
    'Artemisa',
    'La Habana',
    'Mayabeque',
    'Matanzas',
    'Cienfuegos',
    'Villa Clara',
    'Sancti Spíritus',
    'Ciego de Ávila',
    'Camagüey',
    'Las Tunas',
    'Holguín',
    'Granma',
    'Santiago de Cuba',
    'Guantánamo',
    'Isla de la Juventud',
  ];

  // ==========================================
  // LIFECYCLE
  // ==========================================

  ngOnInit() {
    if (this.user) {
      this.localUser = { ...this.user };
      this.notificationPrefs = {
        ...this.user.notificationPreferences,
      } as NotificationPreferences;
      this.privacySettings = {
        ...this.user.privacySettings,
      } as PrivacySettings;
    }
  }

  // ==========================================
  // AZIONI PROFILO
  // ==========================================

  saveProfile() {
    this.onUpdateProfile.emit(this.localUser);
    alert('Perfil actualizado correctamente');
  }

  cancelEdit() {
    if (this.user) {
      this.localUser = { ...this.user };
    }
  }

  // ==========================================
  // AZIONI NOTIFICHE
  // ==========================================

  saveNotifications() {
    this.onUpdateNotifications.emit(this.notificationPrefs);
    alert('Preferencias de notificaciones guardadas');
  }

  // ==========================================
  // AZIONI PRIVACY
  // ==========================================

  savePrivacy() {
    this.onUpdatePrivacy.emit(this.privacySettings);
    alert('Configuración de privacidad guardada');
  }

  // ==========================================
  // AZIONI SICUREZZA
  // ==========================================

  changePassword() {
    this.onChangePassword.emit();
  }

  verifyEmail() {
    alert('Email de verificación enviado');
  }

  setup2FA() {
    alert('Funcionalidad de 2FA próximamente');
  }

  manageSessions() {
    alert('Gestión de sesiones próximamente');
  }

  // ==========================================
  // AZIONI ACCOUNT
  // ==========================================

  downloadData() {
    alert('Preparando descarga de datos...');
  }

  deactivateAccount() {
    if (
      confirm(
        '¿Estás seguro de que quieres desactivar tu cuenta temporalmente?'
      )
    ) {
      alert('Cuenta desactivada');
    }
  }

  deleteAccount() {
    const confirmation = prompt(
      'Esta acción es irreversible. Escribe "ELIMINAR" para confirmar:'
    );

    if (confirmation === 'ELIMINAR') {
      this.onDeleteAccount.emit();
    }
  }
}
