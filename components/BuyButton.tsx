import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BuyButton from "@/components/BuyButton";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const productRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${params.id}`,
    { cache: "no-store" }
  );

  if (!productRes.ok) return notFound();

  const product = await productRes.json();
  const partner = product.partner;

  // Produits du même vendeur
  const similarRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/by-partner?id=${partner.id}`,
    { cache: "no-store" }
  );

  const similar = await similarRes.json();
  const similarFiltered = similar.filter((p: any) => p.id !== product.id);

  return (
    <div className="max-w-5xl mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Image principale */}
        <div>
          <Image
            src={product.images?.[0]}
            alt={product.name}
            width={600}
            height={600}
            className="rounded-lg object-cover"
          />
        </div>

        {/* Infos produit */}
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-xl text-gray-700 mt-2">{product.price} €</p>

          <p className="mt-4 text-gray-600">{product.description}</p>

          {/* Livraison */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold text-lg">Livraison</h3>
            <p className="text-sm text-gray-700 mt-1">
              Livraison possible dans un rayon de{" "}
              <strong>{partner.deliveryRadius ?? 0} km</strong>.
            </p>
            <p className="text-sm text-gray-500">
              Distance exacte calculée après autorisation de localisation.
            </p>
          </div>

          {/* Retrait */}
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold text-lg">Retrait</h3>
            <p className="text-sm text-gray-700 mt-1">
              Retrait possible après achat (adresse communiquée uniquement après paiement).
            </p>
          </div>

          {/* CTA : Bouton Acheter */}
          <BuyButton productId={product.id} quantity={1} />

          {/* Lien vers la page publique du vendeur */}
          <Link
            href={`/partner/${partner.id}`}
            className="block mt-4 text-blue-600 underline text-sm"
          >
            Voir les autres produits du vendeur
          </Link>
        </div>
      </div>

      {/* Produits similaires */}
      {similarFiltered.length > 0 && (
        <div className="mt-16">
          <h3 className="text-xl font-semibold">Produits du même vendeur</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
            {similarFiltered.map((p: any) => (
              <Link key={p.id} href={`/products/${p.id}`}>
                <div className="border rounded-lg p-3 hover:shadow-lg transition">
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    width={300}
                    height={300}
                    className="rounded-md object-cover"
                  />
                  <h4 className="mt-2 font-semibold">{p.name}</h4>
                  <p className="text-gray-700">{p.price} €</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
