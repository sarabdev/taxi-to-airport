import {
  Users,
  Award,
  Globe,
  Heart,
  CheckCircle,
  ArrowRight,
  Shield,
  Clock3,
  BadgeCheck,
} from 'lucide-react';

const About = () => {
  const stats = [
    {
      label: 'Years In Service',
      value: '15+',
    },

    {
      label: 'Happy Travelers',
      value: '50K+',
    },

    {
      label: 'Cities Covered',
      value: '100+',
    },

    {
      label: 'Professional Chauffeurs',
      value: '500+',
    },
  ];

  const values = [
    {
      icon: <Users className="h-7 w-7 sm:h-8 sm:w-8" />,
      title: 'Customer First',

      description:
        'Your comfort and satisfaction are our highest priorities on every journey.',
    },

    {
      icon: <Award className="h-7 w-7 sm:h-8 sm:w-8" />,
      title: 'Premium Excellence',

      description:
        'We maintain luxury-level standards in service, vehicles, and professionalism.',
    },

    {
      icon: <Globe className="h-7 w-7 sm:h-8 sm:w-8" />,
      title: 'Reliable Service',

      description:
        'Count on punctual pickups, smooth transfers, and dependable transportation.',
    },

    {
      icon: <Heart className="h-7 w-7 sm:h-8 sm:w-8" />,
      title: 'Safety & Care',

      description:
        'Licensed drivers and carefully maintained vehicles ensure complete peace of mind.',
    },
  ];

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
                Trusted Airport Transportation Since 2010
              </span>
            </div>

            {/* Heading */}
            <h1 className="mb-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl lg:mb-8 xl:text-7xl">
              Luxury Airport Transfers
              <span className="block text-accent-400">
                Built On Trust
              </span>
            </h1>

            {/* Description */}
            <p className="max-w-3xl text-base leading-relaxed text-gray-300 sm:text-lg md:text-xl">
              AirportRide delivers executive airport transportation with
              professional chauffeurs, luxury vehicles, and exceptional
              customer service trusted by thousands of travelers worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* STATS */}
      {/* ========================================================= */}

      <section className="relative z-20 -mt-10 pb-16 sm:-mt-12 sm:pb-20 lg:-mt-16 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-premium sm:rounded-[32px] sm:p-8 lg:p-14">
            <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4 lg:gap-10">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="mb-2 text-3xl font-black text-primary-900 sm:mb-3 sm:text-4xl lg:text-5xl">
                    {stat.value}
                  </div>

                  <div className="text-xs uppercase tracking-wide text-gray-500 sm:text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* OUR STORY */}
      {/* ========================================================= */}

      <section className="pb-16 sm:pb-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">
            {/* LEFT */}
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-900 sm:mb-6 sm:px-5">
                <Shield className="h-4 w-4 text-accent-500" />

                Our Journey
              </div>

              <h2 className="mb-6 text-3xl font-black leading-tight text-primary-900 sm:text-4xl md:text-5xl lg:mb-8">
                More Than Just
                <span className="block">
                  Transportation
                </span>
              </h2>

              <div className="space-y-5 text-base leading-relaxed text-gray-600 sm:space-y-6 sm:text-lg">
                <p>
                  Founded in 2010, AirportRide started with a clear mission:
                  deliver premium airport transportation that travelers can
                  genuinely rely on.
                </p>

                <p>
                  What began as a small fleet has evolved into a trusted luxury
                  transportation service serving thousands of customers across
                  major cities and airports.
                </p>

                <p>
                  Today, we combine modern booking technology, professional
                  chauffeurs, and executive-class vehicles to deliver a seamless
                  travel experience from pickup to destination.
                </p>
              </div>

              {/* Mini Features */}
              <div className="mt-8 space-y-4 sm:mt-10">
                {[
                  'Professional licensed chauffeurs',
                  'Luxury executive vehicles',
                  '24/7 support & live tracking',
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 shrink-0 text-accent-500" />

                    <span className="font-medium text-gray-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-[40px] bg-accent-500/10 blur-2xl"></div>

              <div className="relative overflow-hidden rounded-[24px] shadow-premium sm:rounded-[32px]">
                <img
                  src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&h=900&fit=crop"
                  alt="Luxury Fleet"
                  className="h-[360px] w-full object-cover sm:h-[480px] lg:h-[650px]"
                />

                {/* Floating Card */}
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 p-4 shadow-card backdrop-blur-md sm:bottom-8 sm:left-8 sm:right-8 sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="mb-1 text-xs text-gray-500 sm:text-sm">
                        Premium Fleet
                      </p>

                      <h3 className="text-base font-bold text-primary-900 sm:text-xl">
                        Executive Transportation
                      </h3>
                    </div>

                    <Clock3 className="h-8 w-8 shrink-0 text-accent-500 sm:h-10 sm:w-10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* VALUES */}
      {/* ========================================================= */}

      <section className="pb-16 sm:pb-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16 lg:mb-20">
            <h2 className="mb-4 text-3xl font-black text-primary-900 sm:mb-6 sm:text-4xl md:text-5xl">
              Our Core Values
            </h2>

            <p className="text-base leading-relaxed text-gray-600 sm:text-xl">
              The principles that guide every journey, every interaction,
              and every customer experience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group rounded-[24px] border border-gray-100 bg-white p-6 shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-premium sm:rounded-[28px] sm:p-8 lg:p-10"
              >
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-900 text-accent-400 transition-transform duration-300 group-hover:scale-110 sm:mb-8 sm:h-16 sm:w-16">
                  {value.icon}
                </div>

                <h3 className="mb-3 text-xl font-bold text-primary-900 sm:mb-5 sm:text-2xl">
                  {value.title}
                </h3>

                <p className="text-base leading-relaxed text-gray-600 sm:text-lg">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* WHY CHOOSE US */}
      {/* ========================================================= */}

      <section className="pb-16 sm:pb-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">
            {/* IMAGE */}
            <div className="relative order-2 lg:order-1">
              <div className="absolute -inset-4 rounded-[40px] bg-accent-500/10 blur-2xl"></div>

              <div className="relative overflow-hidden rounded-[24px] shadow-premium sm:rounded-[32px]">
                <img
                  src="https://images.unsplash.com/photo-1521791055366-0d553872125f?w=1200&h=900&fit=crop"
                  alt="Professional Chauffeur"
                  className="h-[360px] w-full object-cover sm:h-[480px] lg:h-[650px]"
                />
              </div>
            </div>

            {/* CONTENT */}
            <div className="order-1 lg:order-2">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-900 sm:mb-6 sm:px-5">
                <Award className="h-4 w-4 text-accent-500" />

                Why Choose AirportRide
              </div>

              <h2 className="mb-6 text-3xl font-black leading-tight text-primary-900 sm:text-4xl md:text-5xl lg:mb-8">
                Designed Around
                <span className="block">
                  Your Comfort
                </span>
              </h2>

              <div className="space-y-4 sm:space-y-5">
                {[
                  'Professional licensed chauffeurs',
                  'Luxury executive fleet',
                  'Transparent fixed pricing',
                  '24/7 customer support',
                  'Real-time tracking & updates',
                  'Flight monitoring included',
                  'Easy online booking',
                  'Flexible cancellation policy',
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 sm:gap-4">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent-500 sm:h-6 sm:w-6" />

                    <span className="text-base text-gray-700 sm:text-lg">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
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
            Experience The
            <span className="block text-accent-400">
              AirportRide Difference
            </span>
          </h2>

          <p className="mx-auto mb-8 max-w-3xl text-base leading-relaxed text-gray-300 sm:mb-10 sm:text-xl">
            Book your next airport transfer with confidence and enjoy luxury
            transportation designed around comfort, punctuality, and reliability.
          </p>

          <a
            href="/booking"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-accent-500 px-6 py-4 text-sm font-bold text-primary-950 shadow-premium transition-all duration-300 hover:-translate-y-1 hover:bg-accent-400 sm:w-auto sm:px-10 sm:py-5 sm:text-base"
          >
            Book Your Ride Today

            <ArrowRight className="ml-3 h-5 w-5" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;