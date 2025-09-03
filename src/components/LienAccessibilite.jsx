/**
 * @file LienAccessibilite.jsx
 * @description Affiche un lien "Aller au contenu principal" (skip link).
 * Ce lien est le premier élément focusable de la page. Il est invisible par défaut
 * mais devient visible lorsqu'il reçoit le focus via la navigation au clavier (touche Tab).
 * Il permet aux utilisateurs de claviers et de lecteurs d'écran d'accéder directement
 * au contenu principal sans avoir à passer par toute la navigation du header.
 * @returns {JSX.Element} Le composant du lien d'accessibilité.
 */

// --- Imports de React ---
import React from 'react';

function LienAccessibilite () {
    return (
        <a href="#main" className="visually-hidden-focusable">
        Aller au contenu principal
        </a>
    );
}

export default LienAccessibilite;