import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  // Variabili per gestire lo stato del componente
  isMobileMenuOpen = false;
  unreadMessages = 3; // Questo numero verrò dal servizio messaggi

  // Metodo per chiudere/aprire il menu mobile
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // Metodo per chiudere il menu mobile quando l'utente clicca un link
  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }
}
