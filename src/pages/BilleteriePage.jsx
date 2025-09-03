/**
 * @file BilleteriePage.jsx
 * @description Le composant principal pour la page de billetterie.
 * Il affiche les différentes sections d'offres et un résumé du panier.
 * Il récupère les données des offres depuis un fichier statique et
 * les informations du panier via le CartContext.
 */

// --- Imports de React ---
import React from 'react';

// --- Hooks & Contexte ---
// Importe les différentes offres de billets
import { useCart } from '../cart/CartContext.jsx';

// --- Données statiques ---
import { offresSolo, offresDuo, offresFamille } from '../data/offres.js';

// --- Composants Enfants ---
// Importe les composants utilisés pour construire l'interface
import SectionOffres from '../components/SectionOffres.jsx';
import PanierResume from '../components/PanierResume/PanierResume.jsx';

export default function BilleteriePage() {
  const { getTotalItems, getTotalPrice } = useCart();

  return (
    <>
      <SectionOffres
        offresSolo={offresSolo}
        offresDuo={offresDuo}
        offresFamille={offresFamille}
      />
      <PanierResume
        panierCount={getTotalItems()}
        totalPrice={getTotalPrice()}
      />
    </>
  );
}