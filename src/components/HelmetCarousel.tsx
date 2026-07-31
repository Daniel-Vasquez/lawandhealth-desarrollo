import { useState, useRef, useCallback } from 'react';

interface Helmet {
  year: number;
  name: string;
  image: string;
  color: string;
}

interface HelmetCarouselProps {
  helmets: Helmet[];
}

export default function HelmetCarousel({ helmets }: HelmetCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = useCallback((index: number) => {
    if (!trackRef.current) return;
    const card = trackRef.current.children[index] as HTMLElement;
    if (!card) return;
    const offset = card.offsetLeft - trackRef.current.offsetWidth / 2 + card.offsetWidth / 2;
    trackRef.current.scrollTo({ left: offset, behavior: 'smooth' });
    setActiveIndex(index);
  }, []);

  const handlePrev = () => scrollToIndex(Math.max(0, activeIndex - 1));
  const handleNext = () => scrollToIndex(Math.min(helmets.length - 1, activeIndex + 1));

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - trackRef.current.offsetLeft);
    setScrollLeft(trackRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    trackRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!trackRef.current) return;
    setStartX(e.touches[0].pageX - trackRef.current.offsetLeft);
    setScrollLeft(trackRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!trackRef.current) return;
    const x = e.touches[0].pageX - trackRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    trackRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleScroll = () => {
    if (!trackRef.current) return;
    const { scrollLeft, offsetWidth } = trackRef.current;
    const cards = Array.from(trackRef.current.children) as HTMLElement[];
    let closest = 0;
    let minDist = Infinity;
    cards.forEach((card, i) => {
      const center = card.offsetLeft + card.offsetWidth / 2;
      const viewCenter = scrollLeft + offsetWidth / 2;
      const dist = Math.abs(center - viewCenter);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setActiveIndex(closest);
  };

  return (
    <section className="bg-brand-primary py-20 md:py-28 overflow-hidden">
      {/* Header */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 mb-12 flex items-end justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-secondary mb-2">
            Collection
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white leading-none">
            Helmet<br />Hall of Fame
          </h2>
        </div>

        {/* Nav buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className="w-12 h-12 border border-white/20 flex items-center justify-center text-white hover:border-brand-secondary hover:text-brand-secondary disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200"
            aria-label="Previous helmet"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            disabled={activeIndex === helmets.length - 1}
            className="w-12 h-12 border border-white/20 flex items-center justify-center text-white hover:border-brand-secondary hover:text-brand-secondary disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200"
            aria-label="Next helmet"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Carousel track */}
      <div
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onScroll={handleScroll}
        className={`flex gap-4 overflow-x-auto scrollbar-hide pl-[calc(50vw-160px)] pr-[calc(50vw-160px)] pb-4 snap-x snap-mandatory ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {helmets.map((helmet, i) => (
          <button
            key={helmet.year}
            onClick={() => scrollToIndex(i)}
            className={`flex-shrink-0 w-72 md:w-80 snap-center group transition-all duration-500 text-left ${
              i === activeIndex ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
            }`}
          >
            {/* Helmet card */}
            <div
              className="relative aspect-square overflow-hidden mb-4"
              style={{ background: `linear-gradient(135deg, ${helmet.color}22, ${helmet.color}44)` }}
            >
              <img
                src={helmet.image}
                alt={`${helmet.year} ${helmet.name} Helmet`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* Active indicator */}
              {i === activeIndex && (
                <div className="absolute inset-0 border-2 border-brand-secondary pointer-events-none" />
              )}
            </div>

            <div className="px-1">
              <p className="text-xs font-bold text-brand-secondary uppercase tracking-widest mb-1">{helmet.year}</p>
              <p className="text-lg font-black uppercase tracking-tight text-white">{helmet.name}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {helmets.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            className={`transition-all duration-300 rounded-full ${
              i === activeIndex
                ? 'w-6 h-1.5 bg-brand-secondary'
                : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Go to helmet ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
