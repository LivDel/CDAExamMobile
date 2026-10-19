/**
 * Service de persistance locale utilisant AsyncStorage
 * Persistance locale des données utilisateur et des événements
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppEvent } from '../types/event';
import { User } from '../types/user';
import { initialEvents } from '../data/initialEvents';

const STORAGE_KEYS = {
  USER: '@eventease_user',
  EVENTS: '@eventease_events',
};

// Utilisateur démo par défaut si aucun utilisateur n'est enregistré
export const DEFAULT_USER: User = {
  id: 'user-livio',
  name: 'Livio Delenclos',
  email: 'livio.delenclos@test.fr',
};

export const storageService = {
  /**
   * Récupère l'utilisateur actuellement stocké
   */
  async getUser(): Promise<User | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Erreur lors de la lecture de l’utilisateur:', error);
      return null;
    }
  },

  /**
   * Sauvegarde l'utilisateur dans le stockage local
   */
  async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l’utilisateur:', error);
    }
  },

  /**
   * Supprime l'utilisateur (déconnexion)
   */
  async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  },

  /**
   * Récupère la liste des événements (initialise avec le seed si vide)
   */
  async getEvents(): Promise<AppEvent[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.EVENTS);
      if (!data) {
        // Initialisation avec le seed de démo
        await AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(initialEvents));
        return initialEvents;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Erreur lors de la lecture des événements:', error);
      return initialEvents;
    }
  },

  /**
   * Sauvegarde la liste complète des événements
   */
  async saveEvents(events: AppEvent[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des événements:', error);
    }
  },

  /**
   * Réinitialise les données locales avec les valeurs par défaut
   */
  async resetToDefaults(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(initialEvents));
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
    }
  },
};
