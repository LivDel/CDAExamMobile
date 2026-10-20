/**
 * Contexte de gestion des événements (CRUD + Participation + Géolocalisation dynamique)
 * Simple, lisible et persistant avec AsyncStorage
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppEvent } from '../types/event';
import { storageService } from '../services/storage';
import { getUserLocation, getDistanceToLocation, Coordinates } from '../services/location';

interface EventsContextType {
  events: AppEvent[];
  isLoading: boolean;
  userLocation: Coordinates | null;
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
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);

  // Helper pour recalculer et synchroniser les distances réelles avec la position GPS
  const syncDistancesWithLocation = async (
    targetEvents: AppEvent[],
    coords: Coordinates
  ): Promise<AppEvent[]> => {
    let hasChanges = false;
    const updated = await Promise.all(
      targetEvents.map(async (ev) => {
        if (!ev.location) return ev;
        const dist = await getDistanceToLocation(ev.location, coords);
        if (dist !== null && dist !== ev.distanceKm) {
          hasChanges = true;
          return { ...ev, distanceKm: dist };
        }
        return ev;
      })
    );
    if (hasChanges) {
      await storageService.saveEvents(updated);
    }
    return updated;
  };

  // Chargement asynchrone des événements et demande d'autorisation GPS dès l'ouverture de l'application
  useEffect(() => {
    let isMounted = true;

    const initApp = async () => {
      // 1. Chargement immédiat des événements stockés pour un affichage instantané sans latence
      const stored = await storageService.getEvents();
      if (isMounted) {
        setEvents(stored);
        setIsLoading(false);
      }

      // 2. Déclenchement de la popup native d'autorisation GPS dès l'ouverture de l'application
      try {
        const coords = await getUserLocation();
        if (isMounted && coords) {
          setUserLocation(coords);

          // 3. Recalcul immédiat des distances pour que le premier écran affiche le bon kilométrage
          const updatedWithDistances = await syncDistancesWithLocation(stored, coords);
          if (isMounted) {
            setEvents((prev) =>
              prev.map((ev) => {
                const matching = updatedWithDistances.find((u) => u.id === ev.id);
                return matching ? { ...ev, distanceKm: matching.distanceKm } : ev;
              })
            );
          }
        }
      } catch (error) {
        console.warn('Erreur lors de la géolocalisation au démarrage:', error);
      }
    };

    initApp();

    return () => {
      isMounted = false;
    };
  }, []);

  // Rechargement manuel des événements (Pull to refresh)
  const refreshEvents = async () => {
    setIsLoading(true);
    const stored = await storageService.getEvents();

    try {
      const coords = await getUserLocation();
      if (coords) {
        setUserLocation(coords);
        const updated = await syncDistancesWithLocation(stored, coords);
        setEvents(updated);
      } else {
        setEvents(stored);
      }
    } catch {
      setEvents(stored);
    } finally {
      setIsLoading(false);
    }
  };

  // Ajouter un nouvel événement
  const addEvent = async (eventData: Omit<AppEvent, 'id' | 'isParticipated'>): Promise<AppEvent> => {
    // Calcul de la distance réelle avec la position connue si disponible
    let computedDistance = eventData.distanceKm;
    if (computedDistance === undefined && eventData.location) {
      const dist = await getDistanceToLocation(eventData.location, userLocation);
      if (dist !== null) {
        computedDistance = dist;
      }
    }

    const newEvent: AppEvent = {
      ...eventData,
      id: 'evt-' + Date.now(),
      distanceKm: computedDistance,
      isParticipated: false,
    };
    const updated = [newEvent, ...events];
    setEvents(updated);
    await storageService.saveEvents(updated);
    return newEvent;
  };

  // Modifier un événement existant
  const updateEvent = async (updatedEvent: AppEvent): Promise<void> => {
    let finalEvent = updatedEvent;
    if (updatedEvent.location && updatedEvent.distanceKm === undefined) {
      const dist = await getDistanceToLocation(updatedEvent.location, userLocation);
      if (dist !== null) {
        finalEvent = { ...updatedEvent, distanceKm: dist };
      }
    }

    const updated = events.map((item) => (item.id === finalEvent.id ? finalEvent : item));
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
        userLocation,
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
