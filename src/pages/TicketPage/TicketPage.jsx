/**
 * @file TicketPage.jsx
 * @description Affiche le e-billet final pour l'utilisateur après un paiement réussi.
 * Ce composant récupère les informations du billet depuis le `sessionStorage` en se
 * basant sur l'ID dans l'URL. Il génère un QR code à partir d'un token,
 * permet son téléchargement, et affiche un résumé de la commande.
 * Si les données du billet sont invalides ou absentes, il redirige l'utilisateur
 * vers la page d'accueil et vide le panier.
 */

// --- Imports de React & Hooks ---
import { useEffect, useRef, useState } from "react";

// --- Hooks de Bibliothèques Externes ---
import { useParams, Link, useNavigate } from "react-router-dom";

// --- API --- 
import { getTicket } from "../../services/api"; 

// --- Contexte & Hooks Personnalisés de l'Application ---
import { useCart } from "../../cart/CartContext.jsx";

// --- CSS ---
import './TicketPage.css';

export default function TicketPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clear } = useCart();

  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      if (!id) {
        navigate("/", { replace: true });
        return;
      }

      // 1) Essayer le snapshot déposé par CheckoutPage
      try {
        const raw = sessionStorage.getItem("LAST_TICKET");
        const snap = raw ? JSON.parse(raw) : null;

        if (snap && String(snap.id) === String(id)) {
          setTicket(snap);
          clear(); // panier vidé après succès
          return;
        }
      } catch {
        // ignore, on tentera l’API
      }

      // 2) Fallback API réelle
      try {
        const apiData = await getTicket(id); // { id, reservation_id, qr_url, created_at }
        if (!apiData?.id) throw new Error("Ticket introuvable.");
        // On construit un objet minimal pour l’affichage
        const minimal = {
          id: apiData.id,
          reservation_id: apiData.reservation_id,
          qr_url: apiData.qr_url,
          summary: null, // on n’a pas le détail du panier via /tickets/:id
        };
        setTicket(minimal);
        clear();
      } catch (e) {
        setError(
          e?.payload?.detail ||
            e?.message ||
            "Impossible de charger ce billet."
        );
        // Redirection douce après 2 secondes
        setTimeout(() => navigate("/", { replace: true }), 2000);
      }
    }

    load();
  }, [id, navigate, clear]);

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">{error}</div>
        <p>Redirection en cours…</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status" />
        <p className="mt-3 mb-0">Chargement du billet…</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="text-center mb-3">Votre e‑billet</h1>
      <p className="text-center mb-4">Présentez ce QR code à l’entrée.</p>

      <div className="ticket-container">
        {/* --- Section QR --- */}
        <div className="text-center">
          {ticket.qr_url ? (
            <>
              <img
                src={ticket.qr_url}
                alt={`QR code du billet ${ticket.id}`}
                width={240}
                height={240}
                className="qr-image"
              />
              <div className="mt-3">
                <a
                  className="btn btn-outline-secondary btn-sm"
                  href={ticket.qr_url}
                  download={`ticket-${ticket.id}.png`}
                >
                  Télécharger le QR Code
                </a>
              </div>
            </>
          ) : (
            <div className="alert alert-warning">
              QR non disponible pour ce billet.
            </div>
          )}
        </div>

        {/* --- Section Détails --- */}
        <div className="ticket-card">
          <div className="ticket-details">
            <h5 className="card-title">Détails du billet</h5>
            <p className="mb-1">
              <strong>N° billet :</strong> {ticket.id}
            </p>
            <p className="mb-1">
              <strong>N° réservation :</strong> {ticket.reservation_id}
            </p>
            <hr />
            {ticket.summary ? (
              <>
                <p className="mb-1">
                  <strong>Nombre de places :</strong> {ticket.summary.places}
                </p>
                <p className="mb-0">
                  <strong>Total payé :</strong>{" "}
                  {Number(ticket.summary.total).toFixed(2)} €
                </p>
              </>
            ) : (
              <p className="mb-0 text-muted">
                Détails du panier non disponibles (chargé via API). {/* Option : recharger depuis la réservation */}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center gap-3 mt-5">
        <Link className="btn btn-outline-secondary" to="/">
          Retour à l’accueil
        </Link>
        <Link className="btn btn-custom" to="/">
          Acheter d’autres billets
        </Link>
      </div>
    </div>
  );
}