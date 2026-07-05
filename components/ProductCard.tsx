import Link from "next/link";

export default function ProductCard({ product }: any) {
  return (
    <div className="relative border rounded-lg overflow-hidden bg-white hover:shadow-md transition">
      
      {/* 🔥 Badge BOOST */}
      {product.boostLevel !== "none" && (
        <div
          className={`absolute top-3 left-3 px-2 py-1 text-xs font-bold rounded 
            ${product.boostLevel === "premium" ? "bg-purple-600" : "bg-blue-600"} 
            text-white`}
        >
          BOOST
        </div>
      )}

      {/* Image */}
      <img
        src={product.images?.[0]}
        alt={product.name}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{product.name}</h3>

        {/* Prix Locaplux */}
        <p className="text-gray-700 font-medium mb-2">
          {product.prix_locaplux} €
        </p>

        {/* 🔥 Badge PRO vendeur */}
        {product.partner?.isPro && (
          <span className="inline-block bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded mb-2">
            PRO
          </span>
        )}

        <Link
          href={`/products/${product.id}`}
          className="text-black font-medium hover:underline block mt-2"
        >
          Voir le produit
        </Link>
      </div>
    </div>
  );
}
