import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="font-heading text-xl lg:text-2xl font-bold mb-4 tracking-wider block"
            >
              ESTAÇÃO CAFÉ
            </Link>
            <p className="font-body text-gray-300">
              Um espaço para pausar e apreciar.
            </p>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-heading text-lg font-bold mb-4 tracking-wider">
              RECEBA NOSSAS NOVIDADES
            </h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Seu email"
                className="flex-1 px-4 py-2 bg-transparent border border-gray-600 text-white placeholder-gray-400 focus:border-white focus:outline-none"
              />
              <button className="btn-primary whitespace-nowrap">ASSINAR</button>
            </div>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="hover:text-gray-300 transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors">
                <FaYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <p className="font-mono text-sm text-gray-400 text-center">
            © 2026 ESTAÇÃO CAFÉ — TODOS OS DIREITOS RESERVADOS. Rua das Pausas,
            123 — Florianópolis, SC
          </p>
        </div>
      </div>
    </footer>
  );
}
