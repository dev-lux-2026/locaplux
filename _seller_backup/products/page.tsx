"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SellerProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== "partner") {
      router.push("/login");
      return;
    }

    fetch("/api/seller/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [session, status, router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce produit ?")) return;

    await fetch(`/api/products/${id}`, { method: "DELETE" });

    setProducts(products.filter((p: any) => p.id !== id));
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
        Mes produits
      </h1>

      <button
        onClick={() => router.push("/seller/products/new")}
        style={{
          padding: "10px 20px",
          background: "#0070f3",
          color: "white",
          border: "none",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Ajouter un produit
      </button>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {products.map((p: any) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "8px",
              width: "250px",
            }}
          >
            <img
              src={p.images?.[0]}
              alt={p.name}
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />

            <h3 style={{ marginTop: "10px" }}>{p.name}</h3>
            <p>{p.price} €</p>

            {p.boostLevel && p.boostLevel !== "none" && (
              <span
                style={{
                  background:
                    p.boostLevel === "premium" ? "purple" : "#0070f3",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              >
                BOOST
              </span>
            )}

            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => router.push(`/seller/products/${p.id}`)}
                style={{
                  padding: "8px 12px",
                  background: "black",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                Modifier
              </button>

              <button
                onClick={() => handleDelete(p.id)}
                style={{
                  padding: "8px 12px",
                  background: "red",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
