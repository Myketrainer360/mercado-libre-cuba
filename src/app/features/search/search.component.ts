import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  Ad,
  AdCategory,
  AdStatus,
  ItemCondition,
  DeliveryOption,
} from '../../models/ad.interface';
import { PriceType } from '../../models/search.interface';
import { CubanProvince } from '../../models/ad.interface';

@Component({
  selector: 'app-search',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  @ViewChild('searchInput') searchInputRef!: ElementRef;

  // ==========================================
  // PROPRIETÀ DEL COMPONENTE
  // ==========================================

  // Form per i filtri
  filtersForm: FormGroup;

  // Stato della ricerca
  searchQuery = '';
  isSearching = false;
  hasSearched = false;
  showSuggestions = false;
  showFilters = false;

  // Risultati e paginazione
  searchResults: Ad[] = [];
  paginatedResults: Ad[] = [];
  totalResults = 0;
  currentPage = 1;
  totalPages = 1;
  resultsPerPage = 12;
  searchTime = 0;

  // Filtri attivi
  activeFilterTags: { key: string; label: string }[] = [];
  selectedDateRange = '';

  // Ordinamento
  currentSort = 'relevance';

  // Suggerimenti e ricerche popolari
  searchSuggestions: string[] = [];
  popularSearches = [
    'iPhone',
    'Samsung',
    'Ropa',
    'Bicicleta',
    'Mecánico',
    'Clases inglés',
    'Refrigerador',
    'Auto',
    'Apartamento',
  ];

  // Loading state
  loadingStep = 'Iniciando búsqueda...';

  // Preferiti dell'utente
  favorites: string[] = [];

  categories = [
    { value: AdCategory.SERVICES, label: 'Servicios', icon: '🔧' },
    { value: AdCategory.ELECTRONICS, label: 'Electrónicos', icon: '📱' },
    { value: AdCategory.HOUSEHOLD, label: 'Hogar', icon: '🏠' },
    { value: AdCategory.CLOTHING, label: 'Ropa', icon: '👕' },
    { value: AdCategory.TRANSPORT, label: 'Transporte', icon: '🚗' },
    { value: AdCategory.FOOD, label: 'Alimentos', icon: '🍽️' },
    { value: AdCategory.HEALTH, label: 'Salud', icon: '🏥' },
    { value: AdCategory.EDUCATION, label: 'Educación', icon: '📚' },
    { value: AdCategory.CONSTRUCTION, label: 'Construcción', icon: '🔨' },
    { value: AdCategory.BEAUTY, label: 'Belleza', icon: '💄' },
    { value: AdCategory.PETS, label: 'Mascotas', icon: '🐕' },
    { value: AdCategory.TOOLS, label: 'Herramientas', icon: '🛠️' },
    { value: AdCategory.BOOKS, label: 'Libros', icon: '📖' },
    { value: AdCategory.OTHER, label: 'Otros', icon: '📦' },
  ];

  provinces: CubanProvince[] = [
    'Pinar del Río',
    'Artemisa',
    'La Habana',
    'Mayabeque',
    'Matanzas',
    'Cienfuegos',
    'Villa Clara',
    'Sancti Spíritus',
    'Ciego de Ávila',
    'Camagüey',
    'Las Tunas',
    'Holguín',
    'Granma',
    'Santiago de Cuba',
    'Guantánamo',
    'Isla de la Juventud',
  ];

  priceTypes = [
    { value: 'all', label: 'Todos', icon: '💰' },
    { value: 'free', label: 'Gratis', icon: '🆓' },
    { value: 'exchange', label: 'Intercambio', icon: '🔄' },
    { value: 'paid', label: 'Con Precio', icon: '💵' },
  ];

  sortOptions = [
    { value: 'relevance', label: 'Más Relevantes' },
    { value: 'date', label: 'Más Recientes' },
    { value: 'price', label: 'Menor Precio' },
    { value: 'distance', label: 'Más Cerca' },
    { value: 'popularity', label: 'Más Populares' },
  ];

  dateOptions = [
    { value: '', label: 'Cualquier fecha' },
    { value: '1', label: 'Última hora' },
    { value: '24', label: 'Último día' },
    { value: '168', label: 'Última semana' },
    { value: '720', label: 'Último mes' },
    { value: '2160', label: 'Últimos 3 meses' },
  ];

  popularCategories = [
    { value: AdCategory.ELECTRONICS, label: 'Electrónicos', icon: '📱' },
    { value: AdCategory.SERVICES, label: 'Servicios', icon: '🔧' },
    { value: AdCategory.HOUSEHOLD, label: 'Hogar', icon: '🏠' },
    { value: AdCategory.TRANSPORT, label: 'Transporte', icon: '🚗' },
    { value: AdCategory.CLOTHING, label: 'Ropa', icon: '👕' },
    { value: AdCategory.EDUCATION, label: 'Educación', icon: '📚' },
  ];

  // Riferimenti agli enum per il template
  AdCategory = AdCategory;

  constructor(private formBuilder: FormBuilder) {
    this.filtersForm = this.formBuilder.group({
      type: [''],
      category: [''],
      province: [''],
      city: [''],
      maxDistance: [50],
      priceType: ['all'],
      currency: [''],
      minPrice: [null],
      maxPrice: [null],
      hasImages: [false],
      isNegotiable: [false],
      isUrgent: [false],
      verifiedUsers: [false],
    });
  }

  // ==========================================
  // METODI DEL CICLO DI VITA
  // ==========================================

  ngOnInit() {
    // Inizializzazione del componente
    this.loadInitialData();

    // Ascoltiamo i cambi del form per aggiornare i filtri attivi
    this.filtersForm.valueChanges.subscribe(() => {
      this.updateActiveFilterTags();
    });
  }

  private loadInitialData() {
    // In una app reale, qui caricheresti le preferenze salvate dell'utente
    // e i suggerimenti di ricerca personalizzati
    this.generateSearchSuggestions('');
  }

  // ==========================================
  // GESTIONE RICERCA PRINCIPALE
  // ==========================================

  performSearch() {
    if (!this.searchQuery.trim() && this.getActiveFiltersCount() === 0) {
      return;
    }

    this.isSearching = true;
    this.showSuggestions = false;
    this.hasSearched = true;

    // Simulazione dell'evoluzione del loading
    this.simulateSearchProgress();

    // Simulazione della ricerca
    setTimeout(() => {
      this.executeSearch();
    }, 2000);
  }

  private simulateSearchProgress() {
    const steps = [
      'Analizando términos de búsqueda...',
      'Buscando en base de datos...',
      'Aplicando filtros...',
      'Ordenando resultados...',
      'Finalizando búsqueda...',
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        this.loadingStep = steps[currentStep];
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 400);
  }

  private executeSearch() {
    const startTime = Date.now();

    // In una app reale, qui faresti una chiamata HTTP al backend
    const mockResults = this.generateMockSearchResults();

    this.searchResults = mockResults;
    this.totalResults = mockResults.length;
    this.searchTime = Date.now() - startTime;
    this.currentPage = 1;
    this.updatePagination();

    this.isSearching = false;
    this.scrollToResults();
  }

  private generateMockSearchResults(): Ad[] {
    // Generiamo risultati mock basati sulla query e filtri
    const mockResults: Ad[] = [
      {
        id: '1',
        userId: 'user1',
        title: 'iPhone 12 Pro Max 128GB',
        description:
          'iPhone en excelente estado, usado solo 6 meses. Incluye caja original, cargador y funda protectora.',
        category: AdCategory.ELECTRONICS,
        type: 'offer',
        price: 950,
        currency: 'USD',
        isNegotiable: true,
        exchangeFor: undefined,
        images: ['/assets/images/iphone12.jpg'],
        mainImageIndex: 0,
        location: {
          province: 'La Habana',
          city: 'Vedado',
          neighborhood: 'Plaza',
          exactAddress: undefined,
          coordinates: undefined,
        },
        deliveryOptions: [],
        tags: ['iphone', 'apple', 'smartphone', 'como nuevo'],
        condition: ItemCondition.LIKE_NEW,
        status: AdStatus.ACTIVE,
        createdAt: new Date('2024-03-10'),
        updatedAt: new Date('2024-03-10'),
        expiresAt: new Date('2024-04-10'),
        viewCount: 89,
        contactCount: 15,
        favoriteCount: 23,
        isPromoted: false,
        isUrgent: false,
        allowComments: true,
      },
      {
        id: '2',
        userId: 'user2',
        title: 'Clases de inglés online y presencial',
        description:
          'Profesora certificada con 10 años de experiencia ofrece clases de inglés para todos los niveles.',
        category: AdCategory.EDUCATION,
        type: 'offer',
        price: 15,
        currency: 'USD',
        isNegotiable: true,
        exchangeFor: undefined,
        images: ['/assets/images/english-classes.jpg'],
        mainImageIndex: 0,
        location: {
          province: 'Villa Clara',
          city: 'Santa Clara',
          neighborhood: undefined,
          exactAddress: undefined,
          coordinates: undefined,
        },
        deliveryOptions: [],
        tags: ['inglés', 'clases', 'online', 'certificada'],
        condition: undefined,
        status: AdStatus.ACTIVE,
        createdAt: new Date('2024-03-08'),
        updatedAt: new Date('2024-03-08'),
        expiresAt: new Date('2024-05-08'),
        viewCount: 156,
        contactCount: 34,
        favoriteCount: 67,
        isPromoted: true,
        isUrgent: false,
        allowComments: true,
      },
      {
        id: '3',
        userId: 'user3',
        title: 'Busco bicicleta de montaña',
        description:
          'Necesito una bicicleta de montaña en buen estado para ir al trabajo. Presupuesto máximo 200 USD.',
        category: AdCategory.TRANSPORT,
        type: 'request',
        price: 200,
        currency: 'USD',
        isNegotiable: true,
        exchangeFor: undefined,
        images: [],
        mainImageIndex: 0,
        location: {
          province: 'Santiago de Cuba',
          city: 'Santiago',
          neighborhood: undefined,
          exactAddress: undefined,
          coordinates: undefined,
        },
        deliveryOptions: [],
        tags: ['bicicleta', 'montaña', 'transporte', 'trabajo'],
        condition: undefined,
        status: AdStatus.ACTIVE,
        createdAt: new Date('2024-03-12'),
        updatedAt: new Date('2024-03-12'),
        expiresAt: new Date('2024-04-12'),
        viewCount: 45,
        contactCount: 8,
        favoriteCount: 12,
        isPromoted: false,
        isUrgent: true,
        allowComments: true,
      },
    ];

    // Filtraggio basato sui filtri attivi
    return this.applyFiltersToResults(mockResults);
  }

  private applyFiltersToResults(results: Ad[]): Ad[] {
    const filters = this.filtersForm.value;
    let filtered = [...results];

    // Filtro per query testuale
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (ad) =>
          ad.title.toLowerCase().includes(query) ||
          ad.description.toLowerCase().includes(query) ||
          ad.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Filtro per tipo
    if (filters.type) {
      filtered = filtered.filter((ad) => ad.type === filters.type);
    }

    // Filtro per categoria
    if (filters.category) {
      filtered = filtered.filter((ad) => ad.category === filters.category);
    }

    // Filtro per provincia
    if (filters.province) {
      filtered = filtered.filter(
        (ad) => ad.location.province === filters.province
      );
    }

    // Filtro per città
    if (filters.city) {
      filtered = filtered.filter((ad) =>
        ad.location.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    // Filtro per tipo di prezzo
    if (filters.priceType !== 'all') {
      switch (filters.priceType) {
        case 'free':
          filtered = filtered.filter((ad) => !ad.price || ad.price === 0);
          break;
        case 'exchange':
          filtered = filtered.filter((ad) => ad.exchangeFor);
          break;
        case 'paid':
          filtered = filtered.filter((ad) => ad.price && ad.price > 0);
          break;
      }
    }

    // Filtro per prezzo minimo
    if (filters.minPrice) {
      filtered = filtered.filter(
        (ad) => !ad.price || ad.price >= filters.minPrice
      );
    }

    // Filtro per prezzo massimo
    if (filters.maxPrice) {
      filtered = filtered.filter(
        (ad) => !ad.price || ad.price <= filters.maxPrice
      );
    }

    // Filtro per immagini
    if (filters.hasImages) {
      filtered = filtered.filter((ad) => ad.images.length > 0);
    }

    // Filtro per negoziabile
    if (filters.isNegotiable) {
      filtered = filtered.filter((ad) => ad.isNegotiable);
    }

    // Filtro per urgente
    if (filters.isUrgent) {
      filtered = filtered.filter((ad) => ad.isUrgent);
    }

    return filtered;
  }

  // ==========================================
  // GESTIONE SUGGERIMENTI
  // ==========================================

  onSearchInputChange() {
    this.generateSearchSuggestions(this.searchQuery);
    this.showSuggestions = this.searchQuery.length > 2;
  }

  private generateSearchSuggestions(query: string) {
    if (!query || query.length < 2) {
      this.searchSuggestions = [];
      return;
    }

    const allSuggestions = [
      'iPhone',
      'Samsung Galaxy',
      'Laptop',
      'Refrigerador',
      'Lavadora',
      'Clases de inglés',
      'Clases de computación',
      'Mecánico',
      'Plomero',
      'Bicicleta',
      'Auto Lada',
      'Moto',
      'Apartamento',
      'Casa',
      'Ropa de mujer',
      'Zapatos',
      'Bolsos',
      'Vestidos',
      'Libros universitarios',
      'Novelas',
      'Diccionarios',
    ];

    this.searchSuggestions = allSuggestions
      .filter((suggestion) =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5);
  }

  selectSuggestion(suggestion: string) {
    this.searchQuery = suggestion;
    this.showSuggestions = false;
    this.performSearch();
  }

  getSuggestionType(suggestion: string): string {
    if (suggestion.includes('Clases')) return 'Servicio';
    if (
      suggestion.includes('iPhone') ||
      suggestion.includes('Samsung') ||
      suggestion.includes('Laptop')
    )
      return 'Electrónico';
    if (
      suggestion.includes('Auto') ||
      suggestion.includes('Bicicleta') ||
      suggestion.includes('Moto')
    )
      return 'Transporte';
    if (suggestion.includes('Apartamento') || suggestion.includes('Casa'))
      return 'Inmueble';
    return 'Producto';
  }

  quickSearch(term: string) {
    this.searchQuery = term;
    this.performSearch();
  }

  // ==========================================
  // GESTIONE FILTRI
  // ==========================================

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  applyFilters() {
    this.performSearch();
    this.showFilters = false;
  }

  resetFilters() {
    this.filtersForm.reset({
      type: '',
      category: '',
      province: '',
      city: '',
      maxDistance: 50,
      priceType: 'all',
      currency: '',
      minPrice: null,
      maxPrice: null,
      hasImages: false,
      isNegotiable: false,
      isUrgent: false,
      verifiedUsers: false,
    });
    this.selectedDateRange = '';
    this.updateActiveFilterTags();
  }

  clearAllFilters() {
    this.resetFilters();
    this.searchQuery = '';
    this.performSearch();
  }

  onProvinceChange() {
    this.filtersForm.patchValue({ city: '' });
  }

  getActiveFiltersCount(): number {
    const filters = this.filtersForm.value;
    let count = 0;

    if (filters.type) count++;
    if (filters.category) count++;
    if (filters.province) count++;
    if (filters.city) count++;
    if (filters.priceType !== 'all') count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.hasImages) count++;
    if (filters.isNegotiable) count++;
    if (filters.isUrgent) count++;
    if (filters.verifiedUsers) count++;
    if (this.selectedDateRange) count++;

    return count;
  }

  private updateActiveFilterTags() {
    const filters = this.filtersForm.value;
    this.activeFilterTags = [];

    if (filters.type) {
      this.activeFilterTags.push({
        key: 'type',
        label: filters.type === 'offer' ? 'Solo Ofertas' : 'Solo Búsquedas',
      });
    }

    if (filters.category) {
      const category = this.categories.find(
        (c) => c.value === filters.category
      );
      if (category) {
        this.activeFilterTags.push({
          key: 'category',
          label: category.label,
        });
      }
    }

    if (filters.province) {
      this.activeFilterTags.push({
        key: 'province',
        label: filters.province,
      });
    }

    if (filters.city) {
      this.activeFilterTags.push({
        key: 'city',
        label: filters.city,
      });
    }

    if (filters.priceType !== 'all') {
      const priceType = this.priceTypes.find(
        (p) => p.value === filters.priceType
      );
      if (priceType) {
        this.activeFilterTags.push({
          key: 'priceType',
          label: priceType.label,
        });
      }
    }

    if (filters.minPrice) {
      this.activeFilterTags.push({
        key: 'minPrice',
        label: `Mín: ${filters.minPrice} ${filters.currency || 'CUP'}`,
      });
    }

    if (filters.maxPrice) {
      this.activeFilterTags.push({
        key: 'maxPrice',
        label: `Máx: ${filters.maxPrice} ${filters.currency || 'CUP'}`,
      });
    }

    if (filters.hasImages) {
      this.activeFilterTags.push({
        key: 'hasImages',
        label: 'Con Fotos',
      });
    }

    if (filters.isNegotiable) {
      this.activeFilterTags.push({
        key: 'isNegotiable',
        label: 'Precio Negociable',
      });
    }

    if (filters.isUrgent) {
      this.activeFilterTags.push({
        key: 'isUrgent',
        label: 'Urgente',
      });
    }

    if (filters.verifiedUsers) {
      this.activeFilterTags.push({
        key: 'verifiedUsers',
        label: 'Usuarios Verificados',
      });
    }

    if (this.selectedDateRange) {
      const dateOption = this.dateOptions.find(
        (d) => d.value === this.selectedDateRange
      );
      if (dateOption) {
        this.activeFilterTags.push({
          key: 'dateRange',
          label: dateOption.label,
        });
      }
    }
  }

  removeFilter(filterKey: string) {
    switch (filterKey) {
      case 'type':
        this.filtersForm.patchValue({ type: '' });
        break;
      case 'category':
        this.filtersForm.patchValue({ category: '' });
        break;
      case 'province':
        this.filtersForm.patchValue({ province: '', city: '' });
        break;
      case 'city':
        this.filtersForm.patchValue({ city: '' });
        break;
      case 'priceType':
        this.filtersForm.patchValue({ priceType: 'all' });
        break;
      case 'minPrice':
        this.filtersForm.patchValue({ minPrice: null });
        break;
      case 'maxPrice':
        this.filtersForm.patchValue({ maxPrice: null });
        break;
      case 'hasImages':
        this.filtersForm.patchValue({ hasImages: false });
        break;
      case 'isNegotiable':
        this.filtersForm.patchValue({ isNegotiable: false });
        break;
      case 'isUrgent':
        this.filtersForm.patchValue({ isUrgent: false });
        break;
      case 'verifiedUsers':
        this.filtersForm.patchValue({ verifiedUsers: false });
        break;
      case 'dateRange':
        this.selectedDateRange = '';
        break;
    }

    this.performSearch();
  }

  // ==========================================
  // GESTIONE RISULTATI E PAGINAZIONE
  // ==========================================

  private updatePagination() {
    this.totalPages = Math.ceil(this.totalResults / this.resultsPerPage);

    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
    }

    const startIndex = (this.currentPage - 1) * this.resultsPerPage;
    const endIndex = startIndex + this.resultsPerPage;
    this.paginatedResults = this.searchResults.slice(startIndex, endIndex);
  }

  private scrollToResults() {
    // In a real app, you might want to scroll to a specific element.
    // For this example, we'll scroll to the top of the page.
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
      this.scrollToResults();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
      this.scrollToResults();
    }
  }

  goToPage(page: number | string) {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
      this.scrollToResults();
    }
  }

  getVisiblePages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (this.currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, this.currentPage - 1);
      const end = Math.min(this.totalPages - 1, this.currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (this.currentPage < this.totalPages - 2) {
        pages.push('...');
      }

      pages.push(this.totalPages);
    }

    return pages;
  }

  getDisplayedResultsRange(): string {
    const start = (this.currentPage - 1) * this.resultsPerPage + 1;
    const end = Math.min(
      this.currentPage * this.resultsPerPage,
      this.totalResults
    );
    return `${start}-${end}`;
  }

  // ==========================================
  // GESTIONE ORDINAMENTO
  // ==========================================

  onSortChange() {
    this.sortResults();
    this.updatePagination();
  }

  private sortResults() {
    switch (this.currentSort) {
      case 'relevance':
        // Ordinamento per rilevanza (combinazione di vari fattori)
        this.searchResults.sort((a, b) => {
          const scoreA = this.calculateRelevanceScore(a);
          const scoreB = this.calculateRelevanceScore(b);
          return scoreB - scoreA;
        });
        break;
      case 'date':
        this.searchResults.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'price':
        this.searchResults.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'distance':
        // Ordinamento per distanza (mock - in una app reale useresti le coordinate GPS)
        this.searchResults.sort((a, b) => Math.random() - 0.5);
        break;
      case 'popularity':
        this.searchResults.sort(
          (a, b) =>
            b.viewCount +
            b.contactCount +
            b.favoriteCount -
            (a.viewCount + a.contactCount + a.favoriteCount)
        );
        break;
    }
  }

  private calculateRelevanceScore(ad: Ad): number {
    let score = 0;

    // Bonus per corrispondenza esatta nel titolo
    if (
      this.searchQuery &&
      ad.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    ) {
      score += 10;
    }

    // Bonus per corrispondenza nei tag
    const queryWords = this.searchQuery.toLowerCase().split(' ');
    queryWords.forEach((word) => {
      if (ad.tags.some((tag) => tag.toLowerCase().includes(word))) {
        score += 5;
      }
    });

    // Bonus per annunci promossi
    if (ad.isPromoted) score += 3;

    // Bonus per annunci con foto
    if (ad.images.length > 0) score += 2;

    // Bonus basato sulla popolarità
    score += Math.log(ad.viewCount + 1) * 0.1;
    score += Math.log(ad.contactCount + 1) * 0.2;
    score += Math.log(ad.favoriteCount + 1) * 0.15;

    // Penalità per annunci vecchi
    const daysSinceCreation =
      (Date.now() - ad.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    score -= daysSinceCreation * 0.01;

    return score;
  }

  // ==========================================
  // AZIONI SUI RISULTATI
  // ==========================================

  openAdDetails(ad: Ad) {
    // Incrementa il contatore delle visualizzazioni
    ad.viewCount++;

    // In una app reale, qui navigheresti alla pagina di dettaglio
    console.log('Aprendo dettagli per:', ad.title);

    // Esempio di navigazione:
    // this.router.navigate(['/ad', ad.id]);
  }

  toggleFavorite(ad: Ad, event: Event) {
    event.stopPropagation();

    const favoriteIndex = this.favorites.indexOf(ad.id);

    if (favoriteIndex === -1) {
      this.favorites.push(ad.id);
      ad.favoriteCount++;
    } else {
      this.favorites.splice(favoriteIndex, 1);
      ad.favoriteCount = Math.max(0, ad.favoriteCount - 1);
    }

    // In una app reale, qui salveresti i preferiti nel backend
    console.log('Toggle favorito per:', ad.title);
  }

  isFavorite(adId: string): boolean {
    return this.favorites.includes(adId);
  }

  isUserVerified(userId: string): boolean {
    // Mock - in una app reale verificheresti lo stato dell'utente
    return Math.random() > 0.5;
  }

  // ==========================================
  // RICERCHE RAPIDE E AZIONI
  // ==========================================

  quickCategorySearch(category: {
    value: AdCategory;
    label: string;
    icon: string;
  }) {
    this.filtersForm.patchValue({ category: category.value });
    this.searchQuery = '';
    this.performSearch();
  }

  clearSearch() {
    this.searchQuery = '';
    this.resetFilters();
    this.searchResults = [];
    this.totalResults = 0;
    this.hasSearched = false;
    this.currentPage = 1;
  }

  // ==========================================
  // METODI DI UTILITÀ
  // ==========================================

  getResultsTitle(): string {
    if (this.searchQuery.trim()) {
      return `Resultados para "${this.searchQuery}"`;
    }

    const activeCategory = this.filtersForm.get('category')?.value;
    if (activeCategory) {
      const category = this.categories.find((c) => c.value === activeCategory);
      return category ? `${category.label}` : 'Resultados de búsqueda';
    }

    return 'Resultados de búsqueda';
  }

  formatPrice(price: number): string {
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
    if (!text || text.length <= maxLength) {
      return text || '';
    }
    return text.substring(0, maxLength) + '...';
  }
}
