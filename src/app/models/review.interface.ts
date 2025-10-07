/**
 * Interfaccia per le recensioni
 */
export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number;
  comment: string;
  createdAt: Date;
  transactionId?: string;
  isVerified: boolean;
  helpful: number;
  response?: {
    text: string;
    createdAt: Date;
  };
}
