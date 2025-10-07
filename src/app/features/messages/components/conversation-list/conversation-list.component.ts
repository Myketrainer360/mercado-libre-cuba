import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Conversation } from '../../../../models/message.interface';

@Component({
  selector: 'app-conversation-list',
  imports: [CommonModule],
  templateUrl: './conversation-list.component.html',
  styleUrl: './conversation-list.component.css',
})
export class ConversationListComponent {
  // ==========================================
  // INPUT E OUTPUT
  // ==========================================

  @Input() conversations: Conversation[] = [];
  @Input() selectedConversationId: string | undefined;
  @Input() currentUserId: string = '';
  @Input() isLoading: boolean = false;

  @Output() onSelectConversation = new EventEmitter<Conversation>();
  @Output() onArchiveConversation = new EventEmitter<string>();
  @Output() onDeleteConversation = new EventEmitter<string>();

  // ==========================================
  // PROPRIETÀ
  // ==========================================

  showActionsFor: string | null = null;

  // ==========================================
  // METODI
  // ==========================================

  selectConversation(conversation: Conversation) {
    this.onSelectConversation.emit(conversation);
    this.showActionsFor = null;
  }

  showActions(conversation: Conversation) {
    this.showActionsFor =
      this.showActionsFor === conversation.id ? null : conversation.id;
  }

  archiveConversation(conversation: Conversation) {
    this.onArchiveConversation.emit(conversation.id);
    this.showActionsFor = null;
  }

  deleteConversation(conversation: Conversation) {
    this.onDeleteConversation.emit(conversation.id);
    this.showActionsFor = null;
  }

  // ==========================================
  // UTILITY
  // ==========================================

  getUserName(conversation: Conversation): string {
    // Mock - in produzione verrebbe dal servizio utenti
    return 'Usuario';
  }

  getUserAvatar(conversation: Conversation): string {
    return '/assets/images/default-avatar.png';
  }

  isUserVerified(conversation: Conversation): boolean {
    return Math.random() > 0.7;
  }

  isUserOnline(conversation: Conversation): boolean {
    return Math.random() > 0.6;
  }

  hasUnreadMessages(conversation: Conversation): boolean {
    return (conversation.unreadCount?.[this.currentUserId] || 0) > 0;
  }

  getUnreadCount(conversation: Conversation): number {
    return conversation.unreadCount?.[this.currentUserId] || 0;
  }

  isLastMessageFromMe(conversation: Conversation): boolean {
    return conversation.lastMessage?.senderId === this.currentUserId;
  }

  getLastMessagePreview(conversation: Conversation): string {
    if (!conversation.lastMessage) return 'No hay mensajes';

    const content = conversation.lastMessage.content;
    return content.length > 50 ? content.substring(0, 50) + '...' : content;
  }

  getMessageStatusClass(conversation: Conversation): string {
    return conversation.lastMessage?.status || '';
  }

  getMessageStatusIcon(conversation: Conversation): string {
    const status = conversation.lastMessage?.status;
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

  formatTime(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}sem`;

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths}mes`;

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears}a`;
  }

  trackByConversationId(index: number, conversation: Conversation): string {
    return conversation.id;
  }
}
