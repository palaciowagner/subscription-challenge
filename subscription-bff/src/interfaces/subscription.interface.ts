export interface Subscription {
  id: string;
  email: string;
  firstName: string | undefined;
  gender: string | undefined;
  dateOfBirth: Date;
  flagForConsent: boolean;
  newsletterId: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
