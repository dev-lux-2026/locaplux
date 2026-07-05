import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const partner = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  return NextResponse.json(partner);
}

export async function PATCH(req: Request) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  // Normalisation des champs livraison
  const delivery_allowed_countries =
    typeof data.delivery_allowed_countries === "string"
      ? data.delivery_allowed_countries
          .split(",")
          .map((c: string) => c.trim())
          .filter((c: string) => c.length > 0)
      : Array.isArray(data.delivery_allowed_countries)
      ? data.delivery_allowed_countries
      : [];

  const updated = await prisma.user.update({
    where: { email: session.user.email },
    data: {
      // Identité
      firstName: data.firstName,
      lastName: data.lastName,

      // Entreprise
      publicName: data.publicName,
      company: data.company,
      vat: data.vat,

      // Contact
      phonePrefix: data.phonePrefix,
      phone: data.phone,
      website: data.website,

      // Adresse
      street: data.street,
      number: data.number,
      postal: data.postal,
      city: data.city,
      country: data.country,

      // Paramètres de livraison
      delivery_price_per_km:
        data.delivery_price_per_km !== "" &&
        data.delivery_price_per_km !== null
          ? Number(data.delivery_price_per_km)
          : null,

      delivery_min_price:
        data.delivery_min_price !== "" && data.delivery_min_price !== null
          ? Number(data.delivery_min_price)
          : null,

      delivery_max_price:
        data.delivery_max_price !== "" && data.delivery_max_price !== null
          ? Number(data.delivery_max_price)
          : null,

      delivery_max_km:
        data.delivery_max_km !== "" && data.delivery_max_km !== null
          ? Number(data.delivery_max_km)
          : null,

      delivery_allowed_countries,

      default_pickup_available:
        data.default_pickup_available === undefined
          ? true
          : Boolean(data.default_pickup_available),

      default_delivery_available:
        data.default_delivery_available === undefined
          ? true
          : Boolean(data.default_delivery_available),
    },
  });

  return NextResponse.json(updated);
}
