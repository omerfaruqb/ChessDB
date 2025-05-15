import { Sponsor, Sponsorship, SponsorTier, EntityType } from '../models/sponsorModel';

/**
 * Response type for sponsor operations
 */
export interface SponsorResponse {
  data: Sponsor | Sponsor[];
  success: boolean;
  message?: string;
}

/**
 * Response type for sponsorship operations
 */
export interface SponsorshipResponse {
  data: Sponsorship | Sponsorship[];
  success: boolean;
  message?: string;
}

/**
 * Request payload for creating a sponsor
 */
export interface CreateSponsorRequest {
  name: string;
  logoUrl: string;
  website?: string;
  description?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  tier?: SponsorTier;
}

/**
 * Request payload for updating a sponsor
 */
export interface UpdateSponsorRequest {
  name?: string;
  logoUrl?: string;
  website?: string;
  description?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  tier?: SponsorTier;
}

/**
 * Request payload for creating a sponsorship
 */
export interface CreateSponsorshipRequest {
  sponsorId: string;
  entityId: string;
  entityType: EntityType;
  startDate: Date;
  endDate?: Date;
  amount?: number;
  currency?: string;
  terms?: string;
}
