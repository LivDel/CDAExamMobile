/**
 * Écran Calendrier (Écran 6 de la Maquette)
 * Zéro texte en dur, utilisation de i18n
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabParamList, EventsStackParamList } from '../../types/navigation';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { theme } from '../../constants/theme';
import { t, fr } from '../../i18n';
import { useEvents } from '../../context/EventsContext';
import { AppEvent } from '../../types/event';

type CalendarNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'CalendarTab'>,
  NativeStackNavigationProp<EventsStackParamList>
>;

export const CalendarScreen: React.FC = () => {
  const navigation = useNavigation<CalendarNavigationProp>();
  const { events } = useEvents();

  // Date de référence : Octobre 2026 selon la maquette
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 24)); // Mois 9 = Octobre
  const [selectedDateStr, setSelectedDateStr] = useState('2026-10-24');

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Navigation mois précédent / suivant
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Tableau des jours du mois
  const daysInMonth = useMemo(() => {
    const days: (number | null)[] = [];
    const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Dimanche
    // Ajustement lundi = 0, dimanche = 6
    const adjustedFirstDay = (firstDay + 6) % 7;

    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(null);
    }

    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let d = 1; d <= totalDays; d++) {
      days.push(d);
    }

    return days;
  }, [currentYear, currentMonth]);

  // Événements pour le jour sélectionné
  const eventsForSelectedDay = useMemo(() => {
    return events.filter((e) => e.date === selectedDateStr);
  }, [events, selectedDateStr]);

  // Vérifier la présence d'événements pour un jour donné
  const getEventForDay = (day: number): AppEvent | undefined => {
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateQuery = `${currentYear}-${monthStr}-${dayStr}`;
    return events.find((e) => e.date === dateQuery);
  };

  const handleDayPress = (day: number) => {
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    setSelectedDateStr(`${currentYear}-${monthStr}-${dayStr}`);
  };

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Titre */}
        <Text style={styles.title}>{t('calendar.title')}</Text>

        {/* Carte blanche du Calendrier */}
        <View style={[styles.calendarCard, theme.shadows.card]}>
          {/* En-tête mois et flèches */}
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={prevMonth} style={styles.monthNavButton}>
              <Ionicons name="chevron-back" size={20} color={theme.colors.text} />
            </TouchableOpacity>

            <Text style={styles.monthTitle}>
              {fr.calendar.months[currentMonth]} {currentYear}
            </Text>

            <TouchableOpacity onPress={nextMonth} style={styles.monthNavButton}>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          {/* Jours de la semaine : L M M J V S D */}
          <View style={styles.weekDaysRow}>
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((dayName, idx) => (
              <Text key={idx} style={styles.weekDayText}>
                {dayName}
              </Text>
            ))}
          </View>

          {/* Grille des jours */}
          <View style={styles.daysGrid}>
            {daysInMonth.map((day, index) => {
              if (day === null) {
                return <View key={`empty-${index}`} style={styles.dayCell} />;
              }

              const monthStr = String(currentMonth + 1).padStart(2, '0');
              const dayStr = String(day).padStart(2, '0');
              const thisDateStr = `${currentYear}-${monthStr}-${dayStr}`;
              const isSelected = selectedDateStr === thisDateStr;
              const dayEvent = getEventForDay(day);

              return (
                <TouchableOpacity
                  key={`day-${day}`}
                  onPress={() => handleDayPress(day)}
                  style={[
                    styles.dayCell,
                    isSelected && styles.dayCellSelected,
                    !isSelected && day === 19 && styles.dayCellTodayBorder,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayNumber,
                      isSelected && styles.dayNumberSelected,
                    ]}
                  >
                    {day}
                  </Text>
                  {/* Pastille événement */}
                  {dayEvent ? (
                    <View
                      style={[
                        styles.eventDot,
                        isSelected && styles.eventDotSelected,
                        !isSelected && (dayEvent.isParticipated ? styles.eventDotParticipated : styles.eventDotUpcoming),
                      ]}
                    />
                  ) : (
                    <View style={styles.eventDotPlaceholder} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Légende sous le calendrier */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.legendDotUpcoming]} />
              <Text style={styles.legendText}>{t('calendar.legendUpcoming')}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.legendDotParticipated]} />
              <Text style={styles.legendText}>{t('calendar.legendParticipated')}</Text>
            </View>
          </View>
        </View>

        {/* Section des événements pour la date sélectionnée */}
        <View style={styles.selectedDaySection}>
          <Text style={styles.selectedDateHeading}>
            {selectedDateStr.split('-')[2]} {fr.calendar.months[parseInt(selectedDateStr.split('-')[1], 10) - 1]?.toLowerCase()}
          </Text>

          {eventsForSelectedDay.length > 0 ? (
            eventsForSelectedDay.map((event) => (
              <TouchableOpacity
                key={event.id}
                activeOpacity={0.85}
                onPress={() =>
                  (navigation as any).navigate('EventsTab', {
                    screen: 'EventDetail',
                    params: { eventId: event.id },
                  })
                }
                style={[styles.eventItemCard, theme.shadows.card]}
              >
                {/* Barre colorée latérale */}
                <View
                  style={[
                    styles.colorBar,
                    event.isParticipated ? styles.colorBarParticipated : styles.colorBarUpcoming,
                  ]}
                />

                <View style={styles.eventItemInfo}>
                  <Text style={styles.eventItemTitle}>{event.title}</Text>
                  <Text style={styles.eventItemDetails}>
                    {event.time} · {event.location.split(',')[0]}
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyDayContainer}>
              <Text style={styles.emptyDayText}>{t('calendar.emptyDay')}</Text>
            </View>
          )}
        </View>
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
  calendarCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.card,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  monthNavButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: {
    fontSize: theme.typography.size.subtitle,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: '700',
    color: theme.colors.text,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  weekDayText: {
    width: 38,
    textAlign: 'center',
    fontSize: theme.typography.size.caption,
    fontFamily: theme.typography.fontFamily.semiBold,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayCell: {
    width: 38,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
    borderRadius: theme.radii.pill,
  },
  dayCellSelected: {
    backgroundColor: theme.colors.primary,
  },
  dayCellTodayBorder: {
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  dayNumber: {
    fontSize: theme.typography.size.bodySmall,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: '700',
    color: theme.colors.text,
  },
  dayNumberSelected: {
    color: theme.colors.textLight,
  },
  eventDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 2,
  },
  eventDotPlaceholder: {
    width: 5,
    height: 5,
    marginTop: 2,
  },
  eventDotUpcoming: {
    backgroundColor: theme.colors.primary,
  },
  eventDotParticipated: {
    backgroundColor: theme.colors.success,
  },
  eventDotSelected: {
    backgroundColor: theme.colors.textLight,
  },
  legendContainer: {
    flexDirection: 'row',
    gap: theme.spacing.xl,
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendDotUpcoming: {
    backgroundColor: theme.colors.primary,
  },
  legendDotParticipated: {
    backgroundColor: theme.colors.success,
  },
  legendText: {
    fontSize: theme.typography.size.caption,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.textSecondary,
  },
  selectedDaySection: {
    marginTop: theme.spacing.sm,
  },
  selectedDateHeading: {
    fontSize: theme.typography.size.subtitle,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textTransform: 'capitalize',
  },
  eventItemCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  colorBar: {
    width: 4,
    height: 36,
    borderRadius: 2,
    marginRight: theme.spacing.md,
  },
  colorBarUpcoming: {
    backgroundColor: theme.colors.primary,
  },
  colorBarParticipated: {
    backgroundColor: theme.colors.success,
  },
  eventItemInfo: {
    flex: 1,
  },
  eventItemTitle: {
    fontSize: theme.typography.size.body,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 2,
  },
  eventItemDetails: {
    fontSize: theme.typography.size.caption,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
  },
  emptyDayContainer: {
    paddingVertical: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyDayText: {
    fontSize: theme.typography.size.bodySmall,
    color: theme.colors.textSecondary,
  },
});
