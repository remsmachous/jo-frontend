/**
 * @file Header.jsx
 * @description Affiche l'en-tête principal du site avec une image de fond,
 * le logo cliquable et le slogan.
 * @returns {JSX.Element} Le composant de l'en-tête.
 */

// --- Imports de React ---
import React from 'react';

// --- Composants de Bibliothèques Externes ---
import { Link } from 'react-router-dom';

// --- CSS ---
import './Header.css';

export default function Header() {
    return (
        <header className="site-header">
            <Link to="/" className="site-header-logo">
                <img src="../public/img/logo.png" alt="Logo Paris 2024" />
            </Link>
            <h1 className="site-header-title">
                Partagez l’aventure olympique : réservez vos billets dès maintenant
            </h1>
        </header>
        );
    }
