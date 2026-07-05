"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function EditProductPage({ params }: any) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { productId } = params;

  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState([]);

  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== "partner") {
      router.push("/login");
      return;
    }

    fetch(`/api/products/${productId}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));

    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, [session, status, router, productId]);

  const handleUpdate = async (e: any) => {
    e.preventDefault();

    const res = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Erreur");
      return;
    }

    router.push("/seller/products");
  };

  const handleDelete = async () => {
    if (!confirm("Supprimer ce produit ?")) return;

    await fetch(`/api/products/${productId}`, { method: "DELETE" });

    router.push("/seller/products");
  };

  if (!product) return <div>Chargement...</div>;

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
        Modifier le produit
      </h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleUpdate} style={{ maxWidth: "500px" }}>
        <label>Nom</label>
        <input
          type="text"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />

        <label>Description</label>
        <textarea
          value={product.description}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />

        <label>Prix (€)</label>
        <input
          type="number"
          value={product.price}
          onChange={(e) =>
            setProduct({ ...product, price: Number(e.target.value) })
          }
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />

        <label>Prix barré</label>
        <input
          type="number"
          value={product.originalPrice || ""}
          onChange={(e) =>
            setProduct({
              ...product,
              originalPrice: e.target.value
                ? Number(e.target.value)
                : null,
            })
          }
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />

        <label>Stock</label>
        <input
          type="number"
          value={product.stock}
          onChange={(e) =>
            setProduct({ ...product, stock: Number(e.target.value) })
          }
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />

        <label>Images (URLs séparées par des virgules)</label>
        <input
          type="text"
          value={product.images.join(",")}
          onChange={(e) =>
            setProduct({ ...product, images: e.target.value.split(",") })
          }
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />

        <label>Catégorie</label>
        <select
          value={product.categoryId}
          onChange={(e) =>
            setProduct({ ...product, categoryId: e.target.value })
          }
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        >
          {categories.map((c: any) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <label>État</label>
        <select
          value={product.condition}
          onChange={(e) =>
            setProduct({ ...product, condition: e.target.value })
          }
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        >
          <option value="neuf">Neuf</option>
          <option value="exposition">Exposition</option>
          <option value="fin-de-serie">Fin de série</option>
          <option value="reconditionne">Reconditionné</option>
          <option value="retour">Retour client</option>
        </select>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "#0070f3",
            color: "white",
            border: "none",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Enregistrer
        </button>

        <button
          type="button"
          onClick={handleDelete}
          style={{
            padding: "10px 20px",
            background: "red",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Supprimer
        </button>
      </form>
    </div>
  );
}
