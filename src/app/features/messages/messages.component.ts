import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

// Importiamo i sotto-componenti
import { ConversationListComponent } from './components/conversation-list/conversation-list.component';
import { ChatViewComponent } from './components/chat-view/chat-view.component';
import { MessageComposerComponent } from './components/message-composer/message-composer.component';

// Importiamo i modelli
import {
  Conversation,
  Message,
  MessageStatus,
} from '../../models/message.interface';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-messages',
  imports: [
    ConversationListComponent,
    ChatViewComponent,
    MessageComposerComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
})
export class MessagesComponent implements OnInit, OnDestroy {
  // ==========================================
  // PROPRIETÀ DEL COMPONENTE
  // ==========================================

  private destroy$ = new Subject<void>();

  // Dati
  conversations: Conversation[] = [];
  currentMessages: Message[] = [];
  selectedConversation: Conversation | null = null;
  relatedAdInfo: any = null;

  // Stati
  isLoadingConversations = true;
  isLoadingMessages = false;
  isSendingMessage = false;
  isOtherUserTyping = false;
  showChatOptions = false;

  // Filtri e ricerca
  searchQuery = '';
  conversationFilter: 'all' | 'unread' | 'archived' = 'all';

  // Utente corrente
  currentUserId = 'current-user-id';

  // Responsive
  isMobileView = false;

  // ==========================================
  // LIFECYCLE HOOKS
  // ==========================================

  ngOnInit() {
    this.checkMobileView();
    window.addEventListener('resize', () => this.checkMobileView());

    this.loadConversations();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkMobileView() {
    this.isMobileView = window.innerWidth <= 768;
  }

  // ==========================================
  // CARICAMENTO DATI
  // ==========================================

  private loadConversations() {
    this.isLoadingConversations = true;

    // Simulazione caricamento
    setTimeout(() => {
      this.conversations = this.generateMockConversations();
      this.isLoadingConversations = false;
    }, 1000);
  }

  private generateMockConversations(): Conversation[] {
    // Mock data per sviluppo
    return [
      {
        id: '1',
        participants: [this.currentUserId, 'user-2'],
        adId: 'ad-1',
        lastMessage: {
          id: 'msg-1',
          conversationId: '1',
          senderId: 'user-2',
          receiverId: this.currentUserId,
          content: '¿Todavía está disponible el iPhone?',
          messageType: 'text',
          timestamp: new Date(Date.now() - 10 * 60 * 1000),
          status: 'delivered',
          isEdited: false,
        } as Message,
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date(Date.now() - 10 * 60 * 1000),
        isActive: true,
        isArchived: { [this.currentUserId]: false },
        isMuted: { [this.currentUserId]: false },
        unreadCount: { [this.currentUserId]: 2, 'user-2': 0 },
      },
    ];
  }

  // ==========================================
  // GESTIONE CONVERSAZIONI
  // ==========================================

  selectConversation(conversation: Conversation) {
    this.selectedConversation = conversation;
    this.showChatOptions = false;
    this.loadMessages(conversation.id);
    this.loadRelatedAdInfo(conversation.adId);
    this.markAsRead(conversation);
  }

  deselectConversation() {
    this.selectedConversation = null;
    this.currentMessages = [];
    this.relatedAdInfo = null;
    this.showChatOptions = false;
  }

  private loadMessages(conversationId: string) {
    this.isLoadingMessages = true;

    // Simulazione caricamento messaggi
    setTimeout(() => {
      this.currentMessages = this.generateMockMessages(conversationId);
      this.isLoadingMessages = false;

      // Scroll to bottom dopo il caricamento
      setTimeout(() => this.scrollToBottom(), 100);
    }, 800);
  }

  private generateMockMessages(conversationId: string): Message[] {
    // Mock messages per sviluppo
    return [
      {
        id: 'msg-1',
        conversationId,
        senderId: 'user-2',
        receiverId: this.currentUserId,
        content:
          'Hola! Me interesa el iPhone que tienes publicado. ¿Está todavía disponible?',
        messageType: 'text',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        status: 'read',
        isEdited: false,
      } as Message,
      {
        id: 'msg-2',
        conversationId,
        senderId: this.currentUserId,
        receiverId: 'user-2',
        content:
          '¡Hola! Sí, todavía está disponible. Está en perfecto estado, usado solo 6 meses.',
        messageType: 'text',
        timestamp: new Date(Date.now() - 55 * 60 * 1000),
        status: 'read',
        isEdited: false,
      } as Message,
      {
        id: 'msg-3',
        conversationId,
        senderId: 'user-2',
        receiverId: this.currentUserId,
        content: 'Perfecto. ¿Dónde te encuentras? ¿Podríamos vernos mañana?',
        messageType: 'text',
        timestamp: new Date(Date.now() - 50 * 60 * 1000),
        status: 'read',
        isEdited: false,
      } as Message,
      {
        id: 'msg-4',
        conversationId,
        senderId: this.currentUserId,
        receiverId: 'user-2',
        content:
          'Estoy en Vedado, La Habana. Mañana por la tarde me viene bien, ¿te parece a las 4pm?',
        messageType: 'text',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        status: 'delivered',
        isEdited: false,
      } as Message,
    ];
  }

  private loadRelatedAdInfo(adId?: string) {
    if (!adId) {
      this.relatedAdInfo = null;
      return;
    }

    // Mock ad info
    this.relatedAdInfo = {
      title: 'iPhone 12 Pro en excelente estado',
      price: 850,
      currency: 'USD',
      image: '/assets/images/iphone12.jpg',
    };
  }

  private markAsRead(conversation: Conversation) {
    // Marca la conversazione come letta
    if (conversation.unreadCount) {
      conversation.unreadCount[this.currentUserId] = 0;
    }
  }

  private scrollToBottom() {
    // Implementato nel ChatViewComponent
  }

  // ==========================================
  // GESTIONE MESSAGGI
  // ==========================================

  sendMessage(message: { text: string; attachments: File[] }) {
    const content = message.text;
    if (!this.selectedConversation || !content.trim()) return;

    this.isSendingMessage = true;

    // Crea nuovo messaggio
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId: this.selectedConversation.id,
      senderId: this.currentUserId,
      receiverId: this.getOtherUserId(this.selectedConversation),
      content: content.trim(),
      messageType: 'text',
      timestamp: new Date(),
      status: 'sending',
      isEdited: false,
    } as Message;

    // Aggiungi alla lista
    this.currentMessages.push(newMessage);

    // Simula invio
    setTimeout(() => {
      newMessage.status = MessageStatus.SENT;
      this.isSendingMessage = false;

      // Aggiorna last message nella conversazione
      if (this.selectedConversation) {
        this.selectedConversation.lastMessage = newMessage;
        this.selectedConversation.updatedAt = new Date();
      }

      // Simula risposta automatica (solo per demo)
      this.simulateOtherUserTyping();

      this.scrollToBottom();
    }, 1000);
  }

