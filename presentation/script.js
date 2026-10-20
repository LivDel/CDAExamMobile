/**
 * Logique Interactive de la Présentation CDA - EventEase
 * Auteur : Livio DELENCLOS
 * Fonctionnalités : Navigation clavier, Chronomètre 10 min, Timer Démo 4m30, Notes Orateur, Sommaire
 */

// Données des Speaker Notes pour chaque slide (Le script oral professionnel pour la soutenance)
const speakerNotes = [
  // Slide 1
  `<strong>0:00 - 1:00 | Introduction & Cadre</strong><br><br>
  « Bonjour mesdames et messieurs les membres du jury. Je m'appelle <strong>Livio Delenclos</strong> et je vous présente aujourd'hui le prototype mobile de l'association <strong>EventEase</strong>, développé dans le cadre du titre professionnel Concepteur Développeur d'Applications.<br><br>
  L'enjeu : concevoir en 4 jours une application mobile React Native fluide, robuste et prête pour la production, intégrant l'ensemble des exigences du cahier des charges ainsi que 100% des fonctionnalités bonus. »`,

  // Slide 2
  `<strong>1:00 - 2:00 | Cahier des Charges & Périmètre</strong><br><br>
  « Le cahier des charges nous fixait un cadre précis et structuré :<br>
  • <strong>Les fonctionnalités de base :</strong> authentification simplifiée, consultation des événements, CRUD complet et gestion des inscriptions.<br>
  • <strong>La qualité logicielle :</strong> rigueur architecturale, typage strict et absence totale de valeurs en dur.<br>
  • <strong>La persistance locale :</strong> sauvegarde et restauration transparente via AsyncStorage.<br>
  • <strong>Les fonctionnalités bonus :</strong> calendrier mensuel interactif, météo en temps réel, géolocalisation native et calcul exact de distance.<br>
  • <strong>Le livrable technique :</strong> le mini-document d'architecture en 10 lignes synthétiques.<br><br>
  Chaque point a été méthodiquement implémenté et validé. »`,

  // Slide 3
  `<strong>2:00 - 3:00 | Architecture & Mini-Doc (10 Lignes)</strong><br><br>
  « Voici le mini-document technique exigé par le référentiel, synthétisé en 10 choix clés :<br>
  1. <strong>Expo SDK 57 & TypeScript strict</strong> pour une fiabilité totale.<br>
  2. <strong>React Navigation v7</strong> avec découplage strict entre AuthStack, TabNavigator et EventsStack.<br>
  3. <strong>Context API</strong> pour une gestion d'état pragmatique sans sur-ingénierie.<br>
  4. <strong>AsyncStorage</strong> pour une persistance hors-ligne transparente.<br>
  5. <strong>Design System</strong> harmonieux fidèle à la maquette (Terracotta, Sauge, Crème, police Nunito).<br>
  6. <strong>i18n centralisé</strong> : 100% des libellés externalisés, 0 texte en dur.<br>
  7. <strong>Calendrier dynamique</strong> avec pastilles temporelles.<br>
  8. <strong>Météo en direct</strong> via l'API Open-Meteo.<br>
  9. <strong>Géolocalisation native</strong> & formule trigonométrique de Haversine.<br>
  10. <strong>Alertes natives de confirmation</strong> (Oui/Non) pour toute action critique. »`,

  // Slide 4
  `<strong>3:00 - 7:30 | DÉMONSTRATION EN DIRECT (4 min 30)</strong><br><br>
  <span style="color:#fbbf24;">⚠️ <strong>Cœur de la soutenance ! Lancez le timer spécial démo ci-dessus.</strong></span><br><br>
  <strong>Scénario minuté :</strong><br>
  1. <em>[45s]</em> Ouvrez l'app sur le smartphone : montrez la <strong>popup native d'autorisation GPS</strong> à l'ouverture, puis créez un nouveau compte avec mot de passe.<br>
  2. <em>[45s]</em> Sur l'écran d'accueil, montrez le calcul automatique de distance dynamique (ex. Courrières : 26,9 km), testez les filtres Tous / À venir / Inscrits.<br>
  3. <em>[60s]</em> Créez un nouvel événement. Montrez la confirmation d'abandon en cas de retour non sauvegardé.<br>
  4. <em>[45s]</em> Sur le détail : montrez la météo récupérée en direct par l'API, cliquez sur « Je souhaite participer » (bascule en « ✓ Inscrit »), puis tentez d'annuler pour afficher l'alerte native Oui/Non.<br>
  5. <em>[30s]</em> Allez sur l'onglet Calendrier, parcourez les mois et cliquez sur un jour contenant un événement.<br>
  6. <em>[30s]</em> Prouvez la persistance AsyncStorage en tuant l'application et en la rouvrant. Supprimez un événement avec confirmation Oui/Non.<br>
  7. <em>[15s]</em> Déconnectez-vous depuis le profil. »`,

  // Slide 5
  `<strong>7:30 - 8:15 | Fonctionnalités Bonus Majeures</strong><br><br>
  « Nous avons poussé l'expérience au-delà des attentes avec 4 bonus majeurs :<br>
  • <strong>Le Calendrier interactif</strong> : vue mensuelle fluide et pastilles événementielles.<br>
  • <strong>L'API Météo temps réel</strong> : conversion automatique des codes météo WMO en français avec température en direct.<br>
  • <strong>La Géolocalisation native & Haversine</strong> : calcul trigonométrique de la distance réelle au kilomètre près dès l'écran d'accueil.<br>
  • <strong>La Charte graphique & Typographie</strong> : intégration de la police Google Fonts Nunito, splash screen personnalisé et retour haptique visuel. »`,

  // Slide 6
  `<strong>8:15 - 9:00 | Qualité du Code & Bonnes Pratiques</strong><br><br>
  « La qualité du code a été validée par des métriques strictes :<br>
  • <strong>0 erreur TypeScript</strong> avec <code>npx tsc --noEmit</code>.<br>
  • <strong>0 erreur et 0 warning ESLint</strong> avec <code>npx expo lint</code>.<br>
  • <strong>Zéro chaîne magique</strong> : tout le style est issu de <code>theme.ts</code>.<br>
  • <strong>Zéro texte en dur</strong> : 100% des chaînes proviennent du dictionnaire français <code>i18n/fr.ts</code>.<br>
  • <strong>Règle 11</strong> : Utilisation exclusive des alertes natives du téléphone pour tous les choix critiques. »`,

  // Slide 7
  `<strong>9:00 - 9:30 | Bilan & Perspectives</strong><br><br>
  « En 4 jours, ce prototype a prouvé la viabilité technique et ergonomique d'EventEase.<br><br>
  L'application est saine, maintenable et découplée. Les évolutions naturelles consisteraient à brancher un backend Node.js / PostgreSQL pour la synchronisation multi-utilisateurs et des notifications push via Expo Notifications. »`,

  // Slide 8
  `<strong>9:30 - 10:00 | Conclusion & Échanges avec le Jury</strong><br><br>
  « Je vous remercie chaleureusement pour votre écoute et votre attention. Je suis maintenant à votre entière disposition pour répondre à vos questions sur l'architecture, le code ou les choix d'implémentation. »`
];

