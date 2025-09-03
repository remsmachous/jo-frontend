/**
 * @file AuthContext.jsx
 * @description Fournit un contexte global pour la gestion de l'authentification.
 * Gère l'état de la session utilisateur (utilisateur, token), la persistance
 * dans le localStorage, et expose les fonctions pour s'inscrire, se connecter
 * et se déconnecter.
 */

// --- Imports de React & Hooks ---
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  getMe,
  logout as apiLogout,
  getAccessToken,
  clearTokens,
} from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);


  useEffect(() => {
    let alive = true;
    async function bootstrap() {
      try {
        const token = getAccessToken();
        if (token) {
          const me = await getMe();
          if (alive) setUser(me);
        }
      } catch {
        clearTokens();
        if (alive) setUser(null);
      } finally {
        if (alive) setReady(true);
      }
    }
    bootstrap();
    return () => {
      alive = false;
    };
  }, []);

  const login = useCallback(async ({ username, password }) => {
    await apiLogin({ username, password }); 
    const me = await getMe();
    setUser(me);
    return me;
  }, []);

  const register = useCallback(async ({ username, email, password }) => {
    const out = await apiRegister({ username, email, password });
    try {
      const me = await getMe();
      setUser(me);
      return me;
    } catch {
      return out;
    }
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
  }, []);

  const value = { user, ready, login, register, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
