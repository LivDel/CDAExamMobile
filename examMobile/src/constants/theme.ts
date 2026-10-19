/**
 * Thème unifié de l'application EventEase
 * Point d'accès unique pour toutes les constantes visuelles
 * AUCUN style en dur dans les composants : utiliser 'theme'
 */

import { colors } from './colors';
import { spacing } from './spacing';
import { radii } from './radii';
import { typography } from './typography';

export const theme = {
  colors,
  spacing,
  radii,
  typography,

  // Ombres douces pour les cartes
  shadows: {
    card: {
      shadowColor: '#3B2A20',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    button: {
      shadowColor: '#C2410C',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 3,
    },
    header: {
      shadowColor: '#3B2A20',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
    },
  },
} as const;

export type Theme = typeof theme;
