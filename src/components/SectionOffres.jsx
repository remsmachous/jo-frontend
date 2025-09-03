/**
 * @file SectionOffres.jsx
 * @description Un composant qui agit comme un conteneur pour afficher
 * les différents types d'offres (Solo, Duo, Famille) dans une grille responsive.
 * @param {object} props - Les propriétés du composant.
 * @param {Offre[]} props.offresSolo - Le tableau des offres "Solo".
 * @param {Offre[]} props.offresDuo - Le tableau des offres "Duo".
 * @param {Offre[]} props.offresFamille - Le tableau des offres "Famille".
 * @returns {JSX.Element} La section des offres.
 */

// --- Imports de React ---
import React from 'react';

// --- Imports des Composants Enfants ---
import BlocOffreType from './BlocOffreType/BlocOffreType';

export default function SectionOffres({ offresSolo, offresDuo, offresFamille, onAdd }) {
  return (
    <section className="container my-5">
      <h2 className="text-center mb-5 ">Choisissez votre offre</h2>
      <div className="row">
        <div className="col-md-4 mb-4">
          <BlocOffreType titre="Offre Solo" offres={offresSolo} onAdd={onAdd} />
        </div>
        <div className="col-md-4 mb-4">
          <BlocOffreType titre="Offre Duo" offres={offresDuo} onAdd={onAdd}/>
        </div>
        <div className="col-md-4 mb-4">
          <BlocOffreType titre="Offre Famille" offres={offresFamille} onAdd={onAdd}/>
        </div>
      </div>
    </section>
  );
}