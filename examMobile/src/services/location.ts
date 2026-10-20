/**
 * Service de Géolocalisation et calcul de distance (Fonctionnalité Bonus du Cahier des Charges CDA)
 * Calcule la distance réelle entre la position de l'utilisateur et le lieu de l'événement
 * via la formule de Haversine (distance géodésique).
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Coordonnées de référence pour les villes récurrentes de l'application
const CITY_COORDINATES: Record<string, Coordinates> = {
  bordeaux: { latitude: 44.8378, longitude: -0.5792 },
  paris: { latitude: 48.8566, longitude: 2.3522 },
  lyon: { latitude: 45.764, longitude: 4.8357 },
  marseille: { latitude: 43.2965, longitude: 5.3698 },
  toulouse: { latitude: 43.6047, longitude: 1.4442 },
  nantes: { latitude: 47.2184, longitude: -1.5536 },
  lille: { latitude: 50.6292, longitude: 3.0573 },
  strasbourg: { latitude: 48.5734, longitude: 7.7521 },
  montpellier: { latitude: 43.6108, longitude: 3.8767 },
  rennes: { latitude: 48.1173, longitude: -1.6778 },
};

// Position par défaut de l'utilisateur pour la démonstration (Bordeaux Centre)
export const DEFAULT_USER_LOCATION: Coordinates = {
  latitude: 44.8378,
  longitude: -0.5792,
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

/**
 * Tente de trouver les coordonnées GPS d'une adresse ou d'un nom de lieu
 */
export function extractCoordinates(location: string): Coordinates {
  if (!location) {
    return DEFAULT_USER_LOCATION;
  }

  const normalized = location.toLowerCase();

  for (const [city, coords] of Object.entries(CITY_COORDINATES)) {
    if (normalized.includes(city)) {
      return coords;
    }
  }

  // Si lieu précis non référencé, décalage léger pour simuler un quartier proche
  return {
    latitude: DEFAULT_USER_LOCATION.latitude + 0.015,
    longitude: DEFAULT_USER_LOCATION.longitude + 0.02,
  };
}

/**
 * Récupère la position géographique de l'utilisateur (GPS natif ou navigateur)
 */
export function getUserLocation(): Promise<Coordinates> {
  return new Promise((resolve) => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          // Si permission refusée ou indisponible, fallback position par défaut
          resolve(DEFAULT_USER_LOCATION);
        },
        { timeout: 5000, enableHighAccuracy: false }
      );
    } else {
      resolve(DEFAULT_USER_LOCATION);
    }
  });
}
