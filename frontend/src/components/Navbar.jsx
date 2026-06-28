import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaSearch, FaShoppingBag, FaBars } from "react-icons/fa";

function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerBgClass = isScrolled
    ? "bg-black/80 backdrop-blur-xl text-white"
    : "bg-black/20 backdrop-blur-xl text-white";

  return (
    <header
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${headerBgClass}`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/landing"
          className="font-heading text-lg sm:text-xl lg:text-2xl font-bold tracking-wider hover:scale-110 transition-all duration-300"
        >
          ESTAÇÃO CAFÉ
        </Link>

        {/* Links desktop */}
        <nav className="hidden md:flex items-center space-x-8 font-body">
          <Link to="/menu" className="hover:scale-110 transition-transform">
            MENU
          </Link>
          <Link to="/about" className="hover:scale-110 transition-transform">
            SOBRE NÓS
          </Link>
        </nav>

        {/* Ícones */}
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-white/10 rounded-full transition-all">
            <FaSearch />
          </button>
          <Link to="/login" className="p-2 hover:bg-white/10 rounded-full">
            <FaUser />
          </Link>
          <Link
            to="/register"
            className="p-2 hover:bg-white/10 rounded-full relative"
          >
            <FaShoppingBag />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-mono animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded-full"
          >
            <FaBars />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-black text-white p-4 space-y-4">
          <Link to="/menu">MENU</Link>
          <Link to="/about">SOBRE NÓS</Link>
        </div>
      )}
    </header>
  );
}

export default Navbar;
