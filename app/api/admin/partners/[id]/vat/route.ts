import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ---------------------------------------------
// 1) Validation syntaxique stricte TVA par pays
// ---------------------------------------------
function validateVatFormat(vat: string): boolean {
  const country = vat.slice(0, 2).toUpperCase();
  const number = vat.slice(2);

  const rules: Record<string, RegExp> = {
    LU: /^[0-9]{8}$/,
    BE: /^[0-9]{10}$/,
    FR: /^[0-9A-Z]{11}$/,
    DE: /^[0-9]{9}$/,
    NL: /^[0-9A-Z]{12}$/,
    IT: /^[0-9]{11}$/,
    ES: /^[0-9A-Z]{9}$/,
    PT: /^[0-9]{9}$/,
    AT: /^[0-9A-Z]{9}$/,
    DK: /^[0-9]{8}$/,
    SE: /^[0-9]{12}$/,
  };

  return rules[country]?.test(number) ?? false;
}

// ---------------------------------------------
// 2) Vérification VIES (premium + retry + parsing robuste)
// ---------------------------------------------
async function callViesOnce(vat: string) {
  const countryCode = vat.slice(0, 2);
  const vatNumber = vat.slice(2);

  const xml = `
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <checkVat xmlns="urn:ec.europa.eu:taxud:vies:services:checkVat:types">
          <countryCode>${countryCode}</countryCode>
          <vatNumber>${vatNumber}</vatNumber>
        </checkVat>
      </soap:Body>
    </soap:Envelope>
  `;

  try {
    const res = await fetch(
      "https://ec.europa.eu/taxation_customs/vies/services/checkVatService",
      {
        method: "POST",
        headers: {
          "Content-Type": "text/xml;charset=UTF-8",
          "SOAPAction": "checkVat",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        },
        body: xml,
      }
    );

    const text = await res.text();
    const normalized = text.replace(/\s+/g, "").toLowerCase();

    if (normalized.includes("<valid>true</valid>")) return { valid: true };
    if (normalized.includes("<valid>false</valid>")) return { valid: false };

    return { error: true };
  } catch {
    return { error: true };
  }
}

// Retry intelligent (3 tentatives)
async function checkVatWithVies(vat: string) {
  for (let i = 0; i < 3; i++) {
    const result = await callViesOnce(vat);
    if (!result.error) return result;
    await new Promise((r) => setTimeout(r, 300)); // petit délai
  }
  return { error: true };
}

// ---------------------------------------------
// 3) Fallback API tierce (Apilayer)
// ---------------------------------------------
async function checkVatFallback(vat: string) {
  try {
    const res = await fetch(
      `https://api.apilayer.com/vat/validate?vat_number=${vat}`,
      {
        headers: {
          apikey: process.env.VAT_API_KEY || "",
        },
      }
    );

    const data = await res.json();

    if (data.valid === true) return { valid: true };
    if (data.valid === false) return { valid: false };

    return { error: true };
  } catch {
    return { error: true };
  }
}

// ---------------------------------------------
// 4) Cache 24h en base
// ---------------------------------------------
async function getCachedVat(vat: string) {
  const cache = await prisma.vatCache.findUnique({
    where: { vat },
  });

  if (!cache) return null;

  const age = Date.now() - cache.updatedAt.getTime();
  if (age > 24 * 60 * 60 * 1000) return null; // expiré

  return cache.valid;
}

async function setCachedVat(vat: string, valid: boolean) {
  await prisma.vatCache.upsert({
    where: { vat },
    update: { valid, updatedAt: new Date() },
    create: { vat, valid },
  });
}

// ---------------------------------------------
// 5) Route GET
// ---------------------------------------------
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    const vat = user.vat;

    if (!vat) {
      return NextResponse.json(
        { status: "missing", message: "Aucun numéro de TVA fourni." },
        { status: 200 }
      );
    }

    // 1) Validation syntaxique
    if (!validateVatFormat(vat)) {
      await prisma.user.update({
        where: { id },
        data: { vatCheckFailed: true },
      });

      return NextResponse.json(
        { status: "invalid", message: "Format TVA incorrect." },
        { status: 200 }
      );
    }

    // 2) Cache 24h
    const cached = await getCachedVat(vat);
    if (cached !== null) {
      return NextResponse.json({
        status: cached ? "valid" : "invalid",
        message: cached
          ? "TVA valide (cache 24h)."
          : "TVA invalide (cache 24h).",
      });
    }

    // 3) Vérification VIES (retry)
    const vies = await checkVatWithVies(vat);

    if (vies.valid === true) {
      await setCachedVat(vat, true);
      await prisma.user.update({
        where: { id },
        data: { vatCheckFailed: false },
      });

      return NextResponse.json(
        { status: "valid", message: "TVA valide." },
        { status: 200 }
      );
    }

    if (vies.valid === false) {
      await setCachedVat(vat, false);
      await prisma.user.update({
        where: { id },
        data: { vatCheckFailed: true },
      });

      return NextResponse.json(
        { status: "invalid", message: "TVA invalide selon VIES." },
        { status: 200 }
      );
    }

    // 4) Fallback API tierce
    const fallback = await checkVatFallback(vat);

    if (fallback.valid === true) {
      await setCachedVat(vat, true);
      await prisma.user.update({
        where: { id },
        data: { vatCheckFailed: false },
      });

      return NextResponse.json(
        { status: "valid", message: "TVA valide (fallback API)." },
        { status: 200 }
      );
    }

    if (fallback.valid === false) {
      await setCachedVat(vat, false);
      await prisma.user.update({
        where: { id },
        data: { vatCheckFailed: true },
      });

      return NextResponse.json(
        { status: "invalid", message: "TVA invalide (fallback API)." },
        { status: 200 }
      );
    }

    // 5) VIES + fallback indisponibles
    await prisma.user.update({
      where: { id },
      data: { vatCheckFailed: true },
    });

    return NextResponse.json(
      {
        status: "unknown",
        message:
          "Impossible de vérifier la TVA (VIES + fallback). Vérification manuelle requise.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur API check-vat :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
