/**
 * Écran Liste des événements (Écran 3 de la Maquette)
 * Reproduction fidèle de la maquette 
 * Zéro texte en dur, utilisation de i18n
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EventsStackParamList } from '../../types/navigation';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { EventCard } from '../../components/events/EventCard';
import { theme } from '../../constants/theme';
import { t } from '../../i18n';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventsContext';
import { EventFilterType } from '../../types/event';

type Props = NativeStackScreenProps<EventsStackParamList, 'EventsList'>;

export const EventsListScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const { events, isLoading, refreshEvents } = useEvents();
  const [activeFilter, setActiveFilter] = useState<EventFilterType>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Extraction des initiales du profil pour l'avatar
  const userInitials = useMemo(() => {
    if (!user?.name) return 'CM';
    const parts = user.name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  }, [user]);

  // Filtrage des événements
  const filteredEvents = useMemo(() => {
    switch (activeFilter) {
      case 'upcoming':
        return events.filter((e) => !e.isParticipated);
      case 'participated':
        return events.filter((e) => e.isParticipated);
      case 'all':
      default:
        return events;
    }
  }, [events, activeFilter]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshEvents();
    setRefreshing(false);
  };

  return (
    <ScreenContainer>
      {/* En-tête avec message de bienvenue et avatar */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.greetingText}>
            {t('events.greeting', { name: user?.name?.split(' ')[0] || 'Camille' })}
          </Text>
          <Text style={styles.headerTitle}>{t('events.myEventsTitle')}</Text>
        </View>

        {/* Avatar initiales */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userInitials}</Text>
        </View>
      </View>

      {/* Barre de filtres (Tous, À venir, Participés) */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          onPress={() => setActiveFilter('all')}
          style={[
            styles.filterChip,
            activeFilter === 'all' ? styles.filterChipActive : styles.filterChipInactive,
          ]}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === 'all' ? styles.filterTextActive : styles.filterTextInactive,
            ]}
          >
            {t('events.tabAll')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveFilter('upcoming')}
          style={[
            styles.filterChip,
            activeFilter === 'upcoming' ? styles.filterChipActive : styles.filterChipInactive,
          ]}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === 'upcoming' ? styles.filterTextActive : styles.filterTextInactive,
            ]}
          >
            {t('events.tabUpcoming')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveFilter('participated')}
          style={[
            styles.filterChip,
            activeFilter === 'participated' ? styles.filterChipActive : styles.filterChipInactive,
          ]}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === 'participated' ? styles.filterTextActive : styles.filterTextInactive,
            ]}
          >
            {t('events.tabParticipated')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Compteur d'événements */}
      <View style={styles.counterRow}>
        <Text style={styles.counterText}>
          {t('events.countEvents', { count: filteredEvents.length })}
        </Text>
      </View>

      {/* Liste des cartes d'événements */}
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isLoading}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={48} color={theme.colors.textMuted} />
            <Text style={styles.emptyText}>{t('events.emptyFilter')}</Text>
          </View>
        }
      />

      {/* Bouton d'action flottant : Nouvel événement */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('EventForm', {})}
          style={[styles.fabButton, theme.shadows.button]}
        >
          <Ionicons name="add" size={22} color={theme.colors.textLight} style={styles.fabIcon} />
          <Text style={styles.fabText}>{t('events.newEventButton')}</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  headerTextContainer: {
    flex: 1,
  },
  greetingText: {
    fontSize: theme.typography.size.bodySmall,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: theme.typography.size.display,
    fontFamily: theme.typography.fontFamily.extraBold,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.card,
  },
  avatarText: {
    fontSize: theme.typography.size.subtitle,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: '700',
    color: theme.colors.textLight,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginVertical: theme.spacing.md,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radii.pill,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
  },
  filterChipInactive: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterText: {
    fontSize: theme.typography.size.bodySmall,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: '700',
  },
  filterTextActive: {
    color: theme.colors.textLight,
  },
  filterTextInactive: {
    color: theme.colors.text,
  },
  counterRow: {
    marginBottom: theme.spacing.sm,
  },
  counterText: {
    fontSize: theme.typography.size.bodySmall,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
  },
  listContent: {
    paddingBottom: 90, // Espace pour le bouton d'action et la barre d'onglets
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxxl,
    gap: theme.spacing.sm,
  },
  emptyText: {
    fontSize: theme.typography.size.body,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
  },
  fabContainer: {
    position: 'absolute',
    bottom: theme.spacing.md,
    left: theme.spacing.screenHorizontal,
    right: theme.spacing.screenHorizontal,
    alignItems: 'center',
  },
  fabButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.pill,
    minHeight: theme.spacing.minTouchTarget + 6,
    paddingHorizontal: theme.spacing.xxl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  fabIcon: {
    marginRight: 6,
  },
  fabText: {
    fontSize: theme.typography.size.body,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: '700',
    color: theme.colors.textLight,
  },
});
