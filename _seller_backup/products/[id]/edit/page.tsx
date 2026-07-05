"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [condition, setCondition] = useState("fin-de-serie");
  const [status, setStatus] = useState("active");

  useEffect(() => {
    async function loadProduct() {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();

      setProduct(data);
      setName(data.name);
      setDescription(data.description);
      setPrice(data.price);
      setOriginalPrice(data.originalPrice || "");
      setStock(data.stock);
      setImages(data.images || []);
      setCategory(data.category);
      setCategorySlug(data.categorySlug);
      setCategoryId(data.categoryId);
      setCondition(data.condition);
      setStatus(data.status);

      setLoading(false);
    }

    loadProduct();
  }, [id]);

  async function updateProduct() {
    const res = await fetch("/api/products/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: id,
        name,
        description,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        stock: Number(stock),
        images,
        category,
        categorySlug,
        categoryId,
        condition,
        status,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Produit mis à jour !");
      router.push("/seller/products");
    } else {
      alert("Erreur lors de la mise à jour.");
    }
  }

  if (loading) return <p>Chargement...</p>;

  return (
    <div style={{ maxWidth: 900, margin: "50px auto" }}>
      <h1>Modifier le produit</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <input
          type="text"
          placeholder="Nom du produit"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: 10, border: "1px solid #ccc" }}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: 10, border: "1px solid #ccc", minHeight: 120 }}
        />

        <input
          type="number"
          placeholder="Prix"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ padding: 10, border: "1px solid #ccc" }}
        />

        <input
          type="number"
          placeholder="Prix original (optionnel)"
          value={originalPrice}
          onChange={(e) => setOriginalPrice(e.target.value)}
          style={{ padding: 10, border: "1px solid #ccc" }}
        />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          style={{ padding: 10, border: "1px solid #ccc" }}
        />

        <input
          type="text"
          placeholder="Catégorie"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: 10, border: "1px solid #ccc" }}
        />

        <input
          type="text"
          placeholder="Slug catégorie"
          value={categorySlug}
          onChange={(e) => setCategorySlug(e.target.value)}
          style={{ padding: 10, border: "1px solid #ccc" }}
        />

        <input
          type="text"
          placeholder="ID catégorie"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          style={{ padding: 10, border: "1px solid #ccc" }}
        />

        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          style={{ padding: 10, border: "1px solid #ccc" }}
        >
          <option value="neuf">Neuf</option>
          <option value="exposition">Exposition</option>
          <option value="fin-de-serie">Fin de série</option>
          <option value="reconditionne">Reconditionné</option>
          <option value="retour">Retour client</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ padding: 10, border: "1px solid #ccc" }}
        >
          <option value="active">Actif</option>
          <option value="vendu">Vendu</option>
          <option value="masque">Masqué</option>
        </select>

        <button
          onClick={updateProduct}
          style={{
            padding: "12px 20px",
            background: "black",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: 6,
            marginTop: 20,
          }}
        >
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}