  private simulateOtherUserTyping() {
    this.isOtherUserTyping = true;

    setTimeout(() => {
      this.isOtherUserTyping = false;
    }, 3000);
  }

  handleTyping() {
    // Invia evento "typing" al server
    console.log('User is typing...');
  }

  loadMoreMessages() {
    console.log('Loading more messages...');
    // Carica messaggi più vecchi
  }

  // ==========================================
  // AZIONI CONVERSAZIONI
  // ==========================================

  archiveConversation(conversationId: string) {
    const conversation = this.conversations.find(
      (c) => c.id === conversationId
    );
    if (conversation) {
      conversation.isArchived[this.currentUserId] = true;

      if (this.selectedConversation?.id === conversationId) {
        this.deselectConversation();
      }

      console.log('Conversation archived:', conversationId);
    }
    this.showChatOptions = false;
  }

  deleteConversation(conversationId: string) {
    const confirmed = confirm(
      '¿Estás seguro de que quieres eliminar esta conversación?\n\nEsta acción no se puede deshacer.'
    );

    if (confirmed) {
      const index = this.conversations.findIndex(
        (c) => c.id === conversationId
      );
      if (index > -1) {
        this.conversations.splice(index, 1);

        if (this.selectedConversation?.id === conversationId) {
          this.deselectConversation();
        }

        console.log('Conversation deleted:', conversationId);
      }
    }
    this.showChatOptions = false;
  }

  muteConversation(conversation: Conversation) {
    conversation.isMuted[this.currentUserId] =
      !conversation.isMuted[this.currentUserId];
    console.log('Conversation muted:', conversation.id);
    this.showChatOptions = false;
  }

