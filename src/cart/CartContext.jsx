/**
 * @file CartContext.jsx
 * @description Fournit un contexte global pour la gestion du panier d'achat.
 * Gère l'état des articles, les actions (ajout, suppression, modification de quantité),
 * le calcul des totaux, et la persistance des données dans le localStorage.
 */

// --- Imports de React & Hooks ---
import React, {createContext, useContext, useReducer, useMemo, useEffect, useRef,useCallback
} from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "JO_CART_V1";

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    const data = JSON.parse(raw);

    if (!data || !Array.isArray(data.items)) return { items: [] };

    const items = data.items
      .filter((i) => i && i.id != null)
      .map((i) => ({
        id: i.id,
        titre: i.titre ?? i.name ?? "",
        prix:
          Number.isFinite(i.prix) && i.prix > 0
            ? i.prix
            : Number(i.price) || 0,
        qty: Number.isFinite(i.qty) && i.qty > 0 ? i.qty : 1,
      }))
      .filter((i) => i.titre && i.prix > 0 && i.qty > 0);

    return { items };
  } catch {
    return { items: [] };
  }
}

const findIndexById = (items, id) => items.findIndex((i) => i.id === id);
const clampQty = (q) =>
  Math.max(1, Math.min(99, Number.isFinite(q) ? q : 1));

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const { item, qty = 1 } = action.payload; 
      const items = [...state.items];
      const idx = findIndexById(items, item.id);
      if (idx !== -1) {
        items[idx] = {
          ...items[idx],
          qty: clampQty(items[idx].qty + qty),
        };
      } else {
        items.push({ ...item, qty: clampQty(qty) });
      }
      return { ...state, items };
    }
    case "SET_QTY": {
      const { id, qty } = action.payload;
      const items = [...state.items];
      const idx = findIndexById(items, id);
      if (idx === -1) return state;
      items[idx] = { ...items[idx], qty: clampQty(qty) };
      return { ...state, items };
    }
    case "INCREMENT": {
      const { id } = action.payload;
      const items = [...state.items];
      const idx = findIndexById(items, id);
      if (idx === -1) return state;
      items[idx] = { ...items[idx], qty: clampQty(items[idx].qty + 1) };
      return { ...state, items };
    }
    case "DECREMENT": {
      const { id } = action.payload;
      const items = [...state.items];
      const idx = findIndexById(items, id);
      if (idx === -1) return state;
      const nextQty = items[idx].qty - 1;
      if (nextQty < 1) {
        items.splice(idx, 1);
      } else {
        items[idx] = { ...items[idx], qty: nextQty };
      }
      return { ...state, items };
    }
    case "REMOVE": {
      const { id } = action.payload;
      return { ...state, items: state.items.filter((i) => i.id !== id) };
    }
    case "CLEAR": {
      return { ...state, items: [] };
    }
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCart);

  const isFirstRender = useRef(true);
  useEffect(() => {
    try {
      const payload = JSON.stringify({ items: state.items });
      localStorage.setItem(STORAGE_KEY, payload);
    } catch {
    } finally {
      if (isFirstRender.current) isFirstRender.current = false;
    }
  }, [state.items]);

  const addToCart = useCallback((item, qty = 1) => dispatch({ type: "ADD", payload: { item, qty } }), []);
  const setQty = useCallback((id, qty) => dispatch({ type: "SET_QTY", payload: { id, qty } }), []);
  const increment = useCallback((id) => dispatch({ type: "INCREMENT", payload: { id } }), []);
  const decrement = useCallback((id) => dispatch({ type: "DECREMENT", payload: { id } }), []);
  const remove = useCallback((id) => dispatch({ type: "REMOVE", payload: { id } }), []);
  const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const api = useMemo(
      () => ({
        items: state.items,
        getTotalItems: () => state.items.reduce((sum, i) => sum + i.qty, 0),
        getTotalPrice: () => state.items.reduce((sum, i) => sum + i.qty * i.prix, 0),
        
        addToCart,
        setQty,
        increment,
        decrement,
        remove,
        clear,
      }),
      [state.items, addToCart, setQty, increment, decrement, remove, clear]
    );

    return (
      <CartContext.Provider value={api}>
        {children}
      </CartContext.Provider>
    );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}