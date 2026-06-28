import React, { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
  });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    setSaving(true);
    const payload = { name: form.name, email: form.email };
    if (form.password) payload.password = form.password;
    try {
      const { data } = await api.put(`/users/${user._id}`, payload);
      // Atualiza a sessao (nome/email no navbar) mantendo o token atual
      login(data, localStorage.getItem("token"));
      setForm({ ...form, password: "" });
      setMsg("Cadastro atualizado com sucesso.");
    } catch (err) {
      setError(err.response?.data?.message || "Não foi possível atualizar.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "rounded-xl border border-cream/15 bg-mocha-soft px-4 py-3 font-body text-cream placeholder-cream/40 focus:border-honey focus:outline-none";

  return (
    <div className="min-h-screen bg-mocha text-cream">
      <Navbar />
      <main className="mx-auto max-w-md px-6 py-16">
        <h1 className="mb-2 font-display text-4xl text-cream sm:text-5xl">
          Meu cadastro
        </h1>
        <p className="mb-8 font-body text-cream/60">
          Atualize seus dados quando quiser.
        </p>

        <form onSubmit={submit} className="glass flex flex-col gap-4 rounded-3xl p-8">
          <label className="font-body text-sm text-cream/70">
            Nome
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              required
              className={`mt-1 w-full ${inputClass}`}
            />
          </label>
          <label className="font-body text-sm text-cream/70">
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
              className={`mt-1 w-full ${inputClass}`}
            />
          </label>
          <label className="font-body text-sm text-cream/70">
            Nova senha
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              placeholder="deixe em branco para manter"
              className={`mt-1 w-full ${inputClass}`}
            />
          </label>

          {msg && <p className="font-body text-sm text-honey">{msg}</p>}
          {error && <p className="font-body text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="btn-primary mt-2 w-full disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default Profile;
