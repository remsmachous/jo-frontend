/**
 * @file LoginPage.jsx
 * @description Fournit le formulaire et la logique pour la connexion des utilisateurs.
 * Ce composant gère les champs du formulaire (email, mot de passe), un état de chargement
 * (`busy`), et les messages d'erreur. À la soumission, il appelle la fonction `login`
 * du AuthContext. En cas de succès, il redirige l'utilisateur vers la page de
 * destination (`next`) ou vers une page par défaut.
 */

// --- Imports de React & Hooks ---
import { useState } from "react";

// --- Hooks de Bibliothèques Externes (Routing) ---
import { Link, useLocation, useNavigate } from "react-router-dom";

// --- Contexte & Hooks Personnalisés de l'Application ---
import { useAuth } from "../auth/AuthContext.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { search } = useLocation();
  const next = new URLSearchParams(search).get("next") || "/reservation";

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login({
        username: form.username.trim(),
        password: form.password,
      });
      navigate(next, { replace: true });
    } catch (err) {
      const apiMsg =
        err?.payload?.detail ||
        err?.message ||
        "Identifiants incorrects. Réessaie.";
      setError(apiMsg);
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
            <h1 className="text-center mb-4">Se connecter</h1>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={onSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label">Nom d’utilisateur</label>
                <input
                  className="form-control"
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={onChange}
                  autoComplete="username"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Mot de passe</label>
                <input
                  className="form-control"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  autoComplete="current-password"
                  required
                />
              </div>

              <div className="d-grid">
                <button className="btn btn-primary btn-lg" type="submit" disabled={busy}>
                  {busy ? "Connexion..." : "Se connecter"}
                </button>
              </div>
            </form>

            <div className="text-center mt-4">
              <p className="mb-0">
                Nouveau ?{" "}
                <Link to={`/register?next=${encodeURIComponent(next)}`}>
                  Créer un compte
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}