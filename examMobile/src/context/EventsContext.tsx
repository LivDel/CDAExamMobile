/**
 * Contexte de gestion des événements (CRUD + Participation)
 * Simple, lisible et persistant avec AsyncStorage
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppEvent } from '../types/event';
import { storageService } from '../services/storage';

interface EventsContextType {
  events: AppEvent[];
  isLoading: boolean;
  addEvent: (event: Omit<AppEvent, 'id' | 'isParticipated'>) => Promise<AppEvent>;
  updateEvent: (event: AppEvent) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  toggleParticipation: (id: string) => Promise<void>;
  getEventById: (id: string) => AppEvent | undefined;
  refreshEvents: () => Promise<void>;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Chargement des événements stockés
  const refreshEvents = async () => {
    setIsLoading(true);
    const data = await storageService.getEvents();
    setEvents(data);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshEvents();
  }, []);

  // Ajouter un nouvel événement
  const addEvent = async (eventData: Omit<AppEvent, 'id' | 'isParticipated'>): Promise<AppEvent> => {
    const newEvent: AppEvent = {
      ...eventData,
      id: 'evt-' + Date.now(),
      isParticipated: false,
    };
    const updated = [newEvent, ...events];
    setEvents(updated);
    await storageService.saveEvents(updated);
    return newEvent;
  };

  // Modifier un événement existant
  const updateEvent = async (updatedEvent: AppEvent): Promise<void> => {
    const updated = events.map((item) => (item.id === updatedEvent.id ? updatedEvent : item));
    setEvents(updated);
    await storageService.saveEvents(updated);
  };

  // Supprimer un événement
  const deleteEvent = async (id: string): Promise<void> => {
    const updated = events.filter((item) => item.id !== id);
    setEvents(updated);
    await storageService.saveEvents(updated);
  };

  // Basculer le statut « Participé »
  const toggleParticipation = async (id: string): Promise<void> => {
    const updated = events.map((item) =>
      item.id === id ? { ...item, isParticipated: !item.isParticipated } : item
    );
    setEvents(updated);
    await storageService.saveEvents(updated);
  };

  // Récupérer un événement par son identifiant
  const getEventById = (id: string): AppEvent | undefined => {
    return events.find((item) => item.id === id);
  };

  return (
    <EventsContext.Provider
      value={{
        events,
        isLoading,
        addEvent,
        updateEvent,
        deleteEvent,
        toggleParticipation,
        getEventById,
        refreshEvents,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = (): EventsContextType => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents doit être utilisé à l’intérieur d’un EventsProvider');
  }
  return context;
};
