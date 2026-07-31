import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  eyebrow?: string;
  title: string;
  items: FAQItem[];
}

export default function FAQ({ eyebrow = 'Dudas frecuentes', title, items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section id="faq" className="bg-brand-primary-light/10 py-20 md:py-28">
      <div className="max-w-[900px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="mb-12 md:mb-16 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-secondary mb-3">{eyebrow}</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-white leading-tight">
            {title}
          </h2>
        </div>

        {/* Accordion */}
        <div className="flex flex-col divide-y divide-white/10 border-t border-b border-white/10">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.question}>
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-4 py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-base md:text-lg font-bold text-white">{item.question}</span>
                  <svg
                    className={`w-5 h-5 flex-shrink-0 text-brand-secondary transition-transform duration-300 ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
                <div
                  className="grid overflow-hidden transition-all duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="text-sm md:text-base text-white/60 leading-relaxed pb-6 max-w-xl">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
