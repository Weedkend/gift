/* ==========================================================================
   CONFIGURACIÓN Y DATOS PERSONALIZABLES
   ========================================================================== */
const CONFIG = {
  NOMBRE_REMITENTE: "Jesus"
};

/* ==========================================================================
   INICIALIZACIÓN
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  personalizarContenido();
  initPetalCanvas();
  initAudioController();
  initInteractions();
});

function personalizarContenido() {
  document.getElementById("signature-name").textContent = CONFIG.NOMBRE_REMITENTE;
}

/* ==========================================================================
   INTERACCIONES Y REVEAL ON SCROLL
   ========================================================================== */
function initInteractions() {
  const btnDiscover = document.getElementById("btn-discover");
  const mainContent = document.getElementById("main-content");
  const audioBtn = document.getElementById("audio-toggle");

  btnDiscover.addEventListener("click", () => {
    mainContent.classList.remove("hidden");
    audioBtn.classList.remove("hidden");

    const target = document.getElementById("dedicatoria");
    target.scrollIntoView({ behavior: "smooth" });

    playAudioIfPossible();
  });

  const observerOptions = { threshold: 0.15 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  document.querySelectorAll(".reveal-on-scroll").forEach(el => observer.observe(el));
}

/* ==========================================================================
   CONTROL DE AUDIO AMBIENTAL
   ========================================================================== */
function initAudioController() {
  const audio = document.getElementById("bg-music");
  const audioBtn = document.getElementById("audio-toggle");
  const iconPlay = document.getElementById("audio-icon-play");
  const iconPause = document.getElementById("audio-icon-pause");

  audioBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play().then(() => {
        iconPlay.classList.add("hidden");
        iconPause.classList.remove("hidden");
      }).catch(err => console.log("Autoplay bloqueado", err));
    } else {
      audio.pause();
      iconPause.classList.add("hidden");
      iconPlay.classList.remove("hidden");
    }
  });
}

function playAudioIfPossible() {
  const audio = document.getElementById("bg-music");
  const iconPlay = document.getElementById("audio-icon-play");
  const iconPause = document.getElementById("audio-icon-pause");

  if (audio.querySelector("source").getAttribute("src") !== "assets/musica.mp3") {
    audio.play().then(() => {
      iconPlay.classList.add("hidden");
      iconPause.classList.remove("hidden");
    }).catch(() => {});
  }
}

/* ==========================================================================
   CANVAS DE PÉTALOS Y DESTELLOS LUMINOSOS
   ========================================================================== */
function initPetalCanvas() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById("canvas-petals");
  const ctx = canvas.getContext("2d");

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Arreglo de partículas tipo pétalo/destello alegre
  const petals = Array.from({ length: 35 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 4 + 2,
    speedY: Math.random() * 0.4 + 0.1,
    speedX: Math.random() * 0.2 - 0.1,
    opacity: Math.random() * 0.5 + 0.2
  }));

  function render() {
    ctx.clearRect(0, 0, width, height);

    petals.forEach(p => {
      p.y -= p.speedY;
      p.x += p.speedX;

      if (p.y < -10) p.y = height + 10;
      if (p.x < -10 || p.x > width + 10) p.x = Math.random() * width;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(224, 122, 95, ${p.opacity})`;
      ctx.fill();
    });

    requestAnimationFrame(render);
  }

  render();
}
