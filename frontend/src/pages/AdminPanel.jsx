import React, { useState } from "react";
import Navbar from "../components/Navbar";
import ProductsAdmin from "../components/admin/ProductsAdmin";
import RequestsAdmin from "../components/admin/RequestsAdmin";

function AdminPanel() {
  const [tab, setTab] = useState("produtos");

  const tabClass = (t) =>
    `rounded-full px-5 py-2 font-body text-sm font-bold transition-colors ${
      tab === t ? "bg-honey text-mocha" : "text-cream/70 hover:text-honey"
    }`;

  return (
    <div className="min-h-screen bg-mocha text-cream">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="font-display text-4xl text-cream sm:text-5xl">
          Painel do Admin
        </h1>

        <div className="my-8 flex gap-2">
          <button onClick={() => setTab("produtos")} className={tabClass("produtos")}>
            Produtos
          </button>
          <button onClick={() => setTab("chamados")} className={tabClass("chamados")}>
            Chamados
          </button>
        </div>

        {tab === "produtos" ? <ProductsAdmin /> : <RequestsAdmin />}
      </main>
    </div>
  );
}

export default AdminPanel;
