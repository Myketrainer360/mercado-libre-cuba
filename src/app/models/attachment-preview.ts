// ==========================================
// INTERFACCE
// ==========================================
export interface AttachmentPreview {
  file: File;
  name: string;
  size: number;
  type: 'image' | 'document';
  preview: string;
}
