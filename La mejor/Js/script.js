// ============================================
// UTILIDADES
// ============================================

function getURLParam(name) {
  const url = new URL(window.location.href);
  const value = url.searchParams.get(name);
  return value ? decodeURIComponent(value) : null;
}

function sanitizePath(path) {
  return path.replace(/[^\w\d .\-]/g, '');
}

// ============================================
// CARGAR Y ANIMAR SVG
// ============================================

fetch('Img/treelove.svg')
  .then(res => res.text())
  .then(svgText => {
    const container = document.getElementById('tree-container');
    if (!container) return;
    container.innerHTML = svgText;
    const svg = container.querySelector('svg');
    if (!svg) return;

    // Preparar paths para animación
    const allPaths = Array.from(svg.querySelectorAll('path'));
    allPaths.forEach(path => {
      path.style.stroke = '#222';
      path.style.strokeWidth = '2.5';
      path.style.fillOpacity = '0';
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.transition = 'none';
    });

    // Iniciar animación con delay
    setTimeout(() => {
      animatePaths(allPaths);
      const heartPaths = allPaths.filter(el => {
        const style = el.getAttribute('style') || '';
        return style.includes('#FC6F58') || style.includes('#C1321F');
      });
      heartPaths.forEach(path => {
        path.classList.add('animated-heart');
      });
    }, 50);
  })
  .catch(error => console.error('Error loading SVG:', error));

function animatePaths(paths) {
  paths.forEach((path, i) => {
    path.style.transition = `stroke-dashoffset 1.2s cubic-bezier(.77,0,.18,1) ${i * 0.08}s, fill-opacity 0.5s ${0.9 + i * 0.08}s`;
    path.style.strokeDashoffset = 0;
    setTimeout(() => {
      path.style.fillOpacity = '1';
      path.style.stroke = '';
      path.style.strokeWidth = '';
    }, 1200 + i * 80);
  });

  // Después de la animación de dibujo
  const totalDuration = 1200 + (paths.length - 1) * 80 + 500;
  setTimeout(() => {
    const svg = document.querySelector('.tree-container svg');
    if (svg) {
      svg.classList.add('move-and-scale');
      // Agregar animación de balanceo más pronunciado
      svg.style.animation = 'sway 2.5s ease-in-out infinite';
    }
    
    setTimeout(() => {
      showDedicationText();
      startFloatingObjects();
      showCountdown();
    }, 1200);

  }, totalDuration);
}

// ============================================
// TEXTO DE DEDICATORIA
// ============================================

function showDedicationText() {
  let text = getURLParam('text');
  if (!text) {
    text = `Para la mujer mas especial:\n\nDesde el primer momento que te conocí supe que era una excelente mujer. La sonrisa muy característica de su parte, la voz, su forma de ser… cualidades super especiales de una mujer muy valiosa. \n\nGracias por llegar a mi vida y desearle un feliz de de las mujeres a mi princesa luchadora y permitirme estar ahí en los momentos difíciles, por entenderme y por llenar mis días de alegría. \n\nTe quiero más de lo que las palabras puedan expresar FELIZ DIA MUJER HERMOSA.`;
  } else {
    text = text.replace(/\\n/g, '\n');
  }
  
  const container = document.getElementById('dedication-text');
  if (!container) return;
  
  container.classList.add('typing');
  
  // Iniciar música cuando empieza el texto
  playBackgroundMusic();
  
  let i = 0;

  function type() {
    if (i <= text.length) {
      container.textContent = text.slice(0, i);
      i++;
      const delay = text[i - 2] === '\n' ? 350 : 45;
      setTimeout(type, delay);
    } else {
      setTimeout(showSignature, 600);
    }
  }

  type();
}

function showSignature() {
  const dedication = document.getElementById('dedication-text');
  if (!dedication) return;
  
  let signature = dedication.querySelector('#signature');
  if (!signature) {
    signature = document.createElement('div');
    signature.id = 'signature';
    signature.className = 'signature';
    dedication.appendChild(signature);
  }
  
  const firma = getURLParam('firma');
  signature.textContent = firma || "Con mucho cariño, Andy";
  signature.classList.add('visible');
}

// ============================================
// OBJETOS FLOTANTES
// ============================================

