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
    <div className="min-h-screen bg-surface-light overflow-hidden">

      {/* ========================================================= */}
      {/* HERO + BOOKING SECTION */}
      {/* ========================================================= */}

      <section className="relative bg-hero-gradient text-white overflow-hidden">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-500/10 blur-3xl rounded-full"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-10 items-center">

            {/* LEFT SIDE - FORM */}
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2">
                  <BadgeCheck className="h-4 w-4 text-accent-400" />
                  <span className="text-sm text-white font-medium">
                    Trusted By 10,000+ Travelers
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm text-white font-medium">
                    4.9 Google Rating
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-[32px] shadow-premium border border-gray-100 overflow-hidden">
                <div className="bg-primary-900 px-8 py-6">
                  <h2 className="text-3xl font-bold text-white">
                    Book Your Airport Transfer
                  </h2>

                  <p className="text-gray-300 mt-2">
                    Fast, secure, and fixed-price bookings
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 lg:p-10 space-y-7">

                  {/* AIRPORT */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Pickup Location
                    </label>
                    <input
                      ref={fromInputRef}
                      type="text"
                      name="fromLocation"
                      value={formData.fromLocation}
                      onChange={handleChange}
                      placeholder="Enter pickup address"
                      className="input-field text-black h-14 border-gray-200 focus:ring-primary-900"
                      autoComplete="off"
                      required
                    />
                  </div>

                  {/* DESTINATION */}
                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Destination
                    </label>

                    <input
                      ref={toInputRef}
                      type="text"
                      name="toLocation"
                      value={formData.toLocation}
                      onChange={handleChange}
                      placeholder="Enter your destination"
                      className="input-field text-black h-14 border-gray-200 focus:ring-primary-900"
                      autoComplete="off"
                      required
                    />
                  </div>

                  {/* DATE & TIME */}
                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-3">

                      <Calendar className="inline h-4 w-4 mr-2 text-black" />

                      Pickup Date & Time
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      {/* DATE */}
                      <div className="relative">

                        <input
                          type="date"
                          name="pickupDate"
                          value={formData.pickupDate}
                          onChange={handleChange}
                          min={defaultDateTime.date}
                          className="input-field text-black h-14 border-gray-200 focus:ring-primary-900 w-full"
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
                          className="input-field h-14 text-black border-gray-200 focus:ring-primary-900 w-full"
                          required
                        />
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-3">
                      Your local device time is automatically selected.
                    </p>
                  </div>

                  {/* FEATURES */}
                  <div className="grid grid-cols-3 gap-4">

                    <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 text-center">

                      <Clock className="h-5 w-5 text-accent-500 mx-auto mb-2" />

                      <p className="text-xs font-semibold text-gray-700">
                        24/7 Service
                      </p>
                    </div>

                    <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 text-center">

                      <Shield className="h-5 w-5 text-accent-500 mx-auto mb-2" />

                      <p className="text-xs font-semibold text-gray-700">
                        Safe Travel
                      </p>
                    </div>

                    <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 text-center">

                      <CarFront className="h-5 w-5 text-accent-500 mx-auto mb-2" />

                      <p className="text-xs font-semibold text-gray-700">
                        Luxury Fleet
                      </p>
                    </div>
                  </div>

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl bg-primary-900 hover:bg-primary-800 text-white font-bold py-5 px-8 transition-all duration-300 shadow-card hover:shadow-premium hover:-translate-y-1 flex items-center justify-center"
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
            <div className="relative">
              <div className="absolute -inset-4 rounded-[40px] bg-accent-500/10 blur-2xl"></div>

              <div className="relative bg-white/10 backdrop-blur-md border border-white/10 rounded-[32px] p-4 shadow-premium">
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
                  className="h-[620px] rounded-2xl"
                >
                  {sliderImages.map((slide, index) => (
                    <SwiperSlide key={index}>
                      <div className="relative h-full">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-full object-cover rounded-2xl"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent rounded-2xl"></div>

                        <div className="absolute bottom-0 left-0 right-0 p-8">
                          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2 mb-5">
                            <Plane className="h-4 w-4 text-accent-400" />

                            <span className="text-sm text-white font-medium">
                              Premium Airport Transportation
                            </span>
                          </div>

                          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
                            {slide.title}
                          </h2>

                          <p className="text-xl text-gray-200 leading-relaxed">
                            {slide.subtitle}
                          </p>

                          <div className="grid grid-cols-3 gap-5 mt-8">
                            <div>
                              <div className="text-3xl font-black text-white">
                                10K+
                              </div>
                              <p className="text-gray-300 text-sm mt-1">
                                Travelers
                              </p>
                            </div>

                            <div>
                              <div className="text-3xl font-black text-white">
                                24/7
                              </div>
                              <p className="text-gray-300 text-sm mt-1">
                                Support
                              </p>
                            </div>

                            <div>
                              <div className="text-3xl font-black text-white">
                                99%
                              </div>
                              <p className="text-gray-300 text-sm mt-1">
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

      <section className="pb-24">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="bg-white rounded-[32px] border border-gray-100 shadow-premium overflow-hidden">

            {/* HEADER */}
            <div className="px-8 lg:px-12 pt-10 pb-8 border-b border-gray-100">

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                <div>

                  <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 text-primary-900 px-4 py-2 text-sm font-semibold mb-5">

                    <BadgeCheck className="h-4 w-4 text-accent-500" />

                    Trusted By Thousands Of Travelers
                  </div>

                  <h2 className="text-4xl md:text-5xl font-black text-primary-900 leading-tight">

                    Real Customer Reviews
                  </h2>

                  <p className="text-xl text-gray-600 mt-5 max-w-2xl leading-relaxed">

                    Verified experiences from travelers who trust AirportRide
                    for reliable and luxury airport transportation.
                  </p>
                </div>

                {/* OVERALL RATING */}
                <div className="bg-primary-900 rounded-[28px] px-8 py-7 text-white min-w-[240px] shadow-card">

                  <div className="flex items-center justify-center gap-1 mb-4">

                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-accent-400 fill-accent-400"
                      />
                    ))}
                  </div>

                  <div className="text-center">

                    <div className="text-5xl font-black">
                      4.9
                    </div>

                    <p className="text-gray-300 mt-2 text-sm">
                      Average Customer Rating
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* REVIEW PLATFORMS */}
            <div className="grid lg:grid-cols-2">

              {/* GOOGLE */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-gray-100 hover:bg-gray-50 transition-all duration-300"
              >

                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/40 to-blue-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative flex items-start gap-6">

                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 shrink-0">

                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                      alt="Google Reviews"
                      className="w-8 h-8"
                    />
                  </div>

                  <div className="flex-1">

                    <div className="flex items-center justify-between gap-4 mb-4">

                      <div>

                        <h3 className="text-2xl font-black text-primary-900">
                          Google Reviews
                        </h3>

                        <p className="text-gray-500 mt-1">
                          Based on verified customer experiences
                        </p>
                      </div>

                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-900 group-hover:translate-x-1 transition-all duration-300" />
                    </div>

                    <div className="flex items-center gap-2 mb-5">

                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 text-yellow-400 fill-yellow-400"
                          />
                        ))}
                      </div>

                      <span className="text-lg font-bold text-primary-900 ml-2">
                        4.9/5
                      </span>
                    </div>

                    <div className="flex items-center gap-8">

                      <div>

                        <div className="text-2xl font-black text-primary-900">
                          2,000+
                        </div>

                        <p className="text-sm text-gray-500 mt-1">
                          Verified Reviews
                        </p>
                      </div>

                      <div>

                        <div className="text-2xl font-black text-primary-900">
                          99%
                        </div>

                        <p className="text-sm text-gray-500 mt-1">
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
                className="group relative p-8 lg:p-10 hover:bg-gray-50 transition-all duration-300"
              >

                <div className="absolute inset-0 bg-gradient-to-r from-green-50/0 via-green-50/40 to-green-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative flex items-start gap-6">

                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500 text-white text-3xl font-black shrink-0 shadow-soft">
                    ★
                  </div>

                  <div className="flex-1">

                    <div className="flex items-center justify-between gap-4 mb-4">

                      <div>

                        <h3 className="text-2xl font-black text-primary-900">
                          Trustpilot
                        </h3>

                        <p className="text-gray-500 mt-1">
                          Independent customer review platform
                        </p>
                      </div>

                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-900 group-hover:translate-x-1 transition-all duration-300" />
                    </div>

                    <div className="flex items-center gap-2 mb-5">

                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 text-green-500 fill-green-500"
                          />
                        ))}
                      </div>

                      <span className="text-lg font-bold text-primary-900 ml-2">
                        Excellent
                      </span>
                    </div>

                    <div className="flex items-center gap-8">

                      <div>

                        <div className="text-2xl font-black text-primary-900">
                          1,500+
                        </div>

                        <p className="text-sm text-gray-500 mt-1">
                          Trusted Reviews
                        </p>
                      </div>

                      <div>

                        <div className="text-2xl font-black text-primary-900">
                          24/7
                        </div>

                        <p className="text-sm text-gray-500 mt-1">
                          Customer Support
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>

            {/* BOTTOM STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 px-8 py-10 border-t border-gray-100 text-center bg-gray-50/70">

              <div>

                <div className="flex justify-center mb-4">
                  <Users className="h-7 w-7 text-accent-500" />
                </div>

                <h3 className="text-3xl font-black text-primary-900">
                  10K+
                </h3>

                <p className="text-gray-500 mt-1">
                  Happy Travelers
                </p>
              </div>

              <div>

                <div className="flex justify-center mb-4">
                  <Shield className="h-7 w-7 text-accent-500" />
                </div>

                <h3 className="text-3xl font-black text-primary-900">
                  Licensed
                </h3>

                <p className="text-gray-500 mt-1">
                  Fully Insured
                </p>
              </div>

              <div>

                <div className="flex justify-center mb-4">
                  <Clock className="h-7 w-7 text-accent-500" />
                </div>

                <h3 className="text-3xl font-black text-primary-900">
                  24/7
                </h3>

                <p className="text-gray-500 mt-1">
                  Customer Support
                </p>
              </div>

              <div>

                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-7 w-7 text-accent-500" />
                </div>

                <h3 className="text-3xl font-black text-primary-900">
                  99%
                </h3>

                <p className="text-gray-500 mt-1">
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

      <section className="pb-28">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="relative">

            {/* BACKGROUND SHAPES */}
            <div className="absolute -top-8 -left-8 w-72 h-72 bg-purple-200/60 rounded-[40px] blur-sm"></div>

            <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-emerald-200/60 rounded-[40px] blur-sm"></div>

            {/* MAIN CARD */}
            <div className="relative bg-white rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-gray-100 p-6 lg:p-8">

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* ========================================================= */}
                {/* LEFT CARD */}
                {/* ========================================================= */}

                <div className="relative overflow-hidden rounded-[28px] min-h-[340px] group">

                  <img
                    src="https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1600&auto=format&fit=crop"
                    alt="Rewards"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* DARK OVERLAY */}
                  <div className="absolute inset-0 bg-black/50"></div>

                  {/* CONTENT */}
                  <div className="relative h-full flex flex-col justify-end p-8">

                    <div className="max-w-md">

                      <h3 className="text-4xl font-black text-white leading-tight mb-5">

                        Welcome{' '}

                        <span className="bg-accent-500 hover:bg-accent-400 text-primary-950 px-4 py-1 rounded-2xl">
                          Rewards
                        </span>
                      </h3>

                      <p className="text-lg text-gray-200 leading-relaxed mb-8">
                        Turn rides into rewards. Earn cashback and exclusive perks
                        every time you travel with us.
                      </p>

                      <button className="inline-flex items-center justify-center rounded-2xl bg-primary-900 hover:bg-primary-800 text-white font-bold py-5 px-8 transition-all duration-300 shadow-card hover:shadow-premium hover:-translate-y-1">

                        Start Earning

                        <ArrowRight className="ml-3 h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* ========================================================= */}
                {/* RIGHT CARD */}
                {/* ========================================================= */}

                <div className="relative overflow-hidden rounded-[28px] min-h-[340px] group">

                  <img
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600&auto=format&fit=crop"
                    alt="Refer Friends"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* DARK OVERLAY */}
                  <div className="absolute inset-0 bg-black/55"></div>

                  {/* CONTENT */}
                  <div className="relative h-full flex flex-col justify-end p-8">

                    <div className="max-w-md">

                      <h3 className="text-4xl font-black text-white leading-tight mb-5">
                        Refer & Earn
                      </h3>

                      <p className="text-lg text-gray-200 leading-relaxed mb-8">
                        Invite friends and family to enjoy hassle-free airport
                        transfers and receive rewards for every referral.
                      </p>

                      <button className="inline-flex items-center justify-center rounded-2xl bg-primary-900 hover:bg-primary-800 text-white font-bold py-5 px-8 transition-all duration-300 shadow-card hover:shadow-premium hover:-translate-y-1">

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

      <section className="pb-28">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-20">

            <h2 className="text-4xl md:text-5xl font-black text-primary-900 mb-6">
              Why Travelers Choose Us
            </h2>

            <p className="text-xl text-gray-600 leading-relaxed">
              Experience premium airport transportation designed for comfort,
              punctuality, and complete peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">

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
                className="group bg-white rounded-[28px] p-8 border border-gray-100 shadow-soft hover:shadow-premium transition-all duration-500 hover:-translate-y-2"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-900 text-accent-400 mb-6 group-hover:scale-110 transition-transform duration-300">

                  <feature.icon className="h-8 w-8" />
                </div>

                <h3 className="text-2xl font-bold text-primary-900 mb-4">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
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

      <section className="pb-28">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-20">

            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 px-5 py-2 font-semibold text-sm mb-6">

              <BadgeCheck className="h-4 w-4" />

              Verified Google Reviews
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-primary-900 mb-6">
              Trusted By Thousands Of Travelers
            </h2>

            <p className="text-xl text-gray-600">
              Real customer experiences from verified Google reviews.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

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
                className="bg-white rounded-[28px] p-8 border border-gray-100 shadow-soft hover:shadow-premium transition-all duration-300"
              >
                <Quote className="h-10 w-10 text-accent-400 mb-6" />

                <p className="text-gray-700 leading-relaxed text-lg mb-8">
                  "{item.review}"
                </p>

                <div className="border-t border-gray-100 pt-6">

                  <div className="flex items-center justify-between">

                    <div>

                      <h4 className="font-bold text-primary-900">
                        {item.name}
                      </h4>

                      <p className="text-sm text-gray-500 mt-1">
                        Verified Google Review
                      </p>
                    </div>

                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                      alt="Google"
                      className="w-5 h-5"
                    />
                  </div>

                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-yellow-400"
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

      <section className="bg-hero-gradient text-white py-24">

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Ready To Travel In Comfort?
          </h2>

          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
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
            className="inline-flex items-center justify-center rounded-2xl bg-accent-500 hover:bg-accent-400 text-primary-950 font-bold px-10 py-5 transition-all duration-300 shadow-premium hover:-translate-y-1"
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