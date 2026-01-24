const { useCallback, useEffect, useMemo, useRef, useState } = React;

const FILTERS = [
  {
    id: "original",
    name: "Original",
    emoji: "🤍",
    sat: 100,
    bright: 100,
    overlay: "rgba(0,0,0,0)",
  },
  {
    id: "pink",
    name: "💕 Cotton Candy",
    emoji: "🩷",
    sat: 102,
    bright: 102,
    overlay: "rgba(255, 182, 193, 0.08)",
  },
  {
    id: "lavender",
    name: "💜 Lavender",
    emoji: "🪻",
    sat: 101,
    bright: 102,
    overlay: "rgba(230, 230, 250, 0.1)",
  },
  {
    id: "mint",
    name: "🌿 Mint",
    emoji: "🍃",
    sat: 103,
    bright: 103,
    overlay: "rgba(178, 247, 203, 0.08)",
  },
  {
    id: "peach",
    name: "🍑 Peachy",
    emoji: "🍑",
    sat: 102,
    bright: 103,
    overlay: "rgba(255, 218, 185, 0.1)",
  },
  {
    id: "blue",
    name: "💙 Baby Blue",
    emoji: "🩵",
    sat: 101,
    bright: 103,
    overlay: "rgba(180, 231, 255, 0.08)",
  },
];

const OVERLAYS = [
  { id: "none", name: "None", icon: "🤍" },
  { id: "hearts", name: "Hearts", icon: "🩷" },
  { id: "sparkles", name: "Sparkles", icon: "✨" },
  { id: "bubbles", name: "Bubbles", icon: "🫧" },
  { id: "stars", name: "Stars", icon: "⭐️" },
  { id: "flowers", name: "Cute Flowers", icon: "🌸" },
];

const SPEED_OPTIONS = [
  { id: "slow", label: "Slow", value: 1 },
  { id: "medium", label: "Medium", value: 1.6 },
  { id: "fast", label: "Fast", value: 2.2 },
];

const random = (min, max) => min + Math.random() * (max - min);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const spawnSide = (width) => {
  const left = Math.random() > 0.5;
  return {
    side: left ? "left" : "right",
    x: left ? random(0, width * 0.25) : width - random(0, width * 0.25),
  };
};

class Particle {
  constructor(type, width, height) {
    this.type = type;
    this.reset(width, height);
  }

  reset(width, height) {
    const { side, x } = spawnSide(width);
    this.side = side;
    this.x = x;
    this.y = height + 50;
    this.size = random(20, 40);
    this.speed = random(40, 60);
    this.opacity = 0;
    this.life = 0;
    this.maxLife = 10 + Math.random() * 3;
    this.rotation = random(-0.3, 0.3);
    this.rotationSpeed = random(-0.005, 0.005);
    this.drift = random(-7.5, 7.5);
    this.color = ["#FFB6D9", "#E6B8E7", "#FFD4E5", "#FFAACC"][Math.floor(random(0, 4))];
    this.startX = this.x;
    this.startScale = 0.8;
    this.endScale = 1.2;
  }

  update(delta, width, height) {
    this.life += delta;
    this.y -= this.speed * delta;
    const driftAmount = Math.sin(this.life * 1.5) * this.drift;
    this.x = this.startX + driftAmount;
    if (this.side === "left") {
      this.x = clamp(this.x, 0, width * 0.4);
    } else {
      this.x = clamp(this.x, width * 0.6, width);
    }
    this.rotation += this.rotationSpeed;
    if (this.y > height * 0.8) {
      const distanceFromBottom = height - this.y;
      this.opacity = Math.min(1, distanceFromBottom / (height * 0.2));
    } else if (this.y < height * 0.1) {
      this.opacity = Math.max(0, this.y / (height * 0.1));
    } else {
      this.opacity = 1;
    }
    if (this.life > this.maxLife || this.y < -100) {
      this.reset(width, height);
    }
  }
}

class SparkleParticle extends Particle {
  reset(width, height) {
    const { side, x } = spawnSide(width);
    this.side = side;
    this.x = x;
    this.y = height + 50;
    this.size = random(8, 20);
    this.speed = random(55, 75);
    this.opacity = 0;
    this.life = 0;
    this.maxLife = 8 + Math.random() * 2;
    this.rotation = random(0, Math.PI);
    this.rotationSpeed = random(-0.6, 0.6);
    this.typeVariant = ["dot", "star4", "bokeh"][Math.floor(random(0, 3))];
    this.color = ["#FFD98E", "#FFE9B0", "#FFC974", "#E5E7EB", "#CBD5E1"][
      Math.floor(random(0, 5))
    ];
    this.startX = this.x;
    this.drift = random(-7, 7);
  }

