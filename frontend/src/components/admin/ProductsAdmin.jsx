import React, { useCallback, useEffect, useState } from "react";
import api from "../../services/api";

const EMPTY = {
  code: "",
  name: "",
  price: "",
  category: "",
  imageUrl: "",
  ingredients: "",
};

const inputClass =
  "rounded-xl border border-cream/15 bg-mocha-soft px-4 py-2.5 font-body text-cream placeholder-cream/40 focus:border-honey focus:outline-none";

const formatPrice = (v) => `R$ ${Number(v).toFixed(2).replace(".", ",")}`;

function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .catch(() => setError("Não foi possível carregar os produtos."));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const reset = () => {
    setForm(EMPTY);
    setEditingId(null);
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      code: form.code,
      name: form.name,
      price: Number(form.price),
      category: form.category || undefined,
      imageUrl: form.imageUrl || undefined,
      ingredients: form.ingredients
        ? form.ingredients.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    };
    try {
      if (editingId) await api.put(`/products/${editingId}`, payload);
      else await api.post("/products", payload);
      reset();
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Não foi possível salvar.");
    }
  };

  const edit = (p) => {
    setEditingId(p._id);
    setError("");
    setForm({
      code: p.code,
      name: p.name,
      price: p.price,
      category: p.category || "",
      imageUrl: p.imageUrl || "",
      ingredients: (p.ingredients || []).join(", "),
    });
  };

  const remove = async (id) => {
    if (!window.confirm("Excluir este produto?")) return;
    await api.delete(`/products/${id}`);
    if (editingId === id) reset();
    load();
  };

  return (
    <div>
      {/* Formulario de criar/editar */}
      <form
        onSubmit={submit}
        className="glass mb-10 grid grid-cols-1 gap-3 rounded-2xl p-6 sm:grid-cols-2"
      >
        <h2 className="font-heading text-xl font-bold text-cream sm:col-span-2">
          {editingId ? "Editar produto" : "Novo produto"}
        </h2>
        <input name="code" value={form.code} onChange={onChange} placeholder="Código (ex.: CAFE01)" required className={inputClass} />
        <input name="name" value={form.name} onChange={onChange} placeholder="Nome" required className={inputClass} />
        <input name="price" value={form.price} onChange={onChange} type="number" step="0.01" min="0" placeholder="Preço" required className={inputClass} />
        <input name="category" value={form.category} onChange={onChange} placeholder="Categoria (opcional)" className={inputClass} />
        <input name="imageUrl" value={form.imageUrl} onChange={onChange} placeholder="URL da imagem (opcional)" className={`${inputClass} sm:col-span-2`} />
        <input name="ingredients" value={form.ingredients} onChange={onChange} placeholder="Ingredientes separados por vírgula" className={`${inputClass} sm:col-span-2`} />

        {error && <p className="font-body text-sm text-red-400 sm:col-span-2">{error}</p>}

        <div className="flex gap-3 sm:col-span-2">
          <button type="submit" className="btn-primary">
            {editingId ? "Salvar alterações" : "Adicionar produto"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-cream/20 px-5 py-2 font-body text-sm text-cream/80 hover:border-honey hover:text-honey"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Lista de produtos */}
      <h2 className="mb-4 font-heading text-xl font-bold text-honey">
        Produtos ({products.length})
      </h2>
      {products.length === 0 ? (
        <p className="font-body text-cream/50">Nenhum produto cadastrado.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {products.map((p) => (
            <li
              key={p._id}
              className="glass flex items-center justify-between gap-4 rounded-2xl px-5 py-4"
            >
              <span className="font-body">
                <strong>{p.name}</strong>{" "}
                <span className="text-honey">{formatPrice(p.price)}</span>{" "}
                <span className="text-cream/40">({p.code})</span>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => edit(p)}
                  className="rounded-full border border-cream/20 px-4 py-1.5 font-body text-sm text-cream/80 hover:border-honey hover:text-honey"
                >
                  Editar
                </button>
                <button
                  onClick={() => remove(p._id)}
                  className="rounded-full border border-red-400/40 px-4 py-1.5 font-body text-sm text-red-400 hover:bg-red-400/10"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProductsAdmin;
