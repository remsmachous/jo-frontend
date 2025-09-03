 /**
 * @file NotFoundPage.jsx
 * @description Affiche une page d'erreur 404 standard lorsque l'utilisateur
 * navigue vers une URL qui ne correspond à aucune route définie.
 * @returns {JSX.Element} Le composant de la page 404.
 */

// --- Imports de React ---
import React from 'react';

// --- Hooks de Bibliothèques Externes ---
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="text-center my-5">
      <h1>404</h1>
      <h2>Page non trouvée</h2>
      <p>Désolé, la page que vous cherchez n'existe pas.</p>
      <Link to="/" className="btn btn-custom">Retour à l'accueil</Link>
    </div>
  );
}
