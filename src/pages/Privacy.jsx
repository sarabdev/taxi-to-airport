import {
  BadgeCheck,
  Cookie,
  Database,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from 'lucide-react';

const purposeRows = [
  ['Providing a quote and processing your booking', 'Identity, Contact, Booking Data', 'Performance of a contract'],
  ['Arranging your transfer with a Driver', 'Booking Data, Contact Data', 'Performance of a contract'],
  ['Processing payment', 'Payment Data', 'Performance of a contract; legal obligation (accounting/tax)'],
  ['Customer support and handling enquiries or complaints', 'Contact, Correspondence Data', 'Legitimate interest in resolving queries; contractual obligation'],
  ['Sending service-related communications (booking confirmations, driver details, flight delay updates)', 'Contact, Booking Data', 'Performance of a contract'],
  ['Sending marketing communications (email, promotions)', 'Contact Data, Marketing Preferences', 'Consent (where required) or legitimate interest, with an easy opt-out'],
  ['Website analytics and improving our Platform (via Google Analytics)', 'Technical Data, Usage Data', 'Legitimate interest / consent (via cookie banner)'],
  ['Advertising and personalised ads (via Meta Pixel)', 'Technical Data, Usage Data', 'Consent (via cookie banner)'],
  ['Fraud prevention and security', 'Identity, Payment, Technical Data', 'Legitimate interest; legal obligation'],
  ['Complying with legal and regulatory obligations', 'As relevant', 'Legal obligation'],
  ['Defending or pursuing legal claims', 'As relevant', 'Legitimate interest'],
];

const retentionRows = [
  ['Booking/Journey Data', 'Up to 12 months after the journey, unless a longer period is required to resolve a dispute'],
  ['Financial/Transaction records', '6 years, in line with UK tax and accounting obligations'],
  ['Correspondence Data', 'Up to 18 months following resolution of your query, unless part of a longer financial record'],
  ['Marketing Data', 'Until you unsubscribe or withdraw consent, or a maximum of 3 years of inactivity'],
  ['Analytics Data', "As governed by Google Analytics' retention settings, generally anonymised or aggregated over time"],
];

const Section = ({ number, title, icon: Icon, children }) => (
  <section id={`section-${number}`} className="scroll-mt-28 border-t border-gray-100 pt-8 first:border-0 first:pt-0 sm:pt-10">
    <div className="mb-5 flex items-start gap-3 sm:mb-6">
      {Icon && (
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-900 text-accent-400">
          <Icon className="h-5 w-5" />
        </span>
      )}
      <h2 className="text-2xl font-black leading-tight text-primary-900 sm:text-3xl">
        {number}. {title}
      </h2>
    </div>
    <div className="space-y-4 text-base leading-7 text-gray-600">
      {children}
    </div>
  </section>
);

const BulletList = ({ children }) => (
  <ul className="space-y-3 pl-1">
    {children}
  </ul>
);

const Bullet = ({ children }) => (
  <li className="flex items-start gap-3">
    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500"></span>
    <span>{children}</span>
  </li>
);

const Privacy = () => {
  return (
    <div className="min-h-screen bg-surface-light">
      <section className="relative overflow-hidden bg-hero-gradient text-white">
        <div className="absolute inset-0 bg-black/35"></div>
        <div className="absolute right-[-120px] top-[-140px] h-[320px] w-[320px] rounded-full bg-accent-500/10 blur-3xl sm:right-0 sm:h-[480px] sm:w-[480px]"></div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md">
              <ShieldCheck className="h-4 w-4 text-accent-400" />
              Your privacy matters
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
              Privacy Policy
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-300 sm:text-lg">
              How My Airport Taxis collects, uses, shares, and protects your personal data.
            </p>

            <p className="mt-6 text-sm font-medium text-gray-400">
              Last updated: 27 July 2026
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12 lg:px-8">
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-[24px] border border-gray-100 bg-white p-6 shadow-soft">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                On this page
              </p>
              <nav className="space-y-1 text-sm">
                {[
                  'Introduction',
                  'What Personal Data We Collect',
                  'How and Why We Use Your Personal Data',
                  'Sharing Your Data with Drivers',
                  'Sharing Your Data with Other Third Parties',
                  'Cookies and Similar Technologies',
                  'International Data Transfers',
                  'Data Retention',
                  'Your Rights',
                  'Security',
                  'Contact Us',
                ].map((title, index) => (
                  <a
                    key={title}
                    href={`#section-${index + 1}`}
                    className="block rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary-900"
                  >
                    {index + 1}. {title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <article className="min-w-0 rounded-[24px] border border-gray-100 bg-white p-5 shadow-card sm:rounded-[32px] sm:p-8 lg:p-12">
            <div className="space-y-10 sm:space-y-12">
              <Section number="1" title="Introduction" icon={BadgeCheck}>
                <p>
                  1.1 My Airport Taxis (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;, the &quot;Company&quot;) operates the website myairporttaxis.uk (the &quot;Platform&quot;), through which customers (&quot;you&quot;, &quot;your&quot;, the &quot;Traveller&quot;) can book airport transfer services carried out by independent, licensed private hire drivers and operators (&quot;Drivers&quot;).
                </p>
                <p>
                  1.2 We are a booking intermediary. We do not operate vehicles or employ Drivers ourselves. When you book through the Platform, your transfer is carried out by an independent, licensed Driver, and this Privacy Policy explains what happens to your personal data both when you use our Platform and when that data needs to be shared with a Driver to fulfil your booking.
                </p>
                <p>
                  1.3 We are committed to protecting your personal data in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
                </p>

                <div className="rounded-2xl border border-accent-200 bg-accent-50 p-5">
                  <h3 className="mb-3 font-bold text-primary-900">Data Controller details</h3>
                  <BulletList>
                    <Bullet><strong className="text-gray-800">Company name:</strong> My Airport Taxis</Bullet>
                    <Bullet>
                      <strong className="text-gray-800">Contact email:</strong>{' '}
                      <a className="font-semibold text-primary-900 underline decoration-accent-500 underline-offset-4" href="mailto:support@myairporttaxis.uk">
                        support@myairporttaxis.uk
                      </a>
                    </Bullet>
                  </BulletList>
                </div>

                <p>
                  1.4 We may update this Privacy Policy from time to time to reflect changes in law, our practices, or the Platform. We recommend you check this page occasionally. Where changes are significant, we will notify you by a prominent notice on the Platform or by email.
                </p>
              </Section>

              <Section number="2" title="What Personal Data We Collect" icon={Database}>
                <p>We collect the following categories of personal data:</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ['Identity Data', 'Name, title, date of birth (where relevant for airport identification purposes).'],
                    ['Contact Data', 'Email address, telephone/mobile number, billing address.'],
                    ['Booking / Journey Data', 'Pick-up and drop-off addresses, date and time of travel, flight or arrival details, number of passengers, luggage details, and any special requirements you provide.'],
                    ['Payment Data', 'Card details or other payment credentials. Full payment card data is processed and stored by our third-party payment processor, not by us directly (see Section 5).'],
                    ['Technical Data', 'IP address, browser type and version, device information, operating system, and other technology on the devices you use to access the Platform.'],
                    ['Usage Data', 'Information about how you use the Platform, pages visited, time spent, referral source, and interaction with our marketing communications.'],
                    ['Marketing Preferences', 'Your choices regarding receiving marketing communications from us.'],
                    ['Correspondence Data', 'The content of emails, chat messages, or calls between you and our customer support team.'],
                  ].map(([title, description]) => (
                    <div key={title} className="rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:p-5">
                      <h3 className="mb-2 font-bold text-primary-900">{title}</h3>
                      <p className="text-sm leading-6 text-gray-600">{description}</p>
                    </div>
                  ))}
                </div>
                <p>
                  We collect this data directly from you (e.g. when you request a quote or make a booking), automatically through cookies and similar technologies as you use the Platform, and in limited cases from third parties (e.g. a Driver providing feedback about a completed journey).
                </p>
                <p>The Platform is intended for adults. We do not knowingly collect personal data from anyone under the age of 18.</p>
              </Section>

              <Section number="3" title="How and Why We Use Your Personal Data">
                <div className="overflow-x-auto rounded-2xl border border-gray-200">
                  <table className="min-w-[760px] w-full border-collapse text-left text-sm">
                    <thead className="bg-primary-900 text-white">
                      <tr>
                        <th className="px-4 py-3 font-bold">Purpose</th>
                        <th className="px-4 py-3 font-bold">Data Used</th>
                        <th className="px-4 py-3 font-bold">Legal Basis</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {purposeRows.map((row, index) => (
                        <tr key={row[0]} className={index % 2 ? 'bg-gray-50/70' : 'bg-white'}>
                          {row.map((cell) => (
                            <td key={cell} className="align-top px-4 py-3 leading-6 text-gray-600">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>

              <Section number="4" title="Sharing Your Data with Drivers">
                <p>
                  4.1 Because we act as an intermediary, we must share certain booking details with the Driver assigned to your transfer so that they can identify you and complete the journey. This typically includes: your name, mobile number, pick-up/drop-off location, flight details, and passenger/luggage numbers.
                </p>
                <p>
                  4.2 Where possible, we limit what is shared to what the Driver reasonably needs - for example, when checking a Driver&apos;s availability before a booking is confirmed, we may only share the date, time, general location, and vehicle type required, without your identifying details.
                </p>
                <p>
                  4.3 Drivers are independent businesses or contractors, not our employees. Each Driver is separately responsible for complying with data protection law regarding any data we share with them for the purpose of your journey.
                </p>
              </Section>

              <Section number="5" title="Sharing Your Data with Other Third Parties">
                <p>We may share your personal data with:</p>
                <BulletList>
                  <Bullet>Payment processors who handle card transactions on our behalf. Your full card details are processed and stored by the payment provider, not by us.</Bullet>
                  <Bullet>Analytics providers, namely Google Analytics, to understand how the Platform is used.</Bullet>
                  <Bullet>Advertising providers, namely Meta Pixel, to measure and personalise advertising, where you have consented via our cookie banner.</Bullet>
                  <Bullet>Email marketing platforms, to send you newsletters or promotional communications you have opted into.</Bullet>
                  <Bullet>IT hosting and infrastructure providers who support the operation of the Platform.</Bullet>
                  <Bullet>Fraud prevention and verification services, where necessary to protect against fraudulent transactions.</Bullet>
                  <Bullet>Regulators, law enforcement, or courts, where required by law or to protect our legal rights or the rights of others.</Bullet>
                  <Bullet>A buyer or successor, in the event of a sale, merger, or restructuring of our business, subject to the same protections described in this Policy.</Bullet>
                </BulletList>
                <p className="font-semibold text-primary-900">We do not sell your personal data to third parties.</p>
              </Section>

              <Section number="6" title="Cookies and Similar Technologies" icon={Cookie}>
                <p>We use cookies and similar technologies for:</p>
                <BulletList>
                  <Bullet><strong className="text-gray-800">Strictly necessary/functional cookies</strong> - required for the Platform to work (e.g. remembering your booking in progress).</Bullet>
                  <Bullet><strong className="text-gray-800">Analytics cookies (Google Analytics)</strong> - to understand site usage and improve our service.</Bullet>
                  <Bullet><strong className="text-gray-800">Advertising cookies (Meta Pixel)</strong> - to measure and personalise ads shown to you on other platforms.</Bullet>
                </BulletList>
                <p>
                  You can manage your cookie preferences through the cookie banner shown when you first visit the Platform, and you can change your preferences at any time via your browser settings or our cookie settings link. For more detail, please see our separate Cookies Policy.
                </p>
              </Section>

              <Section number="7" title="International Data Transfers">
                <p>
                  Where any of your personal data is transferred outside the UK (for example, to a service provider based in the EEA or the US), we ensure appropriate safeguards are in place, such as the UK&apos;s International Data Transfer Agreement, an adequacy decision, or equivalent standard contractual clauses, in accordance with UK GDPR requirements.
                </p>
              </Section>

              <Section number="8" title="Data Retention">
                <p>We retain personal data only for as long as necessary for the purposes it was collected, or as required by law. As a general guide:</p>
                <div className="overflow-x-auto rounded-2xl border border-gray-200">
                  <table className="min-w-[620px] w-full border-collapse text-left text-sm">
                    <thead className="bg-primary-900 text-white">
                      <tr>
                        <th className="w-1/3 px-4 py-3 font-bold">Data Type</th>
                        <th className="px-4 py-3 font-bold">Retention Period</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {retentionRows.map((row, index) => (
                        <tr key={row[0]} className={index % 2 ? 'bg-gray-50/70' : 'bg-white'}>
                          <td className="align-top px-4 py-3 font-semibold text-primary-900">{row[0]}</td>
                          <td className="align-top px-4 py-3 leading-6 text-gray-600">{row[1]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p>Retention periods restart where relevant if you make an additional booking within the period.</p>
              </Section>

              <Section number="9" title="Your Rights" icon={ShieldCheck}>
                <p>Under UK GDPR, you have the right to:</p>
                <BulletList>
                  <Bullet>Access the personal data we hold about you;</Bullet>
                  <Bullet>Rectify inaccurate or incomplete data;</Bullet>
                  <Bullet>Erasure of your data, in certain circumstances;</Bullet>
                  <Bullet>Restrict our processing of your data, in certain circumstances;</Bullet>
                  <Bullet>Object to processing based on legitimate interests or direct marketing;</Bullet>
                  <Bullet>Data portability, where processing is based on consent or contract and carried out by automated means;</Bullet>
                  <Bullet>Withdraw consent at any time, where processing is based on consent;</Bullet>
                  <Bullet>
                    Lodge a complaint with the Information Commissioner&apos;s Office (ICO) at{' '}
                    <a className="font-semibold text-primary-900 underline decoration-accent-500 underline-offset-4" href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">
                      ico.org.uk
                    </a>
                    , or with another supervisory authority.
                  </Bullet>
                </BulletList>
                <p>
                  To exercise any of these rights, contact us at{' '}
                  <a className="font-semibold text-primary-900 underline decoration-accent-500 underline-offset-4" href="mailto:support@myairporttaxis.uk">
                    support@myairporttaxis.uk
                  </a>
                  . We may ask you to verify your identity before actioning a request. We aim to respond within one month, extendable by up to two further months for complex requests, in line with UK GDPR timeframes.
                </p>
                <p>
                  Some rights are subject to limitations - for example, we may need to retain certain data to comply with a legal obligation, or to complete a service you have already booked.
                </p>
              </Section>

              <Section number="10" title="Security" icon={LockKeyhole}>
                <p>
                  We use appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, or misuse, including encryption where appropriate and restricted access to personal data on a need-to-know basis. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.
                </p>
              </Section>

              <Section number="11" title="Contact Us" icon={Mail}>
                <p>If you have any questions about this Privacy Policy or how we handle your personal data, please contact us at:</p>
                <a
                  href="mailto:support@myairporttaxis.uk"
                  className="inline-flex items-center gap-3 rounded-2xl bg-primary-900 px-5 py-4 font-bold text-white transition-colors hover:bg-primary-800"
                >
                  <Mail className="h-5 w-5 text-accent-400" />
                  support@myairporttaxis.uk
                </a>
                <p>
                  You also have the right to contact the Information Commissioner&apos;s Office (ICO) if you have concerns about how we process your personal data:{' '}
                  <a className="font-semibold text-primary-900 underline decoration-accent-500 underline-offset-4" href="https://www.ico.org.uk" target="_blank" rel="noopener noreferrer">
                    www.ico.org.uk
                  </a>
                </p>
              </Section>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
