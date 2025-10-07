import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-profile-tabs',
  imports: [CommonModule],
  templateUrl: './profile-tabs.component.html',
  styleUrl: './profile-tabs.component.scss',
})
export class ProfileTabsComponent {
  // ==========================================
  // INPUT E OUTPUT PROPERTIES
  // ==========================================

  @Input() activeTab: string = 'ads';
  @Input() isOwnProfile: boolean = false;
  @Input() unreadNotifications: number = 0;

  @Output() onTabChange = new EventEmitter<string>();

  // ==========================================
  // GESTIONE TAB
  // ==========================================

  selectTab(tab: string) {
    if (tab !== this.activeTab) {
      this.activeTab = tab;
      this.onTabChange.emit(tab);

      // Analytics tracking (in una app reale)
      this.trackTabChange(tab);
    }
  }

  private trackTabChange(tab: string) {
    console.log('Tab changed to:', tab);
    // In una app reale, qui invieresti l'evento a Google Analytics o simili
    // this.analytics.track('profile_tab_changed', { tab: tab });
  }

  // ==========================================
  // CALCOLO POSIZIONE INDICATORE
  // ==========================================

  getIndicatorPosition(): number {
    const tabs = this.getVisibleTabs();
    const activeIndex = tabs.indexOf(this.activeTab);

    if (activeIndex === -1) return 0;

    // Calcola la posizione basandosi sul numero di tab prima di quello attivo
    const baseWidth = this.getAverageTabWidth();
    return 20 + activeIndex * baseWidth; // 20px è il padding iniziale
  }

  getIndicatorWidth(): number {
    // Larghezza approssimativa di un tab
    return this.getAverageTabWidth() - 10; // -10px per un po' di margine
  }

  private getAverageTabWidth(): number {
    // In una implementazione reale, potresti usare ViewChild per misurare i tab
    // Per ora usiamo valori approssimativi basati sul design responsive

    if (window.innerWidth < 480) {
      return 90; // Mobile small
    } else if (window.innerWidth < 768) {
      return 110; // Mobile
    } else {
      return 140; // Desktop
    }
  }

  private getVisibleTabs(): string[] {
    const tabs = ['ads', 'reviews'];

    if (this.isOwnProfile) {
      tabs.push('favorites', 'activity', 'settings');
    }

    return tabs;
  }
}
