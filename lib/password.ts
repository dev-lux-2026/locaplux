// /lib/password.ts
const PASSWORD_MIN_LENGTH = 12;

const PASSWORD_BLACKLIST = [
  "password",
  "123456",
  "azerty",
  "qwerty",
  "locaplux",
  "admin",
  "welcome",
  "motdepasse",
];

export function validatePassword(password: string): string | null {
  if (!password || password.length < PASSWORD_MIN_LENGTH) {
    return `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères.`;
  }

  const lower = password.toLowerCase();
  if (PASSWORD_BLACKLIST.some((bad) => lower.includes(bad))) {
    return "Ce mot de passe est trop faible ou trop courant.";
  }

  return null; // OK
}

export function getPasswordScore(password: string): number {
  if (!password) return 0;

  let score = 0;

  if (password.length >= PASSWORD_MIN_LENGTH) score += 1;
  if (password.length >= 16) score += 1;

  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (PASSWORD_BLACKLIST.some((bad) => password.toLowerCase().includes(bad))) {
    score = Math.min(score, 1);
  }

  return Math.min(score, 5);
}

export function getPasswordStrengthLabel(score: number): string {
  if (score <= 1) return "Très faible";
  if (score === 2) return "Faible";
  if (score === 3) return "Moyen";
  if (score === 4) return "Bon";
  return "Excellent";
}

export function getPasswordStrengthColor(score: number): string {
  if (score <= 1) return "#dc2626"; // rouge
  if (score === 2) return "#f97316"; // orange
  if (score === 3) return "#eab308"; // jaune
  if (score === 4) return "#22c55e"; // vert
  return "#16a34a"; // vert foncé
}
