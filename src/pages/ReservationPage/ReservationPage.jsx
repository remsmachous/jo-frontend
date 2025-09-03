/**
 * @file ReservationPage.jsx
 * @description Page de finalisation de la réservation.
 * Ce composant affiche un récapitulatif du panier et un formulaire pour que
 * l'utilisateur saisisse ses informations personnelles. Les champs sont pré-remplis
 * si l'utilisateur est déjà connecté via le AuthContext.
 * Il gère la validation du formulaire, la soumission (simulée) à une API,
 * et les états de chargement/erreur. En cas de succès, il redirige vers la
 * page de paiement avec un ID de réservation.
 */

// --- Imports de React & Hooks ---
import { useEffect, useMemo, useState } from "react";

// --- Hooks de Bibliothèques Externes ---
import { Link, useNavigate } from "react-router-dom";

// --- Services de l'Application ---
import { createReservation } from "../../services/api";

// --- Contexte & Hooks Personnalisés de l'Application ---
import { useCart } from "../../cart/CartContext.jsx";
import { useAuth } from "../../auth/AuthContext.jsx";

// --- CSS ---
import './ReservationPage.css';

export default function ReservationPage() {
  const { items, getTotalItems, getTotalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  // Pré-remplissage basique si ton /api/accounts/me renvoie nom/prenom/email
  const [form, setForm] = useState({
    nom: user?.nom || "",
    prenom: user?.prenom || "",
    email: user?.email || "",
    telephone: "",
    message: "",
  });
  const [errors, setErrors] = useState([]);
  const [busy, setBusy] = useState(false);

  const payload = useMemo(
    () => ({
      client: {
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        email: form.email.trim(),
        telephone: form.telephone.trim() || null,
        message: form.message.trim() || null, // pas utilisé côté backend mais conservé côté front
      },
      panier: items.map(({ id, titre, prix, qty }) => ({
        id,
        titre,
        prix,
        qty,
      })),
      total: Number(totalPrice),
      places: Number(totalItems),
    }),
    [form, items, totalItems, totalPrice]
  );

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const errs = [];
    if (!payload.client.nom) errs.push("Nom requis.");
    if (!payload.client.prenom) errs.push("Prénom requis.");
    if (!/\S+@\S+\.\S+/.test(payload.client.email)) errs.push("Email invalide.");
    if (totalItems < 1) errs.push("Le nombre de places doit être supérieur à 0.");
    return errs;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (errs.length > 0) return;

    try {
      setBusy(true);
      const res = await createReservation(payload); 
      const rid = res?.reservation_id;
      if (!rid) {
        throw new Error("Réservation impossible (réponse invalide).");
      }
      navigate(`/paiement?rid=${encodeURIComponent(rid)}`);
    } catch (err) {
      const apiDetail =
        err?.payload?.detail ||
        (Array.isArray(err?.payload) ? err.payload.join(", ") : null) ||
        (err?.payload && typeof err.payload === "object"
          ? Object.values(err.payload).flat().join(", ")
          : null);
      setErrors([apiDetail || err?.message || "Impossible de finaliser la réservation."]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container py-4 reservation-page-container">
      {/* --- Section Résumé du Panier --- */}
      <section className="reservation-card">
        <h2 className="reservation-section-title">Votre panier</h2>
        {items.length === 0 ? (
          <div className="alert alert-info d-flex justify-content-between align-items-center">
            <span>Votre panier est vide.</span>
            <Link className="btn btn-primary" to="/">Retour à la billetterie</Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle reservation-summary-table">
              <thead>
                <tr>
                  <th>Offre</th>
                  <th className="text-center">Quantité</th>
                  <th className="text-end">Prix unitaire</th>
                  <th className="text-end">Sous‑total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td>{it.titre}</td>
                    <td className="text-center">{it.qty}</td>
                    <td className="text-end">{Number(it.prix).toFixed(2)} €</td>
                    <td className="text-end">{(it.qty * Number(it.prix)).toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan={2}>Total places</th>
                  <th colSpan={2} className="text-end">{totalItems}</th>
                </tr>
                <tr>
                  <th colSpan={2}>Total à payer</th>
                  <th colSpan={2} className="text-end">{totalPrice.toFixed(2)} €</th>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>

      {errors.length > 0 && (
        <div className="alert alert-danger">
          <ul className="mb-0">{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
        </div>
      )}

      {/* --- Section Formulaire --- */}
      <section aria-labelledby="reservation-form-title" className="reservation-card reservation-form">
        <h2 id="reservation-form-title" className="reservation-section-title">Vos informations</h2>

        <form onSubmit={onSubmit} noValidate>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="res-nom" className="form-label">Nom</label>
              <input
                id="res-nom"
                className="form-control"
                name="nom"
                value={form.nom}
                onChange={onChange}
                required
                autoComplete="family-name"
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="res-prenom" className="form-label">Prénom</label>
              <input
                id="res-prenom"
                className="form-control"
                name="prenom"
                value={form.prenom}
                onChange={onChange}
                required
                autoComplete="given-name"
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="res-email" className="form-label">Email</label>
              <input
                id="res-email"
                className="form-control"
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                required
                autoComplete="email"
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="res-tel" className="form-label">Téléphone (optionnel)</label>
              <input
                id="res-tel"
                className="form-control"
                type="tel"
                name="telephone"
                value={form.telephone}
                onChange={onChange}
                placeholder="+33 ..."
                autoComplete="tel"
              />
            </div>

            <div className="col-12">
              <label htmlFor="res-message" className="form-label">Message (optionnel)</label>
              <textarea
                id="res-message"
                className="form-control"
                name="message"
                rows={3}
                value={form.message}
                onChange={onChange}
                placeholder="Précisions, demandes particulières…"
              />
            </div>

            <div className="col-12">
              <label htmlFor="res-places" className="form-label">Nombre de places</label>
              <input
                id="res-places"
                className="form-control"
                value={totalItems}
                readOnly
                aria-describedby="placesHelp"
              />
              <div id="placesHelp" className="form-text">
                Déterminé automatiquement à partir de votre panier.
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <Link className="btn btn-outline-secondary" to="/panier">
              Retour au panier
            </Link>
            <button
              className="btn btn-custom"
              type="submit"
              disabled={busy || items.length === 0}
            >
              {busy ? "Envoi en cours…" : "Valider le Panier"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
