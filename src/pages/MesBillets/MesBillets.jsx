/**
 * @file MesBillets.jsx
 * @description Page qui affiche la liste des billets achetés par l'utilisateur connecté.
 * Récupère les billets via un appel à une API authentifiée.
 * Gère les états de chargement, d'utilisateur non connecté, et de panier vide.
 */

// --- Imports de React & Hooks ---
import { useEffect, useState } from "react";

// --- Hooks de Bibliothèques Externes (Routing) ---
import { Link } from "react-router-dom";

// --- Contexte & Hooks Personnalisés de l'Application ---
import { useAuth } from "../../auth/AuthContext.jsx";
import { getAccessToken, getMyTickets } from "././services/api";

// --- CSS ---
import './MesBillets.css'

export default function MesBillets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        const token = getAccessToken();
        if (!token) {
          if (alive) {
            setTickets([]);
            setLoading(false);
          }
          return;
        }

        const list = await getMyTickets(); // <-- utilise l’API centralisée
        if (!alive) return;
        setTickets(list);
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => { alive = false; };
  }, []);

  if (loading) {
    return (
      <div className="container py-4 text-center">
        <h2 className="section-title">Mes billets</h2>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-4">
        <h2 className="section-title">Mes billets</h2>
        <div className="alert alert-info" role="alert">
          <Link to="/login">Connectez-vous</Link> pour voir vos billets.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 mes-billets-container">
      <h2 className="section-title">Mes billets</h2>

      {tickets.length === 0 ? (
        <div className="alert alert-secondary" role="alert">
          Aucun billet pour le moment. <Link to="/">Acheter des billets</Link>
        </div>
      ) : (
        <div className="row g-4">
          {tickets.map((t) => (
            <div key={t.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 billet-card">
                {t.qr_url ? (
                  <a href={t.qr_url} target="_blank" rel="noreferrer">
                    <img
                      src={t.qr_url}
                      className="card-img-top p-3" 
                      alt={`QR Code pour le billet #${t.id}`}
                      style={{ aspectRatio: '1 / 1', objectFit: 'contain' }}
                    />
                  </a>
                ) : (
                  <div className="card-img-top d-flex align-items-center justify-content-center bg-light" style={{height: 240}}>
                    <span>QR indisponible</span>
                  </div>
                )}
                <div className="card-body">
                  <h5 className="card-title">{t.titre ?? `Billet #${t.id}`}</h5>
                  <p className="card-text small mb-0">
                    Acheté le : {t.created ? new Date(t.created).toLocaleDateString() : "Date inconnue"}
                  </p>
                </div>
                <div className="card-footer">
                  {t.qr_url && (
                    <a className="btn btn-outline-secondary btn-sm w-100" href={t.qr_url} target="_blank" rel="noreferrer">
                      Ouvrir le QR Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}