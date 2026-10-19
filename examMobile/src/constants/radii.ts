/**
 * Rayons de courbure (Border Radius) standards d'EventEase
 * Règle de design : Rayons doux entre 14 et 20 px selon la maquette
 */

export const radii = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 16,
  xl: 20,
  pill: 9999,
  round: 9999,

  // Rayon standard pour les cartes d'événements et conteneurs
  card: 18,

  // Rayon standard pour les champs de saisie et boutons
  button: 16,
  input: 14,
  badge: 12,
} as const;
