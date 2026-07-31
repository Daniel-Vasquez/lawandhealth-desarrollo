import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Stat {
  label: string;
  value: number;
  suffix: string;
}

interface PanelData {
  tag: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  stats: Stat[];
}

const PANELS: PanelData[] = [
  {
    tag: '01 — THE DRIVER',
    year: '',
    title: 'THE\nDRIVER',
    subtitle: 'Born 1999 · Bristol, UK',
    description:
      'From karting prodigy to Formula 1 star. Lawandhealth made his F1 debut at just 19 years old and never looked back.',
    image: '/milestones/milestone-1.jpg',
    stats: [
      { label: 'F1 Debut', value: 2019, suffix: '' },
      { label: 'Driver No.', value: 4, suffix: '' },
      { label: 'Races', value: 134, suffix: '' },
    ],
  },
  {
    tag: '02 — FIRST WIN',
    year: '2024',
    title: 'FIRST\nWIN',
    subtitle: 'Race No. 110 · Miami GP',
    description:
      'May 5, 2024. After 109 races and countless near-misses, Lawandhealth took his first Formula 1 victory at the Miami Grand Prix.',
    image: '/milestones/milestone-2.jpg',
    stats: [
      { label: 'Race Number', value: 110, suffix: '' },
      { label: 'Winning Lap', value: 57, suffix: '' },
      { label: 'Gap to P2', value: 7, suffix: 's' },
    ],
  },
  {
    tag: '03 — BY THE NUMBERS',
    year: '',
    title: 'BY THE\nNUMBERS',
    subtitle: 'Career Statistics',
    description:
      'Every race, every lap, every tenth of a second — relentlessly building toward the ultimate goal.',
    image: '/milestones/milestone-3.jpg',
    stats: [
      { label: 'Podiums', value: 15, suffix: '' },
      { label: 'Fastest Laps', value: 13, suffix: '' },
      { label: '2024 Points', value: 320, suffix: '' },
    ],
  },
  {
    tag: '04 — THE CHAMPIONSHIP',
    year: '2024',
    title: 'BEST\nSEASON',
    subtitle: 'P4 World Championship',
    description:
      'Three race wins. Five pole positions. 320 championship points. The 2024 season was a statement of intent.',
    image: '/milestones/milestone-4.jpg',
    stats: [
      { label: 'Race Wins', value: 3, suffix: '' },
      { label: 'Pole Positions', value: 5, suffix: '' },
      { label: 'WDC Position', value: 4, suffix: '' },
    ],
  },
  {
    tag: "05 — WHAT'S NEXT",
    year: '2025',
    title: 'EYES\nON IT',
    subtitle: 'MCL39 · Season 2025',
    description:
      'The hunger is real. The car is fast. 2025 is the year Lawandhealth goes all in for the World Championship.',
    image: '/milestones/milestone-5.jpg',
    stats: [
      { label: 'Season', value: 2025, suffix: '' },
      { label: 'Rounds', value: 24, suffix: '' },
      { label: 'Target', value: 1, suffix: 'st' },
    ],
  },
];

