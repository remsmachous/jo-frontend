/**
 * ⚠️ FICHIER GÉNÉRÉ AUTOMATIQUEMENT — NE PAS ÉDITER
 * Source: https://jobackend.fly.dev/api/offers/
 * Généré: 2025-09-27T08:27:05.026Z
 */

const BTN_CLASS = "btn btn-custom";

export const offresSolo = [
  { id: 10, image: "https://jobackend.fly.dev/media/offres/testduo.png", alt: "testduo", titre: "Cérémonie d'ouverture", description: "cérémonie d'ouverture", prix: 400, btnLabel: "Etre-là", btnClass: BTN_CLASS, btnHref: "/reservation" },
  { id: 1, image: "https://jobackend.fly.dev/media/offres/athletisme.png", alt: "Affiche des JO de Paris 2024 pour l'épreuve d'athlétisme, montrant un coureur en pleine action sur une piste.", titre: "Pack Solo: Athlétisme", description: "1 place en catégorie A pour la mythique finale du 100m masculin.", prix: 90, btnLabel: "Ajouter au panier", btnClass: BTN_CLASS, btnHref: "/reservation" },
  { id: 3, image: "https://jobackend.fly.dev/media/offres/basket.jpg", alt: "Affiche des JO de Paris 2024 pour le basketball, avec un joueur dribblant sur un terrain.", titre: "Pack Solo: Basketball", description: "1 billet pour un match des phases finales de basketball à l'Accor Arena.", prix: 75, btnLabel: "Dunker sa place", btnClass: BTN_CLASS, btnHref: "/reservation" },
  { id: 2, image: "https://jobackend.fly.dev/media/offres/bmx.jpg", alt: "Affiche des JO de Paris 2024 pour le skateboard, représentant un athlète réalisant une figure devant la Tour Eiffel.", titre: "Pack Solo: Skateboard", description: "1 billet pour les qualifications de Skateboard Park à la Concorde.", prix: 80, btnLabel: "Réserver ma place", btnClass: BTN_CLASS, btnHref: "/reservation" }
];

export const offresDuo = [
  { id: 4, image: "https://jobackend.fly.dev/media/offres/bmx.jpg", alt: "Affiche des JO de Paris 2024 illustrant les sports urbains, avec des athlètes de BMX et de skateboard au-dessus des toits de Paris.", titre: "Pack Duo: BMX Freestyle", description: "2 places pour les qualifications de BMX Freestyle au cœur de Paris.", prix: 120, btnLabel: "Voir les figures", btnClass: BTN_CLASS, btnHref: "/reservation" },
  { id: 5, image: "https://jobackend.fly.dev/media/offres/judo.jpg", alt: "Affiche des JO de Paris 2024 pour le judo, représentant deux judokas se saluant respectueusement devant la Tour Eiffel.", titre: "Pack Duo: Judo", description: "2 billets pour les phases éliminatoires de Judo à l'Arena Champ-de-Mars.", prix: 150, btnLabel: "Vivre l'Ippon", btnClass: BTN_CLASS, btnHref: "/reservation" },
  { id: 6, image: "https://jobackend.fly.dev/media/offres/tennis.webp", alt: "Affiche des JO de Paris 2024 pour le tennis, vue plongeante d'un joueur en action sur un court en terre battue.", titre: "Pack Duo: Tennis", description: "2 places pour un match sur la terre battue mythique de Roland-Garros.", prix: 160, btnLabel: "Jeu, Set et Match", btnClass: BTN_CLASS, btnHref: "/reservation" }
];

export const offresFamille = [
  { id: 7, image: "https://jobackend.fly.dev/media/offres/natation.jpeg", alt: "Affiche des JO de Paris 2024 pour la natation, avec un nageur en pleine action dans un couloir de piscine.", titre: "Pack Famille: Natation", description: "4 places (2 adultes + 2 enfants) pour les séries de natation à La Défense Arena.", prix: 250, btnLabel: "Plonger en famille", btnClass: BTN_CLASS, btnHref: "/reservation" },
  { id: 8, image: "https://jobackend.fly.dev/media/offres/handball.jpg", alt: "Affiche des JO de Paris 2024 pour le handball, montrant un joueur en plein saut, s'apprêtant à tirer.", titre: "Pack Famille: Handball", description: "4 places pour un match de l'équipe de France de handball au stade Pierre-Mauroy.", prix: 240, btnLabel: "Emmener sa tribu", btnClass: BTN_CLASS, btnHref: "/reservation" },
  { id: 9, image: "https://jobackend.fly.dev/media/offres/equitation.jpg", alt: "ffiche des JO de Paris 2024 pour les sports équestres, avec un cavalier et sa monture devant le Château de Versailles.", titre: "Pack Famille: Sports Équestres", description: "4 places pour l'épreuve de saut d'obstacles par équipe dans le cadre royal de Versailles.", prix: 295, btnLabel: "Assister à l'épreuve", btnClass: BTN_CLASS, btnHref: "/reservation" }
];

export default { offresSolo, offresDuo, offresFamille };
