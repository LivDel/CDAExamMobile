/**
 * Champ de formulaire standard respectant la charte graphique
 * Cibles tactiles >= 44 px, styles centralisés
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { theme } from '../../constants/theme';

interface AppInputProps extends TextInputProps {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  hint?: string;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  icon,
  error,
  containerStyle,
  hint,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          Boolean(error) && styles.inputWrapperError,
          props.multiline && styles.inputWrapperMultiline,
        ]}
      >
        {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
        <TextInput
          placeholderTextColor={theme.colors.textMuted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[styles.input, props.multiline && styles.inputMultiline, style]}
          {...props}
        />
      </View>
      {hint && !error ? <Text style={styles.hint}>{hint}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.size.bodySmall,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  inputWrapper: {
    minHeight: theme.spacing.minTouchTarget + 4,
    backgroundColor: theme.colors.inputBackground,
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
    borderRadius: theme.radii.input,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  inputWrapperFocused: {
    borderColor: theme.colors.inputFocusBorder,
    backgroundColor: '#FFFFFF',
  },
  inputWrapperError: {
    borderColor: theme.colors.danger,
  },
  inputWrapperMultiline: {
    minHeight: 100,
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.md,
  },
  iconContainer: {
    marginRight: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: theme.typography.size.body,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text,
    paddingVertical: theme.spacing.sm,
  },
  inputMultiline: {
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: theme.typography.size.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    lineHeight: theme.typography.lineHeight.caption,
  },
  error: {
    fontSize: theme.typography.size.caption,
    color: theme.colors.danger,
    marginTop: theme.spacing.xs,
    fontWeight: '600',
  },
});
