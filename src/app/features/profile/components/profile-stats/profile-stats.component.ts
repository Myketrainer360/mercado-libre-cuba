import { Component, Input } from '@angular/core';
import { UserStats } from '../../../../models/user.interface';
import { CommonModule } from '@angular/common';

/**
 * Componente per visualizzare le statistiche dettagliate dell'utente
 * Include grafici semplici e metriche di performance
 */
@Component({
  selector: 'app-profile-stats',
  imports: [CommonModule],
  templateUrl: './profile-stats.component.html',
  styleUrl: './profile-stats.component.scss',
})
export class ProfileStatsComponent {
  // ==========================================
  // INPUTS
  // ==========================================

  @Input() userStats: UserStats | null = null;
  @Input() isLoading = false;
  @Input() isOwnProfile = false;

  // ==========================================
  // METODI DI CALCOLO
  // ==========================================

  getSuccessRate(): number {
    if (!this.userStats) return 0;
    const { soldItems, totalAds } = this.userStats;
    if (totalAds === 0) return 0;
    return Math.round((soldItems / totalAds) * 100);
  }

  getAverageViewsPerAd(): string {
    if (!this.userStats || this.userStats.totalAds === 0) return '0';
    const avg = Math.round(this.userStats.totalViews / this.userStats.totalAds);
    return this.formatNumber(avg);
  }

  getConversionRate(): number {
    if (!this.userStats || this.userStats.totalViews === 0) return 0;
    return Math.round(
      (this.userStats.totalContacts / this.userStats.totalViews) * 100
    );
  }

  getResponseRateLabel(): string {
    if (!this.userStats) return '';
    const rate = this.userStats.responseRate;

    if (rate >= 95) return 'Excelente';
    if (rate >= 90) return 'Muy bueno';
    if (rate >= 80) return 'Bueno';
    if (rate >= 70) return 'Regular';
    return 'Mejorar';
  }

  showPerformanceIndicators(): boolean {
    if (!this.userStats) return false;

    return (
      this.userStats.responseRate >= 90 ||
      (this.userStats.soldItems >= 10 && this.userStats.soldItems < 50) ||
      this.userStats.totalViews < 100
    );
  }

  // ==========================================
  // UTILITY
  // ==========================================

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
}
