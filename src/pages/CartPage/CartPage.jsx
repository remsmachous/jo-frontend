/**
 * @file CartPage.jsx
 * @description Affiche le contenu détaillé du panier de l'utilisateur.
 * Permet de modifier les quantités, de supprimer des articles et de valider la commande.
 * Ce composant consomme le CartContext pour obtenir les données et les actions du panier.
 * @returns {JSX.Element} Le composant de la page du panier.
 */


// --- Imports de React ---
import React from "react";

// --- Hooks de Bibliothèques Externes (Routing) ---
import { useNavigate } from "react-router-dom";

// --- Contexte & Hooks Personnalisés de l'Application ---
import { useCart } from "../../cart/CartContext.jsx";

// --- Styles ---
import './CartPage.css';


export default function CartPage() {
  const { items, increment, decrement, setQty, remove, getTotalPrice } = useCart();
  const navigate = useNavigate();

  const handleQtyInput = (id, e) => {
    const raw = e.target.value;
    if (raw === "") return setQty(id, 0);
    const parsed = parseInt(raw, 10);
    if (!Number.isNaN(parsed)) setQty(id, parsed);
  };

  const handleQtyBlur = (id, e) => {
    const parsed = parseInt(e.target.value, 10);
    if (Number.isNaN(parsed) || parsed < 1) setQty(id, 1);
  };

  if (items.length === 0) {
    return (
      <div className="container py-4 text-center">
        <h2 className="mb-3">Votre panier est vide</h2>
        <p className="text-muted">Il est temps de commencer votre aventure olympique !</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Votre panier</h2>

      <div className="panier-grid">

        <div className="panier-header panier-item">
          <div>Offre</div>
          <div className="text-end">Prix unitaire</div>
          <div className="text-center">Quantité</div>
          <div className="text-end">Sous-total</div>
          <div></div>
        </div>

        {items.map(item => (
          <div key={item.id} className="panier-item">
            <div data-label="Offre">{item.titre}</div>
            <div data-label="Prix unitaire" className="text-end">{item.prix.toFixed(2)} €</div>
            <div data-label="Quantité" className="text-center">
              <div className="d-inline-flex align-items-center">
                <button
                  className="btn-sm btn-custom-cart"
                  onClick={() => decrement(item.id)}
                  aria-label={`Diminuer la quantité pour ${item.titre}`}
                >−</button>
                <input
                  className="form-control-sm mx-2 text-center quantite-input" 
                  value={item.qty}
                  onChange={(e) => handleQtyInput(item.id, e)}
                  onBlur={(e) => handleQtyBlur(item.id, e)}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  aria-label={`Quantité pour ${item.titre}`}
                />
                <button
                  className="btn-sm btn-custom-cart"
                  onClick={() => increment(item.id)}
                  aria-label={`Augmenter la quantité pour ${item.titre}`}
                >+</button>
              </div>
            </div>
            <div data-label="Sous-total" className="text-end">{(item.qty * item.prix).toFixed(2)} €</div>
            <div className="text-end">
              <button
                className="btn-sm btn-custom-cart"
                onClick={() => remove(item.id)}
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}

        <div className="panier-total">
          <div className="text-end">Total</div>
          <div className="text-end">{getTotalPrice().toFixed(2)} €</div>
        </div>
      </div>

      <div className="text-end mt-4">
        <button
          className="btn-custom"
          onClick={() => navigate("/reservation")}
          disabled={items.length === 0}
        >
          Valider la commande
        </button>
      </div>
    </div>
  );
}