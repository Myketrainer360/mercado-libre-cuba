import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { AttachmentPreview } from '../../../../models/attachment-preview';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Componente per comporre e inviare messaggi
 * Include: textarea, allegati, emoji, invio messaggi
 */

@Component({
  selector: 'app-message-composer',
  imports: [CommonModule, FormsModule],
  templateUrl: './message-composer.component.html',
  styleUrl: './message-composer.component.css',
})
export class MessageComposerComponent {
  // ==========================================
  // INPUTS & OUTPUTS
  // ==========================================

  @Input() disabled = false;
  @Input() placeholder = 'Escribe un mensaje...';
  @Input() maxLength = 1000;
  @Input() showCharCounter = true;
  @Input() showTypingIndicator = false;
  @Input() typingUserName = 'El usuario';
  @Input() showQuickSuggestions = false;
  @Input() quickSuggestions: string[] = [];

  @Output() onSendMessage = new EventEmitter<{
    text: string;
    attachments: File[];
  }>();
  @Output() onTyping = new EventEmitter<void>();
  @Output() onStopTyping = new EventEmitter<void>();

  // ViewChild per accedere al textarea e agli input file
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInput') fileInputElement!: ElementRef<HTMLInputElement>;

  // ==========================================
  // PROPRIETÀ COMPONENTE
  // ==========================================

  messageText = '';
  textareaRows = 1;
  isSending = false;

  attachments: AttachmentPreview[] = [];
  private typingTimeout: any;
  private isTyping = false;

  // ==========================================
  // LIFECYCLE HOOKS
  // ==========================================

  ngAfterViewInit() {
    // Focus automatico sul textarea quando il componente è pronto
    this.focusInput();
  }

  // ==========================================
  // GESTIONE INPUT
  // ==========================================

  onInputChange() {
    this.adjustTextareaHeight();
    this.handleTypingStatus();
  }

  onKeyDown(event: KeyboardEvent) {
    // Invio con Enter (senza Shift)
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }

    // Shift + Enter per andare a capo
    if (event.key === 'Enter' && event.shiftKey) {
      // Comportamento di default (nuova linea)
      this.adjustTextareaHeight();
    }
  }

  private adjustTextareaHeight() {
    const textarea = this.messageInput?.nativeElement;
    if (!textarea) return;

    // Reset height per calcolare la nuova altezza
    textarea.style.height = 'auto';

    // Calcola nuova altezza in base al contenuto
    const newHeight = Math.min(textarea.scrollHeight, 120); // Max 120px
    textarea.style.height = newHeight + 'px';

    // Aggiorna il numero di righe
    this.textareaRows = Math.ceil(newHeight / 24);
  }

  private handleTypingStatus() {
    // Emette evento "typing" solo se non sta già digitando
    if (!this.isTyping) {
      this.isTyping = true;
      this.onTyping.emit();
    }

    // Reset timeout
    clearTimeout(this.typingTimeout);

    // Dopo 2 secondi senza digitare, emette "stop typing"
    this.typingTimeout = setTimeout(() => {
      this.isTyping = false;
      this.onStopTyping.emit();
    }, 2000);
  }

  // ==========================================
  // INVIO MESSAGGIO
  // ==========================================

  sendMessage() {
    if (!this.canSend()) return;

    this.isSending = true;

    // Prepara i file allegati
    const files = this.attachments.map((att) => att.file);

    // Emette l'evento con messaggio e allegati
    this.onSendMessage.emit({
      text: this.messageText.trim(),
      attachments: files,
    });

    // Reset dopo invio
    setTimeout(() => {
      this.clearComposer();
      this.isSending = false;
      this.focusInput();
    }, 500);
  }

  canSend(): boolean {
    return (
      !this.disabled &&
      !this.isSending &&
      (this.messageText.trim().length > 0 || this.attachments.length > 0)
    );
  }

  private clearComposer() {
    this.messageText = '';
    this.attachments = [];
    this.textareaRows = 1;

    if (this.messageInput?.nativeElement) {
      this.messageInput.nativeElement.style.height = 'auto';
    }
  }

  focusInput() {
    setTimeout(() => {
      this.messageInput?.nativeElement?.focus();
    }, 100);
  }

  // ==========================================
  // GESTIONE ALLEGATI
  // ==========================================

  triggerFileInput(type: 'image' | 'file') {
    if (type === 'image') {
      this.imageInput.nativeElement.click();
    } else {
      this.fileInputElement.nativeElement.click();
    }
  }

  onFileSelected(event: Event, type: 'image' | 'file') {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) return;

    // Processa ogni file
    Array.from(files).forEach((file) => {
      this.addAttachment(file, type);
    });

    // Reset input
    input.value = '';
  }

  private addAttachment(file: File, type: 'image' | 'file') {
    // Validazione dimensione file (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert(`El archivo ${file.name} es demasiado grande. Máximo 10MB.`);
      return;
    }

    // Validazione numero allegati (max 5)
    if (this.attachments.length >= 5) {
      alert('Máximo 5 archivos por mensaje.');
      return;
    }

    // Crea preview
    const attachment: AttachmentPreview = {
      file,
      name: file.name,
      size: file.size,
      type: type === 'image' ? 'image' : 'document',
      preview: '',
    };

    // Se è un'immagine, crea preview
    if (type === 'image' && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        attachment.preview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }

    this.attachments.push(attachment);
  }

  removeAttachment(index: number) {
    this.attachments.splice(index, 1);
  }

  // ==========================================
  // UTILITIES
  // ==========================================

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  toggleEmojiPicker() {
    // TODO: Implementare emoji picker
    console.log('Emoji picker - TODO');
  }

  applySuggestion(suggestion: string) {
    this.messageText = suggestion;
    this.focusInput();
    this.adjustTextareaHeight();
  }
}
