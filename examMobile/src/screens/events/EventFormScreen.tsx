/**
 * Écran Formulaire Ajout / Modification (Écran 5 de la Maquette)
 * Reproduction fidèle de la maquette
 * Zéro texte en dur, utilisation de i18n
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EventsStackParamList } from '../../types/navigation';
import { ScreenContainer } from '../../components/common/ScreenContainer';
import { AppInput } from '../../components/common/AppInput';
import { AppButton } from '../../components/common/AppButton';
import { theme } from '../../constants/theme';
import { t } from '../../i18n';
import { useEvents } from '../../context/EventsContext';
import { confirmAction } from '../../utils/alert';
import { getDistanceToLocation } from '../../services/location';
import { fetchLiveWeather } from '../../services/weather';

type Props = NativeStackScreenProps<EventsStackParamList, 'EventForm'>;

export const EventFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const eventId = route.params?.eventId;
  const isEditing = Boolean(eventId);
  const { getEventById, addEvent, updateEvent, userLocation } = useEvents();

  // En mode édition, initialisation directe avec l'événement existant (évite un re-render effect)
  const existing = eventId ? getEventById(eventId) : undefined;

  const [title, setTitle] = useState(existing?.title || '');
  const [description, setDescription] = useState(existing?.description || '');
  const [date, setDate] = useState(existing?.date || '2026-10-30');
  const [time, setTime] = useState(existing?.time || '14h00');
  const [location, setLocation] = useState(existing?.location || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!title.trim() || !description.trim() || !date.trim() || !location.trim()) {
      setError(t('form.errorRequired'));
      return;
    }

    setError('');
    setLoading(true);

    const normalizeDate = (rawDate: string): string => {
      const trimmed = rawDate.trim();
      if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmed)) {
        const [d, m, y] = trimmed.split('/');
        return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      }
      return trimmed;
    };

    const finalDate = normalizeDate(date);

    try {
      const loc = location.trim();
      const computedDistance =
        (await getDistanceToLocation(loc, userLocation)) ?? existing?.distanceKm;
      const liveW = await fetchLiveWeather(loc);

      if (isEditing && eventId) {
        const existing = getEventById(eventId);
        if (existing) {
          await updateEvent({
            ...existing,
            title: title.trim(),
            description: description.trim(),
            date: finalDate,
            time: time.trim() || '18h00',
            location: loc,
            distanceKm: computedDistance,
            weather: liveW || existing.weather,
          });
        }
      } else {
        await addEvent({
          title: title.trim(),
          description: description.trim(),
          date: finalDate,
          time: time.trim() || '18h00',
          location: loc,
          distanceKm: computedDistance,
          weather: liveW || {
            condition: 'Ensoleillé',
            temperature: 20,
          },
        });
      }
      navigation.goBack();
    } catch {
      setError(t('form.errorRequired'));
    } finally {
      setLoading(false);
    }
  };

  // Confirmation native Oui / Non en cas de modification en cours
  const handleCancel = () => {
    const hasChanges = title.trim().length > 0 || description.trim().length > 0 || location.trim().length > 0;
    if (hasChanges) {
      confirmAction(
        t('form.discardChangesTitle'),
        t('form.discardChangesConfirm'),
        () => navigation.goBack(),
        t('common.yes'),
        t('common.no'),
        true
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <ScreenContainer>
      {/* Barre supérieure : Bouton fermer et Titre */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={handleCancel}
          style={styles.closeButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>
          {isEditing ? t('form.editTitle') : t('form.createTitle')}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Titre */}
          <AppInput
            label={t('form.titleLabel')}
            placeholder={t('form.titlePlaceholder')}
            value={title}
            onChangeText={setTitle}
          />

          {/* Description */}
          <AppInput
            label={t('form.descriptionLabel')}
            placeholder={t('form.descriptionPlaceholder')}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          {/* Ligne Date et Heure */}
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <AppInput
                label={t('form.dateLabel')}
                placeholder={t('form.datePlaceholder')}
                value={date}
                onChangeText={setDate}
                icon={
                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color={theme.colors.textSecondary}
                  />
                }
              />
            </View>

            <View style={styles.halfWidth}>
              <AppInput
                label={t('form.timeLabel')}
                placeholder={t('form.timePlaceholder')}
                value={time}
                onChangeText={setTime}
                icon={
                  <Ionicons
                    name="time-outline"
                    size={18}
                    color={theme.colors.textSecondary}
                  />
                }
              />
            </View>
          </View>

          {/* Lieu */}
          <AppInput
            label={t('form.locationLabel')}
            placeholder={t('form.locationPlaceholder')}
            value={location}
            onChangeText={setLocation}
            hint={t('form.locationHint')}
            icon={
              <Ionicons
                name="location-outline"
                size={18}
                color={theme.colors.textSecondary}
              />
            }
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Boutons d'action : Enregistrer & Annuler */}
          <View style={styles.actionButtons}>
            <AppButton
              title={t('form.saveButton')}
              onPress={handleSave}
              loading={loading}
              style={styles.saveButton}
            />

            <TouchableOpacity
              onPress={handleCancel}
              style={styles.cancelLink}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.cancelText}>{t('form.cancelButton')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    fontSize: theme.typography.size.title,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: '800',
    color: theme.colors.text,
  },
  placeholder: {
    width: 44,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxxl,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  errorText: {
    fontSize: theme.typography.size.bodySmall,
    color: theme.colors.danger,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  actionButtons: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  saveButton: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  cancelLink: {
    paddingVertical: theme.spacing.sm,
  },
  cancelText: {
    fontSize: theme.typography.size.body,
    fontFamily: theme.typography.fontFamily.bold,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
});
