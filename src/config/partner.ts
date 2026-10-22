// The partner this deployment serves. Components read branding from here, never hard-code it.
import { env } from './env';

export const PARTNER = {
  id: env.partnerId,
  name: env.partnerName,
  tagline: env.partnerTagline,
  supportWhatsAppUrl: env.supportWhatsAppUrl,
  logoSrc: '/brand/partner-logo.svg',
  skylineSrc: '/brand/skyline.svg',
} as const;
