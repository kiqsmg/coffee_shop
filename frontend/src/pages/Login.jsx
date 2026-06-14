import React, { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="login-container">
      {/* Logo e link para voltar */}
      <header className="login-header">
        <h1>☕ Estação de Café</h1>
        <Link to="/">Voltar para Home</Link>
      </header>

      {/* Alternar entre Login e Cadastro */}
      <div className="login-toggle">
        <button onClick={() => setIsLogin(true)} className={isLogin ? "active" : ""}>
          Login
        </button>
        <button onClick={() => setIsLogin(false)} className={!isLogin ? "active" : ""}>
          Cadastro
        </button>
      </div>

      {/* Formulário */}
      {isLogin ? (
        <form className="login-form">
          <h2>Entrar</h2>
          <label>Email</label>
          <input type="email" placeholder="Digite seu email" required />
          <label>Senha</label>
          <input type="password" placeholder="Digite sua senha" required />
          <button type="submit">Login</button>
        </form>
      ) : (
        <form className="register-form">
          <h2>Cadastrar</h2>
          <label>Nome</label>
          <input type="text" placeholder="Digite seu nome" required />
          <label>Email</label>
          <input type="email" placeholder="Digite seu email" required />
          <label>Senha</label>
          <input type="password" placeholder="Crie uma senha" required />
          <button type="submit">Cadastrar</button>
        </form>
      )}
    </div>
  );
}

export default Login;
