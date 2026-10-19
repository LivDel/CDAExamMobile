/**
 * Espacements et dimensions standards de l'application EventEase
 * Règle de design : cibles tactiles >= 44 px pour l'accessibilité mobile
 */

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,

  // Hauteur minimale pour toute cible interactive
  minTouchTarget: 44,

  // Marges d'écran standards
  screenHorizontal: 20,
  screenVertical: 16,
} as const;
