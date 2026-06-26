import React from "react";
import "../App.css";
import Navbar from "../components/Navbar"; 
import Footer from "../components/Footer"; 

function Landing() {
  return (
    <div className="landing">
      <Navbar />

      <section id="home" className="hero">
        <h1>Estação Café</h1>
        <p>
          Na correria do dia a dia, todo mundo precisa de uma pausa. 
          A Estação Café é o seu ponto de encontro para momentos de sabor, calma e boas conversas. 
          Aqui, cada xícara é preparada com carinho, para que você se sinta em casa.
        </p>
        <button className="cta">Compre já o seu</button>
      </section>

      <section id="sobre" className="sobre">
        <h2>Sobre Nós</h2>
        <p>
          Nossa história nasceu do desejo de criar um espaço acolhedor, 
          onde o café é mais que uma bebida: é uma experiência. 
          A Estação Café é o lugar onde tradição e modernidade se encontram, 
          trazendo aromas que despertam memórias e inspiram novas conexões.
        </p>
        <p>
          Descubra o sabor da pausa perfeita. A Estação Café está pronta para receber você 
          com um sorriso e uma xícara quentinha.
        </p>
        <button className="cta">Saiba Mais</button>
      </section>

      {/* Menu */}
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

      <Footer />
    </div>
  );
}

export default Landing;
