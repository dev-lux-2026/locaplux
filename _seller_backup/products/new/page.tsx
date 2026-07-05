"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [stock, setStock] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [category, setCategory] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [condition, setCondition] = useState("fin-de-serie");

  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== "partner") {
      router.push("/login");
      return;
    }

    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, [session, status, router]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!name || !price || !categoryId) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const selectedCategory = categories.find((c: any) => c._id === categoryId);

    const res = await fetch("/api/products/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        stock,
        images,
        categoryId,
        category: selectedCategory?.name || "",
        categorySlug: selectedCategory?.slug || "",
        condition,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      setError(data.error || "Erreur lors de la création.");
      return;
    }

    router.push("/seller/products");
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
        Ajouter un produit
      </h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
        <label>Nom *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />

        <label>Prix (€) *</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />

        <label>Prix barré (optionnel)</label>
        <input
          type="number"
          value={originalPrice}
          onChange={(e) => setOriginalPrice(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />

        <label>Stock</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />

        <label>Images (URLs séparées par des virgules)</label>
        <input
          type="text"
          value={images.join(",")}
          onChange={(e) =>
            setImages(
              e.target.value
                .split(",")
                .map((i) => i.trim())
                .filter((i) => i.length > 0)
            )
          }
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />

        <label>Catégorie *</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        >
          <option value="">Sélectionner</option>
          {categories.map((c: any) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <label>État</label>
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
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
          }}
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}
