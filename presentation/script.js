/**
 * EventEase — Diaporama Simple & Épuré
 * Navigation clavier, boutons, timer discret 10 minutes
 * Auteur : DELENCLOS Livio
 */

document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  let currentSlide = 1;

  // Éléments du DOM
  const progressBar = document.getElementById('progressBar');
  const currentSlideNum = document.getElementById('currentSlideNum');
  const totalSlidesNum = document.getElementById('totalSlidesNum');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const slideDotsContainer = document.getElementById('slideDots');
  const fullscreenBtn = document.getElementById('fullscreenBtn');

  // Timer éléments
  const timerChip = document.getElementById('timerChip');
  const timerDisplay = document.getElementById('timerDisplay');
  const timerReset = document.getElementById('timerReset');

  // Initialisation du compteur total
  if (totalSlidesNum) {
    totalSlidesNum.textContent = totalSlides;
  }

  // Création des points de navigation
  if (slideDotsContainer) {
    slideDotsContainer.innerHTML = '';
    for (let i = 1; i <= totalSlides; i++) {
      const dot = document.createElement('div');
      dot.classList.add('slide-dot');
      if (i === 1) dot.classList.add('active');
      dot.title = `Aller à la slide ${i}`;
      dot.addEventListener('click', () => goToSlide(i));
      slideDotsContainer.appendChild(dot);
    }
  }

  // Fonction pour changer de slide
  function goToSlide(index) {
    if (index < 1 || index > totalSlides) return;

    // Masquer la slide actuelle
    slides.forEach(slide => slide.classList.remove('active'));

    // Activer la nouvelle slide
    currentSlide = index;
    const targetSlide = document.getElementById(`slide-${currentSlide}`);
    if (targetSlide) {
      targetSlide.classList.add('active');
    }

    // Mise à jour du compteur
    if (currentSlideNum) {
      currentSlideNum.textContent = currentSlide;
    }

    // Mise à jour de la barre de progression
    if (progressBar) {
      const percentage = (currentSlide / totalSlides) * 100;
      progressBar.style.width = `${percentage}%`;
    }

    // Mise à jour des points de navigation
    const dots = document.querySelectorAll('.slide-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx + 1 === currentSlide);
    });

    // Mise à jour de l'état des boutons Précédent / Suivant
    if (prevBtn) {
      prevBtn.style.opacity = currentSlide === 1 ? '0.4' : '1';
      prevBtn.style.pointerEvents = currentSlide === 1 ? 'none' : 'auto';
    }
    if (nextBtn) {
      if (currentSlide === totalSlides) {
        nextBtn.innerHTML = 'Terminé ✓';
        nextBtn.style.opacity = '0.7';
      } else {
        nextBtn.innerHTML = 'Suivant <span>→</span>';
        nextBtn.style.opacity = '1';
      }
    }
  }

  function nextSlide() {
    if (currentSlide < totalSlides) {
      goToSlide(currentSlide + 1);
    }
  }

  function prevSlide() {
    if (currentSlide > 1) {
      goToSlide(currentSlide - 1);
    }
  }

  // Événements boutons
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  // Navigation au clavier
  window.addEventListener('keydown', (e) => {
    // Éviter si le focus est dans un champ de saisie
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ': // Espace
      case 'PageDown':
        e.preventDefault();
        nextSlide();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'Backspace':
      case 'PageUp':
        e.preventDefault();
        prevSlide();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(1);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(totalSlides);
        break;
      case 'f':
      case 'F':
        toggleFullscreen();
        break;
    }
  });

  // Navigation tactile (Swipe)
  let touchStartX = 0;
  let touchEndX = 0;

  window.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const deltaX = touchEndX - touchStartX;
    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }, { passive: true });

  // Mode Plein Écran
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', toggleFullscreen);
  }

  // -----------------------------------------------------------------
  // Chronomètre discret de 10 minutes (Oral soutenance)
  // -----------------------------------------------------------------
  let timerSeconds = 10 * 60; // 600 secondes = 10:00
  let timerInterval = null;
  let isTimerRunning = false;

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function updateTimerDisplay() {
    if (timerDisplay) {
      timerDisplay.textContent = formatTime(timerSeconds);
    }
    if (timerChip) {
      if (timerSeconds <= 60 && timerSeconds > 0) {
        timerChip.classList.add('warning');
      } else {
        timerChip.classList.remove('warning');
      }
    }
  }

  function startTimer() {
    if (isTimerRunning) return;
    isTimerRunning = true;
    if (timerChip) timerChip.classList.add('running');

    timerInterval = setInterval(() => {
      if (timerSeconds > 0) {
        timerSeconds--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        isTimerRunning = false;
        if (timerChip) {
          timerChip.classList.remove('running');
          timerChip.classList.add('warning');
        }
      }
    }, 1000);
  }

  function pauseTimer() {
    if (!isTimerRunning) return;
    clearInterval(timerInterval);
    isTimerRunning = false;
    if (timerChip) timerChip.classList.remove('running');
  }

  function resetTimer(e) {
    if (e) e.stopPropagation();
    pauseTimer();
    timerSeconds = 10 * 60;
    updateTimerDisplay();
    if (timerChip) timerChip.classList.remove('warning');
  }

  if (timerChip) {
    timerChip.addEventListener('click', () => {
      if (isTimerRunning) {
        pauseTimer();
      } else {
        startTimer();
      }
    });
  }

  if (timerReset) {
    timerReset.addEventListener('click', resetTimer);
  }

  // Initialisation à la première slide
  goToSlide(1);
});
