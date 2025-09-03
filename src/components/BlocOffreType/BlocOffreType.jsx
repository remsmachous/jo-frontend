/**
 * @file BlocOffreType.jsx
 * @description Affiche une "carte" contenant un carrousel pour un type d'offre spécifique (Solo, Duo, Famille).
 * Chaque slide du carrousel présente une offre détaillée avec un bouton pour l'ajouter au panier.
 * Le composant est autonome et gère l'ajout au panier via le CartContext.
 * @param {object} props - Les propriétés du composant.
 * @param {string} props.titre - Le titre du bloc (ex: "Offre Solo").
 * @param {Offre[]} props.offres - Un tableau d'objets 'Offre' à afficher dans le carrousel.
 */

// --- Imports de React & Hooks ---
import React from 'react'; 

// --- Contexte & Hooks Personnalisés de l'Application ---
import { useCart } from "../../cart/CartContext.jsx";

// --- CSS ---
import './BlocOffreType.css';

function BlocOffreType({ titre, offres=[], onAdd }) {

  const { addToCart } = useCart();
  if (!offres.length) return null;

  const carouselId = `carrousel-${titre.replace(/\s+/g, '').toLowerCase()}`;
  
  return (
    <div className="card shadow-sm h-100 bloc-offre-card">
      <div className="card-body p-0 d-flex flex-column">
        <h5 className="bloc-offre-title">{titre}</h5>
        <p className="card-subtitle text-center my-auto bloc-offre-subtitle">
          {offres.length} offres disponibles
        </p>
        <div id={carouselId} className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            {offres.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target={`#${carouselId}`}
                data-bs-slide-to={index}
                className={index === 0 ? 'active' : ''}
                aria-current={index === 0 ? 'true' : undefined}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
          <div className="carousel-inner">
            {offres.map((slide, index) => (
              <div
                key={slide.id ?? index}
                className={`carousel-item ${index === 0 ? 'active' : ''}`}
              >
                <img
                  src={slide.image}
                  className="d-block w-100"
                  alt={slide.alt ?? slide.titre ?? 'Slide'}
                />
                {slide.titre && (
                  <div className="carousel-caption bloc-offre-caption">
                    <h5>{slide.titre}</h5>
                    {slide.description && <p>{slide.description}</p>}
                    {slide.prix && <p className="bloc-offre-prix">{slide.prix}€</p>}
                    <button
                      type="button"
                      className={slide.btnClass ?? "btn btn-custom"}
                      onClick={() => {
                        addToCart(
                          {
                            id: slide.id ?? `offre-${index}`,
                            titre: slide.titre,
                            prix: Number(slide.prix)
                          },
                          1
                        );
                        onAdd?.(slide);
                      }}
                    >
                      {slide.btnLabel ?? "Ajouter au panier"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {offres.length > 1 && (
            <>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target={`#${carouselId}`}
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Précédent</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target={`#${carouselId}`}
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Suivant</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BlocOffreType;