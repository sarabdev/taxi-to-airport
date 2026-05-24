import { useState } from 'react';

import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  ArrowRight,
  CheckCircle,
  BadgeCheck,
  Shield,
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Contact form submitted:', formData);

    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-surface-light">
      {/* ========================================================= */}
      {/* HERO */}
      {/* ========================================================= */}

      <section className="relative overflow-hidden bg-hero-gradient text-white">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Glow */}
        <div className="absolute right-[-180px] top-[-120px] h-[300px] w-[300px] rounded-full bg-accent-500/10 blur-3xl sm:right-[-100px] sm:h-[420px] sm:w-[420px] lg:right-0 lg:top-0 lg:h-[500px] lg:w-[500px]"></div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-md sm:mb-8 sm:px-5">
              <BadgeCheck className="h-4 w-4 shrink-0 text-accent-400" />

              <span className="text-xs font-medium text-gray-200 sm:text-sm">
                Available 24/7 For Support & Bookings
              </span>
            </div>

            {/* Heading */}
            <h1 className="mb-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl lg:mb-8 xl:text-7xl">
              Get In Touch
              <span className="block text-accent-400">
                With AirportRide
              </span>
            </h1>

            {/* Description */}
            <p className="max-w-3xl text-base leading-relaxed text-gray-300 sm:text-lg md:text-xl">
              Need help with a booking, airport transfer, or special request?
              Our team is available around the clock to assist you.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* CONTACT SECTION */}
      {/* ========================================================= */}

      <section className="relative z-20 -mt-10 pb-16 sm:-mt-12 sm:pb-20 lg:-mt-16 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
            {/* ========================================================= */}
            {/* CONTACT INFO */}
            {/* ========================================================= */}

            <div className="space-y-5 sm:space-y-6">
              {[
                {
                  icon: Phone,
                  title: 'Phone',
                  value1: '+1 (555) 123-4567',
                  value2: '24/7 Customer Support',
                },

                {
                  icon: Mail,
                  title: 'Email',
                  value1: 'info@airportride.com',
                  value2: 'support@airportride.com',
                },

                {
                  icon: MapPin,
                  title: 'Office',
                  value1: '123 Business Avenue',
                  value2: 'New York, NY 10001',
                },

                {
                  icon: Clock,
                  title: 'Business Hours',
                  value1: 'Office: Mon-Fri 9AM-6PM',
                  value2: 'Support Available 24/7',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-soft transition-all duration-300 hover:shadow-premium sm:rounded-[28px] sm:p-8"
                >
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-900 text-accent-400 sm:h-14 sm:w-14">
                      <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="mb-2 text-lg font-bold text-primary-900 sm:mb-3 sm:text-xl">
                        {item.title}
                      </h3>

                      <p className="break-words leading-relaxed text-gray-700">
                        {item.value1}
                      </p>

                      <p className="mt-1 break-words text-gray-500">
                        {item.value2}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Trust Box */}
              <div className="rounded-[24px] bg-primary-900 p-5 text-white shadow-premium sm:rounded-[28px] sm:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <Shield className="h-6 w-6 text-accent-400 sm:h-7 sm:w-7" />

                  <h3 className="text-xl font-black sm:text-2xl">
                    Why Choose Us
                  </h3>
                </div>

                <div className="space-y-4">
                  {[
                    'Professional licensed chauffeurs',
                    'Luxury executive vehicles',
                    '24/7 support available',
                    'Fixed transparent pricing',
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent-400" />

                      <span className="text-gray-300">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* CONTACT FORM */}
            {/* ========================================================= */}

            <div className="lg:col-span-2">
              <div className="overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-premium sm:rounded-[32px]">
                {/* Header */}
                <div className="bg-primary-900 px-5 py-5 sm:px-8 sm:py-6">
                  <h2 className="text-2xl font-bold text-white sm:text-3xl">
                    Send Us A Message
                  </h2>

                  <p className="mt-2 text-sm text-gray-300 sm:text-base">
                    We usually respond within a few hours.
                  </p>
                </div>

                {/* Form */}
                <div className="p-5 sm:p-8 lg:p-10">
                  {submitted && (
                    <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-800 sm:mb-8 sm:px-5 sm:text-base">
                      Thank you for your message! We'll get back to you soon.
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-7">
                    {/* Row 1 */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700 sm:mb-3">
                          Full Name *
                        </label>

                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="input-field h-12 border-gray-200 focus:ring-primary-900 sm:h-14"
                          required
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700 sm:mb-3">
                          Email Address *
                        </label>

                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="input-field h-12 border-gray-200 focus:ring-primary-900 sm:h-14"
                          required
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700 sm:mb-3">
                          Phone Number
                        </label>

                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="input-field h-12 border-gray-200 focus:ring-primary-900 sm:h-14"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700 sm:mb-3">
                          Subject *
                        </label>

                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="select-field h-12 border-gray-200 focus:ring-primary-900 sm:h-14"
                          required
                        >
                          <option value="">
                            Select Subject
                          </option>

                          <option value="booking">
                            Booking Inquiry
                          </option>

                          <option value="support">
                            Customer Support
                          </option>

                          <option value="feedback">
                            Feedback
                          </option>

                          <option value="partnership">
                            Partnership
                          </option>

                          <option value="other">
                            Other
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700 sm:mb-3">
                        Message *
                      </label>

                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="7"
                        className="input-field min-h-[180px] resize-none border-gray-200 focus:ring-primary-900"
                        required
                        placeholder="Tell us how we can help you..."
                      ></textarea>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center rounded-2xl bg-primary-900 px-6 py-4 text-sm font-bold text-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:bg-primary-800 hover:shadow-premium sm:px-8 sm:py-5 sm:text-base"
                    >
                      Send Message

                      <Send className="ml-3 h-5 w-5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* MAP */}
      {/* ========================================================= */}

      <section className="pb-16 sm:pb-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-premium sm:rounded-[32px]">
            {/* Header */}
            <div className="border-b border-gray-100 px-5 py-6 sm:px-8 sm:py-8">
              <h2 className="mb-2 text-2xl font-black text-primary-900 sm:mb-3 sm:text-3xl">
                Visit Our Office
              </h2>

              <p className="text-base text-gray-600 sm:text-lg">
                Located in the heart of New York City.
              </p>
            </div>

            {/* Placeholder */}
            <div className="flex h-[320px] items-center justify-center bg-gradient-to-r from-primary-100 to-primary-200 px-5 text-center sm:h-[380px] lg:h-[450px]">
              <div>
                <MapPin className="mx-auto mb-5 h-12 w-12 text-primary-900 sm:mb-6 sm:h-16 sm:w-16" />

                <h3 className="mb-2 text-xl font-bold text-primary-900 sm:mb-3 sm:text-2xl">
                  Interactive Map
                </h3>

                <p className="text-base text-gray-700 sm:text-lg">
                  123 Business Avenue, Suite 100
                </p>

                <p className="mt-2 text-gray-500">
                  New York, NY 10001
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FAQ */}
      {/* ========================================================= */}

      <section className="pb-16 sm:pb-20 lg:pb-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center sm:mb-16">
            <h2 className="mb-4 text-3xl font-black text-primary-900 sm:mb-6 sm:text-4xl md:text-5xl">
              Frequently Asked Questions
            </h2>

            <p className="text-base text-gray-600 sm:text-xl">
              Quick answers to common questions.
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {[
              {
                q: 'How do I book a ride?',
                a: 'You can easily book online through our website or contact our support team directly.',
              },

              {
                q: 'What payment methods do you accept?',
                a: 'We accept major credit cards, debit cards, and secure online payments.',
              },

              {
                q: 'Can I modify my booking?',
                a: 'Yes, bookings can be modified or canceled before pickup time.',
              },

              {
                q: 'Do you monitor flights?',
                a: 'Absolutely. We track flight arrivals to ensure timely airport pickups.',
              },

              {
                q: 'Are drivers licensed?',
                a: 'All chauffeurs are fully licensed, insured, and professionally trained.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-soft transition-all duration-300 hover:shadow-premium sm:rounded-[24px] sm:p-8"
              >
                <h3 className="mb-3 text-lg font-bold text-primary-900 sm:mb-4 sm:text-xl">
                  {faq.q}
                </h3>

                <p className="text-base leading-relaxed text-gray-600 sm:text-lg">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* CTA */}
      {/* ========================================================= */}

      <section className="relative overflow-hidden bg-hero-gradient py-16 text-white sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="absolute right-[-140px] top-[-120px] h-[280px] w-[280px] rounded-full bg-accent-500/10 blur-3xl sm:right-0 sm:top-0 sm:h-[400px] sm:w-[400px]"></div>

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md sm:mb-8 sm:px-5">
            <BadgeCheck className="h-4 w-4 shrink-0 text-accent-400" />

            Trusted By Thousands Of Travelers
          </div>

          <h2 className="mb-4 text-3xl font-black leading-tight sm:mb-6 sm:text-4xl md:text-5xl">
            Ready To Book
            <span className="block text-accent-400">
              Your Airport Transfer?
            </span>
          </h2>

          <p className="mx-auto mb-8 max-w-3xl text-base leading-relaxed text-gray-300 sm:mb-10 sm:text-xl">
            Experience luxury airport transportation with professional
            chauffeurs and premium service.
          </p>

          <a
            href="/booking"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-accent-500 px-6 py-4 text-sm font-bold text-primary-950 shadow-premium transition-all duration-300 hover:-translate-y-1 hover:bg-accent-400 sm:w-auto sm:px-10 sm:py-5 sm:text-base"
          >
            Book Your Ride

            <ArrowRight className="ml-3 h-5 w-5" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Contact;