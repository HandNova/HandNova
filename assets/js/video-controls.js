document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('video[controls]').forEach(function (video) {
    video.removeAttribute('controls');
    video.muted = true;

    /* Accesibilidad: si hay un texto cercano con el nombre de la seña
       (ej. "Rojo", "Hola"), lo usamos como aria-label del video para
       que un lector de pantalla sepa qué seña se está mostrando. */
    var tarjeta = video.closest('.video-card, .question, .resultado-video-wrap, .video-wrapper');
    var etiquetaEl = tarjeta && tarjeta.querySelector('.video-label, h2, .resultado-palabra');
    if (etiquetaEl && etiquetaEl.textContent.trim()) {
      video.setAttribute('aria-label', 'Video de la seña: ' + etiquetaEl.textContent.trim());
    } else {
      video.setAttribute('aria-label', 'Video de una seña en Lengua de Señas Colombiana');
    }
    video.addEventListener('loadedmetadata', function () {
    video.currentTime = 0.01;
    },  { once: true });
    

    var container = video.closest('.video-wrapper') || video.parentNode;

    var frame = document.createElement('div');
    frame.className = 'svg-video-frame';
    container.parentNode.insertBefore(frame, container);
    frame.appendChild(container);

    var bar = document.createElement('div');
    bar.className = 'svg-video-bar';
    bar.innerHTML =
      '<button class="svg-video-play" type="button" aria-label="Reproducir o pausar video">▶</button>' +
      '<input class="svg-video-progress" type="range" min="0" max="100" step="0.1" value="0" aria-label="Progreso del video">' +
      '<button class="svg-video-full" type="button" aria-label="Ver en pantalla completa">⛶</button>';
    frame.appendChild(bar);

    var playBtn = bar.querySelector('.svg-video-play');
    var progress = bar.querySelector('.svg-video-progress');
    var fullBtn = bar.querySelector('.svg-video-full');

    playBtn.addEventListener('click', function () {
      if (video.paused) { video.play(); } else { video.pause(); }
    });
    video.addEventListener('play', function () { playBtn.textContent = '⏸'; });
    video.addEventListener('pause', function () { playBtn.textContent = '▶'; });
    video.addEventListener('ended', function () { playBtn.textContent = '▶'; });

    video.addEventListener('timeupdate', function () {
      if (video.duration) progress.value = (video.currentTime / video.duration) * 100;
    });
    progress.addEventListener('input', function () {
      if (video.duration) video.currentTime = (progress.value / 100) * video.duration;
    });

    fullBtn.addEventListener('click', function () {
      if (frame.requestFullscreen) frame.requestFullscreen();
      else if (frame.webkitRequestFullscreen) frame.webkitRequestFullscreen();
    });

    /* Si el video no carga (archivo faltante o dañado), mostramos un
       mensaje amigable en vez de dejar un reproductor roto. */
    video.addEventListener('error', function () {
      frame.classList.add('svg-video-error');
      frame.innerHTML =
        '<div class="svg-video-error-msg">' +
          '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/><line x1="1" y1="5" x2="16" y2="19"/></svg>' +
          '<span>Video no disponible por ahora</span>' +
        '</div>';
    });
  });
});