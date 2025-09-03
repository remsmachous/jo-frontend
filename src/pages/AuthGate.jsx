/**
 * @file AuthGate.jsx
 * @description Affiche une page intermédiaire lorsqu'un utilisateur non authentifié
 * tente d'accéder à une route protégée.
 * Ce composant propose des liens vers la connexion ou l'inscription, en conservant
 * la page de destination initiale (via le paramètre 'next') pour une
 * redirection automatique après l'authentification.
 */

import { Link, useLocation } from "react-router-dom";

export default function AuthGate() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const next = params.get("next") || "/reservation";

  return (
    <div className="container d-flex align-items-center justify-content-center mt-5">
      <div className="col-md-8 col-lg-6">
        <h2>Authentification requise</h2>
        <p className="text-center mb-4 texte-principal">Pour finaliser votre réservation, connectez-vous ou créez un compte.</p>
        <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
          {/* Le paramètre 'next' est transmis aux pages de connexion/inscription
              pour assurer la redirection de l'utilisateur vers sa destination initiale. */}
          <Link className="btn btn-custom" to={`/login?next=${encodeURIComponent(next)}`}>
            Déjà inscrit ? Se connecter
          </Link>
          <Link className="btn btn-custom" to={`/register?next=${encodeURIComponent(next)}`}>
            Nouveau ? Créer un compte
          </Link>
        </div>
      </div>  
    </div>
  );
}