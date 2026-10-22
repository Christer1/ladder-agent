// Reads and validates NEXT_PUBLIC_* env vars with Zod; exports typed env.
import { z } from 'zod';

const isProduction = process.env.NODE_ENV === 'production';

// Fallback for local development only; production builds must set NEXT_PUBLIC_API_BASE_URL.
const DEV_API_BASE_URL = 'http://localhost:4000/api/v1';

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: isProduction
    ? z.url({ error: 'NEXT_PUBLIC_API_BASE_URL must be set to a valid URL in production' })
    : z.url().default(DEV_API_BASE_URL),
  NEXT_PUBLIC_USE_MOCKS: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  NEXT_PUBLIC_PARTNER_ID: z.string().min(1).default('zenith'),
  NEXT_PUBLIC_PARTNER_NAME: z.string().min(1).default('Zenith'),
  NEXT_PUBLIC_PARTNER_TAGLINE: z.string().min(1).default('Banking for a brighter future'),
  NEXT_PUBLIC_SUPPORT_WHATSAPP_URL: z.url().default('https://wa.me/2340000000000'),
});

// Each var is referenced explicitly so Next.js can inline it into the client bundle.
const parsed = envSchema.parse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || undefined,
  NEXT_PUBLIC_USE_MOCKS: process.env.NEXT_PUBLIC_USE_MOCKS,
  NEXT_PUBLIC_PARTNER_ID: process.env.NEXT_PUBLIC_PARTNER_ID || undefined,
  NEXT_PUBLIC_PARTNER_NAME: process.env.NEXT_PUBLIC_PARTNER_NAME || undefined,
  NEXT_PUBLIC_PARTNER_TAGLINE: process.env.NEXT_PUBLIC_PARTNER_TAGLINE || undefined,
  NEXT_PUBLIC_SUPPORT_WHATSAPP_URL: process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP_URL || undefined,
});

export const env = {
  apiBaseUrl: parsed.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, ''),
  useMocks: parsed.NEXT_PUBLIC_USE_MOCKS,
  partnerId: parsed.NEXT_PUBLIC_PARTNER_ID,
  partnerName: parsed.NEXT_PUBLIC_PARTNER_NAME,
  partnerTagline: parsed.NEXT_PUBLIC_PARTNER_TAGLINE,
  supportWhatsAppUrl: parsed.NEXT_PUBLIC_SUPPORT_WHATSAPP_URL,
} as const;
