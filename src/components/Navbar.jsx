import { Link, useLocation } from 'react-router-dom';
import { Menu, Sparkles, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import airportLogo from '../assets/my-airport-logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div
        data-testid="promo-banner"
        className="fixed inset-x-0 top-0 z-[120] h-16 overflow-hidden bg-primary-900 text-white sm:h-11"
      >
        <div className="pointer-events-none absolute -left-8 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-accent-500/15 blur-2xl" />
        <div className="pointer-events-none absolute right-12 top-0 h-20 w-20 rounded-full bg-primary-400/20 blur-2xl" />

        <div className="relative mx-auto flex h-full max-w-7xl flex-col items-center justify-center gap-1 px-2 sm:h-11 sm:flex-row sm:gap-3 sm:px-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-accent-400 sm:px-2.5 sm:py-1 sm:text-[10px]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Special offer
          </span>

          <div className="flex items-center justify-center gap-1.5">
            <p className="text-center text-[11px] font-semibold leading-4 sm:text-sm sm:leading-5">
              Save 30% on booking
              <span className="mx-1 text-white/50 sm:mx-1.5" aria-hidden="true">
                /
              </span>
              Use Code:
            </p>

            <span className="rounded-md border border-dashed border-accent-400/70 bg-accent-500/15 px-1.5 py-0.5 font-mono text-[10px] font-extrabold tracking-wider text-accent-400 sm:px-2.5 sm:py-1 sm:text-sm">
              WELCOME30
            </span>
          </div>
        </div>
      </div>

      <div className="h-16 sm:h-11" aria-hidden="true" />

      <nav
        data-testid="site-navbar"
        className="relative z-[110] bg-white"
      >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between sm:h-18 md:h-20">
          {/* Logo */}
          <div className="flex min-w-0 items-center">
            <Link
              to="/"
              className="group flex min-w-0 items-center gap-2 sm:gap-3"
            >
              <div className="flex h-11 w-16 shrink-0 items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105 sm:h-12 sm:w-20">
                <img
                  src={airportLogo}
                  alt="MYAIRPORTTAXIS logo"
                  className="h-full w-full scale-[1.65] object-contain"
                />
              </div>

              <div className="flex min-w-0 flex-col leading-tight">
                <span className="truncate text-xl font-extrabold tracking-tight text-primary-900 sm:text-2xl">
                  MYAIRPORT<span className="text-accent-500">TAXIS</span>
                </span>

                <span className="hidden truncate text-[10px] uppercase tracking-[0.16em] text-gray-500 xs:block sm:text-[11px] sm:tracking-[0.2em]">
                  Premium Airport Transfers
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-6 md:flex lg:space-x-10">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative text-sm font-semibold tracking-wide transition-all duration-300 ${isActive(item.path)
                    ? 'text-primary-900'
                    : 'text-gray-600 hover:text-primary-900'
                  }`}
              >
                {item.name}

                {isActive(item.path) && (
                  <span className="absolute -bottom-2 left-0 h-[2px] w-full rounded-full bg-accent-500"></span>
                )}
              </Link>
            ))}

            {/* CTA */}
            <Link
              to="/booking"
              className="inline-flex items-center justify-center rounded-xl bg-primary-900 px-5 py-3 font-semibold text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-800 hover:shadow-premium lg:px-6"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="flex shrink-0 items-center md:hidden">
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-primary-900 transition-colors duration-200 hover:bg-gray-100 sm:h-11 sm:w-11"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${isOpen
            ? 'max-h-[420px] border-t border-gray-200 opacity-100'
            : 'max-h-0 opacity-0'
          }`}
      >
        <div className="space-y-2 bg-white/95 px-4 py-4 backdrop-blur-md sm:px-6 sm:py-5">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${isActive(item.path)
                  ? 'bg-primary-900 text-white shadow-soft'
                  : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              {item.name}
            </Link>
          ))}

          <Link
            to="/booking"
            className="mt-4 block w-full rounded-xl bg-accent-500 py-3 text-center font-bold text-primary-900 shadow-soft transition-all duration-300 hover:bg-accent-400"
          >
            Book Your Ride
          </Link>
        </div>
      </div>
      </nav>
    </>
  );
};

export default Navbar;
