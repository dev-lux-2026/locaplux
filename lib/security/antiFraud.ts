// lib/security/antiFraud.ts

// Mémoire en RAM (Edge Runtime compatible)
const recentOrders = new Map<string, number[]>();
const ipScores = new Map<string, number>();

// Configuration
const MAX_ORDERS_PER_MIN = 3;          // 3 commandes / minute
const MIN_DELAY_BETWEEN_ORDERS = 5000; // 5 secondes entre commandes
const MAX_SCORE = 10;                  // score max avant blocage
const SCORE_DECAY = 1;                 // décrémentation progressive

export function antiFraudOrder(ip: string, userId: string) {
  const now = Date.now();

  // --- 1) Historique commandes par user ---
  if (!recentOrders.has(userId)) recentOrders.set(userId, []);
  const history = recentOrders.get(userId)!;

  // Nettoyage des timestamps > 1 min
  const oneMinuteAgo = now - 60_000;
  const recent = history.filter((t) => t > oneMinuteAgo);
  recentOrders.set(userId, recent);

  // --- 2) Trop de commandes en 1 minute ---
  if (recent.length >= MAX_ORDERS_PER_MIN) {
    addScore(ip, 3);
    return { ok: false, reason: "Trop de commandes en peu de temps" };
  }

  // --- 3) Commande trop rapide après la précédente ---
  if (recent.length > 0 && now - recent[recent.length - 1] < MIN_DELAY_BETWEEN_ORDERS) {
    addScore(ip, 2);
    return { ok: false, reason: "Commande trop rapide" };
  }

  // --- 4) Score IP suspect ---
  const score = ipScores.get(ip) || 0;
  if (score >= MAX_SCORE) {
    return { ok: false, reason: "Activité suspecte détectée" };
  }

  // --- 5) Tout est OK → on enregistre ---
  recent.push(now);
  recentOrders.set(userId, recent);

  // Décrémentation du score (comportement normal)
  if (score > 0) ipScores.set(ip, score - SCORE_DECAY);

  return { ok: true };
}

// --- Fonction interne ---
function addScore(ip: string, amount: number) {
  const current = ipScores.get(ip) || 0;
  ipScores.set(ip, current + amount);
}
