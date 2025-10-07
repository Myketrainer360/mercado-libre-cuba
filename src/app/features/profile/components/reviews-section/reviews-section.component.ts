import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Review } from '../../../../models/user.interface';

/**
 * Componente per visualizzare le recensioni dell'utente
 * Include filtri, ordinamento e form per lasciare recensioni
 */

@Component({
  selector: 'app-reviews-section',
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews-section.component.html',
  styleUrl: './reviews-section.component.scss',
})
export class ReviewsSectionComponent {
  // ==========================================
  // INPUTS & OUTPUTS
  // ==========================================

  @Input() reviews: Review[] = [];
  @Input() isLoading = false;
  @Input() isOwnProfile = false;
  @Input() averageRating = 0;
  @Input() totalReviews = 0;
  @Input() canWriteReview = true;

  @Output() onWriteReview = new EventEmitter<void>();
  @Output() onRespondReview = new EventEmitter<Review>();
  @Output() onReportReview = new EventEmitter<Review>();

  // ==========================================
  // PROPRIETÀ
  // ==========================================

  sortBy: 'recent' | 'oldest' | 'highest' | 'lowest' = 'recent';
  filterRating: 'all' | '5' | '4' | '3' | '2' | '1' = 'all';

  currentPage = 1;
  itemsPerPage = 10;

  // ==========================================
  // METODI FILTRI E ORDINAMENTO
  // ==========================================

  getFilteredReviews(): Review[] {
    let filtered = [...this.reviews];

    // Filtra per rating
    if (this.filterRating !== 'all') {
      const rating = parseInt(this.filterRating);
      filtered = filtered.filter((r) => r.rating === rating);
    }

    // Ordina
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'recent':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    // Paginazione
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    return filtered.slice(start, end);
  }

  onSortChange() {
    this.currentPage = 1;
  }

  onFilterChange() {
    this.currentPage = 1;
  }

  // ==========================================
  // PAGINAZIONE
  // ==========================================

  getTotalPages(): number {
    return Math.ceil(this.reviews.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // ==========================================
  // DISTRIBUZIONE RATING
  // ==========================================

  getRatingDistribution() {
    if (this.reviews.length === 0) return null;

    const distribution = [5, 4, 3, 2, 1].map((stars) => {
      const count = this.reviews.filter((r) => r.rating === stars).length;
      const percentage = (count / this.reviews.length) * 100;
      return { stars, count, percentage };
    });

    return distribution;
  }

  // ==========================================
  // AZIONI RECENSIONI
  // ==========================================

  openReviewForm() {
    this.onWriteReview.emit();
  }

  respondToReview(review: Review) {
    this.onRespondReview.emit(review);
  }

  reportReview(review: Review) {
    if (confirm('¿Estás seguro de que quieres reportar esta reseña?')) {
      this.onReportReview.emit(review);
    }
  }

  // ==========================================
  // UTILITY
  // ==========================================

  getStarsArray(rating: number): StarState[] {
    const stars: StarState[] = [];

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

  formatDate(date: Date): string {
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;

    return d.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
}

// ==========================================
// INTERFACCE
// ==========================================

interface StarState {
  filled: boolean;
  half: boolean;
}
