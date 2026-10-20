/**
 * Logique Interactive - Vue Jury (Écran Projeté)
 * Auteur : Livio DELENCLOS
 * Épuré : Navigation simple, clavier (flèches / espace), plein écran
 */

document.addEventListener('DOMContentLoaded', () => {
  let currentSlide = 0;
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  const progressDots = document.getElementById('progressDots');
  const slideCounter = document.getElementById('slideCounter');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');

  // Génération des dots
  slides.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.className = `progress-dot ${idx === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => goToSlide(idx));
    progressDots.appendChild(dot);
  });

  function updateSlideView() {
    slides.forEach((slide, idx) => {
      slide.classList.remove('active', 'prev');
      if (idx === currentSlide) {
        slide.classList.add('active');
      } else if (idx < currentSlide) {
        slide.classList.add('prev');
      }
    });

    document.querySelectorAll('.progress-dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlide);
    });

    slideCounter.innerText = `${currentSlide + 1} / ${totalSlides}`;
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === totalSlides - 1;
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

  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  // Clavier
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
      nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      prevSlide();
    } else if (e.key === 'Home') {
      goToSlide(0);
    } else if (e.key === 'End') {
      goToSlide(totalSlides - 1);
    } else if (e.key.toLowerCase() === 'f') {
      fullscreenBtn.click();
    }
  });

  updateSlideView();
});
