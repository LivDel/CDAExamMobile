/**
 * Carte d'événement conforme à la maquette
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppEvent } from '../../types/event';
import { theme } from '../../constants/theme';
import { t } from '../../i18n';

interface EventCardProps {
  event: AppEvent;
  onPress: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  // Extraction du jour et du mois à partir de la date (ex: "2026-10-24")
  const parseDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const day = parts[2];
        const monthIndex = parseInt(parts[1], 10) - 1;
        const months = ['JAN.', 'FÉV.', 'MAR.', 'AVR.', 'MAI', 'JUIN', 'JUIL.', 'AOÛT', 'SEPT.', 'OCT.', 'NOV.', 'DÉC.'];
        return { day, month: months[monthIndex] || '' };
      }
    } catch {
      // Fallback
    }
    return { day: '01', month: 'OCT.' };
  };

  const { day, month } = parseDate(event.date);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.card, theme.shadows.card]}
    >
      {/* Pastille de date à gauche */}
      <View
        style={[
          styles.dateBadge,
          event.isParticipated ? styles.dateBadgeParticipated : styles.dateBadgeNormal,
        ]}
      >
        <Text
          style={[
            styles.dateDay,
            event.isParticipated ? styles.dateDayParticipated : styles.dateDayNormal,
          ]}
        >
          {day}
        </Text>
        <Text
          style={[
            styles.dateMonth,
            event.isParticipated ? styles.dateMonthParticipated : styles.dateMonthNormal,
          ]}
        >
          {month}
        </Text>
      </View>

      {/* Contenu principal de la carte */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>

        {/* Ligne d'informations : Heure & Distance */}
        <View style={styles.infoRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.metaText}>{event.time}</Text>
          </View>

          {event.distanceKm !== undefined ? (
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={14} color={theme.colors.textSecondary} />
              <Text style={styles.metaText}>
                {t('events.distanceFormatKm', { distance: event.distanceKm.toString().replace('.', ',') })}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Badge de statut */}
        <View style={styles.badgeRow}>
          {event.isParticipated ? (
            <View style={styles.statusBadgeParticipated}>
              <Ionicons name="checkmark-sharp" size={13} color={theme.colors.success} style={styles.badgeIcon} />
              <Text style={styles.statusTextParticipated}>
                {t('events.statusParticipated')}
              </Text>
            </View>
          ) : (
            <View style={styles.statusBadgeUpcoming}>
              <Text style={styles.statusTextUpcoming}>
                {t('events.statusUpcoming')}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.card,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    alignItems: 'flex-start',
  },
  dateBadge: {
    width: 54,
    height: 58,
    borderRadius: theme.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.lg,
  },
  dateBadgeNormal: {
    backgroundColor: theme.colors.surface,
  },
  dateBadgeParticipated: {
    backgroundColor: theme.colors.successLight,
  },
  dateDay: {
    fontSize: theme.typography.size.title,
    fontFamily: theme.typography.fontFamily.extraBold,
    fontWeight: '800',
    lineHeight: 22,
  },
  dateDayNormal: {
    color: theme.colors.primaryDark,
  },
  dateDayParticipated: {
    color: theme.colors.success,
  },
  dateMonth: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dateMonthNormal: {
    color: theme.colors.primary,
  },
  dateMonthParticipated: {
    color: theme.colors.success,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.size.body,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: theme.typography.size.caption,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusBadgeUpcoming: {
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 3,
    borderRadius: theme.radii.badge,
    alignSelf: 'flex-start',
  },
  statusTextUpcoming: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.semiBold,
    fontWeight: '600',
    color: theme.colors.primaryDark,
  },
  statusBadgeParticipated: {
    backgroundColor: theme.colors.successLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 3,
    borderRadius: theme.radii.badge,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  badgeIcon: {
    marginRight: 4,
  },
  statusTextParticipated: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: '700',
    color: theme.colors.success,
  },
});
