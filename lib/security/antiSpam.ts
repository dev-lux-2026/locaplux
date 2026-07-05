// lib/security/antiSpam.ts

// Mémoire en RAM (Edge Runtime compatible)
const recentMessages = new Map<string, number[]>();
const ipScores = new Map<string, number>();

// Configuration
const MAX_MESSAGES_PER_MIN = 10;        // 10 messages / minute
const MIN_DELAY_BETWEEN_MESSAGES = 1500; // 1.5 sec entre messages
const MAX_SCORE = 12;                   // score max avant blocage
const SCORE_DECAY = 1;                  // décrémentation progressive

export function antiSpamMessage(ip: string, userId: string) {
  const now = Date.now();

  // --- 1) Historique messages par user ---
  if (!recentMessages.has(userId)) recentMessages.set(userId, []);
  const history = recentMessages.get(userId)!;

  // Nettoyage des timestamps > 1 min
  const oneMinuteAgo = now - 60_000;
  const recent = history.filter((t) => t > oneMinuteAgo);
  recentMessages.set(userId, recent);

  // --- 2) Trop de messages en 1 minute ---
  if (recent.length >= MAX_MESSAGES_PER_MIN) {
    addScore(ip, 3);
    return { ok: false, reason: "Trop de messages envoyés en peu de temps" };
  }

  // --- 3) Message trop rapide après le précédent ---
  if (recent.length > 0 && now - recent[recent.length - 1] < MIN_DELAY_BETWEEN_MESSAGES) {
    addScore(ip, 2);
    return { ok: false, reason: "Vous envoyez des messages trop rapidement" };
  }

  // --- 4) Score IP suspect ---
  const score = ipScores.get(ip) || 0;
  if (score >= MAX_SCORE) {
    return { ok: false, reason: "Activité suspecte détectée" };
  }

  // --- 5) Tout est OK → on enregistre ---
  recent.push(now);
  recentMessages.set(userId, recent);

  // Décrémentation du score (comportement normal)
  if (score > 0) ipScores.set(ip, score - SCORE_DECAY);

  return { ok: true };
}

// --- Fonction interne ---
function addScore(ip: string, amount: number) {
  const current = ipScores.get(ip) || 0;
  ipScores.set(ip, current + amount);
}
