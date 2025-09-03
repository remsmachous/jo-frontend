import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// ✅ Mock Auth (chemin vers src/auth/AuthContext.jsx)
jest.mock("../../../auth/AuthContext.jsx", () => ({
  useAuth: () => ({
    user: {
      id: 1,
      email: "admin@example.com",
      username: "admin",
      is_staff: true,
    },
    logout: jest.fn(),
  }),
}));

// ✅ Mock Cart (aligne l'API utilisée par Navbar: getTotalItems())
jest.mock("../../../cart/CartContext.jsx", () => ({
  useCart: () => ({
    getTotalItems: jest.fn(() => 2),
    // (optionnel) autres méthodes si ta Navbar les importe plus tard
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    clearCart: jest.fn(),
    state: { items: [{ id: 1, qty: 2 }] },
    dispatch: jest.fn(),
  }),
}));

import Navbar from "../Navbar.jsx";

describe("Navbar (état connecté)", () => {
  test("affiche l'utilisateur et le bouton déconnexion", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // L'email (ou le username) doit apparaître
    expect(screen.getByText(/admin@example\.com|admin/i)).toBeInTheDocument();

    // Le bouton logout (peut être 'Se déconnecter', 'Déconnexion' ou 'Logout')
    expect(
      screen.getByRole("button", { name: /se déconnecter|déconnexion|logout/i })
    ).toBeInTheDocument();

    // (optionnel) Le badge panier peut afficher 2
    // expect(screen.getByText("2")).toBeInTheDocument();
  });
});
