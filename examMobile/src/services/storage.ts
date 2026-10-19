/**
 * Service de persistance locale utilisant AsyncStorage
 * Persistance locale des comptes, de la session et des événements
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppEvent } from '../types/event';
import { User, UserAccount } from '../types/user';
import { initialEvents } from '../data/initialEvents';

const STORAGE_KEYS = {
  USER: '@eventease_user',
  EVENTS: '@eventease_events',
  ACCOUNTS: '@eventease_accounts',
};

// Comptes préenregistrés pour faciliter la démonstration
export const INITIAL_ACCOUNTS: UserAccount[] = [
  {
    id: 'user-livio',
    name: 'Livio Delenclos',
    email: 'livio.delenclos@test.fr',
    password: 'password123',
  },
  {
    id: 'user-camille',
    name: 'Camille Martin',
    email: 'camille.martin@exemple.fr',
    password: 'password123',
  },
];

export const storageService = {
  /**
   * Récupère la session utilisateur actuellement stockée
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
   * Sauvegarde la session utilisateur
   */
  async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l’utilisateur:', error);
    }
  },

  /**
   * Supprime la session utilisateur (déconnexion)
   */
  async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  },

  /**
   * Récupère tous les comptes enregistrés en local (initialise les comptes démo au besoin)
   */
  async getAccounts(): Promise<UserAccount[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      if (!data) {
        await AsyncStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(INITIAL_ACCOUNTS));
        return INITIAL_ACCOUNTS;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Erreur lors de la lecture des comptes:', error);
      return INITIAL_ACCOUNTS;
    }
  },

  /**
   * Enregistre un nouveau compte utilisateur
   */
  async saveAccount(account: UserAccount): Promise<void> {
    try {
      const accounts = await this.getAccounts();
      const filtered = accounts.filter(
        (a) => a.email.toLowerCase() !== account.email.toLowerCase()
      );
      const updated = [...filtered, account];
      await AsyncStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(updated));
    } catch (error) {
      console.error('Erreur lors de la création du compte:', error);
    }
  },

  /**
   * Récupère la liste des événements (initialise avec le seed si vide)
   */
  async getEvents(): Promise<AppEvent[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.EVENTS);
      if (!data) {
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
      await AsyncStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(INITIAL_ACCOUNTS));
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
    }
  },
};
