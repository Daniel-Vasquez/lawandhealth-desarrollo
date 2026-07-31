import { useState, useEffect } from 'react';

interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

interface NavigationProps {
  links: NavLink[];
  ctaLabel: string;
  ctaHref: string;
}

export default function Navigation({ links, ctaLabel, ctaHref }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isOpen ? 'bg-brand-primary/95 backdrop-blur-md' : 'bg-transparent'
          }`}
      >
        <nav className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 md:h-20 flex items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2 text-white hover:text-brand-secondary transition-colors duration-200"
            aria-label="Lawandhealth — Inicio"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-secondary rounded-sm flex items-center justify-center">
              <span className="text-black font-black text-sm md:text-base tracking-tighter">LH</span>
            </div>
            <span className="hidden sm:block font-bold text-base md:text-lg tracking-wide uppercase">
              Lawandhealth
            </span>
          </a>

          {/* Desktop Nav Links */}
          <ul className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className="text-sm font-semibold uppercase tracking-widest text-white/80 hover:text-brand-secondary transition-colors duration-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <a
            href={ctaHref}
            className="hidden lg:inline-flex items-center bg-brand-secondary text-black text-sm font-black uppercase tracking-widest px-5 py-2.5 hover:bg-white transition-colors duration-200"
          >
            {ctaLabel}
          </a>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] group"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 origin-center ${isOpen ? 'rotate-45 translate-y-[7px]' : ''
                }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0 scale-x-0' : ''
                }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 origin-center ${isOpen ? '-rotate-45 -translate-y-[7px]' : ''
                }`}
            />
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-brand-primary flex flex-col transition-all duration-500 lg:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        {/* Decorative background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full opacity-20 blur-3xl"
            style={{ background: 'radial-gradient(circle, #0d401b 0%, transparent 70%)' }}
          />
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center px-8 pt-20">
          <ul className="flex flex-col gap-2">
            {links.map((link, i) => (
              <li
                key={link.label}
                className="overflow-hidden"
                style={{
                  transitionDelay: isOpen ? `${i * 60}ms` : '0ms',
                }}
              >
                <a
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  onClick={() => setIsOpen(false)}
                  className={`block text-4xl sm:text-5xl font-black uppercase tracking-tight text-white hover:text-brand-secondary transition-all duration-300 py-2 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                    }`}
                  style={{ transitionDelay: isOpen ? `${i * 60 + 100}ms` : '0ms' }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile CTA */}
          <a
            href={ctaHref}
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center justify-center bg-brand-secondary text-black text-sm font-black uppercase tracking-widest px-6 py-4 mt-10 hover:bg-white transition-colors duration-200"
          >
            {ctaLabel}
          </a>
        </div>

        {/* Bottom accent line */}
        <div className="h-1 bg-brand-secondary" />
      </div>
    </>
  );
}
