import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../models/user.interface';

@Component({
  selector: 'app-profile-header',
  imports: [CommonModule],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss',
})
export class ProfileHeaderComponent {
  // ==========================================
  // INPUTS & OUTPUTS
  // ==========================================

  @Input() user: User | null = null;
  @Input() isOwnProfile = false;
  @Input() isLoading = false;

  @Output() onEditProfile = new EventEmitter<void>();
  @Output() onContactUser = new EventEmitter<void>();
  @Output() onReportUser = new EventEmitter<void>();

  // ==========================================
  // PROPRIETÀ
  // ==========================================

  showDropdown = false;

  // ==========================================
  // METODI RATING
  // ==========================================

  getStarsArray(): StarState[] {
    if (!this.user?.rating) return [];

    const rating = this.user.rating.averageRating;
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

  getRatingAriaLabel(): string {
    if (!this.user?.rating) return '';
    return `${this.user.rating.averageRating} estrellas de 5, basado en ${this.user.rating.totalReviews} reseñas`;
  }

  // ==========================================
  // METODI FORMATTAZIONE
  // ==========================================

  formatJoinDate(date: Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric',
    });
  }

  getLanguagesText(): string {
    if (!this.user?.languages) return '';

    const languageNames: { [key: string]: string } = {
      es: 'Español',
      en: 'Inglés',
      fr: 'Francés',
      pt: 'Portugués',
    };

    return this.user.languages
      .map((lang) => languageNames[lang] || lang)
      .join(', ');
  }

  hasAnyBadges(): boolean {
    return !!(
      this.user?.isVerified ||
      (this.user?.successRate && this.user.successRate >= 90) ||
      (this.user?.totalTransactions && this.user.totalTransactions >= 50)
    );
  }

  // ==========================================
  // GESTIONE DROPDOWN
  // ==========================================

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown() {
    this.showDropdown = false;
  }

  handleShare() {
    if (navigator.share && this.user) {
      navigator
        .share({
          title: `Perfil de ${this.user.displayName}`,
          text: `Mira el perfil de ${this.user.displayName} en Mercado Libre Cuba`,
          url: window.location.href,
        })
        .catch(() => {
          // Fallback: copia URL
          this.copyProfileUrl();
        });
    } else {
      this.copyProfileUrl();
    }
    this.closeDropdown();
  }

  private copyProfileUrl() {
    navigator.clipboard.writeText(window.location.href);
    alert('URL copiado al portapapeles');
  }

  handleBlock() {
    if (
      confirm(
        `¿Estás seguro de que quieres bloquear a ${this.user?.displayName}?`
      )
    ) {
      console.log('Usuario bloqueado');
      // Implementare logica di blocco
    }
    this.closeDropdown();
  }
}

// ==========================================
// INTERFACCE
// ==========================================

interface StarState {
  filled: boolean;
  half: boolean;
}
