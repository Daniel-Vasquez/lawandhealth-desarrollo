import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 192;
// Container height = SCROLL_MULTIPLIER × 100vh.
// Actual scroll range = (SCROLL_MULTIPLIER - 1) × 100vh ≈ 400vh for 192 frames.
const SCROLL_MULTIPLIER = 5;

function getFrameUrl(index: number): string {
  return `/hero-video/fotograma_${String(index + 1).padStart(4, '0')}.jpg`;
}

interface Props {
  nextRace?: string;
  raceDate?: string;
}

export default function HeroCanvas({ nextRace = 'Monaco GP', raceDate = 'May 22–25' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number>(0);

  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingVisible, setLoadingVisible] = useState(true);

  // object-fit: cover equivalent on canvas
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = imagesRef.current[index];
    if (!img?.complete || !img.naturalWidth) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const canvasRatio = cw / ch;
    const imgRatio = iw / ih;

    let sx = 0, sy = 0, sw = iw, sh = ih;
    if (canvasRatio > imgRatio) {
      sh = iw / canvasRatio;
      sy = (ih - sh) / 2;
    } else {
      sw = ih * canvasRatio;
      sx = (iw - sw) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
  }, []);

  // Preload all frames in parallel, track progress
  useEffect(() => {
    let isMounted = true;
    let timer: ReturnType<typeof setTimeout>;

    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    imagesRef.current = images;
    let loadedCount = 0;

    const promises = Array.from({ length: TOTAL_FRAMES }, (_, i) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        const onFinish = () => {
          if (isMounted) {
            loadedCount++;
            setLoadProgress(Math.floor((loadedCount / TOTAL_FRAMES) * 100));
          }
          resolve();
        };
        img.onload = onFinish;
        img.onerror = onFinish;
        img.src = getFrameUrl(i);
        images[i] = img;
      })
    );

    Promise.all(promises).then(() => {
      if (!isMounted) return;
      setIsLoaded(true);
      timer = setTimeout(() => {
        if (isMounted) setLoadingVisible(false);
      }, 600);
    });

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  // Sync canvas buffer size to viewport; redraw current frame on resize
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(currentFrameRef.current);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [drawFrame]);

  // Wire ScrollTrigger once all frames are ready
  useEffect(() => {
    if (!isLoaded || !containerRef.current) return;

    drawFrame(0);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current!,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate(self) {
          const frame = Math.min(
            Math.round(self.progress * (TOTAL_FRAMES - 1)),
            TOTAL_FRAMES - 1
          );
          if (frame === currentFrameRef.current) return;
          currentFrameRef.current = frame;
          cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(() => drawFrame(frame));
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
      cancelAnimationFrame(rafRef.current);
    };
  }, [isLoaded, drawFrame]);

  return (
    <div
      ref={containerRef}
      id="home"
      style={{ height: `${SCROLL_MULTIPLIER * 100}vh` }}
    >
      {/* Sticky panel — stays pinned for the entire scroll range */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">

        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20 pointer-events-none" />

        {/* Lime accent bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-brand-lime z-10" />

        {/* Hero content */}
        <div className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-24 px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto">
          <div className="mb-4">
            <span className="inline-block bg-brand-lime text-black text-xs font-black uppercase tracking-widest px-3 py-1">
              #4
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[100px] font-black uppercase leading-none tracking-tighter text-white mb-4 md:mb-6">
            Lawandhealth
          </h1>

          <p className="text-base md:text-lg lg:text-xl font-medium uppercase tracking-[0.2em] text-brand-lime mb-8 md:mb-10">
            2025 McLaren Formula 1 Driver
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
            <a
              href="#on-track"
              className="group inline-flex items-center gap-3 bg-brand-lime text-black font-black uppercase text-sm tracking-widest px-6 py-4 hover:bg-white transition-colors duration-200"
            >
              Explore Season
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>

            <div className="flex items-center gap-3 text-white/90">
              <div className="w-2 h-2 rounded-full bg-brand-lime animate-pulse" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Next Race</p>
                <p className="text-sm font-bold">{nextRace} · {raceDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-8 md:right-12 lg:right-20 z-10 hidden md:flex flex-col items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40 rotate-90 origin-center translate-x-4">
            Scroll
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent mt-6" />
        </div>

        {/* Loading screen — fades out when all frames are ready */}
        {loadingVisible && (
          <div
            className={`absolute inset-0 z-50 bg-[#0a0a0a] flex flex-col items-center justify-center gap-6 transition-opacity duration-500 ${
              isLoaded ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-black uppercase tracking-[0.4em] text-brand-lime">#4</span>
              <span className="text-lg font-black uppercase tracking-widest text-white">Lawandhealth</span>
            </div>

            <div className="relative w-48 h-px bg-white/10 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-brand-lime transition-all duration-100 ease-linear"
                style={{ width: `${loadProgress}%` }}
              />
            </div>

            <p className="font-mono text-xs text-white/30">{loadProgress}%</p>
          </div>
        )}
      </div>
    </div>
  );
}