function startFloatingObjects() {
  const container = document.getElementById('floating-objects');
  if (!container) return;

  let count = 0;

  function spawn() {
    const el = document.createElement('div');
    el.className = 'floating-petal';
    el.style.left = `${Math.random() * 90 + 2}%`;
    el.style.top = `${100 + Math.random() * 10}%`;
    el.style.opacity = String(0.7 + Math.random() * 0.3);
    container.appendChild(el);

    const duration = 6000 + Math.random() * 4000;
    const drift = (Math.random() - 0.5) * 60;

    setTimeout(() => {
      el.style.transition = `transform ${duration}ms linear, opacity 1.2s`;
      el.style.transform = `translate(${drift}px, -110vh) scale(${0.8 + Math.random() * 0.6}) rotate(${Math.random() * 360}deg)`;
      el.style.opacity = '0.2';
    }, 30);

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, duration + 2000);

    if (count++ < 32) {
      setTimeout(spawn, 350 + Math.random() * 500);
    } else {
      setTimeout(spawn, 1200 + Math.random() * 1200);
    }
  }

  spawn();
}

// ============================================
// CUENTA REGRESIVA
// ============================================

function showCountdown() {
  const container = document.getElementById('countdown');
  if (!container) return;

  const startParam = getURLParam('start');
  const startDate = startParam 
    ? new Date(startParam + 'T00:00:00') 
    : new Date('2026-01-26T00:00:00');

  function update() {
    const now = new Date();
    const diff = now - startDate;
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    const formattedDate = startDate.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

    container.innerHTML = `
      Desde ${formattedDate}:<br>
      <b>${days}d ${hours}h ${minutes}m ${seconds}s</b>
    `;
    container.classList.add('visible');
  }

  update();
  setInterval(update, 1000);
}

// ============================================
// MÚSICA DE FONDO
// ============================================

function playBackgroundMusic() {
  const audio = document.getElementById('bg-music');
  if (!audio) return;

  const musicaParam = getURLParam('musica') || 'music1.mp3';
  const musicPath = 'Music/' + sanitizePath(musicaParam);
  
  audio.src = musicPath;

  const youtubeParam = getURLParam('youtube');
  if (youtubeParam) {
    showYouTubeHelp();
  }

  audio.volume = 0.7;
  audio.loop = true;

  audio.addEventListener('canplay', () => {
    attemptAutoplay(audio);
  }, { once: true });

  audio.addEventListener('error', () => {
    const btn = document.getElementById('music-btn');
    if (btn) {
      btn.textContent = '❌ Sin audio';
      btn.style.opacity = '0.5';
    }
  });
}

function showYouTubeHelp() {
  let helpMsg = document.getElementById('yt-help-msg');
  if (helpMsg) return;

  helpMsg = document.createElement('div');
  helpMsg.id = 'yt-help-msg';
  helpMsg.style.cssText = `
    position: fixed;
    right: 18px;
    bottom: 180px;
    background: rgba(255,255,255,0.95);
    color: #e60026;
    padding: 10px 16px;
    border-radius: 12px;
    box-shadow: 0 2px 8px #e6002633;
    font-size: 1.05em;
    z-index: 100;
  `;
  helpMsg.innerHTML = 'Para usar música de YouTube, descarga el audio (por ejemplo, usando y2mate, 4K Video Downloader, etc.), colócalo en la carpeta <b>Music</b> y usa la URL así:<br><br><code>?musica=nombre.mp3</code>';
  document.body.appendChild(helpMsg);
  setTimeout(() => { if(helpMsg) helpMsg.remove(); }, 15000);
}

/**
 * Configura el botón de música
 * @param {HTMLAudioElement} audio - Elemento de audio
 */
function setupMusicButton(audio) {
  let btn = document.getElementById('music-btn');
  if (btn) return;

  btn = document.createElement('button');
  btn.id = 'music-btn';
  btn.textContent = '🎵 Música';
  btn.style.cssText = `
    position: fixed;
    bottom: 18px;
    right: 18px;
    z-index: 99;
    background: rgba(255,255,255,0.85);
    border: 2px solid #e60026;
    border-radius: 24px;
    padding: 10px 18px;
    font-size: 1.1em;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: bold;
  `;
  
  btn.addEventListener('click', () => {
    if (audio.paused) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            btn.textContent = '🔊 Música';
          })
          .catch(() => {
            btn.textContent = '❌ Error';
          });
      }
    } else {
      audio.pause();
      btn.textContent = '⏸️ Música';
    }
  });

  btn.addEventListener('mouseover', () => {
    btn.style.background = 'rgba(255,255,255,0.95)';
    btn.style.transform = 'scale(1.05)';
  });

  btn.addEventListener('mouseout', () => {
    btn.style.background = 'rgba(255,255,255,0.85)';
    btn.style.transform = 'scale(1)';
  });

  document.body.appendChild(btn);
}

function attemptAutoplay(audio) {
  const btn = document.getElementById('music-btn');
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        if (btn) {
          btn.textContent = '🔊 Música';
        }
      })
      .catch(() => {
        if (btn) {
          btn.textContent = '▶️ Música';
        }
      });
  }
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('bg-music');
  if (audio) {
    setupMusicButton(audio);
  }
});
