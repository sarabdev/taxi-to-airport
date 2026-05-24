import { Link, useLocation } from 'react-router-dom';
import { Car, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
          ? 'border-b border-gray-200 bg-white/90 shadow-card backdrop-blur-md'
          : 'bg-white'
        }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between sm:h-18 md:h-20">
          {/* Logo */}
          <div className="flex min-w-0 items-center">
            <Link
              to="/"
              className="group flex min-w-0 items-center gap-2 sm:gap-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-900 shadow-soft transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-11">
                <Car className="h-5 w-5 text-accent-400 sm:h-6 sm:w-6" />
              </div>

              <div className="flex min-w-0 flex-col leading-tight">
                <span className="truncate text-xl font-extrabold tracking-tight text-primary-900 sm:text-2xl">
                  AirportRide
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
  );
};

export default Navbar;