/**
 * Types TypeScript relatifs aux événements de l'association EventEase
 */

export type EventFilterType = 'all' | 'upcoming' | 'participated';

export interface WeatherInfo {
  condition: string; // Ex: "Ciel dégagé", "Partiellement nuageux", "Pluie"
  temperature: number; // Ex: 14 (°C)
  icon?: string; // Nom de l'icône météo
}

export interface AppEvent {
  id: string;
  title: string;
  description: string;
  date: string; // Format ISO ou JJ/MM/AAAA (ex: "2026-10-24")
  time: string; // Format HH:mm (ex: "18h30" ou "18:30")
  location: string; // Ex: "Maison des associations, 12 rue des Lilas"
  distanceKm?: number; // Distance calculée ou simulée (ex: 1.2)
  isParticipated: boolean; // Statut de participation de l'utilisateur connecté
  createdBy?: string; // ID ou nom du créateur
  weather?: WeatherInfo; // Météo optionnelle
}
