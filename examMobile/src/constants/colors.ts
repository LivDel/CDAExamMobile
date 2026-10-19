/**
 * Charte graphique officielle d'EventEase
 * Définition centralisée de l'ensemble des couleurs de l'application
 */

export const colors = {
  // Fond principal crème
  background: '#FFF8F0',

  // Actions & boutons principaux (Terracotta)
  primary: '#C2410C',
  primaryLight: '#EA580C',
  primaryDark: '#9A3412',
  primaryMuted: '#FFEDD5',

  // Surfaces secondaires & puces de filtres actives (Pêche)
  surface: '#FDE8D6',
  surfaceLight: '#FFF5EB',

  // Fond des cartes blanches
  card: '#FFFFFF',

  // Accents visuels (Ambre)
  accent: '#F5A623',
  accentLight: '#FEF3C7',

  // Statut « Participé » et succès (Sauge)
  success: '#3F7D58',
  successLight: '#EBF4EF',
  successBorder: '#B7DAC5',

  // Textes
  text: '#3B2A20', // Brun foncé principal
  textSecondary: '#786C65', // Brun grisé pour sous-titres et métadonnées
  textMuted: '#A89E97', // Texte estompé / placeholders
  textLight: '#FFFFFF', // Texte clair pour boutons colorés

  // Bordures et séparateurs
  border: '#E8DFD8',
  borderLight: '#F4EEE9',

  // Statuts d'alerte & erreurs
  danger: '#DC2626',
  dangerLight: '#FEE2E2',

  // Éléments de formulaire
  inputBackground: '#FFFFFF',
  inputBorder: '#E8DFD8',
  inputFocusBorder: '#C2410C',

  // Navigation tab bar
  tabBarBackground: '#FFFFFF',
  tabBarActive: '#C2410C',
  tabBarInactive: '#9E948D',
  tabBarBorder: '#EFE8E1',
} as const;

export type ColorName = keyof typeof colors;
