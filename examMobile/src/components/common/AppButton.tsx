/**
 * Bouton standard respectant la charte graphique EventEase
 * Cible tactile >= 44 px, coins arrondis 16 px, couleurs du thème
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
  View,
} from 'react-native';
import { theme } from '../../constants/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';
  const isGhost = variant === 'ghost';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        isPrimary && styles.buttonPrimary,
        isSecondary && styles.buttonSecondary,
        isOutline && styles.buttonOutline,
        isDanger && styles.buttonDanger,
        isGhost && styles.buttonGhost,
        disabled && styles.buttonDisabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isOutline || isGhost || isSecondary ? theme.colors.primary : theme.colors.textLight}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
          <Text
            style={[
              styles.text,
              isPrimary && styles.textPrimary,
              isSecondary && styles.textSecondary,
              isOutline && styles.textOutline,
              isDanger && styles.textDanger,
              isGhost && styles.textGhost,
              disabled && styles.textDisabled,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: theme.spacing.minTouchTarget,
    borderRadius: theme.radii.button,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: theme.spacing.sm,
  },
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
    ...theme.shadows.button,
  },
  buttonSecondary: {
    backgroundColor: theme.colors.surface,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  buttonDanger: {
    backgroundColor: theme.colors.danger,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  buttonDisabled: {
    backgroundColor: theme.colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    fontSize: theme.typography.size.body,
    fontWeight: '700',
    fontFamily: theme.typography.fontFamily.bold,
    textAlign: 'center',
  },
  textPrimary: {
    color: theme.colors.textLight,
  },
  textSecondary: {
    color: theme.colors.primaryDark,
  },
  textOutline: {
    color: theme.colors.primary,
  },
  textDanger: {
    color: theme.colors.textLight,
  },
  textGhost: {
    color: theme.colors.primary,
  },
  textDisabled: {
    color: theme.colors.textMuted,
  },
});
