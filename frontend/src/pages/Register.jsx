import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // register ja devolve o token; loga e manda pro menu
      const { data } = await api.post("/auth/register", form);
      const { token, ...user } = data;
      login(user, token);
      navigate("/menu");
    } catch (err) {
      setError(err.response?.data?.message || "Não foi possível cadastrar.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "rounded-xl border border-cream/15 bg-mocha-soft px-4 py-3 font-body text-cream placeholder-cream/40 focus:border-honey focus:outline-none";

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
          <h1 className="mt-4 font-display text-3xl text-cream">☕ Criar conta</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            type="text"
            placeholder="Seu nome"
            required
            className={inputClass}
          />
          <input
            name="email"
            value={form.email}
            onChange={onChange}
            type="email"
            placeholder="Email"
            required
            className={inputClass}
          />
          <div className="relative">
            <input
              name="password"
              value={form.password}
              onChange={onChange}
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              required
              className={`${inputClass} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/60 hover:text-honey"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {error && <p className="font-body text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-2 w-full disabled:opacity-60"
          >
            {loading ? "Aguarde..." : "Cadastrar"}
          </button>

          <p className="text-center font-body text-sm text-cream/60">
            Já tem conta?{" "}
            <Link to="/login" className="text-honey hover:underline">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
