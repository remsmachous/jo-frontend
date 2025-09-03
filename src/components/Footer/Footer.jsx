/**
 * @file Footer.jsx
 * @description Affiche le pied de page global du site.
 * Contient les colonnes de navigation, les liens vers les réseaux sociaux
 * et les informations de copyright.
 * @returns {JSX.Element} Le composant de pied de page.
 */

// --- Imports de React ---
import React from 'react';

// --- Hooks de Bibliothèques Externes (Routing) ---
import { Link } from "react-router-dom";

// --- CSS ---
import './Footer.css';

export default function Footer() {
    return (
        <footer className="site-footer container-fluid mt-4 pt-4">
            <div className="row">
            <div className="col-sm-12 col-lg-3">
                <h3 className="site-footer-title">Liens Rapides</h3>
                <nav aria-label="Navigation pied de page pour liens rapides">
                <ul className="site-footer-link-list">
                    <li><Link to="/">Accueil</Link></li>
                    <li><Link to="/a-propos">À propos</Link></li>
                    <li><Link to="/epreuves">Les Épreuves</Link></li>
                    <li><Link to="/faq">FAQ</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                </ul>
                </nav>
            </div>
            <div className="col-sm-12 col-lg-3">
                <h3 className="site-footer-title">Billetterie</h3>
                <nav aria-label="Navigation pied de page pour billetterie">
                <ul className="site-footer-link-list">
                    <li><Link to="/">Acheter des billets</Link></li>
                    <li><Link to="/LoginPage">Mon Compte</Link></li>
                    <li><Link to="/panier">Mes Billets</Link></li>
                    <li><Link to="/">Offres et Hospitalités</Link></li>
                    <li><Link to="/">Aide & FAQ Billetterie</Link></li>
                </ul>
                </nav>
            </div>
            <div className="col-sm-12 col-lg-3">
                <h3 className="site-footer-title">Légal</h3>
                <nav aria-label="Navigation pied de page pour légal">
                <ul className="site-footer-link-list">
                    <li><Link to="/MentionLegale">Mentions Légales</Link></li>
                    <li><Link to="/Politique">Politique de Confidentialité</Link></li>
                    <li><Link to="/Confition">Conditions d'Utilisation</Link></li>
                    <li><Link to="/Cookies">Gérer les Cookies</Link></li>
                </ul>
                </nav>
            </div>
            <div className="col-sm-12 col-lg-3">
                <h3 className="site-footer-title">Suivez-nous</h3>
                <nav aria-label="Navigation pied de page pour les réseaux sociaux">
                <ul className="d-flex justify-content-center site-footer-link-list">
                    <li><a href="#" target="_blank" rel="noopener noreferrer" aria-label="Suivez-nous sur Facebook"><i className="me-3 fab fa-facebook-f"><span className="visually-hidden">Facebook — nouvelle fenêtre</span></i></a></li>
                    <li><a href="#" target="_blank" rel="noopener noreferrer" aria-label="Suivez-nous sur Instagram"><i className="me-3 fab fa-instagram"></i><span className="visually-hidden">Instagram — nouvelle fenêtre</span></a></li>
                    <li><a href="#" target="_blank" rel="noopener noreferrer" aria-label="Suivez-nous sur Twitter"><i className="me-3 fab fa-x-twitter"></i><span className="visually-hidden">Twitter — nouvelle fenêtre</span></a></li>
                    <li><a href="#" target="_blank" rel="noopener noreferrer" aria-label="Suivez-nous sur Tiktok"><i className="me-3 fab fa-tiktok"></i><span className="visually-hidden">Tiktok — nouvelle fenêtre</span></a></li>
                    <li><a href="#" target="_blank" rel="noopener noreferrer" aria-label="Suivez-nous sur Youtube"><i className="me-3 fab fa-youtube"></i><span className="visually-hidden">Youtube — nouvelle fenêtre</span></a></li>
                </ul>
                </nav>
            </div>
            </div>
            <p className="text-center mt-4 site-footer-copyright">
            &copy;{new Date().getFullYear()} Comité International Olympique. Tous droits réservés.
            </p>
            <p className="text-center site-footer-copyright">
            Aucune partie de ce site ne peut être reproduite ou dupliquée sans l'autorisation expresse de moi.
            </p>
        </footer>
    );
}