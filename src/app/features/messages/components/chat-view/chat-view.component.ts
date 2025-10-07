// ==========================================
// FILE: src/app/features/messages/components/chat-view/chat-view.component.ts
// ==========================================
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../../../models/message.interface';

/**
 * Componente per visualizzare la chat con i messaggi
 * Supporta scroll automatico, caricamento messaggi vecchi, typing indicator
 */
@Component({
  selector: 'app-chat-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.css'],
})
export class ChatViewComponent implements AfterViewInit, OnChanges {
  // ==========================================
  // INPUT / OUTPUT
  // ==========================================

  @Input() messages: Message[] = [];
  @Input() currentUserId!: string;
  @Input() isLoading: boolean = false;
  @Input() isTyping: boolean = false;
  @Input() otherUserName: string = 'Usuario';
  @Input() canLoadMore: boolean = true;

  @Output() onLoadMore = new EventEmitter<void>();

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  // ==========================================
  // PROPRIETÀ
  // ==========================================

  private shouldScrollToBottom = true;
  private lastScrollHeight = 0;
  isLoadingMore = false;

  // ==========================================
  // LIFECYCLE HOOKS
  // ==========================================

  ngAfterViewInit() {
    // Scroll iniziale al fondo
    this.scrollToBottom(true);
  }

  ngOnChanges(changes: SimpleChanges) {
    // Quando arrivano nuovi messaggi
    if (changes['messages'] && !changes['messages'].firstChange) {
      const previousMessages = changes['messages'].previousValue as Message[];
      const currentMessages = changes['messages'].currentValue as Message[];

      // Se sono stati aggiunti messaggi in fondo (nuovo messaggio)
      if (currentMessages.length > previousMessages.length) {
        const lastOldMessage = previousMessages[previousMessages.length - 1];
        const lastNewMessage = currentMessages[currentMessages.length - 1];

        // Se è un messaggio nuovo (non caricamento vecchi messaggi)
        if (
          !lastOldMessage ||
          lastNewMessage.timestamp > lastOldMessage.timestamp
        ) {
          this.scrollToBottom();
        }
      }

      // Se sono stati caricati messaggi vecchi, mantieni la posizione
      if (
        currentMessages.length > previousMessages.length &&
        currentMessages[0].id !== previousMessages[0].id
      ) {
        this.maintainScrollPosition();
      }
    }

    // Quando cambia lo stato typing
    if (changes['isTyping'] && changes['isTyping'].currentValue) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  // ==========================================
  // GESTIONE SCROLL
  // ==========================================

  onScroll(event: Event) {
    const container = event.target as HTMLDivElement;

    // Rileva se l'utente è vicino al top per caricare messaggi vecchi
    if (container.scrollTop < 100 && this.canLoadMore && !this.isLoadingMore) {
      this.lastScrollHeight = container.scrollHeight;
      this.loadMoreMessages();
    }

    // Rileva se l'utente è in fondo
    const isAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      50;
    this.shouldScrollToBottom = isAtBottom;
  }

  loadMoreMessages() {
    if (this.isLoadingMore || !this.canLoadMore) return;

    this.isLoadingMore = true;
    this.onLoadMore.emit();

    // Reset dopo un secondo (il componente padre gestirà il caricamento)
    setTimeout(() => {
      this.isLoadingMore = false;
    }, 1000);
  }

  /**
   * Scrolla al fondo della chat
   */
  scrollToBottom(force = false) {
    if (!force && !this.shouldScrollToBottom) return;

    setTimeout(() => {
      const el = this.scrollContainer?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight; // ✅ CORRETTO: scrolla in BASSO
      }
    }, 50);
  }

  /**
   * Mantiene la posizione di scroll quando si caricano messaggi vecchi
   */
  private maintainScrollPosition() {
    setTimeout(() => {
      const el = this.scrollContainer?.nativeElement;
      if (el) {
        const newScrollHeight = el.scrollHeight;
        const scrollDiff = newScrollHeight - this.lastScrollHeight;
        el.scrollTop = scrollDiff;
      }
    }, 0);
  }

  // ==========================================
  // RAGGRUPPAMENTO MESSAGGI PER DATA
  // ==========================================

  /**
   * Verifica se mostrare il separatore data
   */
  shouldShowDateSeparator(index: number): boolean {
    if (index === 0) return true;

    const currentMsg = this.messages[index];
    const previousMsg = this.messages[index - 1];

    const currentDate = new Date(currentMsg.timestamp).toDateString();
    const previousDate = new Date(previousMsg.timestamp).toDateString();

    return currentDate !== previousDate;
  }

  /**
   * Formatta la data per il separatore
   */
  formatDateSeparator(date: Date): string {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const msgDate = new Date(date);

    if (msgDate.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (msgDate.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return msgDate.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year:
          msgDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    }
  }

  // ==========================================
  // RAGGRUPPAMENTO MESSAGGI CONSECUTIVI
  // ==========================================

  /**
   * Verifica se il messaggio è il primo di un gruppo consecutivo
   */
  isFirstInGroup(index: number): boolean {
    if (index === 0) return true;

    const currentMsg = this.messages[index];
    const previousMsg = this.messages[index - 1];

    // Nuovo gruppo se il sender cambia
    if (currentMsg.senderId !== previousMsg.senderId) return true;

    // Nuovo gruppo se passano più di 5 minuti
    const timeDiff =
      new Date(currentMsg.timestamp).getTime() -
      new Date(previousMsg.timestamp).getTime();
    if (timeDiff > 5 * 60 * 1000) return true; // 5 minuti

    return false;
  }

  /**
   * Verifica se il messaggio è l'ultimo di un gruppo consecutivo
   */
  isLastInGroup(index: number): boolean {
    if (index === this.messages.length - 1) return true;

    const currentMsg = this.messages[index];
    const nextMsg = this.messages[index + 1];

    // Ultimo del gruppo se il sender cambia
    if (currentMsg.senderId !== nextMsg.senderId) return true;

    // Ultimo del gruppo se passano più di 5 minuti
    const timeDiff =
      new Date(nextMsg.timestamp).getTime() -
      new Date(currentMsg.timestamp).getTime();
    if (timeDiff > 5 * 60 * 1000) return true; // 5 minuti

    return false;
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  /**
   * Determina la classe CSS del messaggio
   */
  getMessageClass(msg: Message): string {
    return msg.senderId === this.currentUserId
      ? 'message-right'
      : 'message-left';
  }

  /**
   * Verifica se il messaggio è mio
   */
  isMyMessage(msg: Message): boolean {
    return msg.senderId === this.currentUserId;
  }

  /**
   * Formatta l'ora del messaggio
   */
  formatTime(date: Date): string {
    const d = new Date(date);
    return d.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Ottiene l'icona di stato del messaggio
   */
  getMessageStatusIcon(status?: string): string {
    switch (status) {
      case 'sending':
        return '🕐';
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return '✓✓';
      default:
        return '';
    }
  }

  /**
   * Ottiene la classe CSS per lo stato del messaggio
   */
  getMessageStatusClass(status?: string): string {
    return status || '';
  }

  /**
   * TrackBy function per performance
   */
  trackByMessageId(index: number, msg: Message): string {
    return msg.id;
  }

  /**
   * Formatta la data/ora completa per tooltip
   */
  formatFullDateTime(date: Date): string {
    const d = new Date(date);
    return d.toLocaleString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
