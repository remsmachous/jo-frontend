/**
 * @file PanierResume.jsx
 * @description Affiche un résumé du contenu du panier avec le nombre d'articles et le total.
 * Ce composant est autonome et récupère toutes ses données via le CartContext.
 * @returns {JSX.Element|null} Le composant de résumé du panier, ou null s'il est vide.
 */

// --- Imports de React & Hooks ---
import React from 'react';

// --- Contexte & Hooks Personnalisés de l'Application ---
import { useCart } from "../../cart/CartContext.jsx";

// --- CSS ---
import './PanierResume.css';

export default function PanierResume() {
  const { items, getTotalItems, getTotalPrice } = useCart();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <section className="panier-resume-container container my-4">
      <h2 className="panier-resume-titre">Panier ({totalItems})</h2>
      
      <ul className="list-group mb-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="panier-resume-item list-group-item d-flex justify-content-between align-items-center"
          >
            <span>{item.titre}</span>
            <span className="badge">
              {item.qty ?? 1} x {Number(item.prix).toFixed(2)} €
            </span>
          </li>
        ))}
      </ul>

      <div className="panier-resume-total text-end fw-bold">
        Total : {totalPrice.toFixed(2)} €
      </div>
    </section>
  );
}