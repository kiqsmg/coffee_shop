import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Vitrine estatica da landing (teaser; o menu real vem da API no bloco 3)
const destaques = [
  { nome: "Cappuccino", preco: "R$ 12,00", img: "menu-1.jpeg" },
  { nome: "Expresso", preco: "R$ 8,00", img: "menu-2.jpeg" },
  { nome: "Matcha Latte", preco: "R$ 20,00", img: "menu-3.jpeg" },
  { nome: "Frappuccino", preco: "R$ 20,00", img: "menu-4.jpeg" },
  { nome: "Macchiato", preco: "R$ 18,00", img: "menu-5.jpeg" },
  { nome: "Soda Italiana", preco: "R$ 14,00", img: "menu-6.jpeg" },
];

function Landing() {
  return (
    <div className="overflow-x-hidden bg-mocha text-cream">
      <Navbar />

      {/* ===== HERO (dark) ===== */}
      <section id="home" className="bg-mocha pt-14">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cream/50 sm:text-xs">
            O pretexto perfeito para mais uma xícara
          </p>
          <h1 className="mx-auto mt-4 font-display text-4xl leading-[0.95] text-cream sm:text-6xl lg:text-7xl">
            Estação Café
          </h1>
        </div>

        <div className="mt-10 flex justify-center px-6">
          <div className="relative w-full max-w-3xl">
            <div className="relative overflow-hidden rounded-3xl">
              <img
                src="/img/home-img.jpeg"
                alt="Xícara de café"
                className="h-[300px] w-full object-cover sm:h-[440px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-mocha via-transparent to-transparent" />
            </div>
            {/* selo circular */}
            <a
              href="#menu"
              className="glass absolute right-6 top-6 flex h-20 w-20 items-center justify-center rounded-full text-center leading-tight sm:h-24 sm:w-24"
            >
              <span className="font-body text-[11px] font-bold uppercase tracking-wider text-cream">
                Peça
                <br />
                já ↗
              </span>
            </a>
          </div>
        </div>

        {/* faixa translucida (contida para nao estourar a largura) */}
        <div className="mt-6 overflow-hidden border-y border-cream/10 bg-cream/5 py-3">
          <p className="-rotate-2 select-none truncate font-display text-2xl text-cream/20 sm:text-3xl">
            EXPRESSO ☕ EXPRESSO ☕ EXPRESSO ☕ EXPRESSO ☕ EXPRESSO ☕
          </p>
        </div>
      </section>

      {/* ===== VITRINE (dark, cards liquidglass sobre textura) ===== */}
      <section
        id="menu"
        className="relative bg-cover bg-center bg-no-repeat px-6 py-24"
        style={{ backgroundImage: "url('/img/about-img.jpeg')" }}
      >
        <div className="absolute inset-0 bg-mocha/90" />
        <div className="relative mx-auto max-w-6xl">
          <h2 className="mb-12 text-center font-display text-3xl text-cream sm:text-5xl">
            Nosso Menu
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destaques.map((item) => (
              <div
                key={item.nome}
                className="glass flex flex-col items-center rounded-3xl p-4 text-center transition-transform hover:-translate-y-1"
              >
                <img
                  src={`/img/${item.img}`}
                  alt={item.nome}
                  className="mb-4 h-44 w-full rounded-2xl object-cover"
                />
                <h3 className="font-heading text-xl font-bold text-cream">
                  {item.nome}
                </h3>
                <p className="mt-1 font-mono text-honey">{item.preco}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SOBRE (creme claro) ===== */}
      <section id="sobre" className="bg-paper px-6 py-24 text-espresso">
        <div className="mx-auto max-w-5xl rounded-3xl border border-espresso/10 bg-white/50 p-8 sm:p-14">
          <h2 className="font-display text-3xl leading-tight sm:text-5xl">
            Sobre Nós
          </h2>
          <p className="mt-6 max-w-2xl font-body text-base text-espresso/80 sm:text-lg">
            Nossa história nasceu do desejo de criar um espaço acolhedor, onde o
            café é mais que uma bebida: é uma experiência. Tradição e modernidade
            se encontram, trazendo aromas que despertam memórias e inspiram novas
            conexões.
          </p>
          <button className="btn-coffee mt-8">Saiba mais</button>
        </div>
      </section>

      {/* ===== ENDEREÇO (creme claro, vidro sobre foto) ===== */}
      <section id="endereco" className="bg-paper px-6 pb-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl">
          <img
            src="/img/about-img.jpeg"
            alt="Nossa cafeteria"
            className="h-[360px] w-full object-cover sm:h-[420px]"
          />
          <div className="glass-light absolute inset-x-4 top-4 rounded-2xl px-4 py-3 text-center sm:px-6">
            <p className="font-mono text-xs text-espresso sm:text-sm">
              Seg–Sex: 7h–22h · Fim de semana: 8h–23h
            </p>
          </div>
          <div className="glass-light absolute inset-x-4 bottom-4 rounded-2xl px-4 py-4 sm:px-6">
            <p className="font-display text-base text-espresso sm:text-lg">
              Onde nos encontrar
            </p>
            <p className="mt-1 font-body text-sm text-espresso/80 sm:text-base">
              Rua das Pausas, 123 — Florianópolis, SC
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Landing;
