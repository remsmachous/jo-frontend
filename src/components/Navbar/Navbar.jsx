/**
 * @file Navbar.jsx
 * @description Affiche la barre de navigation principale du site.
 * Utilise NavLink pour un style actif sur la page courante et affiche
 * le nombre d'articles dans le panier via le CartContext.
 * @returns {JSX.Element} Le composant de la barre de navigation.
 */

// --- Imports de Bibliothèques Externes (Routing) ---
import { NavLink, useNavigate } from "react-router-dom";

// --- Contexte & Hooks Personnalisés de l'Application ---
import { useCart} from "../../cart/CartContext.jsx";
import { useAuth } from "../../auth/AuthContext.jsx";


// --- CSS ---
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const count = getTotalItems();

  const { user, logout } = useAuth(); 
  const handleLogout = async () => {
    await logout(); 
    navigate("/");  
  };

  return (
    <nav
      className="navbar navbar-expand-lg sticky-top site-navbar"
      aria-label="Navigation principale"
      data-bs-theme="dark"
    >
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Ouvrir ou fermer le menu principal"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item mx-3">
              <a className="nav-link" href="index.html">Accueil</a>
            </li>
            <li className="nav-item mx-3">
              <NavLink className="nav-link" to="/">Billetterie</NavLink>
            </li>
            <li className="nav-item mx-3">
              <NavLink className="nav-link" to="/boutique">Boutique</NavLink>
            </li>
            <li className="nav-item mx-3">
              <NavLink className="nav-link" to="/contact">Contact</NavLink>
            </li>
            <li className="nav-item mx-3">
              <NavLink className="nav-link" to="/mes-billets">Mes billets</NavLink>
            </li>
          </ul>

          {/* Bloc droit : Panier + Auth */}
          <div className="d-flex align-items-center gap-3">
            <NavLink to="/panier" className="btn btn-outline-light position-relative">
              Panier
              {count > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill cart-badge"
                  aria-live="polite"
                >
                  {count}
                  <span className="visually-hidden">articles dans le panier</span>
                </span>
              )}
            </NavLink>

            {/* Auth */}
            {user ? (
              <div className="d-flex align-items-center gap-2">
                <span className="user-info-text">
                  Connecté&nbsp;: {user.email ?? user.username}
                </span>
                <button
                  type="button"
                  className="btn btn-light btn-sm"
                  onClick={handleLogout}
                >
                  Se déconnecter
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <NavLink to="/login" className="btn btn-outline-light btn-sm">
                  Se connecter
                </NavLink>
                <NavLink to="/register" className="btn btn-light btn-sm">
                  Créer un compte
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}