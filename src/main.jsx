/**
 * @file main.jsx
 * @description Point d'entrée principal de l'application de billetterie.
 * Ce fichier est responsable de :
 * 1. Rendre le composant racine <App /> dans le DOM.
 * 2. Envelopper l'application avec les fournisseurs de contexte globaux
 * (BrowserRouter pour le routage, AuthProvider pour l'authentification,
 * et CartProvider pour le panier).
 * 3. Importer les feuilles de style.
 */

// --- React & ReactDOM ---
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// --- Bibliothèques externes ---
import { BrowserRouter } from "react-router-dom";

// --- Fournisseurs de Contexte (Providers) ---
import { CartProvider } from "./cart/CartContext.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";

// --- Composant Principal de l'Application ---
import App from './App.jsx'

// --- Feuilles de Style (CSS) ---
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>  
    </BrowserRouter>
  </StrictMode>,
)
