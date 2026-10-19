/**
 * Écran de Connexion (Écran 1 de la Maquette)
 * Reproduction fidèle de la maquette 
 * Zéro texte en dur, utilisation intégrale de t()
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
  Alert,
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

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError(t('auth.errorEmptyFields'));
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* En-tête : Logo et Nom EventEase */}
          <View style={styles.brandContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="calendar" size={32} color={theme.colors.textLight} />
            </View>
            <Text style={styles.appName}>{t('auth.appName')}</Text>
            <Text style={styles.appTagline}>{t('auth.appTagline')}</Text>
          </View>

          {/* Titre et sous-titre de connexion */}
          <View style={styles.headingContainer}>
            <Text style={styles.title}>{t('auth.welcomeBack')}</Text>
            <Text style={styles.subtitle}>{t('auth.loginSubtitle')}</Text>
          </View>

          {/* Formulaire de saisie */}
          <View style={styles.form}>
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
              placeholder={t('auth.passwordPlaceholder')}
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
              title={t('auth.loginButton')}
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />

            {/* Note rassurante de sécurité locale */}
            <View style={styles.securityNote}>
              <Ionicons
                name="lock-closed-outline"
                size={14}
                color={theme.colors.textSecondary}
                style={styles.securityIcon}
              />
              <Text style={styles.securityText}>{t('auth.loginFooterNote')}</Text>
            </View>
          </View>

          {/* Lien vers Inscription */}
          <View style={styles.footerLinkContainer}>
            <Text style={styles.footerText}>{t('auth.noAccount')} </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.footerLink}>{t('auth.createAccountLink')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxxl,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.button,
  },
  appName: {
    fontSize: theme.typography.size.display,
    fontFamily: theme.typography.fontFamily.extraBold,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  appTagline: {
    fontSize: theme.typography.size.bodySmall,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  headingContainer: {
    marginBottom: theme.spacing.xl,
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
  loginButton: {
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
