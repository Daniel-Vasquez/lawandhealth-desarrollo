import { useEffect, useState } from 'react';
import EvaluationForm from './EvaluationForm';

export default function FloatingWhatsApp() {
  const [isHeroInView, setIsHeroInView] = useState(true);
  const [isFinalCtaInView, setIsFinalCtaInView] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isButtonVisible = !isHeroInView && !isFinalCtaInView;

  useEffect(() => {
    const heroEl = document.querySelector<HTMLElement>('.js-hero');
    const finalCtaEl = document.querySelector<HTMLElement>('.js-final-cta');

    const observers: IntersectionObserver[] = [];

    if (heroEl) {
      const heroObserver = new IntersectionObserver(([entry]) => setIsHeroInView(entry.isIntersecting), {
        threshold: 0,
      });
      heroObserver.observe(heroEl);
      observers.push(heroObserver);
    }

    if (finalCtaEl) {
      const finalCtaObserver = new IntersectionObserver(([entry]) => setIsFinalCtaInView(entry.isIntersecting), {
        threshold: 0,
      });
      finalCtaObserver.observe(finalCtaEl);
      observers.push(finalCtaObserver);
    }

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (!isModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isModalOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        aria-label="Solicitar evaluación por WhatsApp"
        aria-hidden={!isButtonVisible}
        tabIndex={isButtonVisible ? 0 : -1}
        className={`fixed z-40 bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white transition-all duration-500 ease-out hover:bg-[#20bd5a] ${isButtonVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
          } ${isButtonVisible ? 'animate-whatsapp-pulse' : ''}`}
      >
        <svg viewBox="0 0 32 32" fill="currentColor" className="w-7 h-7" aria-hidden="true">
          <path d="M16.004 3C9.377 3 4 8.377 4 15.005c0 2.648.86 5.096 2.32 7.077L4 29l7.1-2.278a11.9 11.9 0 0 0 4.904 1.045h.005c6.627 0 12.004-5.377 12.004-12.005C28.013 8.377 22.636 3 16.004 3zm0 21.79h-.004a9.75 9.75 0 0 1-4.97-1.363l-.357-.212-3.75 1.203 1.224-3.65-.232-.375a9.74 9.74 0 0 1-1.5-5.184c0-5.395 4.393-9.786 9.792-9.786 2.615 0 5.073 1.02 6.922 2.87a9.73 9.73 0 0 1 2.867 6.92c0 5.396-4.393 9.787-9.792 9.787zm5.366-7.33c-.294-.147-1.74-.858-2.01-.956-.27-.098-.467-.147-.664.147-.196.294-.76.956-.932 1.152-.171.196-.343.221-.637.074-.294-.147-1.242-.458-2.366-1.462-.874-.78-1.464-1.744-1.636-2.038-.171-.294-.018-.453.129-.6.132-.132.294-.343.44-.515.147-.171.196-.294.294-.49.098-.196.049-.368-.025-.515-.074-.147-.664-1.6-.91-2.192-.24-.577-.484-.5-.664-.51-.171-.008-.368-.01-.564-.01-.196 0-.515.074-.784.368-.27.294-1.03 1.006-1.03 2.454 0 1.447 1.054 2.845 1.2 3.042.147.196 2.075 3.168 5.028 4.443.703.303 1.251.484 1.679.62.705.224 1.347.192 1.854.117.566-.084 1.74-.712 1.985-1.4.245-.688.245-1.276.171-1.4-.073-.123-.269-.196-.563-.343z" />
        </svg>
      </button>

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsModalOpen(false)}
        aria-hidden={!isModalOpen}
      >
        <div
          className={`w-full max-w-md max-h-[85vh] overflow-y-auto transition-transform duration-300 ${isModalOpen ? 'scale-100' : 'scale-95'
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          <EvaluationForm onClose={() => setIsModalOpen(false)} />
        </div>
      </div>
    </>
  );
}
