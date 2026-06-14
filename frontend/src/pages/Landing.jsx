import React from "react";
import "../App.css";

function Landing() {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">Estação de Café</div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#sobre">Sobre</a></li>
          <li><a href="#menu">Menu</a></li>
          <li><a href="#endereco">Endereço</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <h1>Estação de Café</h1>
        <p>
          Na correria do dia a dia, todo mundo precisa de uma pausa. 
          A Estação de Café é o seu ponto de encontro para momentos de sabor, calma e boas conversas. 
          Aqui, cada xícara é preparada com carinho, para que você se sinta em casa.
        </p>
        <button className="cta">Compre já o seu</button>
      </section>

      {/* Sobre Nós */}
      <section id="sobre" className="sobre">
        <h2>Sobre Nós</h2>
        <p>
          Nossa história nasceu do desejo de criar um espaço acolhedor, 
          onde o café é mais que uma bebida: é uma experiência. 
          A Estação de Café é o lugar onde tradição e modernidade se encontram, 
          trazendo aromas que despertam memórias e inspiram novas conexões.
        </p>
        <p>
          Descubra o sabor da pausa perfeita. A Estação de Café está pronta para receber você 
          com um sorriso e uma xícara quentinha.
        </p>
        <button className="cta">Saiba Mais</button>
      </section>

      <section id="menu" className="menu">
        <h2>Nosso Menu</h2>
        <ul>
          <li><strong>Cappuccino</strong> - R$ 12,00</li>
          <li><strong>Expresso</strong> - R$ 8,00</li>
          <li><strong>Matcha Latte</strong> - R$ 20,00</li>
          <li><strong>Frappuccino</strong> - R$ 20,00</li>
          <li><strong>Macchiato</strong> - R$ 18,00</li>
          <li><strong>Soda Italiana</strong> - R$ 14,00</li>
        </ul>
      </section>

      {/* Endereço */}
      <section id="endereco" className="endereco">
        <h2>Endereço</h2>
        <p>Rua das Pausas, 123 - Florianópolis, SC</p>
      </section>

      {/* Footer */}
      <footer>
        <p>© 2026 Estação de Café - Todos os direitos reservados</p>
      </footer>
    </div>
  );
}

export default Landing;
