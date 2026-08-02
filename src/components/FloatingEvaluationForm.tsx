import { useEffect, useState } from 'react';
import EvaluationForm from './EvaluationForm';

const SCROLL_THRESHOLD = 150;

export default function FloatingEvaluationForm() {
  const [isPastThreshold, setIsPastThreshold] = useState(false);
  const [isHeroInView, setIsHeroInView] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsPastThreshold(window.scrollY > SCROLL_THRESHOLD);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    const heroEl = document.querySelector<HTMLElement>('.js-hero');
    let observer: IntersectionObserver | null = null;
    if (heroEl) {
      observer = new IntersectionObserver(([entry]) => setIsHeroInView(entry.isIntersecting), {
        threshold: 0,
      });
      observer.observe(heroEl);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer?.disconnect();
    };
  }, []);

  const isVisible = isPastThreshold && isHeroInView && !isDismissed;

  return (
    <div
      className={`fixed z-30 bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[380px] max-h-[80vh] overflow-y-auto transition-transform duration-500 ease-out ${isVisible ? 'translate-y-0 pointer-events-auto' : 'translate-y-[150%] pointer-events-none'
        }`}
      aria-hidden={!isVisible}
    >
      <EvaluationForm onClose={() => setIsDismissed(true)} />
    </div>
  );
}
