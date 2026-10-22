# EventEase — Application Mobile React Native / Expo 📅

[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2057-blue.svg?style=flat-square&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.86-61dafb.svg?style=flat-square&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9%20Strict-3178c6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![React Navigation](https://img.shields.io/badge/React%20Navigation-v7-6b52ae.svg?style=flat-square)](https://reactnavigation.org)
[![Code Quality](https://img.shields.io/badge/ESLint-0%20Error-success.svg?style=flat-square&logo=eslint)](https://eslint.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

Ce dossier contient le code source complet de l'application mobile **EventEase**, développée avec **React Native**, **Expo SDK 57**, et entièrement typée en **TypeScript**.

Pour une documentation globale du projet et les slides de soutenance, consultez le [README racine](../README.md).

---

## 📑 Sommaire

- [Aperçu de l'Application](#-aperçu-de-lapplication)
- [Architecture & Choix Techniques](#-architecture--choix-techniques)
- [Structure du Code Source](#-structure-du-code-source)
- [Installation & Démarrage](#-installation--démarrage)
- [Comptes de Démonstration](#-comptes-de-démonstration)
- [Commandes Utiles](#-commandes-utiles)
- [Contrôle Qualité](#-contrôle-qualité)

---

## ✨ Aperçu de l'Application

- 🔐 **Authentification locale** avec persistance de session (`AsyncStorage`).
- 📋 **Catalogue des événements** avec filtres dynamiques (*Tous*, *À venir*, *Inscrits*) et pull-to-refresh.
- ➕ **CRUD complet** (Création, Consultation détaillée, Modification, Suppression).
- 🤝 **Inscription / Désinscription** avec confirmations natives de sécurité Oui / Non.
- 🗓️ **Calendrier interactif sur-mesure** (matrice mensuelle dynamique, pastilles d'événements, sélection du jour).
- ⛅ **Météo en temps réel** via l'API publique Open-Meteo avec conversion des codes WMO en français.
- 📍 **Géolocalisation GPS native & Calcul de distance** par la formule géodésique universelle de Haversine.
- 🎨 **Charte graphique respectée** : Crème `#FFF8F0`, Terracotta `#C2410C`, Sauge `#3F7D58`, police Nunito et cibles tactiles $\ge 44$ px.
- 🌐 **Internationalisation (i18n)** : 100 % des textes centralisés dans `src/i18n/`, zéro chaîne en dur.

---

## 🏛️ Architecture & Choix Techniques

1. **Approche KISS (Keep It Simple, Stupid)** : Privilégie les React Hooks natifs et le `Context API` (`AuthContext`, `EventsContext`), sans complexité superflue.
2. **Navigation Découplée (React Navigation v7)** :
   - `RootNavigator` : aiguillage conditionnel selon la présence de l'utilisateur.
   - `AuthNavigator` : pile d'authentification (`LoginScreen`, `RegisterScreen`).
   - `TabNavigator` : barre d'onglets inférieure (`Événements`, `Calendrier`, `Profil`).
   - `EventsStackNavigator` : pile imbriquée pour le flux des événements (`Liste`, `Détail`, `Formulaire modal`).
3. **Persistance Asynchrone** : Stockage local avec `@react-native-async-storage/async-storage` et pré-remplissage (*seed*) des 4 événements de la maquette.
4. **Mini-document technique** : Consultez [ARCHITECTURE.md](ARCHITECTURE.md) pour la synthèse technique officielle.

---

## 📁 Structure du Code Source

```text
src/
├── components/          # Composants UI modulaires
│   ├── common/          # Boutons, champs de saisie, conteneur sécurisé
│   └── events/          # Cartes d'événements (EventCard)
├── constants/           # Design System (colors, theme, spacing, radii, typography)
├── context/             # Contextes React (AuthContext, EventsContext)
├── data/                # Données initiales de démonstration (initialEvents.ts)
├── i18n/                # Système d'internationalisation et dictionnaire français
├── navigation/          # Navigateurs React Navigation
├── screens/             # Vues de l'application (auth, events, calendar, profile)
├── services/            # Services externes (location, storage, weather)
├── types/               # Définitions TypeScript (event, navigation, user)
└── utils/               # Fonctions utilitaires (alert.ts pour confirmations natives)
```

---

## 🚀 Installation & Démarrage

### 1. Installation des dépendances
```bash
npm install
```

### 2. Démarrer le serveur Expo
```bash
npx expo start
```

### 3. Exécution
- **Sur smartphone physique** : Scannez le QR Code avec **Expo Go** (Android) ou l'application **Appareil photo** (iOS).
- **Sur navigateur Web** : Tapez `w` dans le terminal.
- **Sur émulateur Android** : Tapez `a` dans le terminal.
- **Sur simulateur iOS** : Tapez `i` dans le terminal.

---

## 👥 Comptes de Démonstration

Des comptes avec mot de passe `password123` sont déjà enregistrés en local :
- **Livio Delenclos** : `livio.delenclos@test.fr`
- **Camille Martin** : `camille.martin@exemple.fr`

---

## 🛠️ Commandes Utiles

```bash
npm run start       # Démarre Metro Bundler Expo
npm run android     # Lance sur émulateur Android
npm run ios         # Lance sur simulateur iOS
npm run web         # Lance sur le navigateur Web
npm run lint        # Exécute l'analyse statique ESLint
npx tsc --noEmit    # Vérifie le typage strict TypeScript
```

---

## 🎯 Contrôle Qualité

- TypeScript : **0 erreur** (`npx tsc --noEmit`)
- ESLint : **0 erreur, 0 avertissement** (`npm run lint`)
- Commentaires : **100 % en français**
- Accessibilité : Cibles tactiles $\ge 44 \times 44$ px