  update(delta, width, height) {
    this.life += delta;
    this.y -= this.speed * delta;
    const driftAmount = Math.sin(this.life * 1.5) * this.drift;
    this.x = this.startX + driftAmount;
    if (this.side === "left") {
      this.x = clamp(this.x, 0, width * 0.4);
    } else {
      this.x = clamp(this.x, width * 0.6, width);
    }
    this.rotation += this.rotationSpeed * delta * 0.4;
    if (this.y > height * 0.8) {
      const distanceFromBottom = height - this.y;
      this.opacity = Math.min(1, distanceFromBottom / (height * 0.2));
    } else if (this.y < height * 0.1) {
      this.opacity = Math.max(0, this.y / (height * 0.1));
    } else {
      this.opacity = 1;
    }
    if (this.life > this.maxLife || this.y < -100) {
      this.reset(width, height);
    }
  }
}

class StarParticle extends Particle {
  reset(width, height) {
    const { side, x } = spawnSide(width);
    this.side = side;
    this.x = x;
    this.y = height + 50;
    this.size = random(14, 24);
    this.speed = random(35, 50);
    this.opacity = 0;
    this.life = 0;
    this.maxLife = 8 + Math.random() * 2;
    this.rotation = random(0, Math.PI);
    this.rotationSpeed = random(-0.6, 0.6);
    this.typeVariant = "star5";
    this.color = ["#FFD98E", "#FFE9B0", "#FFC974", "#E5E7EB", "#CBD5E1"][
      Math.floor(random(0, 5))
    ];
    this.startX = this.x;
    this.drift = random(-7, 7);
  }

  update(delta, width, height) {
    this.life += delta;
    this.y -= this.speed * delta;
    const driftAmount = Math.sin(this.life * 1.5) * this.drift;
    this.x = this.startX + driftAmount;
    if (this.side === "left") {
      this.x = clamp(this.x, 0, width * 0.4);
    } else {
      this.x = clamp(this.x, width * 0.6, width);
    }
    this.rotation += this.rotationSpeed * delta * 0.4;
    if (this.y > height * 0.8) {
      const distanceFromBottom = height - this.y;
      this.opacity = Math.min(1, distanceFromBottom / (height * 0.2));
    } else if (this.y < height * 0.1) {
      this.opacity = Math.max(0, this.y / (height * 0.1));
    } else {
      this.opacity = 1;
    }
    if (this.life > this.maxLife || this.y < -100) {
      this.reset(width, height);
    }
  }
}

class BubbleParticle extends Particle {
  reset(width, height) {
    const { side, x } = spawnSide(width);
    this.side = side;
    this.x = x;
    this.y = height + 50;
    this.size = random(30, 60);
    this.speed = random(30, 45);
    this.opacity = random(0.6, 0.8);
    this.life = 0;
    this.maxLife = 9 + Math.random() * 2;
    this.drift = random(-7, 7);
    this.rotation = random(0, Math.PI);
    this.startX = this.x;
  }

  update(delta, width, height) {
    this.life += delta;
    this.y -= this.speed * delta;
    const driftAmount = Math.sin(this.life * 1.2) * this.drift;
    this.x = this.startX + driftAmount;
    if (this.side === "left") {
      this.x = clamp(this.x, 0, width * 0.4);
    } else {
      this.x = clamp(this.x, width * 0.6, width);
    }
    this.rotation += delta * 0.1;
    if (this.y > height * 0.8) {
      const distanceFromBottom = height - this.y;
      this.opacity = Math.min(1, distanceFromBottom / (height * 0.2));
    } else if (this.y < height * 0.1) {
      this.opacity = Math.max(0, this.y / (height * 0.1));
    } else {
      this.opacity = 1;
    }
    if (this.y < -100) {
      this.reset(width, height);
    }
  }
}

