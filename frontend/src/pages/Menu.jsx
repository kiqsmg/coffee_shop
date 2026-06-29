import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import api from "../services/api";

function Menu() {
  const [products, setProducts] = useState([]);
  const [pendingIds, setPendingIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Produtos + chamados pendentes do proprio cliente, em paralelo.
    // Os pendentes mantem o botao "Atendente a caminho" mesmo apos navegar.
    Promise.all([api.get("/products"), api.get("/requests/mine")])
      .then(([prods, mine]) => {
        setProducts(prods.data);
        setPendingIds(new Set(mine.data.map((r) => r.product)));
      })
      .catch(() => setError("Não foi possível carregar o menu."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-mocha text-cream">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="mb-12 text-center font-display text-4xl text-cream sm:text-5xl">
          Nosso Menu
        </h1>

        {loading && (
          <p className="text-center font-body text-cream/60">Carregando...</p>
        )}
        {error && (
          <p className="text-center font-body text-red-400">{error}</p>
        )}
        {!loading && !error && products.length === 0 && (
          <p className="text-center font-body text-cream/60">
            Nenhum produto disponível ainda.
          </p>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              alreadyRequested={pendingIds.has(p._id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Menu;
