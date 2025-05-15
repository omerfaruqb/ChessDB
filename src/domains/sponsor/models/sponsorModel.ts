/**
 * Sponsor model
 */
export interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  website?: string;
  description?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  tier?: SponsorTier;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Sponsorship model
 */
export interface Sponsorship {
  id: string;
  sponsorId: string;
  entityId: string;
  entityType: EntityType;
  startDate: Date;
  endDate?: Date;
  amount?: number;
  currency?: string;
  terms?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Sponsor tier enum
 */
export enum SponsorTier {
  PLATINUM = 'platinum',
  GOLD = 'gold',
  SILVER = 'silver',
  BRONZE = 'bronze',
  SUPPORTING = 'supporting'
}

/**
 * Entity type enum
 */
export enum EntityType {
  TOURNAMENT = 'tournament',
  TEAM = 'team',
  PLAYER = 'player'
}
