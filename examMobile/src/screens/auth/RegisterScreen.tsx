/**
 * Écran d'Inscription (Écran 2 de la Maquette)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { AppInput } from '../../components/common/AppInput';
import { AppButton } from '../../components/common/AppButton';
import { theme } from '../../constants/theme';
import { t } from '../../i18n';
import { useAuth } from '../../context/AuthContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError(t('auth.errorEmptyFields'));
      return;
    }
    if (password.length < 6) {
      setError(t('auth.errorShortPassword'));
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await register(name, email, password);
      if (!res.success) {
        setError(t(res.error || 'auth.errorInvalidCredentials'));
      }
    } catch {
      setError(t('auth.errorInvalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      {/* Bouton retour en haut à gauche */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Titre et sous-titre */}
          <View style={styles.headingContainer}>
            <Text style={styles.title}>{t('auth.welcomeRegister')}</Text>
            <Text style={styles.subtitle}>{t('auth.registerSubtitle')}</Text>
          </View>

          {/* Formulaire */}
          <View style={styles.form}>
            <AppInput
              label={t('auth.nameLabel')}
              placeholder={t('auth.namePlaceholder')}
              value={name}
              onChangeText={setName}
              icon={
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={theme.colors.textSecondary}
                />
              }
            />

            <AppInput
              label={t('auth.emailLabel')}
              placeholder={t('auth.emailPlaceholder')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon={
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={theme.colors.textSecondary}
                />
              }
            />

            <AppInput
              label={t('auth.passwordLabel')}
              placeholder={t('auth.registerPasswordPlaceholder')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={error}
              icon={
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={theme.colors.textSecondary}
                />
              }
            />

            <AppButton
              title={t('auth.registerButton')}
              onPress={handleRegister}
              loading={loading}
              style={styles.registerButton}
            />

            {/* Note de confidentialité locale */}
            <View style={styles.securityNote}>
              <Ionicons
                name="lock-closed-outline"
                size={14}
                color={theme.colors.textSecondary}
                style={styles.securityIcon}
              />
              <Text style={styles.securityText}>{t('auth.registerFooterNote')}</Text>
            </View>
          </View>

          {/* Lien vers Connexion */}
          <View style={styles.footerLinkContainer}>
            <Text style={styles.footerText}>{t('auth.alreadyMember')} </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.footerLink}>{t('auth.loginLink')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xl,
  },
  headingContainer: {
    marginBottom: theme.spacing.xxl,
  },
  title: {
    fontSize: theme.typography.size.headline,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.size.bodySmall,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  form: {
    marginBottom: theme.spacing.xxl,
  },
  registerButton: {
    marginTop: theme.spacing.sm,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
  },
  securityIcon: {
    marginRight: 6,
  },
  securityText: {
    fontSize: theme.typography.size.caption,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
  },
  footerLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingVertical: theme.spacing.md,
  },
  footerText: {
    fontSize: theme.typography.size.bodySmall,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
  },
  footerLink: {
    fontSize: theme.typography.size.bodySmall,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: '700',
    color: theme.colors.primary,
  },
});
