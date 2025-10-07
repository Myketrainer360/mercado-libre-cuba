/**
 * Enumerazione delle categorie di annunci
 * Pensata specificatamente per il mercato cubano
 */
export enum AdCategory {
  SERVICES = 'services', // Riparazioni, pulizie, insegnamento, servizi professionali
  ELECTRONICS = 'electronics', // Telefoni, computer, TV, elettrodomestici tecnologici
  HOUSEHOLD = 'household', // Mobili, elettrodomestici, articoli per la casa
  CLOTHING = 'clothing', // Vestiti, scarpe, accessori, gioielli
  TRANSPORT = 'transport', // Auto, moto, biciclette, pezzi di ricambio
  FOOD = 'food', // Prodotti alimentari, ingredienti, pasti preparati
  HEALTH = 'health', // Medicinali, servizi medici, prodotti per la salute
  EDUCATION = 'education', // Lezioni private, libri, corsi, materiale didattico
  CONSTRUCTION = 'construction', // Materiali edili, servizi di costruzione/ristrutturazione
  ENTERTAINMENT = 'entertainment', // Giochi, musica, eventi, attività ricreative
  BEAUTY = 'beauty', // Prodotti di bellezza, servizi estetici, parrucchiere
  PETS = 'pets', // Animali, accessori per animali, servizi veterinari
  TOOLS = 'tools', // Utensili, attrezzature professionali, strumenti di lavoro
  BOOKS = 'books', // Libri, riviste, materiale di lettura
  OTHER = 'other', // Tutto il resto che non rientra nelle altre categorie
}

/**
 * Interfaccia principale per gli annunci
 * Contiene tutte le informazioni necessarie per un annuncio completo
 */
export interface Ad {
  // Identificatori unici
  id: string; // ID univoco dell'annuncio
  userId: string; // ID dell'utente che ha creato l'annuncio

  // Informazioni principali dell'annuncio
  title: string; // Titolo dell'annuncio (max 100 caratteri)
  description: string; // Descrizione dettagliata (max 500 caratteri)
  category: AdCategory; // Categoria dell'annuncio
  type: AdType; // Se è un'offerta o una richiesta

  // Informazioni economiche
  price?: number; // Prezzo (opzionale per annunci gratuiti)
  currency: Currency; // Valuta del prezzo
  isNegotiable: boolean; // Se il prezzo è trattabile
  exchangeFor?: string; // Cosa si accetta in cambio (per baratti)

  // Media e contenuti
  images: string[]; // Array di URL delle immagini
  mainImageIndex: number; // Indice dell'immagine principale (default: 0)

  // Informazioni geografiche
  location: Location; // Dove si trova l'oggetto/servizio
  deliveryOptions: DeliveryOption[]; // Opzioni di consegna disponibili

  // Metadati e organizzazione
  tags: string[]; // Tag per migliorare la ricerca
  condition?: ItemCondition; // Condizione dell'oggetto (se applicabile)

  // Stato e gestione
  status: AdStatus; // Stato attuale dell'annuncio

  // Informazioni temporali
  createdAt: Date; // Quando è stato creato
  updatedAt: Date; // Ultimo aggiornamento
  expiresAt: Date; // Quando scade l'annuncio

  // Statistiche e interazioni
  viewCount: number; // Numero di visualizzazioni
  contactCount: number; // Numero di contatti ricevuti
  favoriteCount: number; // Numero di volte aggiunto ai preferiti

  // Opzioni avanzate
  isPromoted: boolean; // Se l'annuncio è promosso/sponsorizzato
  isUrgent: boolean; // Se è marcato come urgente
  allowComments: boolean; // Se permette commenti pubblici
}

/**
 * Stato dell'annuncio
 */
export enum AdStatus {
  ACTIVE = 'active', // Attivo e visibile
  PAUSED = 'paused', // In pausa, non visibile ma non cancellato
  COMPLETED = 'completed', // Transazione completata
  EXPIRED = 'expired', // Scaduto
  PENDING_REVIEW = 'pending_review', // In attesa di approvazione moderatori
  REJECTED = 'rejected', // Rifiutato dai moderatori
  DELETED = 'deleted', // Cancellato dall'utente
}

// Opzioni di consegna

export enum DeliveryOption {
  PICKUP_ONLY = 'pickup_only', // Solo ritiro di persona
  DELIVERY_LOCAL = 'delivery_local', // Consegna locale
  DELIVERY_NATIONAL = 'delivery_national', // Consegna nazionale
  MEET_HALFWAY = 'meet_halfway', // Incontro a metà strada
  POSTAL_SERVICE = 'postal_service', // Servizio postale
}

/**
 * Tipo di annuncio
 */
export type AdType = 'offer' | 'request';

/**
 * Valute supportate nella piattaforma
 * Riflette la realtà economica cubana
 */
export type Currency = 'CUP' | 'USD' | 'EUR';

/**
 * Condizione dell'oggetto (per annunci di vendita)
 */
export enum ItemCondition {
  NEW = 'new', // Nuovo, mai usato
  LIKE_NEW = 'like_new', // Come nuovo, usato pochissimo
  GOOD = 'good', // Buone condizioni, segni di uso normale
  FAIR = 'fair', // Condizioni accettabili, segni di usura visibili
  POOR = 'poor', // Condizioni scadenti, funziona ma molto usurato
  FOR_PARTS = 'for_parts', // Solo per pezzi di ricambio, non funzionante
}

/**
 * Informazioni sulla località
 */
export interface Location {
  province: CubanProvince; // Provincia cubana
  city: string; // Città o municipio
  neighborhood?: string; // Quartiere (opzionale)
  exactAddress?: string; // Indirizzo esatto (opzionale, privato)
  coordinates?: Coordinates; // Coordinate GPS (opzionali)
}

/**
 * Coordinate geografiche
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Province cubane
 */
export type CubanProvince =
  | 'Pinar del Río'
  | 'Artemisa'
  | 'La Habana'
  | 'Mayabeque'
  | 'Matanzas'
  | 'Cienfuegos'
  | 'Villa Clara'
  | 'Sancti Spíritus'
  | 'Ciego de Ávila'
  | 'Camagüey'
  | 'Las Tunas'
  | 'Holguín'
  | 'Granma'
  | 'Santiago de Cuba'
  | 'Guantánamo'
  | 'Isla de la Juventud';