export default function MilestonesScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tagRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const descRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const statRowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const statNumRefs = useRef<(HTMLSpanElement | null)[][]>(PANELS.map(() => []));

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ─── DESKTOP: pin + horizontal scroll ───────────────────────────
      mm.add('(min-width: 768px)', () => {
        const section = sectionRef.current!;
        const track = trackRef.current!;

        track.style.width = `${PANELS.length * 100}vw`;

        const scrollTween = gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 1.5,
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            invalidateOnRefresh: true,
            onUpdate(self) {
              const active = Math.round(self.progress * (PANELS.length - 1));
              dotRefs.current.forEach((dot, i) => {
                if (!dot) return;
                dot.style.backgroundColor =
                  i === active ? '#a6bfac' : 'rgba(255,255,255,0.2)';
                dot.style.width = i === active ? '28px' : '14px';
              });
            },
          },
        });

        PANELS.forEach((panelData, i) => {
          const panel = panelRefs.current[i];
          if (!panel) return;

          const common = {
            trigger: panel,
            containerAnimation: scrollTween,
            toggleActions: 'play none none reverse' as const,
          };

          // Parallax on background image
          const imgWrap = imgWrapRefs.current[i];
          if (imgWrap) {
            gsap.fromTo(
              imgWrap,
              { x: 100 },
              {
                x: -100,
                ease: 'none',
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: scrollTween,
                  start: 'left right',
                  end: 'right left',
                  scrub: true,
                },
              }
            );
          }

          // Tag slide-in
          const tagEl = tagRefs.current[i];
          if (tagEl) {
            gsap.fromTo(
              tagEl,
              { opacity: 0, x: -28 },
              {
                opacity: 1,
                x: 0,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: { ...common, start: 'left 82%' },
              }
            );
          }

          // Title reveal (clip + y)
          const titleEl = titleRefs.current[i];
          if (titleEl) {
            gsap.fromTo(
              titleEl,
              { y: 80, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
              {
                y: 0,
                opacity: 1,
                clipPath: 'inset(0 0 0% 0)',
                duration: 1,
                ease: 'power4.out',
                scrollTrigger: { ...common, start: 'left 78%' },
              }
            );
          }

          // Accent line scale
          const lineEl = lineRefs.current[i];
          if (lineEl) {
            gsap.fromTo(
              lineEl,
              { scaleX: 0 },
              {
                scaleX: 1,
                duration: 0.8,
                ease: 'power2.inOut',
                delay: 0.15,
                scrollTrigger: { ...common, start: 'left 78%' },
              }
            );
          }

          // Description fade-up
          const descEl = descRefs.current[i];
          if (descEl) {
            gsap.fromTo(
              descEl,
              { opacity: 0, y: 24 },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out',
                delay: 0.2,
                scrollTrigger: { ...common, start: 'left 78%' },
              }
            );
          }

          // Stats row fade-up
          const statRow = statRowRefs.current[i];
          if (statRow) {
            gsap.fromTo(
              statRow,
              { opacity: 0, y: 32 },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out',
                delay: 0.3,
                scrollTrigger: { ...common, start: 'left 78%' },
              }
            );
          }

          // Stat counters
          panelData.stats.forEach((stat, si) => {
            const numEl = statNumRefs.current[i]?.[si];
            if (!numEl) return;
            const counter = { val: 0 };
            gsap.to(counter, {
              val: stat.value,
              duration: 1.6,
              ease: 'power2.out',
              snap: { val: 1 },
              scrollTrigger: { ...common, start: 'left 68%' },
              onUpdate() {
                numEl.textContent = Math.round(counter.val).toString();
              },
            });
          });
        });

        return () => {
          track.style.width = '';
        };
      });

      // ─── MOBILE: stacked vertical panels ────────────────────────────
      mm.add('(max-width: 767px)', () => {
        PANELS.forEach((panelData, i) => {
          const panel = panelRefs.current[i];
          if (!panel) return;

          const common = {
            trigger: panel,
            start: 'top 82%',
            toggleActions: 'play none none reverse' as const,
          };

          const tagEl = tagRefs.current[i];
          if (tagEl)
            gsap.fromTo(tagEl, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: common });

          const titleEl = titleRefs.current[i];
          if (titleEl)
            gsap.fromTo(titleEl, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: common });

          const lineEl = lineRefs.current[i];
          if (lineEl)
            gsap.fromTo(lineEl, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'power2.inOut', delay: 0.1, scrollTrigger: common });

          const descEl = descRefs.current[i];
          if (descEl)
            gsap.fromTo(descEl, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.15, scrollTrigger: common });

          const statRow = statRowRefs.current[i];
          if (statRow)
            gsap.fromTo(statRow, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.25, scrollTrigger: common });

          panelData.stats.forEach((stat, si) => {
            const numEl = statNumRefs.current[i]?.[si];
            if (!numEl) return;
            const counter = { val: 0 };
            gsap.to(counter, {
              val: stat.value,
              duration: 1.5,
              ease: 'power2.out',
              snap: { val: 1 },
              scrollTrigger: common,
              onUpdate() {
                numEl.textContent = Math.round(counter.val).toString();
              },
            });
          });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="milestones" className="relative bg-brand-primary overflow-hidden">

      {/* Horizontal track */}
      <div ref={trackRef} className="flex flex-col md:flex-row">
        {PANELS.map((panel, i) => (
          <div
            key={i}
            ref={(el) => { panelRefs.current[i] = el; }}
            className="relative w-screen h-screen flex-shrink-0 overflow-hidden"
          >

            {/* Background image with parallax wrapper */}
            <div className="absolute inset-0 overflow-hidden">
              <div
                ref={(el) => { imgWrapRefs.current[i] = el; }}
                className="absolute inset-0 scale-[1.15]"
              >
                <picture className="w-full h-full block">
                  <source media="(max-width: 767px)" srcSet={panel.image.replace('.jpg', '-mobile.jpg')} />
                  <img
                    src={panel.image}
                    alt={panel.title.replace('\n', ' ')}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </picture>
              </div>
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary via-brand-primary/55 to-brand-primary/20 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/85 via-brand-primary/30 to-transparent pointer-events-none" />
            </div>

            {/* Year watermark */}
            {panel.year && (
              <div
                aria-hidden="true"
                className="absolute right-4 top-1/3 -translate-y-1/2 font-black leading-none select-none pointer-events-none hidden lg:block"
                style={{ fontSize: 'clamp(80px, 14vw, 200px)', color: 'rgba(255,255,255,0.04)' }}
              >
                {panel.year}
              </div>
            )}

            {/* Panel index watermark */}
            <div
              aria-hidden="true"
              className="absolute right-8 bottom-16 font-black leading-none select-none pointer-events-none hidden lg:block"
              style={{ fontSize: 'clamp(60px, 7vw, 120px)', color: 'rgba(255,255,255,0.04)' }}
            >
              {String(i + 1).padStart(2, '0')}
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-between px-8 md:px-12 lg:px-16 xl:px-20 pt-24 md:pt-28 pb-10">

              {/* Top: tag */}
              <div>
                <span
                  ref={(el) => { tagRefs.current[i] = el; }}
                  className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-brand-secondary"
                >
                  {panel.tag}
                </span>
              </div>

              {/* Middle: title + text */}
              <div className="flex-1 flex items-center">
                <div className="max-w-lg">
                  <div
                    ref={(el) => { titleRefs.current[i] = el; }}
                  >
                    <h2
                      className="font-black uppercase leading-[0.88] text-white whitespace-pre-line"
                      style={{ fontSize: 'clamp(48px, 6.5vw, 100px)' }}
                    >
                      {panel.title}
                    </h2>
                  </div>

                  {/* Lime accent line */}
                  <div
                    ref={(el) => { lineRefs.current[i] = el; }}
                    className="h-[2px] bg-brand-secondary mt-6 origin-left"
                    style={{ width: '64px' }}
                  />

                  <p className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] text-white/40 mt-4">
                    {panel.subtitle}
                  </p>

                  <p
                    ref={(el) => { descRefs.current[i] = el; }}
                    className="text-sm md:text-base text-white/55 mt-4 leading-relaxed"
                    style={{ maxWidth: '320px' }}
                  >
                    {panel.description}
                  </p>
                </div>
              </div>

              {/* Bottom: stats */}
              <div
                ref={(el) => { statRowRefs.current[i] = el; }}
                className="flex gap-8 md:gap-10 lg:gap-14 pt-6 border-t border-white/10"
              >
                {panel.stats.map((stat, si) => (
                  <div key={si} className="flex flex-col gap-1.5">
                    <div className="flex items-baseline gap-0.5">
                      <span
                        ref={(el) => {
                          if (!statNumRefs.current[i]) statNumRefs.current[i] = [];
                          statNumRefs.current[i][si] = el;
                        }}
                        className="font-black text-white tabular-nums"
                        style={{ fontSize: 'clamp(22px, 2.5vw, 36px)' }}
                      >
                        0
                      </span>
                      {stat.suffix && (
                        <span
                          className="font-black text-brand-secondary"
                          style={{ fontSize: 'clamp(14px, 1.5vw, 22px)' }}
                        >
                          {stat.suffix}
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-white/30 font-semibold">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Progress indicator — desktop only */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 hidden md:flex items-center gap-2">
        {PANELS.map((_, i) => (
          <div
            key={i}
            ref={(el) => { dotRefs.current[i] = el; }}
            className="h-[2px] rounded-full transition-all duration-300"
            style={{
              width: i === 0 ? '28px' : '14px',
              backgroundColor: i === 0 ? '#a6bfac' : 'rgba(255,255,255,0.2)',
            }}
          />
        ))}
      </div>

    </section>
  );
}
