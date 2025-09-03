/**
 * @file RegisterPage.jsx
 * @description Fournit le formulaire et la logique pour l'inscription de nouveaux utilisateurs.
 * Gère la validation des champs côté client, les états de chargement (`busy`) et d'erreur,
 * et appelle la fonction `register` du AuthContext. Redirige l'utilisateur après
 * une inscription réussie.
 */

// --- Imports de React & Hooks ---
import { useState } from "react";

// --- Hooks de Bibliothèques Externes ---
import { Link, useLocation, useNavigate } from "react-router-dom";

// --- Contexte & Hooks Personnalisés de l'Application ---
import { useAuth } from "../auth/AuthContext.jsx";

// --- Utilitaires ---
import { validatePassword } from "../auth/passwordPolicy.js";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { search } = useLocation();
  const next = new URLSearchParams(search).get("next") || "/reservation";

  const [form, setForm] = useState({
    username: "",
    nom: "",
    prenom: "",
    email: "",
    password: "",
    accept: false,
  });
  const [errors, setErrors] = useState([]); 
  const [busy, setBusy] = useState(false);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = [];

    if (!form.username.trim()) errs.push("Nom d’utilisateur requis.");
    if (!form.nom.trim()) errs.push("Nom requis.");
    if (!form.prenom.trim()) errs.push("Prénom requis.");
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.push("Email invalide.");

    const pw = validatePassword(form.password);
    if (!pw.ok) errs.push(...pw.errors);

    if (!form.accept) errs.push("Vous devez accepter les CGU/Politique de confidentialité.");

    setErrors(errs);
    if (errs.length > 0) return;

    try {
      setBusy(true);
      await register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      navigate(next, { replace: true });
    } catch (err) {
      const apiMsg =
        (err && err.payload && err.payload.detail) ||
        err?.message ||
        "Erreur d’inscription. Merci de réessayer.";
      setErrors([apiMsg]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="container d-flex align-items-center justify-content-center py-4"
      style={{ minHeight: "80vh" }}
    >
      <div className="col-md-8 col-lg-6 col-xl-5">
        <div className="card shadow-sm form-card">
          <div className="card-body p-4 p-md-5">
            <h2 className="text-center mb-4">Créer un compte</h2>

            {errors.length > 0 && (
              <div className="alert alert-danger">
                <ul className="mb-0 ps-3">
                  {errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={onSubmit} noValidate>
              <div className="row g-3">
                <div className="col-12">
                  <label htmlFor="usernameInput" className="form-label">
                    Nom d’utilisateur
                  </label>
                  <input
                    id="usernameInput"
                    className="form-control"
                    name="username"
                    value={form.username}
                    onChange={onChange}
                    autoComplete="username"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="nomInput" className="form-label">
                    Nom
                  </label>
                  <input
                    id="nomInput"
                    className="form-control"
                    name="nom"
                    value={form.nom}
                    onChange={onChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="prenomInput" className="form-label">
                    Prénom
                  </label>
                  <input
                    id="prenomInput"
                    className="form-control"
                    name="prenom"
                    value={form.prenom}
                    onChange={onChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label htmlFor="emailInput" className="form-label">
                    Email
                  </label>
                  <input
                    id="emailInput"
                    className="form-control"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="col-12">
                  <label htmlFor="passwordInput" className="form-label">
                    Mot de passe
                  </label>
                  <input
                    id="passwordInput"
                    className="form-control"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={onChange}
                    autoComplete="new-password"
                    required
                  />
                  <div className="form-text">
                    ≥12 caractères, au moins 1 minuscule, 1 majuscule, 1 chiffre, 1 caractère spécial, sans espace.
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-check mt-2">
                    <input
                      id="acceptInput"
                      className="form-check-input"
                      type="checkbox"
                      name="accept"
                      checked={form.accept}
                      onChange={onChange}
                    />
                    <label className="form-check-label" htmlFor="acceptInput">
                      J’accepte les CGU et la Politique de confidentialité.
                    </label>
                  </div>
                </div>
              </div>

              <div className="d-grid mt-4">
                <button className="btn btn-primary btn-lg" type="submit" disabled={busy}>
                  {busy ? "Création..." : "Créer mon compte"}
                </button>
              </div>
            </form>

            <div className="text-center mt-4">
              <p className="mb-0">
                Déjà inscrit ?{" "}
                <Link to={`/login?next=${encodeURIComponent(next)}`}>Identifiez-vous</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}