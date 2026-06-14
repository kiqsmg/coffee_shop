import React from "react";
import { Link } from "react-router-dom";
import { FaUser, FaSearch, FaShoppingBag } from "react-icons/fa";

function Navbar() {
  return (
    <header className="navbar">
      <div className="logo">
        <h1>ESTAÇÃO CAFÉ</h1>
      </div>
      <nav className="nav-links">
        <Link to="/menu">CAFÉS</Link>
        <Link to="/sobre">NOSSA HISTÓRIA</Link>
      </nav>
      <div className="nav-icons">
        <FaSearch />
        <Link to="/login"><FaUser /></Link>
        <FaShoppingBag />
      </div>
    </header>
  );
}

export default Navbar;
