// ==========================================
// FILE: src/app/features/profile/profile.component.ts
// ==========================================
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// Sotto-componenti
import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';
import { ProfileTabsComponent } from './components/profile-tabs/profile-tabs.component';
import { MyAdsListComponent } from './components/my-ads-list/my-ads-list.component';
import { ReviewsSectionComponent } from './components/reviews-section/reviews-section.component';
// import { SettingsPanelComponent } from './components/settings-panel/settings-panel.component';
import { ProfileStatsComponent } from './components/profile-stats/profile-stats.component';

// Modelli
import { User, UserStats } from '../../models/user.interface';
import { Ad } from '../../models/ad.interface';

/**
 * Componente principale del profilo utente
 * Gestisce lo stato globale e coordina tutti i sotto-componenti
 */
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ProfileHeaderComponent,
    ProfileTabsComponent,
    MyAdsListComponent,
    ReviewsSectionComponent,
    // SettingsPanelComponent,
    ProfileStatsComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  // ==========================================
  // PROPRIETÀ
  // ==========================================

  // Gestione subscription
  private destroy$ = new Subject<void>();

  // Stato generale
  activeTab: string = 'ads';
  isOwnProfile = true;
  currentUserId = 'current-user-id';
  profileUserId?: string;

  // Stati di caricamento
  isLoadingProfile = true;
  isLoadingAds = false;
  isLoadingReviews = false;
  isLoadingFavorites = false;

  // Gestione errori
  profileError: string | null = null;
  adsError: string | null = null;

  // Dati utente
  currentUser: User | null = null;
  userStats: UserStats | null = null;

  // Dati annunci
  userAds: Ad[] = [];
  favoriteAds: Ad[] = [];

  // Recensioni
  userReviews: any[] = [];
  averageRating = 0;
  totalReviews = 0;

  // Notifiche
  unreadNotifications = 0;

  // Attività recente
  recentActivity: ActivityItem[] = [];

  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(private route: ActivatedRoute) {}

  // ==========================================
  // LIFECYCLE HOOKS
  // ==========================================

  ngOnInit() {
    this.initializeProfile();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ==========================================
  // INIZIALIZZAZIONE
  // ==========================================

  private async initializeProfile() {
    try {
      // Determina se è il proprio profilo o di un altro utente
      this.profileUserId =
        this.route.snapshot.paramMap.get('userId') || this.currentUserId;
      this.isOwnProfile = this.profileUserId === this.currentUserId;

      // Carica dati profilo
      await this.loadProfileData();
    } catch (error) {
      this.handleProfileError(error);
    }
  }

  private async loadProfileData() {
    this.isLoadingProfile = true;
    this.profileError = null;

    try {
      // Carica dati in parallelo per migliore performance
      await Promise.all([
        this.loadUserData(),
        this.loadUserStats(),
        this.loadTabData(this.activeTab),
      ]);
    } catch (error) {
      this.profileError =
        'Error al cargar el perfil. Por favor, intenta de nuevo.';
      throw error;
    } finally {
      this.isLoadingProfile = false;
    }
  }

  // ==========================================
  // CARICAMENTO DATI UTENTE
  // ==========================================

  private async loadUserData(): Promise<void> {
    // Simulazione chiamata API
    return new Promise((resolve) => {
      setTimeout(() => {
        this.currentUser = {
          id: this.profileUserId!,
          email: 'maria@example.com',
          username: 'maria_habana',
          displayName: 'María García',
          avatar: '/assets/images/avatar-maria.jpg',
          bio: 'Emprendedora cubana. Me encanta ayudar a mi comunidad encontrando lo que necesitan. 🇨🇺',
          phone: '+53 5555 1234',
          location: {
            province: 'La Habana',
            city: 'Vedado',
          },
          rating: {
            averageRating: 4.8,
            totalReviews: 127,
            distribution: {
              5: 98,
              4: 22,
              3: 5,
              2: 2,
              1: 0,
            },
          },
          totalTransactions: 156,
          successRate: 94,
          responseTime: '< 2 horas',
          joinDate: new Date('2023-01-15'),
          lastSeen: new Date(),
          isVerified: true,
          isOnline: true,
          languages: ['es', 'en'],
          socialLinks: {
            whatsapp: '+5355551234',
            telegram: '@maria_habana',
          },
        };

        resolve();
      }, 800);
    });
  }

  private async loadUserStats(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.userStats = {
          totalAds: 23,
          activeAds: 18,
          soldItems: 45,
          totalViews: 1247,
          totalContacts: 89,
          responseRate: 94,
          averageResponseTime: 2,
        };

        this.unreadNotifications = 3;

        this.recentActivity = [
          {
            icon: '👁️',
            text: 'Tu anuncio "iPhone 12" recibió 5 nuevas visualizaciones',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            type: 'view',
          },
          {
            icon: '💬',
            text: 'Nuevo mensaje sobre "Clases de inglés"',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
            type: 'message',
          },
          {
            icon: '⭐',
            text: 'Recibiste una nueva reseña de 5 estrellas',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            type: 'review',
          },
        ];

        resolve();
      }, 600);
    });
  }

  // ==========================================
  // CAMBIO TAB
  // ==========================================

  async onTabChange(tab: string) {
    if (this.activeTab === tab) return;

    this.activeTab = tab;
    await this.loadTabData(tab);
  }

  private async loadTabData(tab: string) {
    switch (tab) {
      case 'ads':
        await this.loadUserAds();
        break;
      case 'reviews':
        await this.loadUserReviews();
        break;
      case 'favorites':
        if (this.isOwnProfile) {
          await this.loadFavoriteAds();
        }
        break;
      case 'activity':
        // Già caricato in loadUserStats
        break;
      case 'settings':
        // Caricato on-demand dal componente Settings
        break;
    }
  }

  // ==========================================
  // CARICAMENTO ANNUNCI
  // ==========================================

  private async loadUserAds(): Promise<void> {
    this.isLoadingAds = true;
    this.adsError = null;

    try {
      // Simulazione chiamata API
      await new Promise((resolve) => {
        setTimeout(() => {
          this.userAds = this.generateMockAds();
          resolve(true);
        }, 800);
      });
    } catch (error) {
      this.adsError = 'Error al cargar los anuncios.';
      console.error('Error loading ads:', error);
    } finally {
      this.isLoadingAds = false;
    }
  }

  private generateMockAds(): Ad[] {
    // Mock data per sviluppo
    return [
      {
        id: 'ad-1',
        userId: this.profileUserId!,
        title: 'iPhone 12 Pro 128GB',
        description: 'Excelente estado, usado solo 6 meses',
        category: 'electronics' as any,
        type: 'offer',
        price: 850,
        currency: 'USD',
        images: ['/assets/images/iphone12.jpg'],
        status: 'active',
        viewCount: 234,
        contactCount: 12,
        createdAt: new Date('2024-09-15'),
        location: {
          province: 'La Habana',
          city: 'Vedado',
        },
      } as any,
      // Altri annunci...
    ];
  }

  // ==========================================
  // CARICAMENTO RECENSIONI
  // ==========================================

  private async loadUserReviews(): Promise<void> {
    this.isLoadingReviews = true;

    try {
      await new Promise((resolve) => {
        setTimeout(() => {
          this.userReviews = this.generateMockReviews();
          resolve(true);
        }, 700);
      });
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      this.isLoadingReviews = false;
    }
  }

  private generateMockReviews(): any[] {
    return [
      {
        id: 'review-1',
        reviewerId: 'user-2',
        reviewerName: 'Carlos Pérez',
        reviewerAvatar: '/assets/images/avatar-default.png',
        rating: 5,
        comment: 'Excelente vendedora, muy profesional y rápida en responder.',
        date: new Date('2024-09-20'),
        adTitle: 'iPhone 12 Pro',
      },
    ];
  }

  // ==========================================
  // CARICAMENTO FAVORITI
  // ==========================================

  private async loadFavoriteAds(): Promise<void> {
    this.isLoadingFavorites = true;

    try {
      await new Promise((resolve) => {
        setTimeout(() => {
          this.favoriteAds = [];
          resolve(true);
        }, 600);
      });
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      this.isLoadingFavorites = false;
    }
  }

  // ==========================================
  // GESTIONE EVENTI HEADER
  // ==========================================

  handleEditProfile() {
    console.log('Edit profile');
    // Implementare navigazione a pagina edit profilo
  }

  handleContactUser() {
    console.log('Contact user');
    // Implementare apertura chat
  }

  handleReportUser() {
    if (confirm('¿Estás seguro de que quieres reportar este usuario?')) {
      console.log('Report user');
      // Implementare sistema di segnalazione
    }
  }

  // ==========================================
  // GESTIONE EVENTI ANNUNCI
  // ==========================================

  handleCreateAd() {
    console.log('Create new ad');
    // Navigazione a pagina creazione annuncio
  }

  handleEditAd(adId: string) {
    console.log('Edit ad:', adId);
  }

  handleDeleteAd(adId: string) {
    if (confirm('¿Estás seguro de que quieres eliminar este anuncio?')) {
      this.userAds = this.userAds.filter((ad) => ad.id !== adId);
      console.log('Ad deleted:', adId);
    }
  }

  handleViewAd(adId: string) {
    console.log('View ad:', adId);
    // Navigazione a dettaglio annuncio
  }

  handleRemoveFavorite(adId: string) {
    this.favoriteAds = this.favoriteAds.filter((ad) => ad.id !== adId);
    console.log('Removed from favorites:', adId);
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  formatActivityTime(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Ahora mismo';
    if (minutes < 60) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    if (days < 7) return `Hace ${days} día${days > 1 ? 's' : ''}`;

    return new Date(timestamp).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
    });
  }

  // ==========================================
  // GESTIONE ERRORI
  // ==========================================

  private handleProfileError(error: any) {
    console.error('Profile error:', error);
    this.profileError =
      'Error al cargar el perfil. Por favor, intenta de nuevo más tarde.';
    this.isLoadingProfile = false;
  }

  retryLoadProfile() {
    this.loadProfileData();
  }
}

// ==========================================
// INTERFACCE
// ==========================================

interface ActivityItem {
  icon: string;
  text: string;
  timestamp: Date;
  type: 'view' | 'message' | 'review' | 'ad' | 'sale';
}