class FlowerParticle extends Particle {
  reset(width, height) {
    const { side, x } = spawnSide(width);
    this.side = side;
    this.x = x;
    this.y = height + 50;
    this.size = random(24, 40);
    this.speed = random(30, 45);
    this.opacity = random(0.7, 0.85);
    this.life = 0;
    this.maxLife = 8 + Math.random() * 2;
    this.rotation = random(0, Math.PI);
    this.rotationSpeed = random(-0.4, 0.4);
    this.color = ["#FFB6D9", "#FFD4E5", "#E6B8E7", "#B2F7CB", "#CDE7FF"][
      Math.floor(random(0, 5))
    ];
    this.center = "#FFF7FB";
    this.drift = random(-7, 7);
    this.startX = this.x;
  }

  update(delta, width, height) {
    this.life += delta;
    this.y -= this.speed * delta;
    const driftAmount = Math.sin(this.life * 1.5) * this.drift;
    this.x = this.startX + driftAmount;
    if (this.side === "left") {
      this.x = clamp(this.x, 0, width * 0.4);
    } else {
      this.x = clamp(this.x, width * 0.6, width);
    }
    this.rotation += this.rotationSpeed * delta;
    if (this.y > height * 0.8) {
      const distanceFromBottom = height - this.y;
      this.opacity = Math.min(1, distanceFromBottom / (height * 0.2));
    } else if (this.y < height * 0.1) {
      this.opacity = Math.max(0, this.y / (height * 0.1));
    } else {
      this.opacity = 1;
    }
    if (this.y < -100 || this.life > this.maxLife) {
      this.reset(width, height);
    }
  }
}

const buildFilterCss = (filter) =>
  `saturate(${filter.sat}%) brightness(${filter.bright}%)`;

