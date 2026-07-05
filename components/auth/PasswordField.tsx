"use client";

import { useState, useMemo } from "react";

const MIN_LENGTH = 12;

const BLACKLIST = [
  "password",
  "123456",
  "azerty",
  "qwerty",
  "locaplux",
  "admin",
  "welcome",
  "motdepasse",
];

// Validation moderne (Option A)
function validatePassword(password: string): string | null {
  if (!password || password.length < MIN_LENGTH) {
    return `Le mot de passe doit contenir au moins ${MIN_LENGTH} caractères.`;
  }

  const lower = password.toLowerCase();
  if (BLACKLIST.some((bad) => lower.includes(bad))) {
    return "Ce mot de passe est trop faible ou trop courant.";
  }

  return null;
}

// Score visuel (UX)
function getPasswordScore(password: string): number {
  if (!password) return 0;

  let score = 0;

  if (password.length >= MIN_LENGTH) score += 1;
  if (password.length >= 16) score += 1;

  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (BLACKLIST.some((bad) => password.toLowerCase().includes(bad))) {
    score = Math.min(score, 1);
  }

  return Math.min(score, 5);
}

function getStrengthLabel(score: number): string {
  if (score <= 1) return "Très faible";
  if (score === 2) return "Faible";
  if (score === 3) return "Moyen";
  if (score === 4) return "Bon";
  return "Excellent";
}

function getStrengthColor(score: number): string {
  if (score <= 1) return "#dc2626"; // rouge
  if (score === 2) return "#f97316"; // orange
  if (score === 3) return "#eab308"; // jaune
  if (score === 4) return "#22c55e"; // vert
  return "#16a34a"; // vert foncé
}

export function PasswordField({ value, onChange }: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [touched, setTouched] = useState(false);

  const score = useMemo(() => getPasswordScore(value), [value]);
  const strengthLabel = useMemo(() => getStrengthLabel(score), [score]);
  const strengthColor = useMemo(() => getStrengthColor(score), [score]);

  const error = useMemo(
    () => (touched ? validatePassword(value) : null),
    [touched, value]
  );

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Mot de passe
      </label>

      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        placeholder="Ex : maMaisonBleueEstGrande"
      />

      {/* Barre de force */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex-1 mr-2 h-1.5 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full transition-all"
            style={{
              width: `${(score / 5) * 100}%`,
              backgroundColor: strengthColor,
            }}
          />
        </div>
        <span className="text-[11px]" style={{ color: strengthColor }}>
          Force : {strengthLabel}
        </span>
      </div>

      <p className="text-[11px] text-gray-500">
        Minimum 12 caractères. Les phrases longues sont recommandées
        (ex : "maMaisonBleueEstGrande").  
        Les mots de passe trop courants sont refusés.
      </p>

      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
