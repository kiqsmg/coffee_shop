import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaSearch, FaShoppingBag } from "react-icons/fa";

function Navbar() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <header className="navbar bg-dark text-white py-4 px-6 flex items-center justify-between">
      {/* Logo */}
      <div className="logo">
        <h1 className="font-heading text-xl lg:text-2xl font-bold tracking-wider">
          ESTAÇÃO CAFÉ
        </h1>
      </div>

      {/* Links centralizados */}
      <nav className="nav-links flex-1 flex justify-center space-x-12 font-body">
        <Link to="/menu" className="hover:text-gray-300 transition-colors">
          MENU
        </Link>
        <Link to="/about" className="hover:text-gray-300 transition-colors">
          SOBRE NÓS
        </Link>
      </nav>

      {/* Ícones */}
      <div className="nav-icons flex items-center space-x-4">
        <button className="hover:text-gray-300 transition-colors">
          <FaSearch />
        </button>
        <Link to="/login" className="hover:text-gray-300 transition-colors">
          <FaUser />
        </Link>
        <Link
          to="/register"
          className="hover:text-gray-300 transition-colors relative"
        >
          <FaShoppingBag />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-mono">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