function App() {
  const typography = {
    h1: "text-3xl md:text-5xl font-bold",
    h2: "text-2xl md:text-3xl font-bold",
    h3: "text-lg md:text-2xl font-semibold",
    body: "text-sm md:text-base font-normal",
    bodySmall: "text-xs md:text-sm font-normal",
    button: "text-sm md:text-base font-semibold",
    buttonSmall: "text-xs font-medium",
    label: "text-xs md:text-sm font-medium uppercase tracking-wide",
  };

  const buttonStyles = {
    primary:
      "px-4 py-2.5 md:px-6 md:py-3 rounded-full bg-gradient-to-r from-pink-300 to-emerald-200 hover:from-pink-400 hover:to-emerald-300 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200",
    secondary:
      "px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-white hover:bg-gray-50 text-[#7A7A7A] font-semibold text-sm shadow-md hover:shadow-lg border-2 border-pink-100 transform hover:scale-105 active:scale-95 transition-all duration-200",
    pill:
      "rounded-full bg-gradient-to-r from-pink-300 to-emerald-200 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200",
  };

  const videoRef = useRef(null);
  const processingCanvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const outputCanvasRef = useRef(null);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(0);
  const spawnTimerRef = useRef(0);
  const particlePoolRef = useRef([]);
  const particlesRef = useRef([]);

  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mirror, setMirror] = useState(true);
  const [facingMode, setFacingMode] = useState("user");
  const [activeFilter, setActiveFilter] = useState("pink");
  const [activeOverlay, setActiveOverlay] = useState("hearts");
  const [overlaySpeed, setOverlaySpeed] = useState("medium");
  const [countdown, setCountdown] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [clips, setClips] = useState([]);
  const mediaRecorderRef = useRef(null);
  const clipChunksRef = useRef([]);

  const filter = useMemo(() => FILTERS.find((f) => f.id === activeFilter) || FILTERS[0], [activeFilter]);
  const speedValue = useMemo(
    () => SPEED_OPTIONS.find((item) => item.id === overlaySpeed)?.value || 1,
    [overlaySpeed]
  );


  const startCamera = useCallback(async () => {
    setIsLoading(true);
    setCameraError(null);
    try {
      const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
      const constraints = {
        video: {
          facingMode,
          width: isMobile ? 640 : 1280,
          height: isMobile ? 480 : 720,
        },
        audio: false,
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      setStream(mediaStream);
      setIsLoading(false);
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError(err.message);
      setIsLoading(false);
    }
  }, [facingMode]);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, [startCamera]);

  // Face charms removed.

  useEffect(() => {
    particlesRef.current = [];
    particlePoolRef.current = [];
  }, [activeOverlay]);

  useEffect(() => {
    const handleResize = () => {
      const outputCanvas = outputCanvasRef.current;
      if (!outputCanvas) return;
      const width = outputCanvas.clientWidth;
      const height = outputCanvas.clientHeight;
      [processingCanvasRef, overlayCanvasRef, outputCanvasRef].forEach((ref) => {
        if (ref.current) {
          ref.current.width = width;
          ref.current.height = height;
        }
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const createParticle = useCallback(
    (width, height) => {
      if (activeOverlay === "sparkles") return new SparkleParticle("sparkle", width, height);
      if (activeOverlay === "bubbles") return new BubbleParticle("bubble", width, height);
      if (activeOverlay === "stars") return new StarParticle("star", width, height);
      if (activeOverlay === "flowers") return new FlowerParticle("flower", width, height);
      return new Particle("heart", width, height);
    },
    [activeOverlay]
  );

  const drawHeart = (ctx, x, y, size, color, opacity, rotation, lifeRatio) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    const scale = 0.8 + lifeRatio * 0.4;
    ctx.scale(scale, scale);
    const grad = ctx.createRadialGradient(-size * 0.1, -size * 0.2, 0, 0, 0, size);
    grad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
    grad.addColorStop(0.5, color);
    grad.addColorStop(1, "rgba(255, 170, 210, 0.9)");
    ctx.fillStyle = grad;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.lineWidth = 2;
    ctx.globalAlpha = opacity;
    ctx.shadowBlur = 12;
    ctx.shadowColor = "rgba(255, 180, 210, 0.6)";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(0, -size * 0.6, -size, -size * 0.6, -size, 0);
    ctx.bezierCurveTo(-size, size * 0.7, 0, size * 1.1, 0, size * 1.4);
    ctx.bezierCurveTo(0, size * 1.1, size, size * 0.7, size, 0);
    ctx.bezierCurveTo(size, -size * 0.6, 0, -size * 0.6, 0, 0);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.beginPath();
    ctx.arc(-size * 0.35, -size * 0.3, size * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
    ctx.beginPath();
    ctx.arc(size * 0.2, -size * 0.1, size * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const drawSparkle = (ctx, particle) => {
    const { x, y, size, rotation, color, life, maxLife, typeVariant, opacity: particleOpacity } = particle;
    const progress = life / maxLife;
    const opacity = particleOpacity ?? Math.sin(Math.PI * Math.min(progress, 1));
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = opacity;
    ctx.shadowBlur = 16;
    ctx.shadowColor = "rgba(255, 205, 120, 0.9)";
    if (typeVariant === "dot") {
      ctx.fillStyle = "rgba(255, 226, 160, 0.85)";
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (typeVariant === "bokeh") {
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
      grad.addColorStop(0, "rgba(255,255,255,0)");
      grad.addColorStop(1, color);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.fill();
    } else if (typeVariant === "star5") {
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < 10; i += 1) {
        const angle = rotation + (i * Math.PI) / 5;
        const radius = i % 2 === 0 ? size : size * 0.45;
        ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      }
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.18, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      for (let i = 0; i < 4; i += 1) {
        const angle = (i * Math.PI) / 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  const drawBubble = (ctx, particle) => {
    const { x, y, size, opacity } = particle;
    const gradient = ctx.createRadialGradient(x - size * 0.3, y - size * 0.3, 0, x, y, size);
    gradient.addColorStop(0, "rgba(255,255,255,0.8)");
    gradient.addColorStop(0.4, "rgba(200,230,255,0.4)");
    gradient.addColorStop(0.7, "rgba(255,200,255,0.3)");
    gradient.addColorStop(1, "rgba(255,255,255,0.1)");
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(255, 220, 230, 0.6)";
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.beginPath();
    ctx.arc(x - size * 0.35, y - size * 0.35, size * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  };

  // Face charms removed.

  const drawFlower = (ctx, particle) => {
    const { x, y, size, color, center, rotation, opacity } = particle;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = opacity;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(255, 200, 230, 0.5)";
    for (let i = 0; i < 6; i += 1) {
      const angle = (Math.PI * 2 * i) / 6;
      ctx.save();
      ctx.rotate(angle);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(0, -size * 0.35, size * 0.25, size * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = center;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const animate = useCallback(
    (timestamp) => {
      const video = videoRef.current;
      const processingCanvas = processingCanvasRef.current;
      const overlayCanvas = overlayCanvasRef.current;
      const outputCanvas = outputCanvasRef.current;
      if (!video || !processingCanvas || !overlayCanvas || !outputCanvas) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const delta = lastTimeRef.current ? (timestamp - lastTimeRef.current) / 1000 : 0;
      lastTimeRef.current = timestamp;

      const rect = outputCanvas.getBoundingClientRect();
      const desiredWidth = Math.max(1, Math.floor(rect.width));
      const desiredHeight = Math.max(1, Math.floor(rect.height));
      if (desiredWidth && desiredHeight && (outputCanvas.width !== desiredWidth || outputCanvas.height !== desiredHeight)) {
        [processingCanvasRef, overlayCanvasRef, outputCanvasRef].forEach((ref) => {
          if (ref.current) {
            ref.current.width = desiredWidth;
            ref.current.height = desiredHeight;
          }
        });
      }
      const width = outputCanvas.width;
      const height = outputCanvas.height;

      const ctxProcessing = processingCanvas.getContext("2d");
      ctxProcessing.clearRect(0, 0, width, height);
      ctxProcessing.filter = buildFilterCss(filter);
      if (mirror) {
        ctxProcessing.save();
        ctxProcessing.translate(width, 0);
        ctxProcessing.scale(-1, 1);
        ctxProcessing.drawImage(video, 0, 0, width, height);
        ctxProcessing.restore();
      } else {
        ctxProcessing.drawImage(video, 0, 0, width, height);
      }
      ctxProcessing.filter = "none";
      if (filter.overlay && filter.overlay !== "rgba(0,0,0,0)") {
        ctxProcessing.globalCompositeOperation = "screen";
        ctxProcessing.fillStyle = filter.overlay;
        ctxProcessing.fillRect(0, 0, width, height);
        ctxProcessing.globalCompositeOperation = "source-over";
      }

      const ctxOverlay = overlayCanvas.getContext("2d");
      ctxOverlay.globalCompositeOperation = "source-over";
      ctxOverlay.clearRect(0, 0, width, height);
      if (activeOverlay !== "none") {
        const maxParticles = {
          hearts: 8,
          sparkles: 14,
          bubbles: 6,
          stars: 10,
          flowers: 8,
        };
        const spawnInterval = activeOverlay === "sparkles" ? 0.6 : 1.0;
        spawnTimerRef.current += delta;
        if (spawnTimerRef.current > spawnInterval) {
          spawnTimerRef.current = 0;
          const maxCount = maxParticles[activeOverlay] ?? 8;
          if (particlesRef.current.length < maxCount) {
            particlesRef.current.push(createParticle(width, height));
          }
        }
      } else {
        particlesRef.current = [];
      }

      particlesRef.current.forEach((particle) => {
        if (activeOverlay === "hearts") {
          particle.update(delta * speedValue, width, height);
          const lifeRatio = Math.min(particle.life / particle.maxLife, 1);
          const opacity = (particle.opacity ?? 1) * 0.75;
          const drift = Math.sin(particle.life * 1.5) * particle.drift;
          drawHeart(
            ctxOverlay,
            particle.startX + drift,
            particle.y,
            particle.size * 0.8,
            particle.color,
            opacity,
            particle.rotation,
            lifeRatio
          );
        }
        if (activeOverlay === "sparkles") {
          particle.update(delta * speedValue, width, height);
          drawSparkle(ctxOverlay, { ...particle, opacity: (particle.opacity ?? 1) * 0.75 });
        }
        if (activeOverlay === "stars") {
          particle.update(delta * speedValue, width, height);
          drawSparkle(ctxOverlay, { ...particle, opacity: (particle.opacity ?? 1) * 0.75 });
        }
        if (activeOverlay === "stars") {
          particle.update(delta * speedValue, width, height);
          drawSparkle(ctxOverlay, particle);
        }
        if (activeOverlay === "bubbles") {
          particle.update(delta * speedValue, width, height);
          drawBubble(ctxOverlay, { ...particle, opacity: (particle.opacity ?? 1) * 0.75 });
        }
        if (activeOverlay === "flowers") {
          particle.update(delta * speedValue, width, height);
          drawFlower(ctxOverlay, { ...particle, opacity: (particle.opacity ?? 1) * 0.75 });
        }
      });

      const ctxOutput = outputCanvas.getContext("2d");
      ctxOutput.clearRect(0, 0, width, height);
      ctxOutput.drawImage(processingCanvas, 0, 0);
      ctxOutput.globalAlpha = 1;
      ctxOutput.drawImage(overlayCanvas, 0, 0);
      ctxOutput.globalAlpha = 1;

      // Face charms removed.

      // Face charms removed.

      rafRef.current = requestAnimationFrame(animate);
    },
    [filter, mirror, createParticle, activeOverlay, speedValue]
  );

  useEffect(() => {
    if (!stream || !outputCanvasRef.current) return;
    const width = outputCanvasRef.current.clientWidth;
    const height = outputCanvasRef.current.clientHeight;
    [processingCanvasRef, overlayCanvasRef, outputCanvasRef].forEach((ref) => {
      if (ref.current) {
        ref.current.width = width;
        ref.current.height = height;
      }
    });
    if (videoRef.current) {
      videoRef.current.onloadedmetadata = () => {
        [processingCanvasRef, overlayCanvasRef, outputCanvasRef].forEach((ref) => {
          if (ref.current) {
            ref.current.width = width;
            ref.current.height = height;
          }
        });
      };
    }
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [stream, animate]);

  const capturePhoto = async () => {
    const outputCanvas = outputCanvasRef.current;
    if (!outputCanvas) return;
    const dataUrl = outputCanvas.toDataURL("image/png");
    setGallery((prev) => [{ url: dataUrl, id: Date.now() }, ...prev]);
  };

  const startRecording = async () => {
    if (!outputCanvasRef.current || isRecording) return;
    setIsRecording(true);
    const stream = outputCanvasRef.current.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    mediaRecorderRef.current = recorder;
    clipChunksRef.current = [];

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        clipChunksRef.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(clipChunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setClips((prev) => [{ url, id: Date.now() }, ...prev]);
      setIsRecording(false);
    };

    recorder.start();
    setTimeout(() => {
      if (recorder.state !== "inactive") recorder.stop();
    }, 4000);
  };

  const handleRecord = () => {
    let count = 3;
    setCountdown(`${count}...`);
    const timer = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        clearInterval(timer);
        setCountdown("🎬");
        setTimeout(() => {
          setCountdown(null);
          startRecording();
        }, 300);
      } else {
        setCountdown(`${count}...`);
      }
    }, 900);
  };

  const downloadClip = (url) => {
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.download = `charm-booth-${Date.now()}.webm`;
    link.click();
  };

  const shareClip = async (url) => {
    if (!url || !navigator.share) return;
    const blob = await (await fetch(url)).blob();
    const file = new File([blob], "charm-booth.webm", { type: "video/webm" });
    await navigator.share({ files: [file], title: "Charm Booth" });
  };

  const handleCountdown = () => {
    let count = 3;
    setCountdown(`${count}...`);
    const timer = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        clearInterval(timer);
        setCountdown("✨");
        setTimeout(() => {
          setCountdown(null);
          capturePhoto();
        }, 400);
      } else {
        setCountdown(`${count}...`);
      }
    }, 900);
  };

  return (
    <div className="app max-w-6xl mx-auto px-3 md:px-4 py-5 md:py-10 text-[#5B5B5B]">
      <header className="text-center mb-5 md:mb-6">
        <h1 className={`${typography.h1} text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-pink-300 to-emerald-200 mb-2 text-center`}>
          ✨ Charm Booth ✨
        </h1>
        <p className={`${typography.body} text-[#7A7A7A] font-medium text-center mb-6`}>
          Create magical memories!
        </p>
      </header>

      <section className="bg-white/95 rounded-3xl shadow-xl p-4 md:p-7 text-[#5B5B5B]">
        <div className="camera-shell mb-4 md:mb-5">
          {cameraError && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
              <div className="text-center text-red-500 font-semibold">
                Camera error: {cameraError}
                <div className="text-sm mt-2 text-gray-500">Please allow camera access and refresh.</div>
              </div>
            </div>
          )}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="mx-auto h-16 w-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Initializing camera... ✨</p>
              </div>
            </div>
          )}
          <video ref={videoRef} className="camera-layer hidden-video" muted playsInline />
          <canvas ref={processingCanvasRef} className="camera-layer canvas-processing" />
          <canvas ref={overlayCanvasRef} className="camera-layer canvas-overlay" />
          <canvas ref={outputCanvasRef} className="camera-layer canvas-output" />
          {countdown && (
            <div className="absolute inset-0 flex items-center justify-center text-white text-4xl md:text-5xl font-bold drop-shadow z-20">
              {countdown}
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <button
            className={`${buttonStyles.primary} ${typography.button} w-full md:w-auto`}
            onClick={startCamera}
          >
            ♻️ Restart Camera
          </button>
          <button
            className={`${buttonStyles.secondary} ${typography.buttonSmall} w-full md:w-auto`}
            onClick={() => setMirror((prev) => !prev)}
          >
            ⚙️ Mirror: {mirror ? "On" : "Off"}
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <button
            className={`w-16 h-16 md:w-20 md:h-20 ${buttonStyles.pill} pulse`}
            onClick={handleCountdown}
            aria-label="Capture photo"
          >
            <span className="text-2xl">📸</span>
          </button>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-6">
          <button
            className={`${buttonStyles.primary} ${typography.button} w-full md:w-auto ${isRecording ? "opacity-60 cursor-not-allowed" : ""}`}
            onClick={handleRecord}
            disabled={isRecording}
          >
            🎬 Record 4s Clip
          </button>
          <span className={`${typography.bodySmall} text-[#7A7A7A] text-center`}>
            {isRecording ? "Recording..." : "Countdown then record"}
          </span>
        </div>

        <div className="mb-6">
          <h3 className={`${typography.h3} text-[#E69BB7] mb-2`}>Filters</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                className={`min-w-[90px] rounded-2xl p-2 ${typography.buttonSmall} shadow ${
                  activeFilter === f.id
                    ? "bg-gradient-to-br from-pink-300 to-emerald-200 text-white shadow-lg"
                    : "bg-white text-[#7A7A7A]"
                }`}
                onClick={() => setActiveFilter(f.id)}
              >
                <div className="h-12 rounded-xl mb-1" style={{ background: f.overlay }} />
                {f.emoji} {f.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className={`${typography.h3} text-[#E69BB7] mb-2`}>Charms</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {OVERLAYS.map((o) => {
              return (
                <button
                  key={o.id}
                  className={`rounded-2xl p-4 ${typography.button} shadow flex flex-col items-center gap-2 ${
                    activeOverlay === o.id
                    ? "bg-gradient-to-br from-pink-300 to-emerald-200 text-white shadow-lg"
                    : "bg-gray-50 text-[#7A7A7A]"
                  }`}
                  onClick={() => setActiveOverlay(o.id)}
                >
                  <span className="text-2xl">{o.icon}</span>
                  {o.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow">
            <label className={`${typography.label} text-[#7A7A7A] mb-2 block`}>Charm Speed</label>
            <select
              className="w-full rounded-lg border border-pink-100 p-2 text-sm"
              value={overlaySpeed}
              onChange={(e) => setOverlaySpeed(e.target.value)}
            >
              {SPEED_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h3 className={`${typography.h3} text-[#E69BB7] mb-3`}>Gallery</h3>
        {gallery.length === 0 ? (
          <p className={`${typography.bodySmall} text-[#7A7A7A]`}>No photos yet. Start snapping! 📸</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {gallery.map((photo) => (
              <div key={photo.id} className="bg-white rounded-2xl p-2 shadow">
                <img src={photo.url} alt="Capture" className="rounded-xl mb-2" />
                <a
                  className="block text-center text-xs text-[#7A7A7A] underline"
                  href={photo.url}
                  download={`mintyblush-${photo.id}.png`}
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h3 className={`${typography.h3} text-[#E69BB7] mb-3`}>Video Clips</h3>
        {clips.length === 0 ? (
          <p className={`${typography.bodySmall} text-[#7A7A7A]`}>No clips yet. Record a 4s charm clip 🎬</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clips.map((clip) => (
              <div key={clip.id} className="bg-white rounded-2xl p-4 shadow">
                <video src={clip.url} controls className="w-full rounded-xl mb-3" />
                <div className="flex flex-wrap gap-3">
                  <button
                    className={`${buttonStyles.secondary} ${typography.buttonSmall}`}
                    onClick={() => downloadClip(clip.url)}
                  >
                    ⬇️ Download WebM
                  </button>
                  {navigator.share && (
                    <button
                      className={`${buttonStyles.secondary} ${typography.buttonSmall}`}
                      onClick={() => shareClip(clip.url)}
                    >
                      📤 Share
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
