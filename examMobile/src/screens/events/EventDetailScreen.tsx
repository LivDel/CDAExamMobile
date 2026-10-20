/**
 * Écran Détail de l'événement (Écran 4 de la Maquette)
 * Zéro texte en dur, utilisation intégrale de i18n
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EventsStackParamList } from '../../types/navigation';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { AppButton } from '../../components/common/AppButton';
import { theme } from '../../constants/theme';
import { t } from '../../i18n';
import { useEvents } from '../../context/EventsContext';
import { confirmAction } from '../../utils/alert';
import { fetchLiveWeather, LiveWeather } from '../../services/weather';
import { getUserLocation, extractCoordinates, calculateDistanceKm } from '../../services/location';

type Props = NativeStackScreenProps<EventsStackParamList, 'EventDetail'>;

export const EventDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { eventId } = route.params;
  const { getEventById, deleteEvent, toggleParticipation } = useEvents();

  const event = getEventById(eventId);

  // États pour les fonctionnalités bonus CDA : météo temps réel & distance dynamique
  const [liveWeather, setLiveWeather] = useState<LiveWeather | null>(null);
  const [dynamicDistance, setDynamicDistance] = useState<number | undefined>(event?.distanceKm);

  useEffect(() => {
    let isMounted = true;
    if (event?.location) {
      // 1. Récupération de la météo en direct via API externe (Bonus CDA)
      fetchLiveWeather(event.location).then((data) => {
        if (isMounted && data) {
          setLiveWeather(data);
        }
      });

      // 2. Calcul dynamique de la distance par géolocalisation Haversine (Bonus CDA)
      getUserLocation().then((userCoords) => {
        if (isMounted) {
          const eventCoords = extractCoordinates(event.location);
          const dist = calculateDistanceKm(userCoords, eventCoords);
          setDynamicDistance(dist);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [event?.location]);

  if (!event) {
    return (
      <ScreenContainer>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.navButton}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>{t('events.emptyList')}</Text>
        </View>
      </ScreenContainer>
    );
  }

  // Confirmation avant suppression avec alerte native Oui/Non
  const handleDelete = () => {
    confirmAction(
      t('events.deleteTitle'),
      t('events.deleteConfirm'),
      async () => {
        await deleteEvent(event.id);
        navigation.goBack();
      },
      t('common.yes'),
      t('common.no'),
      true
    );
  };

  // Gestion de l'inscription / désinscription avec confirmation native Oui/Non
  const handleToggleParticipation = () => {
    if (event.isParticipated) {
      // Demande de confirmation native pour annuler l'inscription
      confirmAction(
        t('events.cancelParticipationTitle'),
        t('events.cancelParticipationConfirm'),
        () => toggleParticipation(event.id),
        t('common.yes'),
        t('common.no'),
        false
      );
    } else {
      // Inscription directe
      toggleParticipation(event.id);
    }
  };

  // Formatage de la date en français
  const formatFullDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return d.toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      }
    } catch {
      // Fallback
    }
    return dateStr;
  };

  const finalDistance = dynamicDistance ?? event.distanceKm;
  const displayedWeather = liveWeather || event.weather;

  return (
    <ScreenContainer>
      {/* Barre de navigation supérieure : Retour, Éditer, Supprimer */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.navButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <View style={styles.topActions}>
          <TouchableOpacity
            onPress={() => navigation.navigate('EventForm', { eventId: event.id })}
            style={styles.navButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="pencil-outline" size={22} color={theme.colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDelete}
            style={styles.navButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={22} color={theme.colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Statut temporaire / délai */}
        <View style={styles.statusRow}>
          <Text
            style={[
              styles.statusNotice,
              event.isParticipated && styles.statusNoticeParticipated,
            ]}
          >
            {event.isParticipated
              ? `✓ ${t('events.statusRegistered')}`
              : t('events.upcomingInDays', { days: 5 })}
          </Text>
        </View>

        {/* Titre principal */}
        <Text style={styles.eventTitle}>{event.title}</Text>

        {/* Carte : Date et heure */}
        <View style={[styles.detailCard, theme.shadows.card]}>
          <View style={styles.iconCircle}>
            <Ionicons name="calendar-outline" size={22} color={theme.colors.primary} />
          </View>
          <View style={styles.cardTextContent}>
            <Text style={styles.cardLabel}>{t('events.sectionDateTime')}</Text>
            <Text style={styles.cardValue}>{formatFullDate(event.date)}</Text>
            <Text style={styles.cardSubValue}>{event.time}</Text>
          </View>
        </View>

        {/* Carte : Lieu et distance dynamique (Bonus CDA) */}
        <View style={[styles.detailCard, theme.shadows.card]}>
          <View style={styles.iconCircle}>
            <Ionicons name="location-outline" size={22} color={theme.colors.primary} />
          </View>
          <View style={styles.cardTextContent}>
            <Text style={styles.cardLabel}>{t('events.sectionLocation')}</Text>
            <Text style={styles.cardValue}>{event.location}</Text>
            {finalDistance !== undefined ? (
              <Text style={styles.cardSubValue}>
                {t('events.distanceFromYou', {
                  distance: `${finalDistance.toString().replace('.', ',')} km`,
                })}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Carte : Météo (Feature Bonus CDA avec API temps réel et fallback) */}
        {displayedWeather ? (
          <View style={[styles.detailCard, theme.shadows.card]}>
            <View style={[styles.iconCircle, styles.weatherIconCircle]}>
              <Ionicons
                name={
                  displayedWeather.condition.toLowerCase().includes('pluie') ||
                  displayedWeather.condition.toLowerCase().includes('averse')
                    ? 'rainy-outline'
                    : displayedWeather.condition.toLowerCase().includes('nuage')
                    ? 'partly-sunny-outline'
                    : 'sunny-outline'
                }
                size={22}
                color={theme.colors.accent}
              />
            </View>
            <View style={styles.cardTextContent}>
              <Text style={styles.cardLabel}>{t('events.sectionWeather')}</Text>
              <Text style={styles.cardValue}>
                {displayedWeather.condition} · {displayedWeather.temperature} °C
              </Text>
              <Text style={styles.cardSubValue}>
                {liveWeather ? t('events.weatherLiveNote') : t('events.weatherForecastNote')}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Section À propos */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>{t('events.sectionAbout')}</Text>
          <Text style={styles.aboutText}>{event.description}</Text>
        </View>
      </ScrollView>

      {/* Bouton d'action principal en bas : Participation / Inscription */}
      <View style={styles.bottomBar}>
        <AppButton
          title={
            event.isParticipated
              ? `✓ ${t('events.actionRegistered')}`
              : t('events.actionWishParticipate')
          }
          variant={event.isParticipated ? 'secondary' : 'primary'}
          onPress={handleToggleParticipation}
          style={event.isParticipated ? styles.buttonParticipated : undefined}
          textStyle={event.isParticipated ? styles.buttonParticipatedText : undefined}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  topActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 110,
  },
  statusRow: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  statusNotice: {
    fontSize: theme.typography.size.caption,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  statusNoticeParticipated: {
    color: theme.colors.success,
  },
  eventTitle: {
    fontSize: theme.typography.size.headline + 2,
    fontFamily: theme.typography.fontFamily.extraBold,
    fontWeight: '800',
    color: theme.colors.text,
    lineHeight: 32,
    marginBottom: theme.spacing.xl,
  },
  detailCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.card,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.lg,
  },
  weatherIconCircle: {
    backgroundColor: theme.colors.accentLight,
  },
  cardTextContent: {
    flex: 1,
  },
  cardLabel: {
    fontSize: theme.typography.size.caption,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  cardValue: {
    fontSize: theme.typography.size.body,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: '700',
    color: theme.colors.text,
    textTransform: 'capitalize',
  },
  cardSubValue: {
    fontSize: theme.typography.size.caption,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  aboutSection: {
    marginTop: theme.spacing.md,
  },
  aboutTitle: {
    fontSize: theme.typography.size.title,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  aboutText: {
    fontSize: theme.typography.size.body,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  bottomBar: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    left: theme.spacing.screenHorizontal,
    right: theme.spacing.screenHorizontal,
  },
  buttonParticipated: {
    backgroundColor: theme.colors.successLight,
    borderWidth: 1.5,
    borderColor: theme.colors.successBorder,
  },
  buttonParticipatedText: {
    color: theme.colors.success,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: theme.typography.size.body,
    color: theme.colors.textSecondary,
  },
});
