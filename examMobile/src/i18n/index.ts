/**
 * Moteur i18n léger, réactif et typé pour EventEase
 * Tous les textes passent obligatoirement par cette fonction
 */

import { fr } from './fr';

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
  ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
  : `${Key}`;
}[keyof ObjectType & (string | number)];

export type I18nKey = NestedKeyOf<typeof fr>;

/**
 * Récupère une chaîne de traduction à partir de sa clé imbriquée (ex: "auth.loginButton")
 * Supporte le remplacement de paramètres %{nomParam}
 */
export function t(key: string, params?: Record<string, string | number>): string {
  // Support automatique du pluriel si un paramètre count est fourni
  let targetKey = key;
  if (params && typeof params.count === 'number') {
    const pluralSuffix = params.count <= 1 ? '_one' : '_other';
    const candidate = `${key}${pluralSuffix}`;
    if (getNestedValue(fr, candidate)) {
      targetKey = candidate;
    }
  }

  const raw = getNestedValue(fr, targetKey);
  if (typeof raw !== 'string') {
    // Clé de secours si manquante
    return key;
  }

  if (!params) {
    return raw;
  }

  // Remplacement des variables %{nom}
  return raw.replace(/%\{(\w+)\}/g, (_, placeholder) => {
    return params[placeholder] !== undefined ? String(params[placeholder]) : `%{${placeholder}}`;
  });
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), obj);
}

export { fr };
export default t;
