/**
 * Données initiales (seed) conformes à la maquette
 * Permet d'alimenter immédiatement l'application pour les tests et la démo
 */

import { AppEvent } from '../types/event';

export const initialEvents: AppEvent[] = [
  {
    id: 'evt-1',
    title: "Conférence : l'engagement associatif",
    description: "Un temps d'échange pour découvrir comment chacun peut s'engager à son rythme. Ouvert à tous les membres et bénévoles, accueil café dès 18h.",
    date: '2026-10-24',
    time: '18h30',
    location: 'Maison des associations, 12 rue des Lilas',
    distanceKm: 1.2,
    isParticipated: false,
    weather: {
      condition: 'Ciel dégagé',
      temperature: 14,
    },
  },
  {
    id: 'evt-2',
    title: 'Atelier couture zéro déchet',
    description: "Apprenez à confectionner des sacs à vrac et des lingettes réutilisables. Matériel et machines à coudre fournis sur place.",
    date: '2026-10-28',
    time: '14h00',
    location: 'Salle polyvalente, 4 avenue Pasteur',
    distanceKm: 3.4,
    isParticipated: false,
    weather: {
      condition: 'Nuageux',
      temperature: 16,
    },
  },
  {
    id: 'evt-3',
    title: 'Repas de quartier',
    description: 'Grand buffet partagé entre adhérents et voisins. Chacun apporte un plat salé ou sucré à partager en toute convivialité.',
    date: '2026-11-15',
    time: '12h00',
    location: 'Place du village',
    distanceKm: 0.8,
    isParticipated: false,
    weather: {
      condition: 'Ensoleillé',
      temperature: 12,
    },
  },
  {
    id: 'evt-4',
    title: 'Sortie en forêt de Fontainebleau',
    description: 'Randonnée de 12 km accessible à tous, découverte de la faune automnale et pique-nique tiré du sac.',
    date: '2026-10-11',
    time: '09h00',
    location: 'Gare de Fontainebleau-Avon',
    distanceKm: 58,
    isParticipated: true,
    weather: {
      condition: 'Ciel dégagé',
      temperature: 15,
    },
  },
];
