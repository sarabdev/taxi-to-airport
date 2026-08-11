import { Link } from 'react-router-dom';

import {
  Mail,
  Facebook,
  // Twitter,
  Instagram,
  // Linkedin,
  ArrowUpRight,
  Shield,
  Clock3,
  BadgeCheck,
} from 'lucide-react';
import airportLogo from '../assets/my-airport-logo.png';
import WhatsAppIcon from './WhatsAppIcon';

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-primary-950 text-gray-300">
      {/* Background Glow */}
      <div className="absolute right-[-160px] top-[-120px] h-[280px] w-[280px] rounded-full bg-accent-500/5 blur-3xl sm:right-[-80px] sm:h-[360px] sm:w-[360px] lg:right-0 lg:top-0 lg:h-[400px] lg:w-[400px]"></div>

      {/* Top Border */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-accent-500/30 to-transparent"></div>

      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 sm:pb-10 sm:pt-16 lg:px-8 lg:pt-20">
        {/* TOP SECTION */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12 xl:grid-cols-[1.5fr_0.75fr_1fr_1.2fr] xl:gap-10">
          {/* ========================================================= */}
          {/* COMPANY */}
          {/* ========================================================= */}

          <div className="sm:col-span-2 xl:col-span-1">
            {/* Logo */}
            <Link
              to="/"
              className="group mb-5 flex items-center gap-3 sm:mb-6"
            >
              <div className="flex h-12 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-24">
                <img
                  src={airportLogo}
                  alt="MYAIRPORTTAXIS logo"
                  className="h-full w-full scale-[1.65] object-contain"
                />
              </div>

              <div className="min-w-0">
                <h2 className="whitespace-nowrap text-xl font-black tracking-tight text-white sm:text-2xl">
                  MYAIRPORT<span className="text-accent-500">TAXIS</span>
                </h2>

                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-gray-500 sm:text-xs">
                  Premium Transfers
                </p>
              </div>
            </Link>

            {/* Description */}
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-gray-400 sm:mb-8 sm:text-base">
              Executive airport transportation with luxury vehicles,
              professional chauffeurs, and reliable service available
              24/7.
            </p>

            {/* Trust Items */}
            <div className="mb-6 space-y-3 sm:mb-8 sm:space-y-4">
              <div className="flex items-center gap-3">
                <BadgeCheck className="h-5 w-5 shrink-0 text-accent-400" />

                <span className="text-sm text-gray-400">
                  Trusted by 10,000+ travelers
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 shrink-0 text-accent-400" />

                <span className="text-sm text-gray-400">
                  Licensed & fully insured
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Clock3 className="h-5 w-5 shrink-0 text-accent-400" />

                <span className="text-sm text-gray-400">
                  24/7 customer support
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {[
                {
                  icon: Facebook,
                  href: 'https://www.facebook.com/profile.php?id=61592346553306',
                },

                /* {
                  icon: Twitter,
                  href: '#',
                }, */

                {
                  icon: Instagram,
                  href: 'https://www.instagram.com/myairporttaxis/',
                },

                /* {
                  icon: Linkedin,
                  href: '#',
                }, */
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all duration-300 hover:border-accent-500 hover:bg-accent-500 sm:h-11 sm:w-11"
                >
                  <item.icon className="h-5 w-5 text-gray-400 transition-colors duration-300 group-hover:text-primary-950" />
                </a>
              ))}
            </div>
          </div>

          {/* ========================================================= */}
          {/* QUICK LINKS */}
          {/* ========================================================= */}

          <div>
            <h3 className="mb-5 text-lg font-bold text-white sm:mb-8">
              Quick Links
            </h3>

            <ul className="space-y-3 sm:space-y-5">
              {[
                {
                  name: 'Home',
                  path: '/',
                },

                {
                  name: 'About Us',
                  path: '/about',
                },

                {
                  name: 'Book A Ride',
                  path: '/booking',
                },

                {
                  name: 'Contact',
                  path: '/contact',
                },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="group inline-flex items-center gap-2 text-gray-400 transition-all duration-300 hover:text-white"
                  >
                    <span>
                      {item.name}
                    </span>

                    <ArrowUpRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ========================================================= */}
          {/* SERVICES */}
          {/* ========================================================= */}

          <div>
            <h3 className="mb-5 text-lg font-bold text-white sm:mb-8">
              Services
            </h3>

            <ul className="space-y-3 text-gray-400 sm:space-y-5">
              {[
                'Airport Transfers',
                'Corporate Travel',
                'Luxury Chauffeur Service',
                'Event Transportation',
                'Hourly Hire',
                'VIP Executive Travel',
              ].map((service, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3"
                >
                  <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400"></div>

                  <span className="text-sm sm:text-base">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ========================================================= */}
          {/* CONTACT */}
          {/* ========================================================= */}

          <div>
            <h3 className="mb-5 text-lg font-bold text-white sm:mb-8">
              Contact Us
            </h3>

            <div className="space-y-5 sm:space-y-6">
              {/* WhatsApp */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 sm:h-11 sm:w-11">
                  <WhatsAppIcon className="h-5 w-5 text-accent-400" />
                </div>

                <div className="min-w-0">
                  <a
                    href="https://wa.me/447899001900"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-words font-semibold text-white transition-colors duration-300 hover:text-accent-400"
                  >
                    +44 7899 001900
                  </a>

                  <p className="mt-1 text-sm text-gray-500">
                    Chat Available 24/7
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 sm:h-11 sm:w-11">
                  <Mail className="h-5 w-5 text-accent-400" />
                </div>

                <div className="min-w-0">
                  <a
                    href="mailto:support@myairporttaxis.uk"
                    className="whitespace-nowrap text-sm font-semibold tracking-tight text-white transition-colors duration-300 hover:text-accent-400"
                  >
                    support@myairporttaxis.uk
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM */}
        {/* ========================================================= */}

        <div className="mt-10 border-t border-white/10 pt-6 sm:mt-14 sm:pt-8 lg:mt-16">
          <div className="flex flex-col items-center justify-between gap-5 lg:flex-row lg:gap-6">
            <p className="text-center text-sm text-gray-500 lg:text-left">
              © {new Date().getFullYear()} MYAIRPORT
              <span className="text-accent-500">TAXIS</span>. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-gray-500 sm:gap-x-6">
              <Link
                to="/privacy"
                className="transition-colors duration-300 hover:text-white"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms"
                className="transition-colors duration-300 hover:text-white"
              >
                Terms of Use
              </Link>

            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
