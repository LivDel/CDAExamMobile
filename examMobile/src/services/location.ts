/**
 * Service de Géolocalisation et calcul de distance (Fonctionnalité Bonus du Cahier des Charges CDA)
 * Utilise expo-location pour demander la permission native au système et récupérer le GPS réel.
 * Géocode le lieu de l'événement et calcule la distance exacte via la formule de Haversine.
 */

import * as Location from 'expo-location';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Coordonnées de référence par défaut si le GPS est désactivé
export const DEFAULT_USER_LOCATION: Coordinates = {
  latitude: 50.6694,
  longitude: 3.1306,
};

/**
 * Calcule la distance à vol d'oiseau (en kilomètres) entre deux points GPS
 * selon la formule universelle de Haversine
 */
export function calculateDistanceKm(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const EARTH_RADIUS_KM = 6371;

  const toRad = (value: number) => (value * Math.PI) / 180;

  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);

  const lat1 = toRad(coord1.latitude);
  const lat2 = toRad(coord2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  // Arrondi à un chiffre après la virgule
  return Math.round(distance * 10) / 10;
}

// Cache mémoire des coordonnées géocodées pour optimiser les performances
const coordsCache = new Map<string, Coordinates>();

/**
 * Demande l'autorisation GPS native (popup système iOS / Android)
 * et renvoie les coordonnées réelles de l'appareil
 */
export async function getUserLocation(): Promise<Coordinates | null> {
  try {
    // 1. Demande d'autorisation via la popup native du système
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      // Permission refusée par l'utilisateur
      return null;
    }

    // 2. Lecture rapide de la dernière position connue pour réactivité maximale
    const lastPosition = await Location.getLastKnownPositionAsync();
    if (lastPosition?.coords) {
      return {
        latitude: lastPosition.coords.latitude,
        longitude: lastPosition.coords.longitude,
      };
    }

    // 3. Lecture de la position GPS actuelle si aucune position en cache
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  } catch (error) {
    // En cas d'erreur ou d'exécution sur simulateur sans GPS
    console.warn('Erreur récupération GPS:', error);
    return null;
  }
}

/**
 * Géocode un nom de ville ou une adresse pour obtenir ses coordonnées GPS réelles
 * Utilise d'abord le géocodeur natif de l'appareil, puis l'API publique Open-Meteo avec recherche intelligente
 */
export async function extractCoordinates(location: string): Promise<Coordinates | null> {
  if (!location || location.trim().length === 0) {
    return null;
  }

  const query = location.trim();
  const cacheKey = query.toLowerCase();

  if (coordsCache.has(cacheKey)) {
    return coordsCache.get(cacheKey)!;
  }

  // 1. Géocodage natif de la plateforme (Apple Maps / Google Play Services)
  try {
    const results = await Location.geocodeAsync(query);
    if (results && results.length > 0) {
      const coords = {
        latitude: results[0].latitude,
        longitude: results[0].longitude,
      };
      coordsCache.set(cacheKey, coords);
      return coords;
    }
  } catch {
    // Poursuite avec le fallback API
  }

  // 2. Géocodage en ligne via l'API Open-Meteo Geocoding avec résolution intelligente
  try {
    const searchOpenMeteo = async (term: string): Promise<Coordinates | null> => {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        term
      )}&count=1&language=fr&format=json`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          return {
            latitude: data.results[0].latitude,
            longitude: data.results[0].longitude,
          };
        }
      }
      return null;
    };

    // A. Recherche sur la chaîne complète (ex: "Courrières")
    let coords = await searchOpenMeteo(query);
    if (coords) {
      coordsCache.set(cacheKey, coords);
      return coords;
    }

    // B. Recherche par segments (ex: "Salle des fêtes, 62710 Courrières")
    const segments = query.split(',').map((s) => s.trim()).filter(Boolean);
    for (let i = segments.length - 1; i >= 0; i--) {
      coords = await searchOpenMeteo(segments[i]);
      if (coords) {
        coordsCache.set(cacheKey, coords);
        return coords;
      }
    }

    // C. Recherche par code postal français (5 chiffres consécutifs)
    const postalMatch = query.match(/\b\d{5}\b/);
    if (postalMatch) {
      coords = await searchOpenMeteo(postalMatch[0]);
      if (coords) {
        coordsCache.set(cacheKey, coords);
        return coords;
      }
    }

    // D. Recherche par mots-clés significatifs (ex: "Gare de Fontainebleau-Avon" -> "Fontainebleau")
    const ignoredWords = new Set([
      'gare',
      'salle',
      'place',
      'maison',
      'centre',
      'parc',
      'rue',
      'avenue',
      'boulevard',
      'polyvalente',
      'associations',
      'village',
      'quartier',
    ]);
    const words = query
      .split(/[\s,-]+/)
      .map((w) => w.trim())
      .filter((w) => w.length > 3 && !ignoredWords.has(w.toLowerCase()));

    for (const w of words) {
      coords = await searchOpenMeteo(w);
      if (coords) {
        coordsCache.set(cacheKey, coords);
        return coords;
      }
    }
  } catch {
    // Échec de la requête réseau
  }

  return null;
}

/**
 * Calcule dynamiquement la distance entre la position de l'utilisateur et le lieu de l'événement
 * Déclenche la demande d'autorisation native si nécessaire
 */
export async function getDistanceToLocation(
  eventLocation: string,
  userCoords?: Coordinates | null
): Promise<number | null> {
  if (!eventLocation || eventLocation.trim().length === 0) {
    return null;
  }

  // 1. Récupération des coordonnées de l'utilisateur (GPS réel ou fallback par défaut)
  const coordsUser = userCoords ?? (await getUserLocation()) ?? DEFAULT_USER_LOCATION;

  // 2. Géocodage du lieu de l'événement (ex. "Courrières" -> 50.4578, 2.9472)
  const coordsEvent = await extractCoordinates(eventLocation);
  if (!coordsEvent) {
    return null;
  }

  // 3. Calcul de la distance géodésique Haversine
  return calculateDistanceKm(coordsUser, coordsEvent);
}
