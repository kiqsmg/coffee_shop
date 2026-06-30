import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const formatPrice = (value) =>
  `R$ ${Number(value).toFixed(2).replace(".", ",")}`;

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const labels = {
  idle: "Peça agora",
  sending: "Enviando...",
  sent: "Atendente a caminho ✓",
  error: "Erro — tentar de novo",
};

function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [commentError, setCommentError] = useState("");

  useEffect(() => {
    Promise.all([api.get(`/products/${id}`), api.get("/requests/mine")])
      .then(([prod, mine]) => {
        setProduct(prod.data);
        if (mine.data.some((r) => r.product === id)) setStatus("sent");
      })
      .catch(() => setError("Não foi possível carregar o produto."))
      .finally(() => setLoading(false));

    api
      .get(`/comments/product/${id}`)
      .then((res) => setComments(res.data))
      .catch(() => {})
      .finally(() => setCommentsLoading(false));
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

  const submitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    setCommentError("");
    try {
      const res = await api.post(`/comments/product/${id}`, {
        text: newComment.trim(),
      });
      setComments((prev) => [res.data, ...prev]);
      setNewComment("");
    } catch (err) {
      setCommentError(
        err.response?.data?.message || "Erro ao enviar comentário."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch {
      // silently ignore
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
          <>
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

            {/* Comments section */}
            <section className="mt-10">
              <h2 className="font-display text-2xl text-cream mb-6">
                Comentários
              </h2>

              {/* Add comment form */}
              <form onSubmit={submitComment} className="glass rounded-2xl p-5 mb-6">
                <label className="block font-body text-sm text-cream/70 mb-2">
                  Deixe sua opinião sobre {product.name}
                </label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  maxLength={500}
                  rows={3}
                  placeholder="O que você achou desse produto?"
                  className="w-full rounded-xl bg-mocha-soft/60 border border-cream/10 px-4 py-3 font-body text-sm text-cream placeholder-cream/30 focus:outline-none focus:ring-2 focus:ring-honey/50 resize-none"
                />
                <div className="flex items-center justify-between mt-3">
                  <span className="font-mono text-xs text-cream/30">
                    {newComment.length}/500
                  </span>
                  <button
                    type="submit"
                    disabled={submitting || !newComment.trim()}
                    className="btn-primary px-6 py-2 text-sm disabled:opacity-50"
                  >
                    {submitting ? "Enviando..." : "Comentar"}
                  </button>
                </div>
                {commentError && (
                  <p className="mt-2 font-body text-sm text-red-400">{commentError}</p>
                )}
              </form>

              {/* Comments list */}
              {commentsLoading ? (
                <p className="font-body text-sm text-cream/50 text-center py-6">
                  Carregando comentários...
                </p>
              ) : comments.length === 0 ? (
                <p className="font-body text-sm text-cream/40 text-center py-8">
                  Nenhum comentário ainda. Seja o primeiro a comentar!
                </p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {comments.map((c) => {
                    const isOwn = user?._id === c.user;
                    const isAdmin = user?.role === "admin";
                    return (
                      <li
                        key={c._id}
                        className="glass rounded-2xl px-5 py-4 flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-honey/20 font-display text-sm text-honey uppercase">
                              {c.userName.charAt(0)}
                            </span>
                            <span className="font-body text-sm font-semibold text-cream">
                              {c.userName}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs text-cream/30">
                              {formatDate(c.createdAt)}
                            </span>
                            {(isOwn || isAdmin) && (
                              <button
                                onClick={() => deleteComment(c._id)}
                                className="font-body text-xs text-red-400/60 hover:text-red-400 transition-colors"
                                title="Apagar comentário"
                              >
                                Apagar
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="font-body text-sm text-cream/80 leading-relaxed mt-1 pl-10">
                          {c.text}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default ProductDetail;
