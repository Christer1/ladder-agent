// Firebase (Auth + Firestore) for the help chat, created on first use. Import this module only
// with import(), so the Firebase SDK stays out of the main bundle.
import { initializeApp } from 'firebase/app';
import { inMemoryPersistence, initializeAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { env } from '@/config/env';

let instance: { auth: Auth; db: Firestore } | null = null;

export function getFirebase(): { auth: Auth; db: Firestore } {
  if (instance) return instance;
  if (!env.firebase) throw new Error('Firebase is not configured (NEXT_PUBLIC_FIREBASE_*).');

  const app = initializeApp(env.firebase, 'ladder-help-chat');
  instance = {
    // In memory only: partner screens may be shared devices, so the chat sign-in never outlives
    // the page.
    auth: initializeAuth(app, { persistence: inMemoryPersistence }),
    db: getFirestore(app),
  };
  return instance;
}
