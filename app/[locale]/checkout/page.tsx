"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@/components/Container";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [delivery, setDelivery] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    number: "",
    postal: "",
    city: "",
    country: "Luxembourg",
  });

  /* ------------------------------------------------------ */
  /* LOAD CART                                              */
  /* ------------------------------------------------------ */
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      const parsed = JSON.parse(stored);
      setCart(parsed);

      if (!parsed || parsed.length === 0) {
        router.push("/cart");
      }
    } else {
      router.push("/cart");
    }
  }, [router]);

  /* ------------------------------------------------------ */
  /* CALCULATE DELIVERY PRICE (AUTO)                        */
  /* ------------------------------------------------------ */
  useEffect(() => {
    if (cart.length === 0) return;

    async function calculateDelivery() {
      try {
        // 1) Position client
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
        );

        const clientLat = pos.coords.latitude;
        const clientLng = pos.coords.longitude;

        // 2) Appel API checkout (mode "preview")
        const res = await fetch("/api/checkout/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cart,
            clientLat,
            clientLng,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Erreur lors du calcul de la livraison");
          return;
        }

        setDelivery(data.delivery.price);
        setDistance(data.delivery.distanceKm);
      } catch (e) {
        setError("Impossible de récupérer votre position.");
      }
    }

    calculateDelivery();
  }, [cart]);

  /* ------------------------------------------------------ */
  /* FORM VALIDATION                                        */
  /* ------------------------------------------------------ */
  const isFormValid =
    customer.firstName.trim() &&
    customer.lastName.trim() &&
    customer.email.trim() &&
    customer.phone.trim() &&
    customer.street.trim() &&
    customer.postal.trim() &&
    customer.city.trim();

  const update = (field: string, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = delivery !== null ? subtotal + delivery : subtotal;

  /* ------------------------------------------------------ */
  /* PAY (STRIPE CHECKOUT)                                  */
  /* ------------------------------------------------------ */
  const pay = async () => {
    if (!isFormValid || cart.length === 0) return;

    setLoading(true);
    setError("");

    try {
      // 1) Position client
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );

      const clientLat = pos.coords.latitude;
      const clientLng = pos.coords.longitude;

      // 2) Appel API checkout final
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart,
          clientLat,
          clientLng,
          customer,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors du paiement");
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch (e) {
      setError("Erreur réseau, veuillez réessayer.");
      setLoading(false);
    }
  };

  const cancelled = searchParams.get("cancelled") === "true";

  /* ------------------------------------------------------ */
  /* UI                                                     */
  /* ------------------------------------------------------ */
  return (
    <Container>
      <div className="py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* FORMULAIRE */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-semibold text-gray-900">
            Finaliser la commande
          </h1>

          {cancelled && (
            <p className="text-sm text-orange-600">
              Le paiement a été annulé. Vous pouvez réessayer ci-dessous.
            </p>
          )}

          {/* Infos client */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Informations client
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Prénom"
                className="input"
                value={customer.firstName}
                onChange={(e) => update("firstName", e.target.value)}
              />
              <input
                placeholder="Nom"
                className="input"
                value={customer.lastName}
                onChange={(e) => update("lastName", e.target.value)}
              />
            </div>

            <input
              placeholder="Email"
              className="input"
              type="email"
              value={customer.email}
              onChange={(e) => update("email", e.target.value)}
            />

            <input
              placeholder="Téléphone (obligatoire)"
              className="input"
              value={customer.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>

          {/* Adresse */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Adresse de livraison
            </h2>

            <input
              placeholder="Rue"
              className="input"
              value={customer.street}
              onChange={(e) => update("street", e.target.value)}
            />

            <div className="grid grid-cols-3 gap-4">
              <input
                placeholder="Numéro"
                className="input"
                value={customer.number}
                onChange={(e) => update("number", e.target.value)}
              />
              <input
                placeholder="Code postal"
                className="input"
                value={customer.postal}
                onChange={(e) => update("postal", e.target.value)}
              />
              <input
                placeholder="Ville"
                className="input"
                value={customer.city}
                onChange={(e) => update("city", e.target.value)}
              />
            </div>

            <input
              placeholder="Pays"
              className="input"
              value={customer.country}
              onChange={(e) => update("country", e.target.value)}
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            onClick={pay}
            disabled={loading || !isFormValid || cart.length === 0}
            className="w-full px-6 py-3 bg-black text-white rounded-xl shadow hover:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {loading ? "Redirection vers Stripe..." : "Payer maintenant"}
          </button>
        </div>

        {/* RÉSUMÉ */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-fit">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Résumé de commande
          </h2>

          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between text-gray-700 mb-2"
            >
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{item.price * item.quantity} €</span>
            </div>
          ))}

          <hr className="my-3" />

          {delivery !== null && (
            <p className="flex justify-between text-gray-700 mb-2">
              <span>Livraison ({distance} km)</span>
              <span>{delivery} €</span>
            </p>
          )}

          <p className="flex justify-between text-lg font-semibold text-gray-900 mt-4">
            <span>Total</span>
            <span>{total} €</span>
          </p>
        </div>
      </div>
    </Container>
  );
}
