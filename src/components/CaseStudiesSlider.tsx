import { useEffect, useState } from 'react';

interface CaseStudySlide {
  image: string;
  situation: string;
  strategy: string;
  result: string;
}

const slides: CaseStudySlide[] = [
  {
    image: 'images/casos-de-exito/Laboratorio farmaceutico.webp',
    situation:
      'Un laboratorio farmacéutico con operación nacional recibió una orden de suspensión temporal de COFEPRIS derivada de observaciones en su sistema de farmacovigilancia, con riesgo de detener por completo la comercialización de sus productos.',
    strategy:
      'Diseñamos una defensa integral: interpusimos el recurso de revisión correspondiente, subsanamos cada no conformidad detectada y acompañamos al cliente en todas las mesas de trabajo con la autoridad sanitaria.',
    result:
      'La suspensión fue revocada en menos de 45 días naturales y el laboratorio recuperó la operación plena de su planta sin interrupciones adicionales en su cadena de distribución.',
  },
  {
    image: 'images/casos-de-exito/Empresa de alimentos y bebidas.webp',
    situation:
      'Una empresa de alimentos y bebidas buscaba lanzar una nueva línea de productos, pero su etiquetado y su publicidad presentaban observaciones de riesgo frente a la Ley General de Salud y el reglamento de publicidad sanitaria.',
    strategy:
      'Realizamos una auditoría regulatoria integral, ajustamos el etiquetado conforme a la norma vigente y gestionamos ante COFEPRIS los permisos de publicidad sanitaria requeridos antes del lanzamiento.',
    result:
      'El producto salió al mercado en la fecha planeada, con cero observaciones posteriores y sin riesgo de sanción por publicidad no autorizada.',
  },
  {
    image: 'images/casos-de-exito/Grupo hospitalario.webp',
    situation:
      'Un grupo hospitalario en expansión necesitaba obtener el aviso de funcionamiento y la licencia sanitaria de un nuevo centro de diagnóstico por imagen antes de su apertura al público.',
    strategy:
      'Coordinamos el trámite integral ante la autoridad sanitaria, desde la verificación normativa de las instalaciones hasta la gestión de las licencias de responsable sanitario y de equipo de rayos X.',
    result:
      'El centro obtuvo todas sus autorizaciones sanitarias en tiempo récord y abrió sus puertas conforme al calendario original, sin observaciones en su primera visita de verificación.',
  },
];

const AUTOPLAY_INTERVAL_MS = 7000;

interface CaseStudiesSliderProps {
  eyebrow?: string;
  title: string;
}

export default function CaseStudiesSlider({ eyebrow = 'Resultados', title }: CaseStudiesSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isPaused, activeIndex]);

  const goTo = (index: number) => setActiveIndex((index + slides.length) % slides.length);
  const goPrev = () => goTo(activeIndex - 1);
  const goNext = () => goTo(activeIndex + 1);

  const active = slides[activeIndex];

  return (
    <div
      className="relative h-[85svh] w-full overflow-hidden bg-brand-primary"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') goPrev();
        if (event.key === 'ArrowRight') goNext();
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Casos de éxito"
      tabIndex={0}
    >
      {/* Background images — crossfade */}
      {slides.map((slide, index) => (
        <img
          key={slide.image}
          src={slide.image}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
        />
      ))}

      {/* Legibility overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/25" />
      <div className="absolute inset-0 bg-black/25" />

      {/* Section title — floats over the image */}
      <div className="absolute left-8 top-8 z-20 max-w-[60%] select-none sm:max-w-xs md:top-12 md:max-w-sm">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-brand-secondary">{eyebrow}</p>
        <h2 className="text-xl font-black uppercase leading-tight tracking-tighter text-white sm:text-2xl md:text-3xl lg:text-4xl">
          {title}
        </h2>
      </div>

      {/* Slide counter watermark */}
      <div className="absolute top-8 right-6 z-10 select-none lg:right-12">
        <span className="font-black text-2xl leading-none tracking-tighter text-white/25 sm:text-[3rem] md:text-[4rem]">
          {String(activeIndex + 1).padStart(2, '0')}
          <span className="text-white/10">/{String(slides.length).padStart(2, '0')}</span>
        </span>
      </div>

      {/* Text content — timeline layout */}
      <div className="relative z-10 flex h-full items-end">
        <div className="mx-auto w-full max-w-[1400px] px-6 pb-24 md:pb-32 lg:px-12">
          <div key={activeIndex} className="animate-fade-up">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-brand-secondary md:mb-5">
              Caso de éxito
            </p>
            <div className="flex flex-col gap-5 md:flex-row md:gap-8 lg:gap-12">
              <div className="relative flex-1 border-l-2 border-white/30 py-1 pl-6 md:border-l-0 md:border-t-2 md:pl-0 md:pt-6">
                <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-white md:-top-[5px] md:left-0" />
                <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-brand-secondary/80">
                  Situación
                </p>
                <p className="text-sm leading-snug text-white/90 line-clamp-3 md:line-clamp-none md:text-base md:leading-relaxed">{active.situation}</p>
              </div>
              <div className="relative flex-1 border-l-2 border-white/30 py-1 pl-6 md:border-l-0 md:border-t-2 md:pl-0 md:pt-6">
                <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-white md:-top-[5px] md:left-0" />
                <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-brand-secondary/80">
                  Estrategia implementada
                </p>
                <p className="text-sm leading-snug text-white/90 line-clamp-3 md:line-clamp-none md:text-base md:leading-relaxed">{active.strategy}</p>
              </div>
              <div className="relative flex-1 border-l-2 border-white/30 py-1 pl-6 md:border-l-0 md:border-t-2 md:pl-0 md:pt-6">
                <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-white md:-top-[5px] md:left-0" />
                <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-brand-secondary/80">
                  Resultado obtenido
                </p>
                <p className="text-sm font-semibold leading-snug text-white line-clamp-3 md:line-clamp-none md:text-base md:leading-relaxed">{active.result}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <div className="absolute bottom-8 left-8 z-20 flex items-center gap-3 md:gap-4">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Caso anterior"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-300 ease-in-out hover:scale-105 hover:bg-white/20 active:scale-95 md:h-12 md:w-12"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 md:h-6 md:w-6">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Siguiente caso"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-300 ease-in-out hover:scale-105 hover:bg-white/20 active:scale-95 md:h-12 md:w-12"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 md:h-6 md:w-6">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-6 right-6 z-20 flex gap-2 lg:right-12">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Ir al caso ${index + 1}`}
            aria-current={index === activeIndex}
            className={`h-1.5 rounded-full transition-all duration-500 ease-in-out ${index === activeIndex ? 'w-8 bg-brand-secondary' : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
          />
        ))}
      </div>
    </div>
  );
}
