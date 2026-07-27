import {
  BadgeCheck,
  Banknote,
  CarFront,
  FileCheck2,
  Mail,
  Scale,
  ShieldCheck,
} from 'lucide-react';

const Section = ({ number, title, icon: Icon, children }) => (
  <section
    id={`section-${number}`}
    className="scroll-mt-28 border-t border-gray-100 pt-8 first:border-0 first:pt-0 sm:pt-10"
  >
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

const Subheading = ({ children }) => (
  <h3 className="pt-2 text-xl font-bold text-primary-900">
    {children}
  </h3>
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

const Terms = () => {
  const sectionTitles = [
    'Introduction',
    'Description of Transport Services',
    'Our Legal Status as an Intermediary',
    'Making a Booking',
    'Cancellations, Changes, and No-Shows',
    'Additional Service Terms',
    "Company's Liability",
    'Your Obligations',
    'Charges and Payment',
    'Reviews and Feedback',
    'Intellectual Property',
    'Acceptable Use of the Platform',
    'External Links',
    'General Terms',
    'Contact Us',
  ];

  return (
    <div className="min-h-screen bg-surface-light">
      <section className="relative overflow-hidden bg-hero-gradient text-white">
        <div className="absolute inset-0 bg-black/35"></div>
        <div className="absolute right-[-120px] top-[-140px] h-[320px] w-[320px] rounded-full bg-accent-500/10 blur-3xl sm:right-0 sm:h-[480px] sm:w-[480px]"></div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md">
              <FileCheck2 className="h-4 w-4 text-accent-400" />
              Clear terms for every journey
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
              Terms of Use
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-300 sm:text-lg">
              The terms governing your use of My Airport Taxis and bookings made through our platform.
            </p>

            <p className="mt-6 text-sm font-medium text-gray-400">
              Version 1 - Effective 27 July 2026
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12 lg:px-8">
          <aside className="hidden lg:block">
            <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-[24px] border border-gray-100 bg-white p-6 shadow-soft">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                On this page
              </p>

              <nav className="space-y-1 text-sm">
                {sectionTitles.map((title, index) => (
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
                  These Terms of Use (&quot;Terms&quot;) govern access to and use of the website myairporttaxis.uk (the &quot;Platform&quot;), operated by My Airport Taxis (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;, the &quot;Company&quot;).
                </p>
                <p>
                  The Platform allows travellers (&quot;you&quot;, &quot;Traveller&quot;) to book airport transfer and related transport services (&quot;Transport Services&quot;) that are carried out by independent, licensed private hire drivers and operators (&quot;Drivers&quot;). We are a booking intermediary: we connect you with Drivers and facilitate your booking and payment, but we do not ourselves operate vehicles, hold a private hire operator&apos;s licence, or act as a transport carrier.
                </p>
                <p>
                  By accessing or using the Platform, you confirm that you have read, understood, and agree to be bound by these Terms, along with our{' '}
                  <a href="/privacy" className="font-semibold text-primary-900 underline decoration-accent-500 underline-offset-4">
                    Privacy Policy
                  </a>{' '}
                  and Cookies Policy. If you do not agree, please do not use the Platform.
                </p>
                <p>
                  We may update these Terms from time to time to reflect changes in law, our services, or how the Platform operates. Material changes will be notified via a notice on the Platform or by email. Continued use of the Platform after changes take effect constitutes acceptance of the updated Terms. Changes do not apply retroactively to bookings already confirmed before the change.
                </p>
                <p className="rounded-2xl border border-accent-200 bg-accent-50 p-4 font-semibold text-primary-900">
                  You must be at least 18 years old to use the Platform and make a booking.
                </p>
              </Section>

              <Section number="2" title="Description of Transport Services" icon={CarFront}>
                <p>Through the Platform you can book:</p>
                <BulletList>
                  <Bullet>Transfers to and from airports, ports, and train or bus stations;</Bullet>
                  <Bullet>Transfers to and from a place of residence, hotel, or other accommodation;</Bullet>
                  <Bullet>Point-to-point transfers within a city; and</Bullet>
                  <Bullet>Other transport services as may be made available on the Platform from time to time.</Bullet>
                </BulletList>
                <p>
                  At pickup, the assigned Driver will meet you at the agreed location. Where available, we will share the Driver&apos;s name and contact number with you ahead of the transfer so you can identify and reach them.
                </p>
              </Section>

              <Section number="3" title="Our Legal Status as an Intermediary" icon={Scale}>
                <p className="font-bold text-primary-900">
                  We are not a licensed private hire operator and do not provide Transport Services ourselves. We act solely as an intermediary between you and the Driver.
                </p>
                <p>
                  When you make a booking through the Platform, you enter into a direct contract for the Transport Service with the Driver (or the licensed private hire operator the Driver works for). We facilitate that booking and the related payment, but we are not a party to the transport contract itself, and we do not guarantee the availability, quality, timeliness, or safety of any Transport Service, though we take reasonable steps to work only with licensed, properly insured Drivers and operators.
                </p>
                <p>
                  Drivers are independent third parties and are not our employees, agents, or partners. We are not liable for any act, omission, delay, or misconduct of a Driver, except as set out in Section 7 below.
                </p>
              </Section>

              <Section number="4" title="Making a Booking">
                <p>
                  To book a transfer, you will need to provide accurate details including your name, contact details, pickup and drop-off locations, date and time, flight/train details where relevant, number of passengers, and luggage. You are responsible for ensuring this information is correct and up to date - incorrect details (for example, an inaccurate flight number) may affect our ability to arrange your pickup correctly.
                </p>
                <p>
                  A booking is confirmed only once payment has been successfully processed and you have received a booking confirmation with your reference code. We reserve the right to decline or cancel a booking, including for reasons such as unavailability, suspected fraud, or an inability to service the requested route - in which case we will notify you promptly and refund any payment already made in full.
                </p>
                <p>
                  You confirm that you are the lawful holder of, or are authorised to use, the payment method provided, and that sufficient funds are available to cover the cost of the booking.
                </p>
              </Section>

              <Section number="5" title="Cancellations, Changes, and No-Shows">
                <Subheading>5.1 Cancellation by the Traveller</Subheading>
                <BulletList>
                  <Bullet>Cancellations made more than 24 hours before the scheduled pickup time are eligible for a full refund.</Bullet>
                  <Bullet>Cancellations made within 24 hours of pickup may be subject to a cancellation fee. Any applicable fee will be shown or communicated before cancellation is confirmed.</Bullet>
                  <Bullet>Cancellations made after the Driver has been dispatched are non-refundable.</Bullet>
                </BulletList>
                <p>
                  To cancel, contact us at{' '}
                  <a href="mailto:support@myairporttaxis.uk" className="font-semibold text-primary-900 underline decoration-accent-500 underline-offset-4">
                    support@myairporttaxis.uk
                  </a>{' '}
                  or by phone at{' '}
                  <a href="tel:+447899001900" className="font-semibold text-primary-900 underline decoration-accent-500 underline-offset-4">
                    +44 7899 001900
                  </a>
                  .
                </p>

                <Subheading>5.2 Changes to a Booking</Subheading>
                <p>
                  You may request changes to your booking (e.g. pickup time, address, passenger numbers) before the scheduled pickup, subject to availability. Please request changes as early as possible. If a change affects the price, we will confirm the new price with you before applying it. Late changes may not be possible and, where not accommodated, will be treated as a cancellation under Section 5.1.
                </p>

                <Subheading>5.3 Waiting Time</Subheading>
                <p>
                  Your Driver will wait for you free of charge for the following period, starting from the scheduled pickup time (or, for airport pickups where the pickup time is tied to flight arrival, from actual landing time, subject to correct flight details having been provided):
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ['Airport pickups', '60 minutes'],
                    ['Port, train, or bus station pickups', '30 minutes'],
                    ['Other in-city pickups', '20 minutes'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-center">
                      <p className="font-black text-primary-900">{value}</p>
                      <p className="mt-1 text-sm leading-5 text-gray-500">{label}</p>
                    </div>
                  ))}
                </div>
                <p>
                  Extra waiting time beyond these periods may be requested via customer support and, where the Driver can accommodate it, may be subject to an additional charge, which will be confirmed with you before it applies.
                </p>

                <Subheading>5.4 Traveller No-Show</Subheading>
                <p>
                  If you fail to arrive at the agreed pickup point within the applicable waiting time in Section 5.3 (having been reasonably contactable by the Driver or our support team), the booking will be treated as a no-show and is non-refundable. If you believe a no-show was recorded in error, you may dispute it within 48 hours by contacting support@myairporttaxis.uk, and we will review the available evidence.
                </p>

                <Subheading>5.5 Driver No-Show or Delay</Subheading>
                <p>
                  If your assigned Driver fails to arrive within a reasonable time of the scheduled pickup without prior notice, and we are unable to arrange a suitable alternative promptly, you will be entitled to a full refund for that booking.
                </p>
              </Section>

              <Section number="6" title="Additional Service Terms">
                <Subheading>6.1 Child Seats</Subheading>
                <p>
                  Rules on child car seats vary by location; we require the correct seat, restraint, or booster to be used for any child passenger where local law requires it, generally for children under 12 years old or under 135cm in height, unless local law sets a different threshold.
                </p>
                <p>
                  If you require a child seat, you must request it at the time of booking so we can assign an appropriate vehicle. If you intend to bring your own child seat, please tell us in advance so we can confirm the vehicle can accommodate it. In the rare event a requested child seat cannot be provided, any related charge will be refunded.
                </p>
                <p>
                  Checking that a provided child seat is correctly fitted and suitable for your child is your responsibility as the parent or guardian; we and the Driver accept no liability for the suitability, fitting, or use of a child seat, whether provided by us or brought by you.
                </p>

                <Subheading>6.2 Luggage</Subheading>
                <p>
                  Unless otherwise stated at booking, each passenger may bring one standard suitcase or bag (combined dimensions up to approximately 158cm - length + width + height) plus one item of hand luggage. Please declare oversized items (e.g. sports equipment, musical instruments, pushchairs, additional bags) at the time of booking so we can assign a suitably sized vehicle.
                </p>
                <p>
                  If you arrive with more luggage or passengers than declared and the assigned vehicle cannot safely or legally accommodate this, we or the Driver may need to arrange an additional or replacement vehicle, and any extra cost will be payable by you. Your luggage and personal belongings remain your responsibility throughout the journey; we recommend appropriate travel insurance, as we do not accept liability for loss of or damage to personal items unless caused directly by our or the Driver&apos;s negligence.
                </p>
                <p>
                  For safety and legal reasons, certain items may not be transported, including weapons, hazardous or illegal substances, and items that are excessively large, fragile, or perishable in a way that could damage the vehicle or endanger passengers.
                </p>

                <Subheading>6.3 Intermediate Stops</Subheading>
                <p>
                  Where supported for your route, you may request a short intermediate stop (e.g. to collect an additional passenger) at the time of booking. Intermediate stops should not exceed approximately 5 minutes; longer stops may incur an additional charge or may not be accommodated, at the Driver&apos;s reasonable discretion, particularly where it would risk a flight connection or subsequent booking.
                </p>

                <Subheading>6.4 Travel Documents and Border Requirements</Subheading>
                <p>
                  Where your journey involves crossing a national border or an international arrival/departure, it is your responsibility to hold all necessary travel documents (passport, visa, or other required documentation). We are not liable for any cost, delay, or missed travel arising from your failure to hold the correct documents, and a booking confirmation or voucher does not constitute a visa or entry permission of any kind.
                </p>
              </Section>

              <Section number="7" title="Company's Liability" icon={ShieldCheck}>
                <p>
                  7.1 To the fullest extent permitted by law, we do not accept liability for the acts, omissions, negligence, or misconduct of any Driver, since the Driver is an independent third party and not our employee or agent. Your legal recourse for issues arising during the transfer itself (e.g. driving standard, vehicle condition, route taken) is primarily against the Driver or their operator; however, we will assist in good faith with resolving complaints and, where appropriate, may facilitate compensation.
                </p>
                <p>
                  7.2 We are liable for losses that are a direct and foreseeable result of our own breach of these Terms or our own negligence in operating the Platform (for example, a booking error caused by a fault in our system). We are not liable for indirect or consequential losses, including loss of profit, loss of a connecting flight or onward travel, or loss of enjoyment, except where such loss arises from our failure to exercise reasonable care and skill.
                </p>
                <p>
                  7.3 Nothing in these Terms excludes or limits liability for death or personal injury caused by negligence, for fraud, or for any other liability that cannot lawfully be excluded or limited under the laws of England and Wales.
                </p>
                <p>
                  7.4 We do not guarantee that the Platform will be uninterrupted, error-free, or secure at all times, and we are not liable for losses arising from technical failures, downtime, or events beyond our reasonable control (force majeure), including strikes, extreme weather, traffic disruption, or flight delays exceeding what is reasonably foreseeable.
                </p>
                <p>
                  7.5 Subject to Section 7.3, our total liability to you arising out of or in connection with a booking is limited to the total price paid for that booking.
                </p>
              </Section>

              <Section number="8" title="Your Obligations">
                <p>When using the Platform and during any Transport Service, you agree to:</p>
                <BulletList>
                  <Bullet>Provide true, accurate, and up-to-date information when booking;</Bullet>
                  <Bullet>Treat Drivers with courtesy and not cause damage to their vehicle;</Bullet>
                  <Bullet>Not use the Platform for any unlawful purpose, or to transmit harmful, defamatory, or abusive content;</Bullet>
                  <Bullet>Not attempt to access other users&apos; accounts or interfere with the security or operation of the Platform;</Bullet>
                  <Bullet>Comply with reasonable safety instructions given by the Driver during the journey (e.g. seatbelt use, not distracting the Driver, not smoking in the vehicle); and</Bullet>
                  <Bullet>Be responsible for any damage caused to a Driver&apos;s vehicle by you, your party, or items or animals you bring with you.</Bullet>
                </BulletList>
                <p>
                  We reserve the right to suspend or terminate your access to the Platform if we reasonably believe you have breached these Terms, engaged in fraud, or behaved in a way that puts a Driver, other travellers, or the Company at risk.
                </p>
              </Section>

              <Section number="9" title="Charges and Payment" icon={Banknote}>
                <p>
                  The price shown at the time of booking is the total price for the Transport Service, inclusive of our service fee. Payment is processed at the time of booking through our third-party payment provider. We do not store your full card details - these are handled directly by our payment provider in accordance with their own security standards (e.g. PCI-DSS).
                </p>
                <p>
                  Prices may vary based on factors such as vehicle type, distance, number of passengers, luggage, time of day, and demand. Any promotional offers or discount codes are subject to their own specific terms, which will be made clear at the time they are offered.
                </p>
              </Section>

              <Section number="10" title="Reviews and Feedback">
                <p>
                  Following completion of your transfer, we may invite you to rate the Driver and your overall experience. Reviews and feedback you submit may be used by us, in aggregate or individually, for quality assurance, Driver performance management, and marketing purposes. Reviews must be honest and must not contain defamatory, abusive, or unlawful content; we reserve the right to remove reviews that breach this requirement.
                </p>
              </Section>

              <Section number="11" title="Intellectual Property">
                <p>
                  All content on the Platform - including text, graphics, logos, and the &quot;My Airport Taxis&quot; name and branding - is owned by us or our licensors and is protected by applicable intellectual property laws. We grant you a limited, non-exclusive, non-transferable licence to access and use the Platform for your personal, non-commercial use only. You may not copy, reproduce, resell, or create derivative works from the Platform&apos;s content without our prior written consent.
                </p>
              </Section>

              <Section number="12" title="Acceptable Use of the Platform">
                <p>You must not use the Platform to:</p>
                <BulletList>
                  <Bullet>Attempt to gain unauthorised access to any part of the Platform, other users&apos; data, or our systems;</Bullet>
                  <Bullet>Upload or transmit viruses, malware, or any code designed to disrupt the Platform;</Bullet>
                  <Bullet>Scrape, data-mine, or systematically extract content or data from the Platform;</Bullet>
                  <Bullet>Use the Platform to build or support a directly competing service;</Bullet>
                  <Bullet>Impersonate any person or entity, or misrepresent your affiliation with any person or entity; or</Bullet>
                  <Bullet>Engage in any activity that is fraudulent, unlawful, or that could damage, disable, or impair the Platform or interfere with any other party&apos;s use of it.</Bullet>
                </BulletList>
                <p>
                  We reserve the right to investigate suspected breaches of this section and to take appropriate action, including suspending or terminating access to the Platform.
                </p>
              </Section>

              <Section number="13" title="External Links">
                <p>
                  The Platform may contain links to third-party websites (for example, a Driver&apos;s operator website, or a payment provider). We do not control and are not responsible for the content, availability, or privacy practices of any third-party site. Use of any linked site is at your own risk and subject to that site&apos;s own terms.
                </p>
              </Section>

              <Section number="14" title="General Terms" icon={Scale}>
                <p><strong className="text-primary-900">14.1 Entire agreement.</strong> These Terms, together with our Privacy Policy and Cookies Policy, constitute the entire agreement between you and us regarding use of the Platform, superseding any prior agreements or understandings.</p>
                <p><strong className="text-primary-900">14.2 Severability.</strong> If any provision of these Terms is found to be invalid or unenforceable by a court, the remaining provisions will continue in full force and effect.</p>
                <p><strong className="text-primary-900">14.3 No waiver.</strong> Our failure to enforce any provision of these Terms at any time does not constitute a waiver of our right to enforce it later.</p>
                <p><strong className="text-primary-900">14.4 Assignment.</strong> You may not assign or transfer your rights under these Terms without our prior written consent. We may assign these Terms in connection with a merger, acquisition, or sale of assets, without affecting your rights under them.</p>
                <p><strong className="text-primary-900">14.5 Governing law and jurisdiction.</strong> These Terms are governed by the laws of England and Wales. Any dispute arising out of or in connection with these Terms or the Platform is subject to the exclusive jurisdiction of the courts of England and Wales.</p>
              </Section>

              <Section number="15" title="Contact Us" icon={Mail}>
                <p>For questions about these Terms, complaints, or general support, please contact us at:</p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href="mailto:support@myairporttaxis.uk"
                    className="inline-flex items-center justify-center gap-3 rounded-2xl bg-primary-900 px-5 py-4 font-bold text-white transition-colors hover:bg-primary-800"
                  >
                    <Mail className="h-5 w-5 text-accent-400" />
                    support@myairporttaxis.uk
                  </a>
                  <a
                    href="tel:+447899001900"
                    className="inline-flex items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 font-bold text-primary-900 transition-colors hover:bg-gray-50"
                  >
                    +44 7899 001900
                  </a>
                </div>
              </Section>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default Terms;
