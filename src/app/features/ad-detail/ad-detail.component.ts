// ==========================================
// FILE: src/app/features/ad-detail/ad-detail.component.ts
// ==========================================
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Ad, AdCategory } from '../../models/ad.interface';
import { User } from '../../models/user.interface';

/**
 * Componente per visualizzare i dettagli completi di un annuncio
 * Include galleria immagini, info venditore, azioni e annunci correlati
 */
@Component({
  selector: 'app-ad-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ad-detail.component.html',
  styleUrls: ['./ad-detail.component.scss'],
})
export class AdDetailComponent implements OnInit, OnDestroy {
  // ==========================================
  // PROPRIETÀ
  // ==========================================

  private destroy$ = new Subject<void>();

  // Dati annuncio
  ad: Ad | null = null;
  adId: string = '';
  isLoading = true;
  error: string | null = null;

  // Galleria immagini
  currentImageIndex = 0;
  showImageModal = false;

  // Venditore
  seller: User | null = null;
  isLoadingSeller = false;

  // Stato utente
  isFavorite = false;
  isOwner = false;
  currentUserId = 'current-user-id'; // Mock

  // Contatti
  showContactModal = false;
  showPhoneNumber = false;

  // Annunci correlati
  relatedAds: Ad[] = [];
  isLoadingRelated = false;

  // Share
  showShareModal = false;

  // Report
  showReportModal = false;
  reportReason = '';

  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(private route: ActivatedRoute, private router: Router) {}

  // ==========================================
  // LIFECYCLE
  // ==========================================

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.adId = params['id'];
      this.loadAdDetails();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ==========================================
  // CARICAMENTO DATI
  // ==========================================

  async loadAdDetails() {
    this.isLoading = true;
    this.error = null;

    try {
      // Simulazione chiamata API
      await this.simulateApiCall();

      this.ad = this.getMockAd();

      if (this.ad) {
        this.isOwner = this.ad.userId === this.currentUserId;
        this.checkIfFavorite();
        await this.loadSellerInfo();
        await this.loadRelatedAds();
        this.incrementViewCount();
      } else {
        this.error = 'Anuncio no encontrado';
      }
    } catch (error) {
      this.error = 'Error al cargar el anuncio';
      console.error('Error loading ad:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private async loadSellerInfo() {
    this.isLoadingSeller = true;

    try {
      await this.simulateApiCall(500);

      this.seller = {
        id: this.ad!.userId,
        email: 'seller@example.com',
        username: 'maria_habana',
        displayName: 'María García',
        avatar: '/assets/images/avatar-default.png',
        location: {
          province: 'La Habana',
          city: 'Vedado',
        },
        rating: {
          averageRating: 4.8,
          totalReviews: 45,
        },
        totalTransactions: 67,
        responseTime: '< 2 horas',
        joinDate: new Date('2023-01-15'),
        isVerified: true,
        isOnline: true,
      } as User;
    } catch (error) {
      console.error('Error loading seller:', error);
    } finally {
      this.isLoadingSeller = false;
    }
  }

  private async loadRelatedAds() {
    this.isLoadingRelated = true;

    try {
      await this.simulateApiCall(600);
      this.relatedAds = this.getMockRelatedAds();
    } catch (error) {
      console.error('Error loading related ads:', error);
    } finally {
      this.isLoadingRelated = false;
    }
  }

  private simulateApiCall(delay = 800): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  // ==========================================
  // GALLERIA IMMAGINI
  // ==========================================

  previousImage() {
    if (this.ad && this.ad.images.length > 0) {
      this.currentImageIndex =
        this.currentImageIndex === 0
          ? this.ad.images.length - 1
          : this.currentImageIndex - 1;
    }
  }

  nextImage() {
    if (this.ad && this.ad.images.length > 0) {
      this.currentImageIndex =
        this.currentImageIndex === this.ad.images.length - 1
          ? 0
          : this.currentImageIndex + 1;
    }
  }

  selectImage(index: number) {
    this.currentImageIndex = index;
  }

  openImageModal(index?: number) {
    if (index !== undefined) {
      this.currentImageIndex = index;
    }
    this.showImageModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeImageModal() {
    this.showImageModal = false;
    document.body.style.overflow = 'auto';
  }

  // ==========================================
  // AZIONI ANNUNCIO
  // ==========================================

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;

    if (this.isFavorite) {
      console.log('Added to favorites');
      // API call to add favorite
    } else {
      console.log('Removed from favorites');
      // API call to remove favorite
    }
  }

  private checkIfFavorite() {
    // Mock - verificare se è nei favoriti
    this.isFavorite = Math.random() > 0.5;
  }

  shareAd() {
    this.showShareModal = true;
  }

  closeShareModal() {
    this.showShareModal = false;
  }

  copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Enlace copiado al portapapeles');
    this.closeShareModal();
  }

  shareOnWhatsApp() {
    const url = window.location.href;
    const text = `Mira este anuncio: ${this.ad?.title}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      '_blank'
    );
  }

  shareOnTelegram() {
    const url = window.location.href;
    const text = `Mira este anuncio: ${this.ad?.title}`;
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(text)}`,
      '_blank'
    );
  }

