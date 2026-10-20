/**
 * Service Météo en direct (Fonctionnalité Bonus du Cahier des Charges CDA)
 * Utilise l'API météo Open-Meteo (libre d'accès, temps réel, sans clé payante)
 * Compatible avec l'intégration météo recommandée dans le sujet.
 */

// Correspondance des codes météo WMO officiels vers des libellés en français
const WMO_CODE_MAP: Record<number, string> = {
  0: 'Ensoleillé',
  1: 'Ensoleillé',
  2: 'Partiellement nuageux',
  3: 'Couvert',
  45: 'Brumeux',
  48: 'Brouillard givrant',
  51: 'Bruine légère',
  53: 'Bruine modérée',
  55: 'Bruine dense',
  61: 'Pluie faible',
  63: 'Pluie modérée',
  65: 'Forte pluie',
  71: 'Chute de neige faible',
  73: 'Chute de neige modérée',
  75: 'Forte chute de neige',
  80: 'Averses légères',
  81: 'Averses modérées',
  82: 'Violentes averses',
  95: 'Orageux',
  96: 'Orage avec grêle',
};

export interface LiveWeather {
  condition: string;
  temperature: number;
}

/**
 * Récupère la météo en temps réel pour une ville ou adresse donnée
 * @param location Libellé du lieu (ex: "Bordeaux", "Paris", "Salle des Fêtes, Lyon")
 * @returns Météo en direct { condition, temperature } ou null si échec
 */
export async function fetchLiveWeather(location: string): Promise<LiveWeather | null> {
  try {
    if (!location || location.trim().length === 0) {
      return null;
    }

    // Extraction du nom de la ville (prend le dernier segment si virgule)
    const segments = location.split(',');
    const queryCity = segments[segments.length - 1].trim();

    // 1. Géocodage pour trouver les coordonnées latitude/longitude
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      queryCity
    )}&count=1&language=fr&format=json`;

    const geoResponse = await fetch(geoUrl);
    if (!geoResponse.ok) {
      return null;
    }

    const geoData = await geoResponse.json();
    if (!geoData.results || geoData.results.length === 0) {
      return null;
    }

    const { latitude, longitude } = geoData.results[0];

    // 2. Appel de l'API météo pour obtenir la température et les conditions actuelles
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`;
    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      return null;
    }

    const weatherData = await weatherResponse.json();
    const current = weatherData.current;

    if (!current) {
      return null;
    }

    const weatherCode = current.weather_code ?? 0;
    const condition = WMO_CODE_MAP[weatherCode] || 'Ensoleillé';
    const temperature = Math.round(current.temperature_2m ?? 20);

    return {
      condition,
      temperature,
    };
  } catch {
    // En cas d'absence de réseau, retour silencieux pour laisser le fallback de l'événement
    return null;
  }
}
