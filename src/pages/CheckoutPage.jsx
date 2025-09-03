/**
 * @file CheckoutPage.jsx
 * @description Gère la page de paiement simulée.
 * Ce composant récupère l'ID de la réservation (`rid`) depuis l'URL,
 * affiche un résumé du panier via le CartContext, et un appel API
 * pour le paiement. Il gère les états de chargement (`busy`) et d'erreur.
 * Après un "paiement" réussi, il sauvegarde les informations du billet en
 * sessionStorage et redirige l'utilisateur vers la page du billet.
 */

// --- Imports de React & Hooks ---
import { useEffect, useState } from "react";

// --- Hooks de Bibliothèques Externes (Routing) ---
import { useLocation, useNavigate, Link } from "react-router-dom";

// --- Services & Contexte de l'Application ---
import { checkout } from "../services/api";
import { useCart } from "../cart/CartContext.jsx";


export default function CheckoutPage() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const rid = new URLSearchParams(search).get("rid");

  const { items, getTotalItems, getTotalPrice } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!rid) setError("Réservation introuvable (paramètre 'rid' manquant).");
  }, [rid]);

  const onPay = async () => {
    setError("");
    if (!rid) return;
    try {
      setBusy(true);

      // Appel API réel
      const res = await checkout(Number(rid)); // => { status:"paid", ticket:{...} }
      if (!res?.status || res.status !== "paid" || !res?.ticket?.id) {
        throw new Error(res?.detail || "Paiement refusé.");
      }

      const t = res.ticket;
      sessionStorage.setItem(
        "LAST_TICKET",
        JSON.stringify({
          id: t.id,
          reservation_id: t.reservation_id,
          qr_url: t.qr_url,
          summary: {
            items,
            places: getTotalItems(),
            total: getTotalPrice(),
          },
        })
      );

      // Redirection vers la page billet
      navigate(`/billet/${t.id}`);
    } catch (e) {
      const msg =
        e?.payload?.detail ||
        (Array.isArray(e?.payload) ? e.payload.join(", ") : null) ||
        (e?.payload && typeof e.payload === "object"
          ? Object.values(e.payload).flat().join(", ")
          : null) ||
        e?.message ||
        "Erreur de paiement.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-3">Paiement</h2>
      <p>Étape de paiement de votre réservation.</p>

      {!rid && <div className="alert alert-danger">{error}</div>}

      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">Résumé de votre commande</h5>
          <p className="mb-1">Places : {getTotalItems()}</p>
          <p className="mb-0">Total : {getTotalPrice().toFixed(2)} €</p>
        </div>
      </div>

      {error && rid && <div className="alert alert-danger">{error}</div>}

      <div className="d-flex gap-2">
        <Link className="btn btn-outline-secondary d-inline-flex align-items-center" to="/panier">
          Retour au panier
        </Link>
        <button
          type="button"
          className="btn-custom ms-auto"
          onClick={onPay}
          disabled={!rid || busy || items.length === 0}
          aria-disabled={!rid || busy || items.length === 0}
        >
          {busy ? "Traitement…" : "Payer maintenant"}
        </button>
      </div>
    </div>
  );
}