document.addEventListener('DOMContentLoaded', () => {
  let currentSlide = 0;
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  const progressDots = document.getElementById('progressDots');
  const slideCounter = document.getElementById('slideCounter');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const speakerContent = document.getElementById('speakerContent');
  const speakerPanel = document.getElementById('speakerPanel');
  const toggleNotesBtn = document.getElementById('toggleNotesBtn');
  const overviewModal = document.getElementById('overviewModal');
  const overviewGrid = document.getElementById('overviewGrid');
  const toggleOverviewBtn = document.getElementById('toggleOverviewBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');

  // Génération des dots de progression
  slides.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.className = `progress-dot ${idx === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => goToSlide(idx));
    progressDots.appendChild(dot);
  });

  // Génération de la grille du sommaire
  slides.forEach((slide, idx) => {
    const title = slide.querySelector('.slide-title')?.innerText || `Slide ${idx + 1}`;
    const timeTag = slide.querySelector('.slide-time-tag')?.innerText || '';
    const card = document.createElement('div');
    card.className = `thumb-card ${idx === 0 ? 'active' : ''}`;
    card.innerHTML = `
      <div class="thumb-num">SLIDE 0${idx + 1}</div>
      <div class="thumb-title">${title}</div>
      <div class="thumb-time">${timeTag}</div>
    `;
    card.addEventListener('click', () => {
      goToSlide(idx);
      overviewModal.classList.remove('open');
    });
    overviewGrid.appendChild(card);
  });

  // Mise à jour de l'affichage du slide
  function updateSlideView() {
    slides.forEach((slide, idx) => {
      slide.classList.remove('active', 'prev');
      if (idx === currentSlide) {
        slide.classList.add('active');
      } else if (idx < currentSlide) {
        slide.classList.add('prev');
      }
    });

    // Mise à jour dots
    document.querySelectorAll('.progress-dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlide);
    });

    // Mise à jour sommaire
    document.querySelectorAll('.thumb-card').forEach((card, idx) => {
      card.classList.toggle('active', idx === currentSlide);
    });

    // Compteur
    slideCounter.innerText = `${currentSlide + 1} / ${totalSlides}`;

    // Boutons
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === totalSlides - 1;

    // Mise à jour des Speaker Notes
    if (speakerContent && speakerNotes[currentSlide]) {
      speakerContent.innerHTML = speakerNotes[currentSlide];
    }
  }

  function goToSlide(index) {
    if (index >= 0 && index < totalSlides) {
      currentSlide = index;
      updateSlideView();
    }
  }

  function nextSlide() {
    if (currentSlide < totalSlides - 1) {
      currentSlide++;
      updateSlideView();
    }
  }

  function prevSlide() {
    if (currentSlide > 0) {
      currentSlide--;
      updateSlideView();
    }
  }

  // Événements boutons de navigation
  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  // Toggle Speaker Notes
  toggleNotesBtn.addEventListener('click', () => {
    speakerPanel.classList.toggle('open');
    toggleNotesBtn.classList.toggle('active');
  });

  // Toggle Sommaire Modal
  toggleOverviewBtn.addEventListener('click', () => {
    overviewModal.classList.toggle('open');
  });

  overviewModal.addEventListener('click', (e) => {
    if (e.target === overviewModal) {
      overviewModal.classList.remove('open');
    }
  });

  // Plein écran
  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  // Contrôles Clavier
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
      nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      prevSlide();
    } else if (e.key === 'Home') {
      goToSlide(0);
    } else if (e.key === 'End') {
      goToSlide(totalSlides - 1);
    } else if (e.key.toLowerCase() === 'p') {
      speakerPanel.classList.toggle('open');
      toggleNotesBtn.classList.toggle('active');
    } else if (e.key.toLowerCase() === 'm') {
      overviewModal.classList.toggle('open');
    } else if (e.key.toLowerCase() === 'f') {
      fullscreenBtn.click();
    } else if (e.key.toLowerCase() === 't') {
      toggleMasterTimer();
    } else if (e.key === 'Escape') {
      overviewModal.classList.remove('open');
    }
  });

  // Initialisation vue
  updateSlideView();

  // =========================================================================
  // GESTION DU CHRONOMÈTRE GLOBAL (10:00 MINUTES CHRONO)
  // =========================================================================
  let timerInterval = null;
  let remainingSeconds = 10 * 60; // 10 minutes = 600 secondes
  let isTimerRunning = false;

  const timerDisplay = document.getElementById('timerDisplay');
  const timerToggleBtn = document.getElementById('timerToggleBtn');
  const timerResetBtn = document.getElementById('timerResetBtn');
  const demoTimerBtn = document.getElementById('demoTimerBtn');

  function formatTime(totalSec) {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function updateTimerDisplay() {
    timerDisplay.innerText = formatTime(remainingSeconds);

    // Alertes de couleurs au fil du temps
    // > 3 minutes restantes : bleu
    // Entre 3 min et 1 min : orange
    // < 1 minute : rouge clignotant
    if (remainingSeconds <= 60) {
      timerDisplay.className = 'timer-display danger';
    } else if (remainingSeconds <= 180) {
      timerDisplay.className = 'timer-display warning';
    } else {
      timerDisplay.className = 'timer-display';
    }
  }

  function toggleMasterTimer() {
    if (isTimerRunning) {
      clearInterval(timerInterval);
      isTimerRunning = false;
      timerToggleBtn.innerHTML = '▶';
    } else {
      isTimerRunning = true;
      timerToggleBtn.innerHTML = '❚❚';
      timerInterval = setInterval(() => {
        if (remainingSeconds > 0) {
          remainingSeconds--;
          updateTimerDisplay();
        } else {
          clearInterval(timerInterval);
          isTimerRunning = false;
          timerToggleBtn.innerHTML = '▶';
          alert('⏰ Les 10 minutes de présentation sont écoulées !');
        }
      }, 1000);
    }
  }

  timerToggleBtn.addEventListener('click', toggleMasterTimer);

  timerResetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    isTimerRunning = false;
    remainingSeconds = 10 * 60;
    timerToggleBtn.innerHTML = '▶';
    updateTimerDisplay();
  });

  // Timer spécial Démo (4:30)
  demoTimerBtn.addEventListener('click', () => {
    // Naviguer directement vers le slide Démo
    goToSlide(3);
    clearInterval(timerInterval);
    remainingSeconds = 4 * 60 + 30; // 4m30s
    isTimerRunning = true;
    timerToggleBtn.innerHTML = '❚❚';
    updateTimerDisplay();
    timerInterval = setInterval(() => {
      if (remainingSeconds > 0) {
        remainingSeconds--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        isTimerRunning = false;
        timerToggleBtn.innerHTML = '▶';
      }
    }, 1000);
  });

  updateTimerDisplay();
});
