import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle,
  Link2,
  Percent,
  QrCode,
  Send,
  Share2,
  CarFront,
  Wallet,
  BadgeCheck,
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const PROPERTY_TYPES = [
  { value: 'HOTEL', label: 'Hotel' },
  { value: 'GUEST_HOUSE', label: 'Guest house / B&B' },
  { value: 'LODGE', label: 'Lodge' },
  { value: 'HOLIDAY_RENTAL', label: 'Holiday rental / Airbnb' },
  { value: 'SERVICED_APARTMENTS', label: 'Serviced apartments' },
  { value: 'OTHER', label: 'Other' },
];

const PROPERTY_COUNTS = ['1', '2-5', '6-20', '21-50', '51+'];

const BENEFITS = [
  { icon: BadgeCheck, title: 'Free setup', text: 'No joining fee or integration work.' },
  { icon: Link2, title: 'Your own link', text: 'For reception, rooms and guest messages.' },
  { icon: Percent, title: 'Commission', text: 'Earn on every completed journey.' },
  { icon: BarChart3, title: 'Clear reporting', text: 'See bookings, journeys and rewards.' },
];

const STEPS = [
  {
    icon: QrCode,
    title: 'We create your partner link',
    text: 'Once approved, your property receives a personal, trackable link by email.',
  },
  {
    icon: Share2,
    title: 'You share it with guests',
    text: 'Add it to booking confirmations, digital guestbooks or reception materials.',
  },
  {
    icon: CarFront,
    title: 'The guest books directly',
    text: 'They choose a suitable vehicle and receive their own confirmation.',
  },
  {
    icon: Wallet,
    title: 'You earn commission',
    text: 'Every completed journey booked through your link earns you a share of the fare.',
  },
];

const EMPTY_FORM = {
  contactName: '',
  position: '',
  companyName: '',
  email: '',
  phone: '',
  city: '',
  propertyType: 'HOTEL',
  propertyCount: '1',
  message: '',
  website: '', // honeypot
};

