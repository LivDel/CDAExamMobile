/**
 * Définition des types pour React Navigation
 */

import { NavigatorScreenParams } from '@react-navigation/native';

// Paramètres de la Stack d'authentification
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Paramètres de la Stack Événements
export type EventsStackParamList = {
  EventsList: undefined;
  EventDetail: { eventId: string };
  EventForm: { eventId?: string }; // Si eventId est fourni, mode modification, sinon création
};

// Paramètres des Bottom Tabs
export type TabParamList = {
  EventsTab: NavigatorScreenParams<EventsStackParamList>;
  CalendarTab: undefined;
  ProfileTab: undefined;
};

// Paramètres de la racine
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<TabParamList>;
};
