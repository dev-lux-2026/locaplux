export function detectForbiddenContent(text: string) {
  if (!text) return false;

  const patterns = [
    /\b[\w.%+-]+@[\w.-]+\.\w{2,}\b/gi, // emails
    /\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{2,4}[-.\s]?\d{2,4}/gi, // numéros
    /\b(zero|un|deux|trois|quatre|cinq|six|sept|huit|neuf)(\s|-)?(zero|un|deux|trois|quatre|cinq|six|sept|huit|neuf)+\b/gi, // numéros écrits
    /https?:\/\/\S+/gi, // liens
    /www\.\S+/gi, // liens
    /\b(instagram|facebook|whatsapp|tiktok|snapchat|telegram|messenger)\b/gi, // réseaux sociaux
    /\b(rue|avenue|boulevard|impasse|chemin|route|allée|place)\b\s+\w+/gi, // adresses
    /\b(L-\d{4}|\d{4,5})\b/gi, // codes postaux
  ];

  return patterns.some((p) => p.test(text));
}
