/**
 * Notifiche per l'utente
 */
export interface Notification {
  id: string; // ID univoco della notifica
  userId: string; // ID dell'utente destinatario

  // Contenuto della notifica
  type: NotificationType; // Tipo di notifica
  title: string; // Titolo
  message: string; // Messaggio
  icon?: string; // Icona da mostrare

  // Riferimenti
  relatedAdId?: string; // ID dell'annuncio correlato
  relatedUserId?: string; // ID dell'utente correlato
  relatedConversationId?: string; // ID della conversazione correlata

  // Azioni possibili
  actionUrl?: string; // URL di destinazione quando cliccata
  actions?: NotificationAction[]; // Azioni rapide disponibili

  // Stato
  isRead: boolean; // Se è stata letta
  createdAt: Date; // Quando è stata creata
  readAt?: Date; // Quando è stata letta
  expiresAt?: Date; // Quando scade (opzionale)
}

/**
 * Tipi di notifica
 */
export enum NotificationType {
  NEW_MESSAGE = 'new_message', // Nuovo messaggio ricevuto
  AD_EXPIRED = 'ad_expired', // Annuncio scaduto
  AD_ABOUT_TO_EXPIRE = 'ad_about_to_expire', // Annuncio in scadenza
  NEW_INTEREST = 'new_interest', // Qualcuno è interessato al tuo annuncio
  PRICE_DROP = 'price_drop', // Riduzione di prezzo su annuncio seguito
  NEW_AD_MATCH = 'new_ad_match', // Nuovo annuncio corrispondente ai tuoi interessi
  REVIEW_RECEIVED = 'review_received', // Nuova recensione ricevuta
  SYSTEM_ANNOUNCEMENT = 'system_announcement', // Annuncio di sistema
  ACCOUNT_VERIFICATION = 'account_verification', // Verifica account
  SUSPICIOUS_ACTIVITY = 'suspicious_activity', // Attività sospetta rilevata
}

/**
 * Azioni rapide nelle notifiche
 */
export interface NotificationAction {
  label: string; // Etichetta del pulsante
  action: string; // Azione da eseguire
  style?: 'primary' | 'secondary' | 'danger'; // Stile del pulsante
}
