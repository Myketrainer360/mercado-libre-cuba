import { Currency } from './ad.interface';
import { Location } from './ad.interface';

// ==========================================
// FILE: src/app/models/user.interface.ts
// ==========================================

// ==========================================
// FILE: src/app/models/user.interface.ts
// ==========================================

/**
 * Interfaccia utente base
 */
export interface User {
  // Identificatori
  id: string;
  email: string;
  username: string;
  displayName: string;

  // Profilo
  avatar?: string;
  bio?: string;
  phone?: string;

  // Localizzazione
  location: {
    province: string;
    city: string;
    neighborhood?: string;
  };

  // Rating e recensioni
  rating: {
    averageRating: number;
    totalReviews: number;
    distribution?: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };

  // Statistiche
  totalTransactions: number;
  successRate?: number;
  responseTime?: string;

  // Date
  joinDate: Date;
  lastSeen?: Date;

  // Stato
  isVerified: boolean;
  isOnline?: boolean;

  // Extra
  languages?: string[];
  socialLinks?: {
    whatsapp?: string;
    telegram?: string;
    facebook?: string;
  };

  // Preferenze (solo per proprio profilo)
  notificationPreferences?: NotificationPreferences;
  privacySettings?: PrivacySettings;
}

/**
 * Statistiche utente per dashboard
 */
export interface UserStats {
  totalAds: number;
  activeAds: number;
  soldItems: number;
  totalViews: number;
  totalContacts: number;
  responseRate: number;
  averageResponseTime: number;
}

/**
 * Preferenze notifiche
 */
export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  newMessages: boolean;
  adExpiration: boolean;
  newMatchingAds: boolean;
}

/**
 * Impostazioni privacy
 */
export interface PrivacySettings {
  showOnlineStatus: boolean;
  showLastSeen: boolean;
  allowSearchByEmail: boolean;
  allowSearchByPhone: boolean;
  showTransactionHistory: boolean;
}

/**
 * Rating utente
 */
export interface UserRating {
  averageRating: number;
  totalReviews: number;
  distribution?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  recentReviews?: Review[];
}

/**
 * Recensione
 */
export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number;
  comment: string;
  date: Date;
  adId?: string;
  adTitle?: string;
}
