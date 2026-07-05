export default function CancelPage() {
  return (
    <div className="max-w-3xl mx-auto py-20 text-center">
      <h1 className="text-4xl font-bold mb-4 text-red-600">
        Paiement annulé
      </h1>

      <p className="text-gray-700 text-lg mb-8">
        Vous pouvez réessayer ou modifier votre panier.
      </p>

      <a
        href="/cart"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Retour au panier
      </a>
    </div>
  );
}
