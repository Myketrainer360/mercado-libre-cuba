import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [DecimalPipe, RouterLink, FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  //Dati statistici della piattaforma
  totalUsers = 15247;
  totalAds = 8934;
  totalTransactions = 3428;

  @Input() newsletterEmail: string = '';

  // Informazioni App
  currentYear: number = new Date().getFullYear();
  appVersion: string = '1.0.0';
  lastUpdateDate: string = '2024-06-15';

  /*  -----------------------------------------------------------------------------------------------
    Metodo per la validazione dell'email
  --------------------------------------------------------------------------------------------------- */
  isValidEmail(email: string): boolean {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  subscribeNewsletter() {
    if (!this.isValidEmail(this.newsletterEmail)) {
      alert(`Por favor, introduzca un correo electrónico válido.`);
    }
    return;

    console.log(
      `Suscripción al boletín con el correo: ${this.newsletterEmail}`
    );
    // Simuliamo l'iscrizione
    alert(`¡Gracias! Te has suscrito con el email: ${this.newsletterEmail}`);
    this.newsletterEmail = '';

    // In una app reale, qui faresti una chiamata API
    // this.newsletterService.subscribe(this.newsletterEmail)
  }

  /*  -----------------------------------------------------------------------------------------------
    METODI PER LA NAVIGAZIONE
  --------------------------------------------------------------------------------------------------- */
  scrollToCategories(event: Event) {
    event.preventDefault();
    console.log('Scrolling to categories...');
    // Implementa lo scroll verso le categories
  }

  openHowItWorks(event: Event) {
    event.preventDefault();
    console.log('Opening How It Works...');
    // Implementa l'apertura della sezione "How It Works"
  }

  openSafetyTips(event: Event) {
    event.preventDefault();
    console.log('Opening safety tips...');
    // Apri consigli di sicurezza
  }

  openFAQ(event: Event) {
    event.preventDefault();
    console.log('Opening FAQ...');
    // Apri FAQ
  }

  openSupport(event: Event) {
    event.preventDefault();
    console.log('Opening support...');
    // Apri supporto clienti
  }

  openForum(event: Event) {
    event.preventDefault();
    console.log('Opening forum...');
    // Apri forum della community
  }

  reportProblem(event: Event) {
    event.preventDefault();
    console.log('Reporting problem...');
    // Apri form per segnalare problemi
  }

  // ==========================================
  // METODI PER LE PAGINE LEGALI
  // ==========================================

  openTerms(event: Event) {
    event.preventDefault();
    console.log('Opening terms...');
    // Apri termini di servizio
  }

  openPrivacy(event: Event) {
    event.preventDefault();
    console.log('Opening privacy policy...');
    // Apri policy privacy
  }

  openAbout(event: Event) {
    event.preventDefault();
    console.log('Opening about...');
    // Apri pagina "Chi siamo"
  }

  openPress(event: Event) {
    event.preventDefault();
    console.log('Opening press...');
    // Apri sezione stampa
  }

  openCareers(event: Event) {
    event.preventDefault();
    console.log('Opening careers...');
    // Apri pagina lavoro
  }

  openContact(event: Event) {
    event.preventDefault();
    console.log('Opening contact...');
    // Apri contatti
  }

  openCookies(event: Event) {
    event.preventDefault();
    console.log('Opening cookies policy...');
    // Apri policy cookies
  }

  // ==========================================
  // METODI PER LE APP MOBILE
  // ==========================================

  downloadAndroid(event: Event) {
    event.preventDefault();
    console.log('Downloading Android app...');

    // In una app reale, qui reindirizzeresti al Play Store
    alert('Redirigiendo a Google Play Store...');
    // window.open('https://play.google.com/store/apps/details?id=com.mercadolibrecuba', '_blank');
  }

  downloadiOS(event: Event) {
    event.preventDefault();
    console.log('Downloading iOS app...');

    // In una app reale, qui reindirizzeresti all'App Store
    alert('Redirigiendo a App Store...');
    // window.open('https://apps.apple.com/app/mercadolibrecuba/id123456789', '_blank');
  }

  // ==========================================
  // ALTRI METODI
  // ==========================================

  changeLanguage(event: Event) {
    event.preventDefault();
    console.log('Changing language...');
    // Implementa cambio lingua
    alert('Próximamente disponible en inglés');
  }
}
