import React from "react";
import "../App.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaArrowRight } from "react-icons/fa";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      <main className="pt-24 leading-7">
        {/* Hero Section com vídeo de fundo */}
        <section className="relative h-[60vh] md:h-[85vh] bg-[#1a1a1a] overflow-hidden">
          <div className="absolute inset-0 z-10">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/about_video.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/80 via-black/60 to-black/70"></div>

          <div className="relative z-30 container mx-auto px-4 text-center text-white h-full flex flex-col justify-center">
            <h1 className="font-heading text-xl sm:text-2xl md:text-5xl font-bold mb-4 md:mb-8 tracking-wider">
              SOBRE NÓS
            </h1>
            <div className="hidden md:block font-body text-lg leading-relaxed mb-8 opacity-90 max-w-4xl mx-auto">
              <p className="mb-4">
                A Estação Café nasceu do desejo de criar um espaço acolhedor,
                onde cada xícara é mais que uma bebida: é uma experiência.
              </p>
              <p>
                Nosso propósito é oferecer momentos de pausa, conexão e sabor,
                trazendo cafés selecionados e preparados com carinho.
              </p>
              <p className="mt-4">
                Aqui, tradição e modernidade se encontram para despertar memórias
                e inspirar novas histórias.
              </p>
            </div>
            <div className="md:hidden font-body text-sm leading-relaxed mb-6 opacity-90 max-w-2xl mx-auto">
              <p className="mb-3">
                A Estação Café nasceu do desejo de criar um espaço acolhedor,
                onde cada xícara é mais que uma bebida: é uma experiência.
              </p>
              <p>Tradição e modernidade se encontram em cada preparo.</p>
            </div>
            <a
              href="/menu"
              className="inline-flex items-center font-body text-white hover:text-gray-300 transition-all duration-300 group text-xs sm:text-sm md:text-base"
            >
              CONHEÇA NOSSO MENU
              <FaArrowRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
        </section>

        {/* Seção com imagem e texto */}
        <section className="py-8 md:py-20 bg-dark text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-16 items-center">
              <div>
                <img
                  src="/about_texto.png"
                  alt="image coffe"
                  className="w-full h-48 sm:h-64 md:h-96 lg:h-[500px] object-cover grayscale"
                />
              </div>
              <div>
                <h2 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-8 tracking-wider">
                  NOSSA ESSÊNCIA
                </h2>
                <div className="font-body text-sm sm:text-base md:text-lg leading-relaxed space-y-3 md:space-y-6">
                  <p>
                    Cada detalhe da Estação Café foi pensado para proporcionar
                    acolhimento e qualidade. Visitamos produtores, conhecemos
                    histórias e selecionamos grãos com personalidade.
                  </p>
                  <p>
                    Mais do que técnica, buscamos cafés que transmitam conexão —
                    com a terra, com as pessoas e com o momento presente.
                  </p>
                  <p>
                    Porque acreditamos que café é sobre pausa, inspiração e
                    encontros que ficam na memória.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Imagem de fundo */}
        <section className="w-full">
          <div className="relative h-48 sm:h-64 md:h-96 lg:h-[500px] overflow-hidden">
            <img
              src="/trem_about.png"
              alt="cafe com graos"
              className="w-full h-full object-cover grayscale"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
