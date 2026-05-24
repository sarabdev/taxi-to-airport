import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Shield,
  Star,
  Calendar,
  Plane,
  Quote,
  Users,
  CarFront,
  BadgeCheck,
} from 'lucide-react';

import { airports } from '../data/airports';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

const getLocalDateTime = () => {
  const now = new Date();

  // LOCAL DATE (NOT UTC)
  const year = now.getFullYear();

  const month = String(now.getMonth() + 1).padStart(2, '0');

  const day = String(now.getDate()).padStart(2, '0');

  // ROUND TIME TO NEXT 5 MINUTES
  now.setMinutes(Math.ceil(now.getMinutes() / 5) * 5);

  const hours = String(now.getHours()).padStart(2, '0');

  const minutes = String(now.getMinutes()).padStart(2, '0');

  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`,
  };
};

const defaultDateTime = getLocalDateTime();

const Home = () => {
  const navigate = useNavigate();

  const toInputRef = useRef(null);
  const fromInputRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fromType: 'airport',
    fromLocation: '',
    fromPlaceId: '',
    toType: 'custom',
    toLocation: '',
    toPlaceId: '',
    passengers: 1,
    luggage: 1,
    isRoundTrip: false,

    pickupDate: defaultDateTime.date,
    pickupTime: defaultDateTime.time,

    returnDate: '',
    returnTime: '',
  });

  /* ========================================================= */
  /* GOOGLE AUTOCOMPLETE */
  /* ========================================================= */

  useEffect(() => {
    if (!GOOGLE_KEY) return;

    if (!window.google) {
      const script = document.createElement('script');

      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&libraries=places`;

      script.async = true;

      script.onload = initAutocomplete;

      document.body.appendChild(script);
    } else {
      initAutocomplete();
    }
  }, []);

  const sliderImages = [
    {
      image:
        'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1600&auto=format&fit=crop',
      title: 'Executive Airport Transfers',
      subtitle: 'Luxury vehicles available 24/7',
    },
    {
      image:
        'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1600&auto=format&fit=crop',
      title: 'Professional Chauffeurs',
      subtitle: 'Experienced and punctual drivers',
    },
    {
      image:
        'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1600&auto=format&fit=crop',
      title: 'Premium Travel Experience',
      subtitle: 'Comfort, reliability and fixed pricing',
    },
  ];

  const initAutocomplete = () => {
    if (fromInputRef.current) {
      const fromAuto = new window.google.maps.places.Autocomplete(fromInputRef.current);
      fromAuto.addListener('place_changed', () => {
        const place = fromAuto.getPlace();
        setFormData((prev) => ({
          ...prev,
          fromLocation: place.formatted_address || '',
          fromPlaceId: place.place_id || '',
        }));
      });
    }

    if (toInputRef.current) {
      const toAuto = new window.google.maps.places.Autocomplete(toInputRef.current);
      toAuto.addListener('place_changed', () => {
        const place = toAuto.getPlace();
        setFormData((prev) => ({
          ...prev,
          toLocation: place.formatted_address || '',
          toPlaceId: place.place_id || '',
        }));
      });
    }
  };

  /* ========================================================= */
  /* FORM SUBMIT */
  /* ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    let pricing = null;

    if (formData.fromPlaceId && formData.toPlaceId) {
      try {
        const res = await fetch(`${API_BASE}/api/pricing/distance`, {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            fromPlaceId: formData.fromPlaceId,
            toPlaceId: formData.toPlaceId,
            isRoundTrip: formData.isRoundTrip,
          }),
        });

        pricing = await res.json();
      } catch (err) {
        console.error('Pricing API failed', err);
      }
    }

    localStorage.setItem(
      'bookingData',
      JSON.stringify({
        ...formData,
        pricing,
      })
    );

    setLoading(false);

    navigate('/booking/cars');
  };

  /* ========================================================= */
  /* FORM CHANGE */
  /* ========================================================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen overflow-hidden bg-surface-light">
      {/* ========================================================= */}
      {/* HERO + BOOKING SECTION */}
      {/* ========================================================= */}

      <section className="relative overflow-hidden bg-hero-gradient text-white">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Glow */}
        <div className="absolute right-[-180px] top-[-120px] h-[320px] w-[320px] rounded-full bg-accent-500/10 blur-3xl sm:right-[-120px] sm:h-[480px] sm:w-[480px] lg:right-0 lg:top-0 lg:h-[600px] lg:w-[600px]"></div>

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-24">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-10">
            {/* LEFT SIDE - FORM */}
            <div className="relative z-10 w-full">
              <div className="mb-5 flex flex-wrap items-center gap-3 sm:mb-6 sm:gap-4">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-md sm:px-4">
                  <BadgeCheck className="h-4 w-4 shrink-0 text-accent-400" />
                  <span className="text-xs font-medium text-white sm:text-sm">
                    Trusted By 10,000+ Travelers
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-md sm:px-4">
                  <Star className="h-4 w-4 shrink-0 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium text-white sm:text-sm">
                    4.9 Google Rating
                  </span>
                </div>
              </div>

              <div className="overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-premium sm:rounded-[32px]">
                <div className="bg-primary-900 px-5 py-5 sm:px-8 sm:py-6">
                  <h2 className="text-2xl font-bold text-white sm:text-3xl">
                    Book Your Airport Transfer
                  </h2>

                  <p className="mt-2 text-sm text-gray-300 sm:text-base">
                    Fast, secure, and fixed-price bookings
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:space-y-7 sm:p-8 lg:p-10">
                  {/* AIRPORT */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700 sm:mb-3">
                      Pickup Location
                    </label>
                    <input
                      ref={fromInputRef}
                      type="text"
                      name="fromLocation"
                      value={formData.fromLocation}
                      onChange={handleChange}
                      placeholder="Enter pickup address"
                      className="input-field h-12 border-gray-200 text-black focus:ring-primary-900 sm:h-14"
                      autoComplete="off"
                      required
                    />
                  </div>

                  {/* DESTINATION */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700 sm:mb-3">
                      Destination
                    </label>

                    <input
                      ref={toInputRef}
                      type="text"
                      name="toLocation"
                      value={formData.toLocation}
                      onChange={handleChange}
                      placeholder="Enter your destination"
                      className="input-field h-12 border-gray-200 text-black focus:ring-primary-900 sm:h-14"
                      autoComplete="off"
                      required
                    />
                  </div>

                  {/* DATE & TIME */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700 sm:mb-3">
                      <Calendar className="mr-2 inline h-4 w-4 text-black" />
                      Pickup Date & Time
                    </label>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                      {/* DATE */}
                      <div className="relative">
                        <input
                          type="date"
                          name="pickupDate"
                          value={formData.pickupDate}
                          onChange={handleChange}
                          min={defaultDateTime.date}
                          className="input-field ios-date-input min-h-12 w-full border-gray-200 text-black focus:ring-primary-900 sm:min-h-14"
                          required
                        />
                      </div>

                      {/* TIME */}
                      <div className="relative">
                        <input
                          type="time"
                          name="pickupTime"
                          value={formData.pickupTime}
                          onChange={handleChange}
                          step="300"
                          className="input-field ios-date-input min-h-12 w-full border-gray-200 text-black focus:ring-primary-900 sm:min-h-14"
                          required
                        />
                      </div>
                    </div>

                    <p className="mt-2 text-xs text-gray-500 sm:mt-3">
                      Your local device time is automatically selected.
                    </p>
                  </div>

                  {/* FEATURES */}
                  <div className="grid grid-cols-1 gap-3 xs:grid-cols-3 sm:grid-cols-3 sm:gap-4">
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-center">
                      <Clock className="mx-auto mb-2 h-5 w-5 text-accent-500" />

                      <p className="text-xs font-semibold text-gray-700">
                        24/7 Service
                      </p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-center">
                      <Shield className="mx-auto mb-2 h-5 w-5 text-accent-500" />

                      <p className="text-xs font-semibold text-gray-700">
                        Safe Travel
                      </p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-center">
                      <CarFront className="mx-auto mb-2 h-5 w-5 text-accent-500" />

                      <p className="text-xs font-semibold text-gray-700">
                        Luxury Fleet
                      </p>
                    </div>
                  </div>

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-2xl bg-primary-900 px-5 py-4 text-sm font-bold text-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:bg-primary-800 hover:shadow-premium disabled:cursor-not-allowed disabled:opacity-70 sm:px-8 sm:py-5 sm:text-base"
                  >
                    {loading ? (
                      'Checking Availability...'
                    ) : (
                      <>
                        Find Available Vehicles

                        <ArrowRight className="ml-3 h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT SIDE - SLIDER */}
            <div className="relative w-full lg:block">
              <div className="absolute -inset-4 rounded-[40px] bg-accent-500/10 blur-2xl"></div>

              <div className="relative rounded-[24px] border border-white/10 bg-white/10 p-3 shadow-premium backdrop-blur-md sm:rounded-[32px] sm:p-4">
                <Swiper
                  modules={[Autoplay, Pagination]}
                  autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                  }}
                  pagination={{
                    clickable: true,
                  }}
                  loop
                  className="h-[360px] rounded-2xl sm:h-[460px] lg:h-[620px]"
                >
                  {sliderImages.map((slide, index) => (
                    <SwiperSlide key={index}>
                      <div className="relative h-full">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="h-full w-full rounded-2xl object-cover"
                        />

                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/80 via-black/25 to-transparent"></div>

                        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-md sm:mb-5 sm:px-4">
                            <Plane className="h-4 w-4 shrink-0 text-accent-400" />

                            <span className="text-xs font-medium text-white sm:text-sm">
                              Premium Airport Transportation
                            </span>
                          </div>

                          <h2 className="mb-3 text-2xl font-black leading-tight text-white sm:text-4xl md:text-5xl lg:mb-4">
                            {slide.title}
                          </h2>

                          <p className="text-base leading-relaxed text-gray-200 sm:text-xl">
                            {slide.subtitle}
                          </p>

                          <div className="mt-6 grid grid-cols-3 gap-3 sm:mt-8 sm:gap-5">
                            <div>
                              <div className="text-xl font-black text-white sm:text-3xl">
                                10K+
                              </div>
                              <p className="mt-1 text-xs text-gray-300 sm:text-sm">
                                Travelers
                              </p>
                            </div>

                            <div>
                              <div className="text-xl font-black text-white sm:text-3xl">
                                24/7
                              </div>
                              <p className="mt-1 text-xs text-gray-300 sm:text-sm">
                                Support
                              </p>
                            </div>

                            <div>
                              <div className="text-xl font-black text-white sm:text-3xl">
                                99%
                              </div>
                              <p className="mt-1 text-xs text-gray-300 sm:text-sm">
                                On-Time
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* TRUST & REVIEWS */}
      {/* ========================================================= */}

      <section className="pb-16 pt-8 sm:pb-20 lg:pb-24 lg:pt-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-premium sm:rounded-[32px]">
            {/* HEADER */}
            <div className="border-b border-gray-100 px-5 pb-7 pt-8 sm:px-8 sm:pb-8 sm:pt-10 lg:px-12">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-900 sm:mb-5">
                    <BadgeCheck className="h-4 w-4 text-accent-500" />

                    Trusted By Thousands Of Travelers
                  </div>

                  <h2 className="text-3xl font-black leading-tight text-primary-900 sm:text-4xl md:text-5xl">
                    Real Customer Reviews
                  </h2>

                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600 sm:mt-5 sm:text-xl">
                    Verified experiences from travelers who trust AirportRide
                    for reliable and luxury airport transportation.
                  </p>
                </div>

                {/* OVERALL RATING */}
                <div className="w-full rounded-[24px] bg-primary-900 px-6 py-6 text-white shadow-card sm:w-auto sm:min-w-[240px] sm:rounded-[28px] sm:px-8 sm:py-7">
                  <div className="mb-4 flex items-center justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-accent-400 text-accent-400"
                      />
                    ))}
                  </div>

                  <div className="text-center">
                    <div className="text-4xl font-black sm:text-5xl">
                      4.9
                    </div>

                    <p className="mt-2 text-sm text-gray-300">
                      Average Customer Rating
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* REVIEW PLATFORMS */}
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* GOOGLE */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative border-b border-gray-100 p-5 transition-all duration-300 hover:bg-gray-50 sm:p-8 lg:border-b-0 lg:border-r lg:p-10"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/40 to-blue-50/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 sm:h-16 sm:w-16">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                      alt="Google Reviews"
                      className="h-7 w-7 sm:h-8 sm:w-8"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-black text-primary-900 sm:text-2xl">
                          Google Reviews
                        </h3>

                        <p className="mt-1 text-sm text-gray-500 sm:text-base">
                          Based on verified customer experiences
                        </p>
                      </div>

                      <ArrowRight className="h-5 w-5 shrink-0 text-gray-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary-900" />
                    </div>

                    <div className="mb-5 flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400 sm:h-5 sm:w-5"
                          />
                        ))}
                      </div>

                      <span className="text-base font-bold text-primary-900 sm:ml-2 sm:text-lg">
                        4.9/5
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-5 sm:flex sm:items-center sm:gap-8">
                      <div>
                        <div className="text-xl font-black text-primary-900 sm:text-2xl">
                          2,000+
                        </div>

                        <p className="mt-1 text-sm text-gray-500">
                          Verified Reviews
                        </p>
                      </div>

                      <div>
                        <div className="text-xl font-black text-primary-900 sm:text-2xl">
                          99%
                        </div>

                        <p className="mt-1 text-sm text-gray-500">
                          Satisfaction Rate
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>

              {/* TRUSTPILOT */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-5 transition-all duration-300 hover:bg-gray-50 sm:p-8 lg:p-10"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-50/0 via-green-50/40 to-green-50/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-500 text-2xl font-black text-white shadow-soft sm:h-16 sm:w-16 sm:text-3xl">
                    ★
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-black text-primary-900 sm:text-2xl">
                          Trustpilot
                        </h3>

                        <p className="mt-1 text-sm text-gray-500 sm:text-base">
                          Independent customer review platform
                        </p>
                      </div>

                      <ArrowRight className="h-5 w-5 shrink-0 text-gray-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary-900" />
                    </div>

                    <div className="mb-5 flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-green-500 text-green-500 sm:h-5 sm:w-5"
                          />
                        ))}
                      </div>

                      <span className="text-base font-bold text-primary-900 sm:ml-2 sm:text-lg">
                        Excellent
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-5 sm:flex sm:items-center sm:gap-8">
                      <div>
                        <div className="text-xl font-black text-primary-900 sm:text-2xl">
                          1,500+
                        </div>

                        <p className="mt-1 text-sm text-gray-500">
                          Trusted Reviews
                        </p>
                      </div>

                      <div>
                        <div className="text-xl font-black text-primary-900 sm:text-2xl">
                          24/7
                        </div>

                        <p className="mt-1 text-sm text-gray-500">
                          Customer Support
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>

            {/* BOTTOM STATS */}
            <div className="grid grid-cols-1 gap-7 border-t border-gray-100 bg-gray-50/70 px-5 py-8 text-center sm:grid-cols-2 sm:px-8 sm:py-10 lg:grid-cols-4 lg:gap-10">
              <div>
                <div className="mb-3 flex justify-center sm:mb-4">
                  <Users className="h-7 w-7 text-accent-500" />
                </div>

                <h3 className="text-2xl font-black text-primary-900 sm:text-3xl">
                  10K+
                </h3>

                <p className="mt-1 text-gray-500">
                  Happy Travelers
                </p>
              </div>

              <div>
                <div className="mb-3 flex justify-center sm:mb-4">
                  <Shield className="h-7 w-7 text-accent-500" />
                </div>

                <h3 className="text-2xl font-black text-primary-900 sm:text-3xl">
                  Licensed
                </h3>

                <p className="mt-1 text-gray-500">
                  Fully Insured
                </p>
              </div>

              <div>
                <div className="mb-3 flex justify-center sm:mb-4">
                  <Clock className="h-7 w-7 text-accent-500" />
                </div>

                <h3 className="text-2xl font-black text-primary-900 sm:text-3xl">
                  24/7
                </h3>

                <p className="mt-1 text-gray-500">
                  Customer Support
                </p>
              </div>

              <div>
                <div className="mb-3 flex justify-center sm:mb-4">
                  <CheckCircle className="h-7 w-7 text-accent-500" />
                </div>

                <h3 className="text-2xl font-black text-primary-900 sm:text-3xl">
                  99%
                </h3>

                <p className="mt-1 text-gray-500">
                  On-Time Pickup
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* REWARDS SECTION */}
      {/* ========================================================= */}

      <section className="pb-16 sm:pb-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* BACKGROUND SHAPES */}
            <div className="absolute -left-8 -top-8 h-40 w-40 rounded-[40px] bg-purple-200/60 blur-sm sm:h-72 sm:w-72"></div>

            <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-[40px] bg-emerald-200/60 blur-sm sm:h-72 sm:w-72"></div>

            {/* MAIN CARD */}
            <div className="relative rounded-[24px] border border-gray-100 bg-white p-4 shadow-[0_20px_60px_rgba(0,0,0,0.12)] sm:rounded-[32px] sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
                {/* ========================================================= */}
                {/* LEFT CARD */}
                {/* ========================================================= */}

                <div className="group relative min-h-[300px] overflow-hidden rounded-[24px] sm:min-h-[340px] sm:rounded-[28px]">
                  <img
                    src="https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1600&auto=format&fit=crop"
                    alt="Rewards"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* DARK OVERLAY */}
                  <div className="absolute inset-0 bg-black/50"></div>

                  {/* CONTENT */}
                  <div className="relative flex h-full flex-col justify-end p-5 sm:p-8">
                    <div className="max-w-md">
                      <h3 className="mb-4 text-3xl font-black leading-tight text-white sm:mb-5 sm:text-4xl">
                        Welcome{' '}

                        <span className="rounded-2xl bg-accent-500 px-3 py-1 text-primary-950 hover:bg-accent-400 sm:px-4">
                          Rewards
                        </span>
                      </h3>

                      <p className="mb-6 text-base leading-relaxed text-gray-200 sm:mb-8 sm:text-lg">
                        Turn rides into rewards. Earn cashback and exclusive perks
                        every time you travel with us.
                      </p>

                      <button className="inline-flex w-full items-center justify-center rounded-2xl bg-primary-900 px-6 py-4 text-sm font-bold text-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:bg-primary-800 hover:shadow-premium sm:w-auto sm:px-8 sm:py-5 sm:text-base">
                        Start Earning

                        <ArrowRight className="ml-3 h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* ========================================================= */}
                {/* RIGHT CARD */}
                {/* ========================================================= */}

                <div className="group relative min-h-[300px] overflow-hidden rounded-[24px] sm:min-h-[340px] sm:rounded-[28px]">
                  <img
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600&auto=format&fit=crop"
                    alt="Refer Friends"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* DARK OVERLAY */}
                  <div className="absolute inset-0 bg-black/55"></div>

                  {/* CONTENT */}
                  <div className="relative flex h-full flex-col justify-end p-5 sm:p-8">
                    <div className="max-w-md">
                      <h3 className="mb-4 text-3xl font-black leading-tight text-white sm:mb-5 sm:text-4xl">
                        Refer & Earn
                      </h3>

                      <p className="mb-6 text-base leading-relaxed text-gray-200 sm:mb-8 sm:text-lg">
                        Invite friends and family to enjoy hassle-free airport
                        transfers and receive rewards for every referral.
                      </p>

                      <button className="inline-flex w-full items-center justify-center rounded-2xl bg-primary-900 px-6 py-4 text-sm font-bold text-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:bg-primary-800 hover:shadow-premium sm:w-auto sm:px-8 sm:py-5 sm:text-base">
                        Invite Friends

                        <ArrowRight className="ml-3 h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FEATURES */}
      {/* ========================================================= */}

      <section className="pb-16 sm:pb-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16 lg:mb-20">
            <h2 className="mb-4 text-3xl font-black text-primary-900 sm:mb-6 sm:text-4xl md:text-5xl">
              Why Travelers Choose Us
            </h2>

            <p className="text-base leading-relaxed text-gray-600 sm:text-xl">
              Experience premium airport transportation designed for comfort,
              punctuality, and complete peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 xl:gap-8">
            {[
              {
                icon: CheckCircle,
                title: 'Reliable Service',
                desc: 'Professional chauffeurs with industry-leading punctuality.',
              },

              {
                icon: Clock,
                title: '24/7 Availability',
                desc: 'Available anytime for early flights and late arrivals.',
              },

              {
                icon: Shield,
                title: 'Safe & Secure',
                desc: 'Licensed, insured, and regularly maintained vehicles.',
              },

              {
                icon: CarFront,
                title: 'Luxury Fleet',
                desc: 'Premium executive vehicles with maximum comfort.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group rounded-[24px] border border-gray-100 bg-white p-6 shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-premium sm:rounded-[28px] sm:p-8"
              >
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-900 text-accent-400 transition-transform duration-300 group-hover:scale-110 sm:mb-6 sm:h-16 sm:w-16">
                  <feature.icon className="h-7 w-7 sm:h-8 sm:w-8" />
                </div>

                <h3 className="mb-3 text-xl font-bold text-primary-900 sm:mb-4 sm:text-2xl">
                  {feature.title}
                </h3>

                <p className="leading-relaxed text-gray-600">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* TESTIMONIALS */}
      {/* ========================================================= */}

      <section className="pb-16 sm:pb-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16 lg:mb-20">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-5 py-2 text-sm font-semibold text-blue-700 sm:mb-6">
              <BadgeCheck className="h-4 w-4" />

              Verified Google Reviews
            </div>

            <h2 className="mb-4 text-3xl font-black text-primary-900 sm:mb-6 sm:text-4xl md:text-5xl">
              Trusted By Thousands Of Travelers
            </h2>

            <p className="text-base text-gray-600 sm:text-xl">
              Real customer experiences from verified Google reviews.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {[
              {
                name: 'Michael Carter',
                review:
                  'Outstanding airport transfer service. Driver arrived early and the vehicle was immaculate.',
              },

              {
                name: 'Sophia Williams',
                review:
                  'Professional experience from start to finish. Booking was incredibly smooth.',
              },

              {
                name: 'Daniel Roberts',
                review:
                  'Best airport transfer company I’ve used. Highly reliable and premium quality.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-soft transition-all duration-300 hover:shadow-premium sm:rounded-[28px] sm:p-8"
              >
                <Quote className="mb-5 h-9 w-9 text-accent-400 sm:mb-6 sm:h-10 sm:w-10" />

                <p className="mb-6 text-base leading-relaxed text-gray-700 sm:mb-8 sm:text-lg">
                  "{item.review}"
                </p>

                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-primary-900">
                        {item.name}
                      </h4>

                      <p className="mt-1 text-sm text-gray-500">
                        Verified Google Review
                      </p>
                    </div>

                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                      alt="Google"
                      className="h-5 w-5 shrink-0"
                    />
                  </div>

                  <div className="mt-4 flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FINAL CTA */}
      {/* ========================================================= */}

      <section className="bg-hero-gradient py-16 text-white sm:py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-black sm:mb-6 sm:text-4xl md:text-5xl">
            Ready To Travel In Comfort?
          </h2>

          <p className="mx-auto mb-8 max-w-3xl text-base text-gray-300 sm:mb-10 sm:text-xl">
            Book your premium airport transfer today and experience luxury
            transportation with fixed pricing and professional service.
          </p>

          <button
            onClick={() =>
              window.scrollTo({
                top: 700,
                behavior: 'smooth',
              })
            }
            className="inline-flex w-full items-center justify-center rounded-2xl bg-accent-500 px-6 py-4 text-sm font-bold text-primary-950 shadow-premium transition-all duration-300 hover:-translate-y-1 hover:bg-accent-400 sm:w-auto sm:px-10 sm:py-5 sm:text-base"
          >
            Book Your Ride Now

            <ArrowRight className="ml-3 h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;