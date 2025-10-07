import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ad } from '../../../../models/ad.interface';

/**
 * Componente per visualizzare e gestire la lista degli annunci dell'utente
 * Include funzionalità di filtro, ordinamento ed azioni per ogni annuncio
 */

/**
 * Componente per visualizzare e gestire la lista degli annunci dell'utente
 * Include funzionalità di filtro, ordinamento ed azioni per ogni annuncio
 */
@Component({
  selector: 'app-my-ads-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './my-ads-list.component.html',
  styleUrl: './my-ads-list.component.scss',
})
export class MyAdsListComponent implements OnInit {
  // ==========================================
  // INPUTS & OUTPUTS
  // ==========================================

  @Input() ads: Ad[] = [];
  @Input() isOwnProfile = false;
  @Input() userName = '';
  @Input() isLoading = false;
  @Input() error: string | null = null;

  @Output() onCreateAd = new EventEmitter<void>();
  @Output() onEditAd = new EventEmitter<string>();
  @Output() onDeleteAd = new EventEmitter<string>();
  @Output() onViewAd = new EventEmitter<string>();
  @Output() onRetry = new EventEmitter<void>();

  // ==========================================
  // PROPRIETÀ
  // ==========================================

  selectedFilter: 'all' | 'active' | 'paused' | 'completed' | 'expired' = 'all';
  sortBy:
    | 'recent'
    | 'oldest'
    | 'views'
    | 'contacts'
    | 'price-high'
    | 'price-low' = 'recent';
  activeMenuId: string | null = null;

  // ==========================================
  // LIFECYCLE
  // ==========================================

  ngOnInit() {
    // Inizializzazione
  }

  // ==========================================
  // FILTRI
  // ==========================================

  setFilter(filter: typeof this.selectedFilter) {
    this.selectedFilter = filter;
    this.activeMenuId = null;
  }

  getFilteredAds(): Ad[] {
    if (this.selectedFilter === 'all') {
      return this.ads;
    }
    return this.ads.filter((ad) => ad.status === this.selectedFilter);
  }

  getTotalByStatus(status: typeof this.selectedFilter): number {
    if (status === 'all') return this.ads.length;
    return this.ads.filter((ad) => ad.status === status).length;
  }

  getStatusText(): string {
    switch (this.selectedFilter) {
      case 'all':
        return '';
      case 'active':
        return 'activos';
      case 'paused':
        return 'pausados';
      case 'completed':
        return 'completados';
      case 'expired':
        return 'expirados';
      default:
        return '';
    }
  }

  getFilteredStatusText(): string {
    switch (this.selectedFilter) {
      case 'active':
        return 'activos';
      case 'paused':
        return 'pausados';
      case 'completed':
        return 'completados';
      case 'expired':
        return 'expirados';
      default:
        return '';
    }
  }

  // ==========================================
  // ORDINAMENTO
  // ==========================================

  onSortChange() {
    this.activeMenuId = null;
  }

  getSortedAds(): Ad[] {
    const filtered = [...this.getFilteredAds()];

    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'recent':
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case 'oldest':
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case 'views':
          return (b.viewCount || 0) - (a.viewCount || 0);
        case 'contacts':
          return (b.contactCount || 0) - (a.contactCount || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }

  // ==========================================
  // AZIONI ANNUNCI
  // ==========================================

  toggleMenu(adId: string) {
    this.activeMenuId = this.activeMenuId === adId ? null : adId;
  }

  handleEdit(adId: string) {
    this.activeMenuId = null;
    this.onEditAd.emit(adId);
  }

  handlePause(adId: string) {
    this.activeMenuId = null;
    console.log('Pause ad:', adId);
    // Implementare logica di pausa
  }

  handleActivate(adId: string) {
    this.activeMenuId = null;
    console.log('Activate ad:', adId);
    // Implementare logica di attivazione
  }

  handleMarkCompleted(adId: string) {
    this.activeMenuId = null;
    if (confirm('¿Marcar este anuncio como vendido?')) {
      console.log('Mark completed:', adId);
    }
  }

  handleShare(adId: string) {
    this.activeMenuId = null;
    const url = `${window.location.origin}/ad/${adId}`;

    if (navigator.share) {
      navigator
        .share({
          title: 'Anuncio',
          url: url,
        })
        .catch(() => this.copyToClipboard(url));
    } else {
      this.copyToClipboard(url);
    }
  }

  handleDelete(adId: string) {
    this.activeMenuId = null;
    if (
      confirm(
        '¿Estás seguro de que quieres eliminar este anuncio?\n\nEsta acción no se puede deshacer.'
      )
    ) {
      this.onDeleteAd.emit(adId);
    }
  }

  private copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    alert('Enlace copiado al portapapeles');
  }

  retryLoad() {
    this.onRetry.emit();
  }

  // ==========================================
  // UTILITY
  // ==========================================

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      active: 'Activo',
      paused: 'Pausado',
      completed: 'Vendido',
      expired: 'Expirado',
    };
    return labels[status] || status;
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;

    return d.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
    });
  }

  trackByAdId(index: number, ad: Ad): string {
    return ad.id;
  }
}
