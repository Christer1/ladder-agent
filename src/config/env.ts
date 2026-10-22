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
  // Where Get Help goes: the in-page chat (Firestore) or the WhatsApp link above.
  NEXT_PUBLIC_HELP_CHANNEL: z.enum(['web', 'whatsapp']).default('web'),
  // Firebase web app config for the help chat. Public values: firestore.rules protects the data.
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().optional(),
});

// Each var is referenced explicitly so Next.js can inline it into the client bundle.
const parsed = envSchema.parse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || undefined,
  NEXT_PUBLIC_USE_MOCKS: process.env.NEXT_PUBLIC_USE_MOCKS,
  NEXT_PUBLIC_PARTNER_ID: process.env.NEXT_PUBLIC_PARTNER_ID || undefined,
  NEXT_PUBLIC_PARTNER_NAME: process.env.NEXT_PUBLIC_PARTNER_NAME || undefined,
  NEXT_PUBLIC_PARTNER_TAGLINE: process.env.NEXT_PUBLIC_PARTNER_TAGLINE || undefined,
  NEXT_PUBLIC_SUPPORT_WHATSAPP_URL: process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP_URL || undefined,
  NEXT_PUBLIC_HELP_CHANNEL: process.env.NEXT_PUBLIC_HELP_CHANNEL || undefined,
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || undefined,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || undefined,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || undefined,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || undefined,
});

const firebaseConfig = {
  apiKey: parsed.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: parsed.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: parsed.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: parsed.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const env = {
  apiBaseUrl: parsed.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, ''),
  useMocks: parsed.NEXT_PUBLIC_USE_MOCKS,
  partnerId: parsed.NEXT_PUBLIC_PARTNER_ID,
  partnerName: parsed.NEXT_PUBLIC_PARTNER_NAME,
  partnerTagline: parsed.NEXT_PUBLIC_PARTNER_TAGLINE,
  supportWhatsAppUrl: parsed.NEXT_PUBLIC_SUPPORT_WHATSAPP_URL,
  helpChannel: parsed.NEXT_PUBLIC_HELP_CHANNEL,
  /** null until all four NEXT_PUBLIC_FIREBASE_* values are set. */
  firebase: Object.values(firebaseConfig).every(Boolean)
    ? (firebaseConfig as Record<keyof typeof firebaseConfig, string>)
    : null,
} as const;