const Partners = () => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [commissionPercent, setCommissionPercent] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_BASE}/api/settings/public`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((settings) => {
        const value = Number(settings?.defaultPartnerCommissionPercent);
        if (Number.isFinite(value) && value > 0) setCommissionPercent(value);
      })
      .catch(() => {});

    return () => controller.abort();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch(`${API_BASE}/api/partners/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || 'Unable to send your enquiry.');
      }

      setSubmitted(true);
      setFormData(EMPTY_FORM);
    } catch (error) {
      setSubmitError(error.message || 'Unable to send your enquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const fieldClass =
    'h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-primary-900 outline-none transition focus:border-accent-500 focus:ring-4 focus:ring-accent-500/10 sm:text-base';
  const labelClass =
    'mb-2 block text-xs font-bold uppercase tracking-wider text-gray-600';

  return (
    <div className="min-h-screen bg-surface-light">
      {/* ========================================================= */}
      {/* HERO */}
      {/* ========================================================= */}
      <section className="relative overflow-hidden bg-primary-950 text-white">
        <div className="absolute right-[-160px] top-[-140px] h-[340px] w-[340px] rounded-full border-[40px] border-white/5 sm:h-[520px] sm:w-[520px] sm:border-[60px]"></div>

        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 sm:pb-28 sm:pt-16 lg:px-8 lg:pb-32 lg:pt-20">
          <p className="mb-5 flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-accent-400">
            <span className="h-0.5 w-8 bg-accent-500"></span>
            For hotels, lodges and holiday rentals
          </p>

          <h1 className="max-w-3xl text-3xl font-black leading-tight sm:text-5xl lg:text-6xl">
            A better transfer option for every arriving guest.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
            Give guests a trusted way to pre-book airport travel and earn a commission on
            every completed journey. We provide your personal link and clear reporting.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => scrollTo('partner-enquiry')}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 py-3.5 font-bold text-primary-950 transition hover:bg-accent-400"
            >
              Become a partner
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollTo('partner-rewards')}
              className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3.5 font-bold text-primary-950 transition hover:bg-gray-100"
            >
              View partner rewards
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* BENEFITS */}
      {/* ========================================================= */}
      <section className="relative mx-auto -mt-14 max-w-7xl px-4 sm:-mt-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {BENEFITS.map((benefit) => (
            <div key={benefit.title} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft">
              <benefit.icon className="mb-3 h-6 w-6 text-accent-500" />
              <h3 className="font-black text-primary-900">{benefit.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{benefit.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* HOW IT WORKS */}
      {/* ========================================================= */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <p className="mb-3 flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-accent-500">
            <span className="h-0.5 w-8 bg-accent-500"></span>
            Guest journey
          </p>
          <h2 className="text-3xl font-black text-primary-900 sm:text-4xl">
            One link from check-in to pickup.
          </h2>

          <ol className="mt-8 space-y-6">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-900 text-accent-400">
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-primary-900">
                    <span className="mr-2 text-accent-500">{index + 1}.</span>
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600 sm:text-base">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col justify-center rounded-[28px] bg-accent-500 p-8 text-primary-950 sm:p-10">
          <p className="text-2xl font-black leading-snug sm:text-3xl">
            “Your team doesn’t need to arrange the journey. Simply give the guest a trusted
            way to book it.”
          </p>
          <p className="mt-6 flex items-center gap-2 text-sm font-bold">
            <CheckCircle className="h-5 w-5" />
            Free to join, no integration required
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* REWARDS */}
      {/* ========================================================= */}
      <section id="partner-rewards" className="scroll-mt-24 bg-primary-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <p className="mb-3 flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-accent-400">
            <span className="h-0.5 w-8 bg-accent-500"></span>
            Simple rewards
          </p>
          <h2 className="max-w-2xl text-3xl font-black sm:text-4xl">
            The more guests travel, the more your property earns.
          </h2>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold text-gray-300">Commission per journey</p>
              <p className="mt-2 text-4xl font-black text-accent-400">
                {commissionPercent ? `${commissionPercent}%` : 'A share'}
              </p>
              <p className="mt-2 text-sm text-gray-400">of every completed, paid fare.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold text-gray-300">Tracked automatically</p>
              <p className="mt-2 text-xl font-black">Every booking via your link</p>
              <p className="mt-2 text-sm text-gray-400">
                Guests stay linked to your property for 30 days after opening your link.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-semibold text-gray-300">Paid on completed rides</p>
              <p className="mt-2 text-xl font-black">Transparent statements</p>
              <p className="mt-2 text-sm text-gray-400">
                Cancelled journeys never count; completed ones always do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* ENQUIRY FORM */}
      {/* ========================================================= */}
      <section id="partner-enquiry" className="scroll-mt-24 mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="rounded-[28px] border border-gray-100 bg-white p-5 shadow-premium sm:p-10">
          <p className="mb-3 flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-accent-500">
            <span className="h-0.5 w-8 bg-accent-500"></span>
            Partner enquiry
          </p>
          <h2 className="text-2xl font-black text-primary-900 sm:text-3xl">
            Request your free partner link
          </h2>

          {submitted ? (
            <div role="status" className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6 text-green-800">
              <CheckCircle className="mb-3 h-8 w-8" />
              <p className="text-lg font-black">Thank you, your enquiry has been sent.</p>
              <p className="mt-1 text-sm">
                We will review your details and email your partner link once approved.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-4 text-sm font-bold text-green-900 underline"
              >
                Send another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="partner-contactName" className={labelClass}>Contact name</label>
                <input id="partner-contactName" name="contactName" value={formData.contactName} onChange={handleChange} required maxLength={120} autoComplete="name" className={fieldClass} />
              </div>
              <div>
                <label htmlFor="partner-position" className={labelClass}>Position</label>
                <input id="partner-position" name="position" value={formData.position} onChange={handleChange} maxLength={120} autoComplete="organization-title" className={fieldClass} />
              </div>
              <div>
                <label htmlFor="partner-companyName" className={labelClass}>Property / company</label>
                <input id="partner-companyName" name="companyName" value={formData.companyName} onChange={handleChange} required maxLength={160} autoComplete="organization" className={fieldClass} />
              </div>
              <div>
                <label htmlFor="partner-email" className={labelClass}>Email</label>
                <input id="partner-email" type="email" name="email" value={formData.email} onChange={handleChange} required maxLength={254} autoComplete="email" className={fieldClass} />
              </div>
              <div>
                <label htmlFor="partner-phone" className={labelClass}>Phone</label>
                <input id="partner-phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} maxLength={40} autoComplete="tel" className={fieldClass} />
              </div>
              <div>
                <label htmlFor="partner-city" className={labelClass}>City / town</label>
                <input id="partner-city" name="city" value={formData.city} onChange={handleChange} maxLength={120} autoComplete="address-level2" className={fieldClass} />
              </div>
              <div>
                <label htmlFor="partner-propertyType" className={labelClass}>Property type</label>
                <select id="partner-propertyType" name="propertyType" value={formData.propertyType} onChange={handleChange} className={fieldClass}>
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="partner-propertyCount" className={labelClass}>Rooms or properties managed</label>
                <select id="partner-propertyCount" name="propertyCount" value={formData.propertyCount} onChange={handleChange} className={fieldClass}>
                  {PROPERTY_COUNTS.map((count) => (
                    <option key={count} value={count}>{count.replace('-', '–')}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="partner-message" className={labelClass}>
                  Message <span className="font-normal normal-case tracking-normal text-gray-400">(optional)</span>
                </label>
                <textarea id="partner-message" name="message" value={formData.message} onChange={handleChange} maxLength={2000} rows={4} className={`${fieldClass} h-auto py-3`} />
              </div>

              {/* Honeypot: hidden from people, tempting to bots */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="partner-website">Website</label>
                <input id="partner-website" name="website" tabIndex={-1} autoComplete="off" value={formData.website} onChange={handleChange} />
              </div>

              {submitError && (
                <p role="alert" className="text-sm font-medium text-red-600 sm:col-span-2">
                  {submitError}
                </p>
              )}

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-900 px-8 py-4 font-bold text-white transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {submitting ? 'Sending...' : 'Request partner details'}
                  {!submitting && <Send className="h-4 w-4" />}
                </button>
                <p className="mt-3 flex items-start gap-2 text-xs text-gray-500">
                  <Building2 className="mt-0.5 h-4 w-4 shrink-0" />
                  We review every enquiry and email your personal partner link once approved.
                </p>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Partners;
