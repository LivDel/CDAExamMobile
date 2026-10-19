/**
 * Écran Profil (Écran 7 de la Maquette)
 * Reproduction fidèle de la maquette
 * Zéro texte en dur, utilisation de i18n
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EventsStackParamList } from '../../types/navigation';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { theme } from '../../constants/theme';
import { t } from '../../i18n';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventsContext';
import { confirmAction } from '../../utils/alert';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<EventsStackParamList>>();
  const { user, logout } = useAuth();
  const { events } = useEvents();

  // Initiales du profil
  const userInitials = useMemo(() => {
    if (!user?.name) return 'CM';
    const parts = user.name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  }, [user]);

  // Liste des événements où l'utilisateur a participé
  const participatedEvents = useMemo(() => {
    return events.filter((e) => e.isParticipated);
  }, [events]);

  const handleLogout = () => {
    confirmAction(
      t('auth.logoutConfirmTitle'),
      t('auth.logoutConfirmMessage'),
      async () => {
        await logout();
      },
      t('profile.logoutButton'),
      t('common.cancel')
    );
  };

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Titre */}
        <Text style={styles.title}>{t('profile.title')}</Text>

        {/* Section Avatar et Coordonnées */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userInitials}</Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'Camille Martin'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'camille.martin@exemple.fr'}</Text>
        </View>

        {/* Cartes de statistiques : Événements créés & Participations */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, theme.shadows.card]}>
            <Text style={styles.statNumber}>{events.length}</Text>
            <Text style={styles.statLabel}>
              {t('profile.statCreated_other')}
            </Text>
          </View>

          <View style={[styles.statCard, theme.shadows.card]}>
            <Text style={styles.statNumber}>{participatedEvents.length}</Text>
            <Text style={styles.statLabel}>
              {t('profile.statParticipated', { count: participatedEvents.length })}
            </Text>
          </View>
        </View>

        {/* Section : Mes participations */}
        <View style={styles.participationsSection}>
          <Text style={styles.sectionTitle}>{t('profile.myParticipationsSection')}</Text>

          {participatedEvents.length > 0 ? (
            participatedEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                activeOpacity={0.85}
                onPress={() =>
                  (navigation as any).navigate('EventsTab', {
                    screen: 'EventDetail',
                    params: { eventId: event.id },
                  })
                }
                style={[styles.participationCard, theme.shadows.card]}
              >
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark-sharp" size={16} color={theme.colors.success} />
                </View>

                <View style={styles.participationInfo}>
                  <Text style={styles.participationTitle}>{event.title}</Text>
                  <Text style={styles.participationDate}>{event.date}</Text>
                </View>

                <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>{t('profile.emptyParticipations')}</Text>
            </View>
          )}
        </View>

        {/* Encart informatif de persistance locale */}
        <View style={styles.storageNoticeCard}>
          <Ionicons
            name="lock-closed-outline"
            size={18}
            color={theme.colors.text}
            style={styles.noticeIcon}
          />
          <Text style={styles.noticeText}>{t('profile.storageNotice')}</Text>
        </View>

        {/* Bouton de déconnexion */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color={theme.colors.primary}
            style={styles.logoutIcon}
          />
          <Text style={styles.logoutText}>{t('profile.logoutButton')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: theme.spacing.xxxl,
  },
  title: {
    fontSize: theme.typography.size.display,
    fontFamily: theme.typography.fontFamily.extraBold,
    fontWeight: '800',
    color: theme.colors.text,
    marginVertical: theme.spacing.md,
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.button,
  },
  avatarText: {
    fontSize: theme.typography.size.headline,
    fontFamily: theme.typography.fontFamily.extraBold,
    fontWeight: '800',
    color: theme.colors.textLight,
  },
  userName: {
    fontSize: theme.typography.size.title,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: theme.typography.size.bodySmall,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginVertical: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.card,
    padding: theme.spacing.lg,
    alignItems: 'flex-start',
  },
  statNumber: {
    fontSize: theme.typography.size.display,
    fontFamily: theme.typography.fontFamily.extraBold,
    fontWeight: '800',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: theme.typography.size.caption,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.textSecondary,
  },
  participationsSection: {
    marginVertical: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.size.title,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  participationCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.card,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  checkCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  participationInfo: {
    flex: 1,
  },
  participationTitle: {
    fontSize: theme.typography.size.body,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 2,
  },
  participationDate: {
    fontSize: theme.typography.size.caption,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
  },
  emptyCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.card,
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.typography.size.bodySmall,
    color: theme.colors.textSecondary,
  },
  storageNoticeCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.card,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: theme.spacing.lg,
  },
  noticeIcon: {
    marginRight: theme.spacing.md,
    marginTop: 2,
  },
  noticeText: {
    flex: 1,
    fontSize: theme.typography.size.bodySmall,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text,
    lineHeight: 20,
  },
  logoutButton: {
    minHeight: theme.spacing.minTouchTarget,
    borderRadius: theme.radii.button,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  logoutIcon: {
    marginRight: theme.spacing.sm,
  },
  logoutText: {
    fontSize: theme.typography.size.body,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: '700',
    color: theme.colors.primary,
  },
});
