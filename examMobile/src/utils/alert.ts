/**
 * Utilitaire de dialogue de confirmation multiplateforme
 * Fonctionne parfaitement sur iOS, Android et Web (react-native-web)
 */

import { Alert, Platform } from 'react-native';

export const confirmAction = (
  title: string,
  message: string,
  onConfirm: () => void | Promise<void>,
  confirmText: string = 'Confirmer',
  cancelText: string = 'Annuler'
): void => {
  if (Platform.OS === 'web') {
    // Sur navigateur Web, Alert.alert de React Native Web ne s'affiche pas
    const confirmed = typeof window !== 'undefined' ? window.confirm(`${title}\n\n${message}`) : true;
    if (confirmed) {
      onConfirm();
    }
  } else {
    Alert.alert(title, message, [
      { text: cancelText, style: 'cancel' },
      {
        text: confirmText,
        style: 'destructive',
        onPress: () => {
          onConfirm();
        },
      },
    ]);
  }
};
