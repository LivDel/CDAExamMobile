# Mini-Document Technique : Architecture & Choix Techniques — EventEase
> *Livrable officiel exigé par le Cahier des Charges CDA (10 lignes synthétiques pour la soutenance).*

1. **Socle & Typage** : Application mobile développée en React Native avec Expo SDK 57, intégralement typée en TypeScript strict (0 erreur de compilation).
2. **Navigation** : Architecture découplée via React Navigation v7 : `RootNavigator` conditionnel, `AuthNavigator` (Connexion/Inscription) et `TabNavigator` (Événements, Calendrier, Profil) avec `EventsStackNavigator` imbriqué.
3. **Gestion d'État** : Approche KISS sans sur-architecture via le `Context API` natif de React (`AuthContext` pour la session et les comptes, `EventsContext` pour le cycle de vie CRUD des événements).
4. **Persistance Locale** : Stockage asynchrone hors-ligne via `@react-native-async-storage/async-storage` pour les utilisateurs et le catalogue d'événements, avec pré-remplissage initial (`seed`) pour la démonstration.
5. **Charte & Design System** : Respect fidèle de la maquette (Crème `#FFF8F0`, Terracotta `#C2410C`, Sauge `#3F7D58`, police Nunito) centralisé dans `src/constants/` sans aucune valeur magique en dur.
6. **Internationalisation (i18n)** : Centralisation 100% des textes de l'application dans `src/i18n/` garantissant zéro chaîne de caractères en dur dans les vues JSX et une évolutivité multilingue immédiate.
7. **Calendrier Interactif (Bonus)** : Vue mensuelle dynamique développée sur mesure avec navigation temporelle, pastilles thématiques terracotta/sauge et sélection réactive des événements par jour.
8. **Météo Temps Réel (Bonus)** : Intégration d'une API externe en direct (`Open-Meteo`) avec géocodage de la commune de l'événement, extraction des codes WMO et repli fluide en mode hors-ligne.
9. **Géolocalisation & Distance (Bonus)** : Calcul dynamique de la distance entre la position de l'utilisateur et le lieu de l'événement selon la formule trigonométrique géodésique de Haversine.
10. **Robustesse UX & Alertes Natives** : Sécurisation de tous les choix critiques (suppression, déconnexion, désinscription) via des alertes natives de confirmation (`Alert.alert`) avec boutons explicites Oui/Non.
