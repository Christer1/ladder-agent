// Date helpers for the "DD / MM / YYYY" date of birth field and the details screen.

const DISPLAY_PATTERN = /^(\d{2}) \/ (\d{2}) \/ (\d{4})$/;
const ISO_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Today as YYYY-MM-DD in local time; call it from an event handler, never during render. */
export function todayIsoDate(): string {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

/** Formats raw typing into "DD / MM / YYYY": "1204" → "12 / 04", "12042000" → "12 / 04 / 2000". */
export function maskDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
  return parts.join(' / ');
}

/** "12 / 04 / 2000" → "2000-04-12"; null when the text is incomplete. */
export function displayToIsoDate(display: string): string | null {
  const match = DISPLAY_PATTERN.exec(display);
  if (!match) return null;
  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

/** "2000-04-12" → "12 / 04 / 2000". */
export function isoToDisplayDate(iso: string): string {
  const match = ISO_PATTERN.exec(iso);
  if (!match) return '';
  const [, year, month, day] = match;
  return `${day} / ${month} / ${year}`;
}

/** Parses YYYY-MM-DD as a local date; returns null for impossible dates like 2001-02-30. */
export function parseIsoDate(value: string): Date | null {
  const match = ISO_PATTERN.exec(value);
  if (!match) return null;
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(year, month - 1, day);
  const isRealDate =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return isRealDate && year >= 1900 ? date : null;
}

/** "2000-04-12" → "12 Apr 2000". */
export function formatDisplayDate(iso: string): string {
  const date = parseIsoDate(iso);
  if (!date) return iso;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}
