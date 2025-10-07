import {
  Ad,
  AdCategory,
  AdType,
  CubanProvince,
  Currency,
  DeliveryOption,
  ItemCondition,
} from './ad.interface';

/**
 * Parametri per la ricerca avanzata
 */
export interface SearchFilters {
  // Ricerca testuale
  query?: string; // Termine di ricerca

  // Filtri per categoria e tipo
  category?: AdCategory; // Categoria specifica
  type?: AdType; // Offerta o richiesta

  // Filtri geografici
  province?: CubanProvince; // Provincia
  city?: string; // Città
  maxDistance?: number; // Distanza massima in km

  // Filtri economici
  minPrice?: number; // Prezzo minimo
  maxPrice?: number; // Prezzo massimo
  currency?: Currency; // Valuta
  priceType?: PriceType; // Tipo di prezzo

  // Filtri per condizione
  condition?: ItemCondition[]; // Condizioni accettabili

  // Filtri temporali
  dateRange?: DateRange; // Intervallo di date

  // Filtri per caratteristiche
  hasImages?: boolean; // Solo annunci con foto
  isNegotiable?: boolean; // Solo prezzi negoziabili
  deliveryOptions?: DeliveryOption[]; // Opzioni di consegna

  // Ordinamento
  sortBy?: SortBy; // Criterio di ordinamento
  sortOrder?: 'asc' | 'desc'; // Ordine crescente o decrescente

  // Paginazione
  page?: number; // Numero di pagina
  limit?: number; // Elementi per pagina
}

/**
 * Tipi di prezzo per il filtro
 */
export enum PriceType {
  FREE = 'free', // Solo gratuiti
  EXCHANGE = 'exchange', // Solo scambi
  PAID = 'paid', // Solo a pagamento
  ALL = 'all', // Tutti i tipi
}

/**
 * Intervallo di date
 */
export interface DateRange {
  from: Date; // Data di inizio
  to: Date; // Data di fine
}

/**
 * Criteri di ordinamento
 */
export enum SortBy {
  RELEVANCE = 'relevance', // Rilevanza
  DATE = 'date', // Data di pubblicazione
  PRICE = 'price', // Prezzo
  DISTANCE = 'distance', // Distanza
  POPULARITY = 'popularity', // Popolarità (visualizzazioni + contatti)
  RATING = 'rating', // Rating del venditore
}

/**
 * Risultati della ricerca
 */
export interface SearchResults {
  ads: Ad[]; // Array degli annunci trovati
  totalCount: number; // Numero totale di risultati
  currentPage: number; // Pagina corrente
  totalPages: number; // Numero totale di pagine
  hasMore: boolean; // Se ci sono più risultati
  searchFilters: SearchFilters; // Filtri applicati
  searchTime: number; // Tempo di ricerca in millisecondi
}
