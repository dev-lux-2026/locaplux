// lib/rateLimit.ts

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 20; // 20 requêtes par minute par IP

const ipStore = new Map<string, { count: number; timestamp: number }>();

export function rateLimit(ip: string) {
  const now = Date.now();
  const entry = ipStore.get(ip);

  if (!entry) {
    ipStore.set(ip, { count: 1, timestamp: now });
    return true;
  }

  // Reset window
  if (now - entry.timestamp > RATE_LIMIT_WINDOW) {
    ipStore.set(ip, { count: 1, timestamp: now });
    return true;
  }

  // Too many requests
  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}
