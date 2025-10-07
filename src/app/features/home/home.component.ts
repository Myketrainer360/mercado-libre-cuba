import { Component, OnInit, NgModule } from '@angular/core';
import {
  Ad,
  AdCategory,
  AdStatus,
  DeliveryOption,
  ItemCondition,
  AdType,
} from '../../models/ad.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  // PROPRIETÀ DEL COMPONENTE
  // Dati degli annunci - in una app reale verranno dal servizio API
  ads: Ad[] = [];
  filteredAds: Ad[] = [];
  paginatedAds: Ad[] = [];

  // Stato della interfaccia utente
  isLoading = true;
  searchTerm = '';

  selectedCategory: string | AdCategory = 'all';
  sortBy = 'newest';

  // Paginazione
  currentPage = 1;
  adsPerPage = 12;
  totalPages = 1;

  // Statistiche della community
  totalAds = 2847;
  activeUsers = 156;
  todayDeals = 23;

  // Lista degli annunci preferiti dell'utente
  favorites: string[] = [];

  // Per accedere al enum nel template
  AdCategory = AdCategory;

  // ==========================================
  // METODI DEL CICLO DI VITA DI ANGULAR
  // ==========================================

  ngOnInit() {
    // Quando il componente si inizializza, carichiamo i dati
    this.loadInitialData();
  }

  // ==========================================
  // METODI PER IL CARICAMENTO DEI DATI
  // ==========================================

  private loadInitialData() {
    // Simuliamo il caricamento dal server
    this.isLoading = true;

    // In una app reale, qui useresti un servizio per chiamare l'API
    setTimeout(() => {
      this.ads = this.generateMockAds();
      this.applyFilters();
      this.isLoading = false;
    }, 1500);
  }

  // Metodo che genera dati di esempio per lo sviluppo
  private generateMockAds(): Ad[] {
    return [
      {
        id: '1',
        userId: 'user1',
        title: 'iPhone 12 Pro en excelente estado',
        description:
          'Vendo mi iPhone 12 Pro de 128GB, usado por 6 meses. Incluye cargador original, caja y protector de pantalla. Sin rayones, funciona perfectamente.',
        category: AdCategory.ELECTRONICS,
        type: 'offer',
        price: 850,
        currency: 'USD',
        isNegotiable: true,
        exchangeFor: 'Samsung Galaxy S21',
        images: ['/assets/images/iphone12.jpg'],
        mainImageIndex: 0, // Indice dell'immagine principale (default: 0)
        location: { province: 'La Habana', city: 'Vedado' },
        deliveryOptions: [
          DeliveryOption.PICKUP_ONLY,
          DeliveryOption.DELIVERY_LOCAL,
        ], // Opzioni di consegna disponibili
        // Metadati e organizzazione
        condition: ItemCondition.FAIR,
        tags: ['Androide', 'Samsung', 'smartphone', 'como nuevo'],

        // Stato e gestione
        status: AdStatus.ACTIVE,
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2024-03-15'),
        expiresAt: new Date('2024-04-15'),
        viewCount: 47,
        contactCount: 12,
        favoriteCount: 5,
        isPromoted: false,
        isUrgent: false,
        allowComments: true,
      },
      {
        id: '2',
        userId: 'user2',
        title: 'MacBook Air 2020 - Excelente estado',
        description:
          'Vendo mi MacBook Air 2020 de 256GB, usado por 1 año. Incluye cargador original y caja. Sin rayones, funciona perfectamente.',
        category: AdCategory.ELECTRONICS,
        type: 'offer',
        price: 850,
        currency: 'USD',
        isNegotiable: true,
        exchangeFor: 'Samsung Galaxy S21',
        images: ['/assets/images/iphone12.jpg'],
        mainImageIndex: 0, // Indice dell'immagine principale (default: 0)
        location: { province: 'La Habana', city: 'Vedado' },
        deliveryOptions: [
          DeliveryOption.PICKUP_ONLY,
          DeliveryOption.DELIVERY_LOCAL,
        ], // Opzioni di consegna disponibili
        // Metadati e organizzazione
        condition: ItemCondition.FAIR,
        tags: ['Pc', 'apple', 'smartphone', 'como nuevo'],

        // Stato e gestione
        status: AdStatus.ACTIVE,
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2024-03-15'),
        expiresAt: new Date('2024-04-15'),
        viewCount: 47,
        contactCount: 12,
        favoriteCount: 5,
        isPromoted: false,
        isUrgent: false,
        allowComments: true,
      },
      {
        id: '3',
        userId: 'user3',
        title: 'Busco Mecánico para mi coche',
        description:
          'Necesito un mecánico de confianza para reparar mi coche. Interesados, por favor contactar.',
        category: AdCategory.SERVICES,
        type: 'request',
        price: 0,
        currency: 'USD',
        isNegotiable: true,
        exchangeFor: 'Un coche en buen estado',
        images: ['/assets/images/iphone12.jpg'],
        mainImageIndex: 0, // Indice dell'immagine principale (default: 0)
        location: { province: 'La Habana', city: 'Vedado' },
        deliveryOptions: [
          DeliveryOption.PICKUP_ONLY,
          DeliveryOption.DELIVERY_LOCAL,
        ], // Opzioni di consegna disponibili
        // Metadati e organizzazione
        condition: ItemCondition.FAIR,
        tags: ['mecánico', 'coche', 'reparación'],

        // Stato e gestione
        status: AdStatus.ACTIVE,
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2024-03-15'),
        expiresAt: new Date('2024-04-15'),
        viewCount: 47,
        contactCount: 12,
        favoriteCount: 5,
        isPromoted: false,
        isUrgent: false,
        allowComments: true,
      },
      {
        id: '4',
        userId: 'user4',
        title: 'Refrigerador LG en venta',
        description:
          'Vendo mi Refrigerador LG de 500L, usado por 2 años. Funciona perfectamente y está en excelente estado.',
        category: AdCategory.ELECTRONICS,
        type: 'offer',
        price: 850,
        currency: 'EUR',
        isNegotiable: true,
        exchangeFor: 'Nevera Samsung',
        images: ['/assets/images/iphone12.jpg'],
        mainImageIndex: 0, // Indice dell'immagine principale (default: 0)
        location: { province: 'Santiago de Cuba', city: 'San Luis' },
        deliveryOptions: [
          DeliveryOption.PICKUP_ONLY,
          DeliveryOption.DELIVERY_LOCAL,
        ], // Opzioni di consegna disponibili
        // Metadati e organizzazione
        condition: ItemCondition.FAIR,
        tags: ['iphone', 'apple', 'smartphone', 'como nuevo'],

        // Stato e gestione
        status: AdStatus.ACTIVE,
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2024-03-15'),
        expiresAt: new Date('2024-04-15'),
        viewCount: 47,
        contactCount: 12,
        favoriteCount: 5,
        isPromoted: false,
        isUrgent: false,
        allowComments: true,
      },
    ];
  }

  // ==========================================
  // METODI PER I FILTRI E LA RICERCA
  // ==========================================

  filterByCategory(category: string | AdCategory) {
    this.selectedCategory = category;
    this.currentPage = 1; // Resettiamo alla prima pagina quando cambiamo filtro
    this.applyFilters();
  }

  quickSearch() {
    if (this.searchTerm.trim()) {
      // Resettiamo i filtri quando facciamo una ricerca testuale
      this.selectedCategory = 'all';
      this.currentPage = 1;
      this.applyFilters();
    }
  }

  private applyFilters() {
    let filtered = [...this.ads];

    // Filtro per categoria
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter((ad) => ad.category === this.selectedCategory);
    }

    // Filtro per ricerca testuale
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (ad) =>
          ad.title.toLowerCase().includes(searchLower) ||
          ad.description.toLowerCase().includes(searchLower) ||
          ad.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
          ad.location.city.toLowerCase().includes(searchLower) ||
          ad.location.province.toLowerCase().includes(searchLower)
      );
    }

    this.filteredAds = filtered;
    this.sortAds();
    this.updatePagination();
  }

  // ==========================================
  // METODI PER L'ORDINAMENTO
  // ==========================================

  sortAds() {
    switch (this.sortBy) {
      case 'newest':
        this.filteredAds.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'oldest':
        this.filteredAds.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case 'price-low':
        this.filteredAds.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        this.filteredAds.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'popular':
        this.filteredAds.sort(
          (a, b) =>
            b.viewCount + b.contactCount - (a.viewCount + a.contactCount)
        );
        break;
    }

    this.updatePagination();
  }

  // ==========================================
  // METODI PER LA PAGINAZIONE
  // ==========================================

  private updatePagination() {
    this.totalPages = Math.ceil(this.filteredAds.length / this.adsPerPage);

    // Assicuriamoci che la pagina corrente sia valida
    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
    }

    // Calcoliamo gli annunci da mostrare per la pagina corrente
    const startIndex = (this.currentPage - 1) * this.adsPerPage;
    const endIndex = startIndex + this.adsPerPage;
    this.paginatedAds = this.filteredAds.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
      this.scrollToTop();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
      this.scrollToTop();
    }
  }

  private scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ==========================================
  // METODI PER L'INTERAZIONE CON GLI ANNUNCI
  // ==========================================

  openAdDetails(ad: Ad) {
    // In una app reale, qui navigheresti alla pagina di dettaglio
    console.log("Aprendo dettagli dell'annuncio:", ad.title);

    // Incrementiamo il contatore delle visualizzazioni
    ad.viewCount++;

    // Navighiamo alla pagina di dettaglio (da implementare)
    // this.router.navigate(['/ad', ad.id]);
  }

  toggleFavorite(ad: Ad, event: Event) {
    // Preveniamo che il click sul cuore apra anche il dettaglio
    event.stopPropagation();

    const favoriteIndex = this.favorites.indexOf(ad.id);

    if (favoriteIndex === -1) {
      // Aggiungiamo ai preferiti
      this.favorites.push(ad.id);
      console.log('Aggiunto ai preferiti:', ad.title);
    } else {
      // Rimuoviamo dai preferiti
      this.favorites.splice(favoriteIndex, 1);
      console.log('Rimosso dai preferiti:', ad.title);
    }

    // In una app reale, qui salveresti i preferiti nel backend
    // this.favoritesService.updateFavorites(this.favorites);
  }

  isFavorite(adId: string): boolean {
    return this.favorites.includes(adId);
  }

  // ==========================================
  // METODI DI UTILITÀ PER LA FORMATTAZIONE
  // ==========================================

  getFilterTitle(): string {
    if (this.searchTerm.trim()) {
      return `Resultados para "${this.searchTerm}"`;
    }

    switch (this.selectedCategory) {
      case 'all':
        return 'Todos los Anuncios';
      case AdCategory.SERVICES:
        return 'Servicios';
      case AdCategory.ELECTRONICS:
        return 'Electrónicos';
      case AdCategory.HOUSEHOLD:
        return 'Artículos del Hogar';
      case AdCategory.TRANSPORT:
        return 'Transporte';
      case AdCategory.FOOD:
        return 'Alimentos';
      case AdCategory.CLOTHING:
        return 'Ropa y Accesorios';
      case AdCategory.HEALTH:
        return 'Salud';
      case AdCategory.EDUCATION:
        return 'Educación';
      case AdCategory.CONSTRUCTION:
        return 'Construcción';
      default:
        return 'Otros';
    }
  }

  formatPrice(price: number): string {
    // Formattiamo il prezzo con separatori per migliore leggibilità
    return price.toLocaleString();
  }

  formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Hoy';
    } else if (diffInDays === 1) {
      return 'Ayer';
    } else if (diffInDays < 7) {
      return `Hace ${diffInDays} días`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `Hace ${weeks} semana${weeks > 1 ? 's' : ''}`;
    } else {
      const months = Math.floor(diffInDays / 30);
      return `Hace ${months} mes${months > 1 ? 'es' : ''}`;
    }
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength).trim() + '...';
  }

  // Metodo per migliorare le performance con grandi liste
  trackByAdId(index: number, ad: Ad): string {
    return ad.id;
  }
}
