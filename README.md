# EventEase — Application Mobile de Gestion d'Événements 📅

[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2057-blue.svg?style=flat-square&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.86-61dafb.svg?style=flat-square&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9%20Strict-3178c6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![React Navigation](https://img.shields.io/badge/React%20Navigation-v7-6b52ae.svg?style=flat-square)](https://reactnavigation.org)
[![Code Quality](https://img.shields.io/badge/ESLint-0%20Error-success.svg?style=flat-square&logo=eslint)](https://eslint.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

**EventEase** est une application mobile cross-platform (iOS, Android, Web) moderne et intuitive dédiée à la découverte, l'organisation et la gestion d'événements associatifs (conférences, ateliers, sorties conviviales, actions bénévoles).

Conçue avec **React Native**, **Expo** et **TypeScript**, elle met l'accent sur la simplicité d'usage, une charte visuelle soignée (Crème, Terracotta et Sauge) et des fonctionnalités enrichies (calendrier interactif sur-mesure, météo en direct et calcul géodésique de distance par GPS).

---

## 📑 Sommaire

- [Aperçu des Fonctionnalités](#-aperçu-des-fonctionnalités)
- [Architecture & Choix Techniques](#-architecture--choix-techniques)
- [Arborescence du Projet](#-arborescence-du-projet)
- [Prérequis](#-prérequis)
- [Installation & Démarrage Rapide](#-installation--démarrage-rapide)
- [Comptes & Données de Démonstration](#-comptes--données-de-démonstration)
- [Scripts Disponibles](#-scripts-disponibles)
- [Contrôle Qualité](#-contrôle-qualité)
- [Licence & Auteur](#-licence--auteur)

---

## ✨ Aperçu des Fonctionnalités

### 🔐 1. Authentification & Gestion de Session
- Inscription et connexion dynamiques persistées localement.
- Aiguillage déclaratif de navigation : les écrans internes sont inaccessibles sans être authentifié.
- Déconnexion sécurisée avec alerte native de confirmation Oui / Non.

### 📋 2. Catalogue d'Événements & Filtres Réactifs
- Liste dynamique sous forme de cartes d'événements respectant fidèlement la maquette.
- Filtres instantanés par statut : **Tous**, **À venir**, **Inscrits**.
- Compteur réactif d'événements affichés.
- Rafraîchissement par geste (*Pull-to-refresh*).
- Avatar dynamique avec initiales de l'utilisateur redirigeant vers le profil.

### ➕ 3. Cycle de Vie CRUD Complet
- **Création** d'un nouvel événement via bouton d'action flottant (+ Nouvel événement).
- **Consultation détaillée** avec date formatée en français, heure, lieu, météo prévue, description et participants.
- **Modification** en temps réel avec pré-remplissage des champs.
- **Suppression** sécurisée par confirmation native destructive.
- Sécurisation contre la perte de données (alerte native Oui/Non si l'utilisateur quitte un formulaire en cours de saisie).

### 🤝 4. Inscription & Participation
- Action intuitive « **Je souhaite participer** » / « **✓ Inscrit** ».
- Annulation de participation sécurisée par confirmation native.
- Badge visuel distinctif Sauge sur la carte d'événement.

### 🗓️ 5. Calendrier Mensuel Interactif (Sur-mesure)
- Vue mensuelle interactive développée sans dépendance tierce lourde.
- Navigation fluide entre les mois (précédent / suivant).
- Pastilles colorées sur les jours d'événements (Terracotta pour les événements à venir, Sauge pour les participations).
- Sélection d'un jour affichant instantanément les événements associés en bas de l'écran avec redirection directe.

### ⛅ 6. Météo en Direct (API Open-Meteo)
- Intégration en temps réel de l'API publique Open-Meteo sans clé payante requise.
- Géocodage automatique de la commune de l'événement.
- Traduction instantanée des codes météorologiques internationaux WMO en libellés français (*Ensoleillé, Pluie faible, Nuageux...*).
- Repli gracieux hors-ligne (*graceful fallback*) conservant la météo par défaut si le réseau est indisponible.

### 📍 7. Géolocalisation & Calcul de Distance Réelle
- Demande d'autorisation native GPS du smartphone dès l'ouverture de l'application.
- Résolution géodésique intelligente à 4 étages (géocodeur natif, API Open-Meteo Geocoding, parsing de segments d'adresse et détection de code postal à 5 chiffres).
- Calcul de la distance à vol d'oiseau selon la **formule trigonométrique universelle de Haversine**.
- Synchronisation réactive des distances sur le premier écran dès l'acquisition de la position.

### 👤 8. Profil & Statistiques
- Tableau de bord personnel avec comptage des événements créés et des participations.
- Liste récapitulative des événements rejoints avec accès direct.
- Encart informatif rappelant le stockage des données en local sur l'appareil.

---

## 🏛️ Architecture & Choix Techniques

Le projet respecte rigoureusement les principes de maintenabilité, de robustesse et de simplicité (**KISS** - *Keep It Simple, Stupid*) :

1. **Typage Strict (TypeScript)** : 100 % du code est typé avec zéro `any` implicite et zéro avertissement de compilation.
2. **Navigation Découplée (React Navigation v7)** : Structure imbriquée claire (`RootNavigator` conditionnel ➔ `AuthNavigator` ou `TabNavigator` contenant `EventsStackNavigator`).
3. **Gestion d'État Globale (Context API)** : Utilisation des React Hooks natifs (`AuthContext` pour la session, `EventsContext` pour le CRUD et la géolocalisation), sans sur-architecture Redux inutile pour ce périmètre.
4. **Persistance Asynchrone (AsyncStorage)** : Stockage local des comptes, de la session et des événements avec initialisation automatique de secours (*seed*) pour une démonstration immédiate.
5. **Charte & Design System Centralisés** : Couleurs (Crème `#FFF8F0`, Terracotta `#C2410C`, Sauge `#3F7D58`), espacements, rayons de courbure (16 px) et typographie (Nunito) centralisés dans `src/constants/` sans aucune valeur magique en dur.
6. **Internationalisation (i18n)** : Moteur de traduction sur-mesure typé dans `src/i18n/` garantissant **0 chaîne de caractères en dur** dans les vues JSX et un support natif des pluriels.
7. **UX Mobile Native** : Alertes de confirmation natives iOS / Android via `Alert.alert` avec boutons explicites Oui / Non et cibles tactiles ergonomiques $\ge 44 \times 44$ px.

---

## 📁 Arborescence du Projet

```text
CDAExamMobile/
├── presentation/              # Slides interactifs HTML/CSS de soutenance
│   ├── index.html             # Cockpit Candidat (Chrono 10:00, Démo 4m30, Notes orateur 'P')
│   ├── jury.html              # Vue Jury épurée pour vidéoprojecteur grand écran
│   ├── styles.css & script.js # Moteur des présentations
├── presentation.html          # Point d'accès direct vers la présentation candidat
├── jury.html                  # Point d'accès direct vers la présentation jury
└── examMobile/                # Application Mobile React Native / Expo
    ├── assets/                # Icônes adaptatives, splash screen et images
    ├── src/
    │   ├── components/        # Composants d'interface réutilisables
    │   │   ├── common/        # AppButton, AppInput, ScreenContainer
    │   │   └── events/        # EventCard conforme à la maquette
    │   ├── constants/         # Design System (colors, spacing, radii, theme, typography)
    │   ├── context/           # Gestion d'état globale (AuthContext, EventsContext)
    │   ├── data/              # Données initiales de démonstration (seed)
    │   ├── i18n/              # Dictionnaire français complet et moteur typé t()
    │   ├── navigation/        # Navigateurs (Root, Auth, Tabs, EventsStack)
    │   ├── screens/           # Écrans de l'application
    │   │   ├── auth/          # LoginScreen, RegisterScreen
    │   │   ├── events/        # EventsListScreen, EventDetailScreen, EventFormScreen
    │   │   ├── calendar/      # CalendarScreen (matrice mensuelle dynamique)
    │   │   └── profile/       # ProfileScreen
    │   ├── services/          # Services externes et persistance
    │   │   ├── location.ts    # GPS native expo-location, géocodage & formule Haversine
    │   │   ├── storage.ts     # Wrapper persistance AsyncStorage
    │   │   └── weather.ts     # API Météo Open-Meteo & conversion codes WMO
    │   ├── types/             # Interfaces et types TypeScript
    │   └── utils/             # Utilitaires (alert.ts pour confirmations natives Oui/Non)
    ├── App.tsx                # Point d'entrée React Native avec chargement des polices
    ├── app.json               # Configuration Expo & permissions natives (GPS)
    ├── package.json           # Dépendances et scripts npm
    └── tsconfig.json          # Configuration TypeScript stricte
```

---

## ⚙️ Prérequis

Avant de lancer le projet, assurez-vous d'avoir installé sur votre machine :

- **Node.js** : version LTS recommandée (v18 ou supérieure) — [Télécharger Node.js](https://nodejs.org/)
- **npm** (inclus avec Node.js) ou **yarn**
- **Expo Go** (sur smartphone physique) :
  - [Expo Go sur Google Play Store (Android)](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - [Expo Go sur App Store (iOS)](https://apps.apple.com/app/expo-go/id982107779)
- *(Optionnel)* Un émulateur Android Studio ou un simulateur Xcode si vous préférez tester sur ordinateur.

---

## 🚀 Installation & Démarrage Rapide

### 1. Cloner le dépôt Git
```bash
git clone https://github.com/LivioDel/CDAExamMobile.git
cd CDAExamMobile
```

### 2. Accéder au dossier de l'application mobile
```bash
cd examMobile
```

### 3. Installer les dépendances
```bash
npm install
```

### 4. Démarrer le serveur de développement Expo
```bash
npm run start
# ou directement :
npx expo start
```

### 5. Ouvrir l'application sur votre appareil

Lorsque le terminal affiche le **QR Code** et les options :
- 📱 **Sur smartphone physique (Recommandé)** :
  - **Android** : Ouvrez l'application **Expo Go**, appuyez sur *Scan QR code* et scannez le code affiché dans votre terminal.
  - **iOS (iPhone)** : Ouvrez l'application **Appareil photo** native, visez le QR code et appuyez sur la notification pour l'ouvrir dans **Expo Go**.
  > *Note : Assurez-vous que votre smartphone et votre ordinateur sont connectés au même réseau Wi-Fi.*
- 💻 **Sur navigateur Web** :
  - Appuyez sur la touche `w` dans le terminal ou lancez `npm run web`.
- 🤖 **Sur émulateur Android** :
  - Appuyez sur la touche `a` dans le terminal.
- 🍏 **Sur simulateur iOS** (macOS uniquement) :
  - Appuyez sur la touche `i` dans le terminal.

---

## 👥 Comptes & Données de Démonstration

L'application intègre un jeu de données initial (*seed*) prêt à l'emploi. Dès le lancement, vous pouvez utiliser les comptes démo suivants ou en créer un nouveau directement depuis l'écran d'inscription :

| Nom | Email | Mot de passe | Rôle |
| :--- | :--- | :--- | :--- |
| **Livio Delenclos** | `livio.delenclos@test.fr` | `password123` | Compte Démo Soutenance |
| **Camille Martin** | `camille.martin@exemple.fr` | `password123` | Compte Standard Maquette |

---

## 🛠️ Scripts Disponibles

Dans le dossier `examMobile/` :

| Commande | Action |
| :--- | :--- |
| `npm run start` | Lance le serveur de développement Metro Bundler Expo |
| `npm run android` | Démarre l'application directement sur un émulateur ou appareil Android |
| `npm run ios` | Démarre l'application sur un simulateur iOS |
| `npm run web` | Démarre l'application dans votre navigateur Web |
| `npm run lint` | Exécute l'analyse statique ESLint (0 erreur, 0 avertissement) |
| `npx tsc --noEmit` | Vérifie l'intégralité des types TypeScript (0 erreur) |

---

## 🎯 Contrôle Qualité

Le projet a été développé selon des critères stricts de qualité logicielle :

- **TypeScript** : `npx tsc --noEmit` validé avec **0 erreur**.
- **ESLint** : `npm run lint` validé avec **0 erreur et 0 avertissement**.
- **Commentaires** : 100 % des fichiers et des fonctions métier clés sont commentés en français.
- **Design System** : Conformité visuelle totale avec la maquette officielle (couleurs, polices, cibles tactiles $\ge 44$ px).
- **Zéro texte en dur** : Toutes les chaînes visibles passent par le dictionnaire `src/i18n/`.

---

## 🎤 Présentation de Soutenance

Pour lancer le diaporama officiel de soutenance (format 10 minutes, démo comprise) :
- Ouvrez simplement le fichier `presentation.html` (ou `presentation/index.html`) dans n'importe quel navigateur.
- Diaporama classique épuré (7 slides), fluide et calibré pour l'épreuve orale.
- Navigation intuitive : touches Flèches (Gauche/Droite), Espace, ou barre de contrôles inférieure (chronomètre 10 min discret et plein écran `F`).

---

## 📄 Licence & Auteur

- **Auteur** : Livio Delenclos
- **Projet** : Épreuve Pratique Mobile — Concepteur Développeur d'Applications (CDA)
- **Licence** : [MIT](examMobile/LICENSE)
