/**
 * Typographie officielle d'EventEase
 * Utilise la police Google Nunito
 */

export const typography = {
  // Noms des variantes de polices Nunito
  fontFamily: {
    regular: 'Nunito_400Regular',
    medium: 'Nunito_500Medium',
    semiBold: 'Nunito_600SemiBold',
    bold: 'Nunito_700Bold',
    extraBold: 'Nunito_800ExtraBold',
  },

  // Tailles de police
  size: {
    caption: 12,
    bodySmall: 13,
    body: 15,
    subtitle: 17,
    title: 20,
    headline: 24,
    display: 28,
  },

  // Hauteurs de ligne harmonieuses
  lineHeight: {
    caption: 16,
    bodySmall: 18,
    body: 22,
    subtitle: 24,
    title: 28,
    headline: 32,
    display: 36,
  },
} as const;
