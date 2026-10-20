/**
 * Utilitaire de dialogue de confirmation multiplateforme
 * Fonctionne parfaitement sur iOS, Android et Web (react-native-web)
 */

import { Alert, Platform } from 'react-native';

export const confirmAction = (
  title: string,
  message: string,
  onConfirm: () => void | Promise<void>,
  confirmText: string = 'Oui',
  cancelText: string = 'Non',
  isDestructive: boolean = false
): void => {
  if (Platform.OS === 'web') {
    // Sur navigateur Web, Alert.alert de React Native Web ne s'affiche pas
    const confirmed = typeof window !== 'undefined' ? window.confirm(`${title}\n\n${message}`) : true;
    if (confirmed) {
      onConfirm();
    }
  } else {
    // Alerte native iOS / Android
    Alert.alert(title, message, [
      { text: cancelText, style: 'cancel' },
      {
        text: confirmText,
        style: isDestructive ? 'destructive' : 'default',
        onPress: () => {
          onConfirm();
        },
      },
    ]);
  }
};
