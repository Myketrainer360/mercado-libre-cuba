/**
 * Interfaccia per i messaggi tra utenti
 */
export interface Message {
  id: string; // ID univoco del messaggio
  conversationId: string; // ID della conversazione
  senderId: string; // ID del mittente
  receiverId: string; // ID del destinatario

  // Contenuto del messaggio
  content: string; // Testo del messaggio
  messageType: MessageType; // Tipo di messaggio
  attachments?: MessageAttachment[]; // Allegati (foto, documenti)

  // Riferimenti
  adId?: string; // ID dell'annuncio correlato (opzionale)
  replyToId?: string; // ID del messaggio a cui si risponde

  // Metadati temporali
  timestamp: Date; // Quando è stato inviato
  deliveredAt?: Date; // Quando è stato consegnato
  readAt?: Date; // Quando è stato letto

  // Stato del messaggio
  status: MessageStatus; // Stato corrente del messaggio
  isEdited: boolean; // Se è stato modificato
  editedAt?: Date; // Quando è stato modificato
}

/**
 * Tipo di messaggio
 */
export enum MessageType {
  TEXT = 'text', // Messaggio testuale
  IMAGE = 'image', // Immagine
  LOCATION = 'location', // Posizione geografica
  CONTACT = 'contact', // Informazioni di contatto
  AD_REFERENCE = 'ad_reference', // Riferimento a un annuncio
  SYSTEM = 'system', // Messaggio di sistema
}

/**
 * Stato del messaggio
 */
export enum MessageStatus {
  SENDING = 'sending', // In fase di invio
  SENT = 'sent', // Inviato
  DELIVERED = 'delivered', // Consegnato
  READ = 'read', // Letto
  FAILED = 'failed', // Invio fallito
}

/**
 * Allegati ai messaggi
 */
export interface MessageAttachment {
  id: string; // ID univoco dell'allegato
  type: AttachmentType; // Tipo di allegato
  url: string; // URL del file
  filename: string; // Nome del file
  size: number; // Dimensione in byte
  mimeType: string; // Tipo MIME del file
}

/**
 * Tipi di allegati supportati
 */
export enum AttachmentType {
  IMAGE = 'image', // Immagine
  DOCUMENT = 'document', // Documento
  AUDIO = 'audio', // File audio
  VIDEO = 'video', // File video
}

/**
 * Conversazione tra utenti
 */
export interface Conversation {
  id: string; // ID univoco della conversazione
  participants: string[]; // Array di user IDs
  adId?: string; // ID dell'annuncio che ha generato la conversazione

  // Ultimo messaggio per preview rapide
  lastMessage?: Message; // Ultimo messaggio inviato

  // Metadati
  createdAt: Date; // Quando è stata creata
  updatedAt: Date; // Ultimo aggiornamento

  // Stato della conversazione
  isActive: boolean; // Se la conversazione è attiva
  isArchived: { [userId: string]: boolean }; // Se è archiviata per ogni utente
  isMuted: { [userId: string]: boolean }; // Se è silenziata per ogni utente

  // Contatori per ogni utente
  unreadCount: { [userId: string]: number }; // Messaggi non letti per utente

  // Informazioni sulla transazione (se applicabile)
  transactionStatus?: TransactionStatus; // Stato della transazione collegata
}

/**
 * Stato delle transazioni
 */
export enum TransactionStatus {
  INQUIRING = 'inquiring', // Fase di richiesta informazioni
  NEGOTIATING = 'negotiating', // Fase di negoziazione
  AGREED = 'agreed', // Accordo raggiunto
  MEETING_ARRANGED = 'meeting_arranged', // Incontro organizzato
  COMPLETED = 'completed', // Transazione completata
  CANCELLED = 'cancelled', // Transazione cancellata
}
