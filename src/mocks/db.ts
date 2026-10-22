// In-memory "backend" state shared by the MSW handlers.
// Mirrored to sessionStorage so a page reload keeps your progress while developing.
// Only flags and statuses: never BVN, NIN, date of birth, Ladder ID or selfies (rules.md §10).
import type { AssistanceStatus, IdentityMethod } from '@/features/session';

/** Test behaviour picked at identify time from the test values (rules.md §9). */
export type MockScenario = 'default' | 'face-mismatch' | 'no-address';

type MockDb = {
  hasSession: boolean;
  scenario: MockScenario;
  isConfirmed: boolean;
  status: AssistanceStatus;
};

const STORAGE_KEY = 'ladder-assistance-mock-db';

const emptyDb = (): MockDb => ({
  hasSession: false,
  scenario: 'default',
  isConfirmed: false,
  status: { method: null, identity: 'not_started', liveness: 'not_started' },
});

function load(): MockDb {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as MockDb;
  } catch {
    // Storage blocked or corrupt: start fresh.
  }
  return emptyDb();
}

let db: MockDb = load();

function save() {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // Not critical for mocks.
  }
}

export const mockDb = {
  get: (): Readonly<MockDb> => db,
  startSession(method: IdentityMethod, scenario: MockScenario) {
    db = {
      ...emptyDb(),
      hasSession: true,
      scenario,
      status: { method, identity: 'verified', liveness: 'not_started' },
    };
    save();
  },
  updateStatus(patch: Partial<AssistanceStatus>) {
    db = { ...db, status: { ...db.status, ...patch } };
    save();
  },
  confirm() {
    db = { ...db, isConfirmed: true };
    save();
  },
  end() {
    db = emptyDb();
    save();
  },
};
