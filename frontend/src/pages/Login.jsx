import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const switchMode = (mode) => {
    setIsLogin(mode);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const url = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };
      const { data } = await api.post(url, payload);
      const { token, ...user } = data; // separa token dos dados do usuario
      login(user, token);
      navigate("/menu");
    } catch (err) {
      setError(
        err.response?.data?.message || "Algo deu errado. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "rounded-xl border border-cream/15 bg-mocha-soft px-4 py-3 font-body text-cream placeholder-cream/40 focus:border-honey focus:outline-none";
  const tabClass = (active) =>
    `flex-1 rounded-full py-2 font-body text-sm font-bold transition-colors ${
      active ? "bg-honey text-mocha" : "text-cream/70"
    }`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-mocha px-6 py-12">
      <div className="glass w-full max-w-md rounded-3xl p-8 sm:p-10">
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="font-body text-sm tracking-wide text-cream/60 transition-colors hover:text-honey"
          >
            ← Voltar para Home
          </Link>
          <h1 className="mt-4 font-display text-3xl text-cream">
            ☕ Estação Café
          </h1>
        </div>

        <div className="mb-6 flex rounded-full border border-cream/15 p-1">
          <button onClick={() => switchMode(true)} className={tabClass(isLogin)}>
            Login
          </button>
          <button
            onClick={() => switchMode(false)}
            className={tabClass(!isLogin)}
          >
            Cadastro
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              type="text"
              placeholder="Seu nome"
              required
              className={inputClass}
            />
          )}
          <input
            name="email"
            value={form.email}
            onChange={onChange}
            type="email"
            placeholder="Email"
            required
            className={inputClass}
          />
          <input
            name="password"
            value={form.password}
            onChange={onChange}
            type="password"
            placeholder="Senha"
            required
            className={inputClass}
          />

          {error && <p className="font-body text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-2 w-full disabled:opacity-60"
          >
            {loading ? "Aguarde..." : isLogin ? "Entrar" : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
