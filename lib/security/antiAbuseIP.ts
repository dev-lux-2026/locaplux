// lib/security/antiAbuseIP.ts

// Mémoire en RAM (Edge Runtime compatible)
const ipHits = new Map<string, number[]>();
const ipScores = new Map<string, number>();

// Configuration
const MAX_REQUESTS_PER_MIN = 60; // 60 requêtes / minute (global)
const MAX_SCORE = 20;            // score max avant blocage
const SCORE_DECAY = 1;           // décrémentation progressive

export function antiAbuseIP(ip: string) {
  const now = Date.now();

  // --- 1) Historique des hits par IP ---
  if (!ipHits.has(ip)) ipHits.set(ip, []);
  const history = ipHits.get(ip)!;

  // Nettoyage des timestamps > 1 min
  const oneMinuteAgo = now - 60_000;
  const recent = history.filter((t) => t > oneMinuteAgo);
  ipHits.set(ip, recent);

  // --- 2) Trop de requêtes en 1 minute ---
  if (recent.length >= MAX_REQUESTS_PER_MIN) {
    addScore(ip, 3);
    return { ok: false, reason: "Activité excessive détectée" };
  }

  // --- 3) Score IP suspect ---
  const score = ipScores.get(ip) || 0;
  if (score >= MAX_SCORE) {
    return { ok: false, reason: "IP temporairement bloquée pour abus" };
  }

  // --- 4) Tout est OK → on enregistre ---
  recent.push(now);
  ipHits.set(ip, recent);

  // Décrémentation du score (comportement normal)
  if (score > 0) ipScores.set(ip, score - SCORE_DECAY);

  return { ok: true };
}

// --- Fonction interne ---
function addScore(ip: string, amount: number) {
  const current = ipScores.get(ip) || 0;
  ipScores.set(ip, current + amount);
}
