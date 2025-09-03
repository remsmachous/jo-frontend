/**
 * @file ProtectedRoute.jsx
 * @description Un composant d'ordre supérieur (HOC) qui protège une route.
 * Si l'utilisateur est authentifié, il affiche les composants enfants (la page protégée).
 * Sinon, il redirige l'utilisateur vers une page d'authentification (`/auth`),
 * en conservant l'URL de destination initiale pour une redirection future.
 * Composant de garde pour les routes nécessitant une authentification.
 * @param {object} props
 * @param {React.ReactNode} props.children - Le composant de page à afficher si l'utilisateur est authentifié.
 * @returns {JSX.Element} Le composant enfant ou une redirection.
 */

// --- Imports de React ---
import React from 'react';

// --- Hooks de Bibliothèques Externes ---
import { Navigate, useLocation } from "react-router-dom";

// --- Contexte & Hooks Personnalisés de l'Application ---
import { useAuth } from "./AuthContext.jsx";


export default function ProtectedRoute({ children }) {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status" />
        <p className="mt-3 mb-0">Chargement…</p>
      </div>
    );
  }

  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  return children;
}