  blockUser(conversation: Conversation) {
    const otherUserName = this.getOtherUserName(conversation);
    const confirmed = confirm(
      `¿Estás seguro de que quieres bloquear a ${otherUserName}?\n\nNo podrás recibir mensajes de este usuario.`
    );

    if (confirmed) {
      console.log('User blocked');
      this.deselectConversation();
    }
    this.showChatOptions = false;
  }

  // ==========================================
  // FILTRI E RICERCA
  // ==========================================

  setConversationFilter(filter: 'all' | 'unread' | 'archived') {
    this.conversationFilter = filter;
  }

  filterConversations() {
    // Il filtro viene applicato in getFilteredConversations()
  }

  getFilteredConversations(): Conversation[] {
    let filtered = [...this.conversations];

    // Applica filtro per tipo
    switch (this.conversationFilter) {
      case 'unread':
        filtered = filtered.filter(
          (c) => (c.unreadCount?.[this.currentUserId] || 0) > 0
        );
        break;
      case 'archived':
        filtered = filtered.filter(
          (c) => c.isArchived?.[this.currentUserId] === true
        );
        break;
      default:
        filtered = filtered.filter((c) => !c.isArchived?.[this.currentUserId]);
    }

    // Applica ricerca testuale
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter((c) => {
        const otherUserName = this.getOtherUserName(c).toLowerCase();
        const lastMessage = c.lastMessage?.content?.toLowerCase() || '';
        return otherUserName.includes(query) || lastMessage.includes(query);
      });
    }

    // Ordina per data più recente
    filtered.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return filtered;
  }

  getTotalConversations(): number {
    return this.conversations.filter((c) => !c.isArchived?.[this.currentUserId])
      .length;
  }

  getUnreadCount(): number {
    return this.conversations.filter(
      (c) =>
        !c.isArchived?.[this.currentUserId] &&
        (c.unreadCount?.[this.currentUserId] || 0) > 0
    ).length;
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  getOtherUserId(conversation: Conversation): string {
    return (
      conversation.participants.find((id) => id !== this.currentUserId) || ''
    );
  }

  getOtherUserName(conversation: Conversation): string {
    // In una app reale, prenderebbe il nome dal servizio utenti
    const otherUserId = this.getOtherUserId(conversation);

    // Mock names per sviluppo
    const mockNames: { [key: string]: string } = {
      'user-2': 'Carlos Pérez',
      'user-3': 'Ana Rodríguez',
      'user-4': 'Luis Martínez',
    };

    return mockNames[otherUserId] || 'Usuario';
  }

  getOtherUserAvatar(conversation: Conversation): string {
    // In una app reale, prenderebbe l'avatar dal servizio utenti
    return '/assets/images/default-avatar.png';
  }

  isUserVerified(conversation: Conversation): boolean {
    // In una app reale, verificherebbe lo stato dell'utente
    return Math.random() > 0.5;
  }

  isUserOnline(conversation: Conversation): boolean {
    // In una app reale, verificherebbe lo status online
    return Math.random() > 0.5;
  }

  getUserStatusText(conversation: Conversation): string {
    if (this.isUserOnline(conversation)) {
      return 'En línea';
    }

    // Mock last seen
    return 'Activo hace 2h';
  }

  getComposerPlaceholder(): string {
    if (this.selectedConversation) {
      return `Escribe un mensaje a ${this.getOtherUserName(
        this.selectedConversation
      )}...`;
    }
    return 'Escribe un mensaje...';
  }

  // ==========================================
  // NAVIGAZIONE
  // ==========================================

  viewUserProfile(conversation: Conversation) {
    const otherUserId = this.getOtherUserId(conversation);
    console.log('Navigating to profile:', otherUserId);
    // this.router.navigate(['/profile', otherUserId]);
    this.showChatOptions = false;
  }

  viewRelatedAd(conversation: Conversation) {
    if (conversation.adId) {
      console.log('Navigating to ad:', conversation.adId);
      // this.router.navigate(['/ad', conversation.adId]);
    }
    this.showChatOptions = false;
  }

  toggleChatOptions() {
    this.showChatOptions = !this.showChatOptions;
  }
}
