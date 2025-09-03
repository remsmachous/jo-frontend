/**
 * @file App.jsx
 * @description Composant racine qui définit la structure visuelle (coquille) de l'application.
 * Il assemble les composants de layout communs (Header, Navbar, Footer)
 * et gère l'affichage des différentes pages (publiques et protégées)
 * via le système de routage de React Router. L'état est géré par des contextes dédiés.
 * @returns {JSX.Element} La structure complète de l'application.
 */

// --- Bibliothèques externes ---
import { Routes, Route } from "react-router-dom";

// --- Pages de l'application ---
import BilleteriePage from "./pages/BilleteriePage.jsx";
import CartPage from "./pages/CartPage/CartPage.jsx";
import AuthGate from "./pages/AuthGate.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ReservationPage from "./pages/ReservationPage/ReservationPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import TicketPage from "./pages/TicketPage/TicketPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import MesBillets from "./pages/MesBillets/MesBillets.jsx"; 
import ScanQR from "./pages/ScanQR/ScanQR.jsx";

// --- Composants réutilisables ---
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import LienAccessibilite from "./components/LienAccessibilite";
import Header from "./components/Header/Header.jsx";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <LienAccessibilite />
      <Header />
      <Navbar />

      <main className="flex-grow-1" id="main">
        <Routes>
          {/* Routes Publiques                */}
          <Route path="/" element={<BilleteriePage />} />
          <Route path="/panier" element={<CartPage />} />
          <Route path="/auth" element={<AuthGate />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/scan" element={<ScanQR />} />
          {/* Routes Protégés                */}
          <Route
            path="/mes-billets"
            element={
              <ProtectedRoute>
                <MesBillets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservation"
            element={
              <ProtectedRoute>
                <ReservationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/paiement"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/billet/:id"
            element={
              <ProtectedRoute>
                <TicketPage />
              </ProtectedRoute>
            }
          />
          {/* Route 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}