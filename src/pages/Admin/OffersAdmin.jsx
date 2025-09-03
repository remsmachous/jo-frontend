/**
 * @file OffersAdmin.jsx
 * @description Espace admin minimal pour gérer les Offres :
 *  - Liste des offres (GET /api/offers/)
 *  - Création d'une offre (POST /api/offers/)
 * Protégé côté front : visible uniquement si user.is_staff || user.is_admin || user.is_superuser (ou rôle "admin").
 * Happy path uniquement.
 */

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/AuthContext.jsx";
import { getAccessToken } from "../../services/api"; // même helper que le reste du projet

const API_BASE = "http://127.0.0.1:8000/api";

export default function OffersAdmin() {
  const { user } = useAuth();

  // ✅ élargit la condition d'admin pour couvrir plusieurs structures possibles
  const isAdmin = useMemo(() => {
    if (!user) return false;
    // cas simples
    if (user.is_staff || user.is_superuser || user.is_admin === true) return true;
    // certains backends renvoient "roles": ["admin", ...]
    if (Array.isArray(user.roles) && user.roles.some(r => String(r).toLowerCase() === "admin")) return true;
    // certains backends renvoient "role": "admin"
    if (typeof user.role === "string" && user.role.toLowerCase() === "admin") return true;
    return false;
  }, [user]);

  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState([]);

  // Form state
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "0.00",
    persons: 1,
    is_active: true,
    sort_order: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let alive = true;

    async function fetchOffers() {
      try {
        const res = await fetch(`${API_BASE}/offers/?ordering=sort_order,name`, {
          headers: { Accept: "application/json" },
        });
        const data = await res.json();
        if (!alive) return;
        const list = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
        setOffers(list);
      } finally {
        if (alive) setLoading(false);
      }
    }

    fetchOffers();
    return () => {
      alive = false;
    };
  }, []);

  if (!user) {
    return (
      <div className="container py-4">
        <h1 className="h4 mb-3">Admin — Offres</h1>
        <div className="alert alert-info">Vous devez être connecté.</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-4">
        <h1 className="h4 mb-3">Admin — Offres</h1>
        <div className="alert alert-danger">Accès réservé aux administrateurs.</div>
      </div>
    );
  }

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "persons" || name === "sort_order" ? Number(value || 0) : value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = getAccessToken();
      const res = await fetch(`${API_BASE}/offers/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          description: form.description,
          price: Number(form.price),
          persons: Number(form.persons),
          is_active: !!form.is_active,
          sort_order: Number(form.sort_order),
        }),
      });

      const created = await res.json(); // happy path: 201
      setOffers((prev) => [created, ...prev]);

      setForm({
        name: "",
        slug: "",
        description: "",
        price: "0.00",
        persons: 1,
        is_active: true,
        sort_order: 0,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="h4 mb-3">Admin — Offres</h1>

      {/* Formulaire création */}
      <div className="card mb-4">
        <div className="card-header">Créer une offre</div>
        <div className="card-body">
          <form onSubmit={onSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Nom</label>
              <input
                className="form-control"
                name="name"
                value={form.name}
                onChange={onChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Slug</label>
              <input
                className="form-control"
                name="slug"
                value={form.slug}
                onChange={onChange}
                required
              />
            </div>
            <div className="col-md-12">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                name="description"
                rows="2"
                value={form.description}
                onChange={onChange}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Prix (€)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                name="price"
                value={form.price}
                onChange={onChange}
                required
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Personnes</label>
              <input
                type="number"
                min="1"
                className="form-control"
                name="persons"
                value={form.persons}
                onChange={onChange}
                required
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Ordre d’affichage</label>
              <input
                type="number"
                min="0"
                className="form-control"
                name="sort_order"
                value={form.sort_order}
                onChange={onChange}
              />
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="is_active"
                  name="is_active"
                  checked={form.is_active}
                  onChange={onChange}
                />
                <label className="form-check-label" htmlFor="is_active">
                  Active
                </label>
              </div>
            </div>
            <div className="col-12">
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? "Création…" : "Créer"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Liste des offres */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>Offres ({offers.length})</span>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="p-3 text-muted">Chargement…</div>
          ) : offers.length === 0 ? (
            <div className="p-3 text-muted">Aucune offre pour le moment.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped align-middle mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nom</th>
                    <th>Slug</th>
                    <th>Prix</th>
                    <th>Pers.</th>
                    <th>Active</th>
                    <th>Ordre</th>
                    <th>Mise à jour</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((o) => (
                    <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>{o.name}</td>
                      <td>{o.slug}</td>
                      <td>{Number(o.price).toFixed(2)} €</td>
                      <td>{o.persons}</td>
                      <td>{o.is_active ? "Oui" : "Non"}</td>
                      <td>{o.sort_order}</td>
                      <td>{o.updated_at ? new Date(o.updated_at).toLocaleString() : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