  reportAd() {
    this.showReportModal = true;
  }

  closeReportModal() {
    this.showReportModal = false;
    this.reportReason = '';
  }

  submitReport() {
    if (this.reportReason.trim()) {
      console.log('Reporting ad:', this.reportReason);
      alert('Gracias por tu reporte. Lo revisaremos pronto.');
      this.closeReportModal();
    }
  }

  // ==========================================
  // CONTATTO VENDITORE
  // ==========================================

  contactSeller() {
    if (this.isOwner) {
      alert('Este es tu propio anuncio');
      return;
    }

    this.showContactModal = true;
    this.incrementContactCount();
  }

  closeContactModal() {
    this.showContactModal = false;
    this.showPhoneNumber = false;
  }

  revealPhoneNumber() {
    this.showPhoneNumber = true;
  }

  sendMessage() {
    // Navegar a la chat con il venditore
    this.router.navigate(['/messages'], {
      queryParams: { userId: this.seller?.id, adId: this.ad?.id },
    });
    this.closeContactModal();
  }

  callSeller() {
    if (this.seller?.phone) {
      window.location.href = `tel:${this.seller.phone}`;
    }
  }

  // ==========================================
  // AZIONI PROPRIETARIO
  // ==========================================

  editAd() {
    this.router.navigate(['/edit-ad', this.adId]);
  }

  deleteAd() {
    const confirmed = confirm(
      '¿Estás seguro de que quieres eliminar este anuncio?\n\nEsta acción no se puede deshacer.'
    );

    if (confirmed) {
      console.log('Deleting ad:', this.adId);
      // API call to delete
      this.router.navigate(['/profile']);
    }
  }

  pauseAd() {
    console.log('Pausing ad:', this.adId);
    // API call to pause
  }

  markAsSold() {
    const confirmed = confirm('¿Marcar este anuncio como vendido?');
    if (confirmed) {
      console.log('Marking as sold:', this.adId);
      // API call to mark as sold
    }
  }

  // ==========================================
  // NAVIGAZIONE
  // ==========================================

  goBack() {
    window.history.back();
  }

  viewSellerProfile() {
    if (this.seller) {
      this.router.navigate(['/profile', this.seller.id]);
    }
  }

  viewRelatedAd(adId: string) {
    this.router.navigate(['/ad', adId]);
  }

  // ==========================================
  // UTILITY
  // ==========================================

  private incrementViewCount() {
    if (this.ad && !this.isOwner) {
      this.ad.viewCount++;
      // API call to increment view count
    }
  }

  private incrementContactCount() {
    if (this.ad) {
      this.ad.contactCount++;
      // API call to increment contact count
    }
  }

  formatPrice(price: number): string {
    return price.toLocaleString('es-ES');
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Hace menos de 1 hora';
    if (diffHours < 24)
      return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;

    const weeks = Math.floor(diffDays / 7);
    return `Hace ${weeks} semana${weeks > 1 ? 's' : ''}`;
  }

