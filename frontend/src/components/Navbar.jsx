import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const links = [
  { href: "/menu", label: "MENU", route: true },
  { href: "#sobre", label: "SOBRE", route: false },
  { href: "#endereco", label: "CONTATO", route: false },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  const renderLink = (l, onClick) =>
    l.route ? (
      <Link
        key={l.href}
        to={l.href}
        onClick={onClick}
        className="font-body text-sm tracking-wide text-cream/80 transition-colors hover:text-honey"
      >
        {l.label}
      </Link>
    ) : (
      <a
        key={l.href}
        href={l.href}
        onClick={onClick}
        className="font-body text-sm tracking-wide text-cream/80 transition-colors hover:text-honey"
      >
        {l.label}
      </a>
    );

  return (
    <header className="sticky top-0 z-50 bg-dark/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="font-heading text-lg font-bold tracking-wider text-cream"
        >
          ☕ ESTAÇÃO CAFÉ
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) => renderLink(l))}
          {user?.role === "admin" &&
            renderLink({ href: "/admin", label: "PAINEL", route: true })}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden font-body text-sm text-cream/80 sm:inline">
                Olá, {user.name?.split(" ")[0] || "conta"}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-cream/20 px-4 py-1.5 font-body text-sm text-cream/80 transition-colors hover:border-honey hover:text-honey"
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-cream/80 transition-colors hover:text-honey"
              aria-label="Entrar"
            >
              <FaUser />
            </Link>
          )}
          <button
            className="text-cream/80 transition-colors hover:text-honey md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Abrir menu"
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {open && (
        <nav className="flex flex-col gap-4 border-t border-cream/10 px-6 py-4 md:hidden">
          {links.map((l) => renderLink(l, () => setOpen(false)))}
          {user?.role === "admin" &&
            renderLink({ href: "/admin", label: "PAINEL", route: true }, () =>
              setOpen(false)
            )}
        </nav>
      )}
    </header>
  );
}

export default Navbar;
