import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendAdminPartnerNotification } from "@/lib/emails/partner/sendAdminPartnerNotification";
import { sendVatCheckFailedAlert } from "@/lib/emails/alerts/sendVatCheckFailed";

const prisma = new PrismaClient();

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

async function checkVatWithVies(vat: string) {
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
          "Content-Type": "text/xml",
          "User-Agent": "Locaplux VAT Validator",
        },
        body: xml,
      }
    );

    const text = await res.text();

    if (text.includes("<valid>true</valid>")) return { valid: true };
    if (text.includes("<valid>false</valid>")) return { valid: false };

    return { error: true };
  } catch {
    return { error: true };
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const {
      firstName,
      lastName,
      company,
      publicName,
      email,
      street,
      number,
      postal,
      city,
      country,
      phonePrefix,
      phone,
      vat,
      website,
    } = data;

    // Vérification champs obligatoires
    if (
      !firstName ||
      !lastName ||
      !company ||
      !publicName ||
      !email ||
      !postal ||
      !country ||
      !phonePrefix ||
      !phone ||
      !vat
    ) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants." },
        { status: 400 }
      );
    }

    // Vérification TVA
    const vatFormatOk = validateVatFormat(vat);
    const vies = vatFormatOk ? await checkVatWithVies(vat) : { valid: false };

    let vatCheckFailed = false;

    if (vies.valid === false || vies.error) {
      vatCheckFailed = true;

      // 🔥 Email interne en cas d'échec TVA
      await sendVatCheckFailedAlert({
        company,
        publicName,
        vat,
        email,
      }).catch((err) => {
        console.error("❌ Erreur envoi alerte TVA :", err);
      });
    }

    // Vérifier si email existe déjà
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet email." },
        { status: 400 }
      );
    }

    // Création du user
    const user = await prisma.user.create({
      data: {
        email,
        role: "partner",
        status: "pending",

        firstName,
        lastName,

        company,
        publicName,
        vat,

        phonePrefix,
        phone,

        street,
        number,
        postal,
        city,
        country,

        website,

        vatCheckFailed,
      },
    });

    // 🔥 Email admin garanti (avec logs)
    await sendAdminPartnerNotification({
      ...data,
      vatCheckFailed,
    }).catch((err) => {
      console.error("❌ Erreur envoi email admin :", err);
    });

    return NextResponse.json(
      {
        message:
          "Votre demande a été envoyée. Un administrateur doit valider votre compte avant activation.",
        userId: user.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Erreur API register/partner :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
