import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

const formatPrice = (value) =>
  `R$ ${Number(value).toFixed(2).replace(".", ",")}`;

const labels = {
  idle: "Peça agora",
  sending: "Enviando...",
  sent: "Atendente a caminho ✓",
  error: "Erro — tentar de novo",
};

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  useEffect(() => {
    // produto + chamados pendentes do cliente (pra ja refletir "Atendente a caminho")
    Promise.all([api.get(`/products/${id}`), api.get("/requests/mine")])
      .then(([prod, mine]) => {
        setProduct(prod.data);
        if (mine.data.some((r) => r.product === id)) setStatus("sent");
      })
      .catch(() => setError("Não foi possível carregar o produto."))
      .finally(() => setLoading(false));
  }, [id]);

  const pedir = async () => {
    setStatus("sending");
    try {
      await api.post("/requests", { productId: id });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-mocha text-cream">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <Link
          to="/menu"
          className="font-body text-sm text-cream/60 transition-colors hover:text-honey"
        >
          ← Voltar ao menu
        </Link>

        {loading && (
          <p className="mt-8 text-center font-body text-cream/60">Carregando...</p>
        )}
        {error && (
          <p className="mt-8 text-center font-body text-red-400">{error}</p>
        )}

        {product && (
          <div className="glass mt-6 overflow-hidden rounded-3xl sm:flex">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-64 w-full object-cover sm:h-auto sm:w-1/2"
              />
            ) : (
              <div className="flex h-64 w-full items-center justify-center bg-mocha-soft text-6xl sm:w-1/2">
                ☕
              </div>
            )}
            <div className="flex flex-col gap-3 p-8 sm:w-1/2">
              <span className="font-mono text-xs text-cream/40">{product.code}</span>
              <h1 className="font-display text-3xl text-cream">{product.name}</h1>
              <span className="font-mono text-xl text-honey">
                {formatPrice(product.price)}
              </span>
              {product.category && (
                <span className="font-body text-sm text-cream/60">
                  {product.category}
                </span>
              )}
              {product.ingredients?.length > 0 && (
                <p className="font-body text-cream/70">
                  {product.ingredients.join(", ")}
                </p>
              )}
              <button
                onClick={pedir}
                disabled={status === "sending" || status === "sent"}
                className="btn-primary mt-4 w-full disabled:opacity-60"
              >
                {labels[status]}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProductDetail;
