import React from "react";

// Formata o preco para o padrao brasileiro (R$ 12,00)
const formatPrice = (value) =>
  `R$ ${Number(value).toFixed(2).replace(".", ",")}`;

function ProductCard({ product }) {
  return (
    <div className="glass flex flex-col rounded-3xl p-4 transition-transform hover:-translate-y-1">
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="mb-4 h-44 w-full rounded-2xl object-cover"
        />
      ) : (
        <div className="mb-4 flex h-44 w-full items-center justify-center rounded-2xl bg-mocha-soft text-4xl">
          ☕
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <h3 className="font-heading text-xl font-bold text-cream">
          {product.name}
        </h3>
        <span className="whitespace-nowrap font-mono text-honey">
          {formatPrice(product.price)}
        </span>
      </div>

      {product.ingredients?.length > 0 && (
        <p className="mt-1 font-body text-sm text-cream/60">
          {product.ingredients.join(", ")}
        </p>
      )}
    </div>
  );
}

export default ProductCard;