  getCategoryLabel(category: AdCategory): string {
    const labels: { [key in AdCategory]: string } = {
      [AdCategory.SERVICES]: 'Servicios',
      [AdCategory.ELECTRONICS]: 'Electrónicos',
      [AdCategory.HOUSEHOLD]: 'Hogar',
      [AdCategory.CLOTHING]: 'Ropa y Accesorios',
      [AdCategory.TRANSPORT]: 'Transporte',
      [AdCategory.FOOD]: 'Alimentos',
      [AdCategory.HEALTH]: 'Salud',
      [AdCategory.EDUCATION]: 'Educación',
      [AdCategory.CONSTRUCTION]: 'Construcción',
      [AdCategory.ENTERTAINMENT]: 'Entretenimiento',
      [AdCategory.BEAUTY]: 'Belleza',
      [AdCategory.PETS]: 'Mascotas',
      [AdCategory.TOOLS]: 'Herramientas',
      [AdCategory.BOOKS]: 'Libros',
      [AdCategory.OTHER]: 'Otros',
    };
    return labels[category] || 'Otros';
  }

  getStarsArray(rating: number): { filled: boolean; half: boolean }[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push({ filled: true, half: false });
      } else if (rating >= i - 0.5) {
        stars.push({ filled: false, half: true });
      } else {
        stars.push({ filled: false, half: false });
      }
    }
    return stars;
  }

  // ==========================================
  // MOCK DATA
  // ==========================================

  private getMockAd(): Ad {
    return {
      id: this.adId,
      userId: 'user-123',
      title: 'iPhone 12 Pro 128GB en Excelente Estado',
      description: `iPhone 12 Pro de 128GB en excelente estado, usado solo 6 meses.

Incluye:
- Caja original
- Cargador original
- Cable Lightning
- Funda de silicona
- Cristal templado instalado

El teléfono está en perfectas condiciones, sin golpes ni rayones. Batería al 95% de su capacidad original. Libre de iCloud y con todos los accesorios originales.

Acepto intercambios por:
- Samsung Galaxy S23 Ultra
- MacBook Air M1
- PlayStation 5

También acepto pagos en USD o EUR. El precio es ligeramente negociable para compra en efectivo.

Ubicación: Vedado, La Habana. Puedo mostrar el teléfono cuando quieras y hacer todas las pruebas necesarias.`,
      category: AdCategory.ELECTRONICS,
      type: 'offer',
      price: 850,
      currency: 'USD',
      isNegotiable: true,
      images: [
        '/assets/images/iphone-1.jpg',
        '/assets/images/iphone-2.jpg',
        '/assets/images/iphone-3.jpg',
        '/assets/images/iphone-4.jpg',
      ],
      mainImageIndex: 0,
      location: {
        province: 'La Habana',
        city: 'Vedado',
        neighborhood: 'Plaza de la Revolución',
      },
      deliveryOptions: ['pickup_only', 'meet_halfway'],
      tags: ['iphone', 'apple', 'smartphone', '128gb', 'como nuevo'],
      condition: 'excellent',
      status: 'active',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000),
      viewCount: 234,
      contactCount: 12,
      favoriteCount: 18,
    } as any;
  }

  private getMockRelatedAds(): Ad[] {
    return [
      {
        id: 'ad-2',
        title: 'Samsung Galaxy S22 Ultra',
        price: 780,
        currency: 'USD',
        images: ['/assets/images/samsung.jpg'],
        location: { province: 'La Habana', city: 'Centro Habana' },
        type: 'offer',
      } as any,
      {
        id: 'ad-3',
        title: 'iPhone 13 Pro Max 256GB',
        price: 950,
        currency: 'USD',
        images: ['/assets/images/iphone13.jpg'],
        location: { province: 'La Habana', city: 'Miramar' },
        type: 'offer',
      } as any,
      {
        id: 'ad-4',
        title: 'iPad Air 2022',
        price: 650,
        currency: 'USD',
        images: ['/assets/images/ipad.jpg'],
        location: { province: 'La Habana', city: 'Vedado' },
        type: 'offer',
      } as any,
    ];
  }
}
