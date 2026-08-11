import { createElement, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  Briefcase,
  CalendarDays,
  CarFront,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Plane,
  ReceiptText,
  Route,
  Users,
} from "lucide-react";

const formatDate = (value) => {
  if (!value) return "Not provided";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const bookingReference = (booking) =>
  String(booking?._id || "").slice(-8).toUpperCase();

const luggageCount = (luggage = {}) =>
  Number(luggage.largeBags23kg || 0) +
  Number(luggage.smallBags15kg || 0) +
  Number(luggage.shoulderBags || 0);

function Detail({ icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50">
        {createElement(icon, { className: "h-4 w-4 text-accent-500" })}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {label}
        </p>
        <div className="mt-1 break-words font-semibold leading-relaxed text-primary-900">
          {children}
        </div>
      </div>
    </div>
  );
}

const ThankYou = () => {
  const navigate = useNavigate();
  const [confirmation] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("bookingConfirmation") || "null");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!confirmation?.booking) navigate("/", { replace: true });
  }, [confirmation, navigate]);

  if (!confirmation?.booking) return null;

  const { booking, selectedCar } = confirmation;
  const reference = bookingReference(booking);
  const bags = luggageCount(booking.luggage);

  return (
    <div className="min-h-screen bg-surface-light py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[28px] bg-primary-900 shadow-premium sm:rounded-[36px]">
          <div className="relative px-6 py-10 text-center sm:px-10 sm:py-14">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
              <CheckCircle2 className="h-11 w-11 text-accent-500" />
            </div>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.22em] text-accent-500">
              Payment successful
            </p>
            <h1 className="mt-3 text-3xl font-black text-white sm:text-5xl">
              Thank you for your booking
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
              Your airport transfer is confirmed. We have sent the booking details to {booking.customerEmail}.
            </p>
            <div className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-primary-900 shadow-soft sm:text-base">
              <ReceiptText className="h-5 w-5 text-accent-500" />
              Booking reference: {reference}
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px] lg:gap-8">
          <div className="space-y-6">
            <section className="rounded-[28px] border border-gray-100 bg-white p-5 shadow-soft sm:p-8">
              <div className="mb-7 flex items-center gap-3">
                <Route className="h-6 w-6 text-accent-500" />
                <h2 className="text-2xl font-black text-primary-900">Journey details</h2>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <Detail icon={MapPin} label="Pickup">{booking.pickupLocation}</Detail>
                <Detail icon={MapPin} label="Destination">{booking.dropoffLocation}</Detail>
                <Detail icon={CalendarDays} label="Pickup date">{formatDate(booking.pickupDate)}</Detail>
                <Detail icon={Clock3} label="Pickup time">{booking.pickupTime || "Not provided"}</Detail>
              </div>

              {booking.isReturnTrip && booking.returnTrip && (
                <div className="mt-8 border-t border-gray-100 pt-7">
                  <div className="mb-6 flex items-center gap-2">
                    <Plane className="h-5 w-5 text-accent-500" />
                    <h3 className="text-lg font-black text-primary-900">Return journey</h3>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Detail icon={MapPin} label="Return pickup">{booking.returnTrip.pickupLocation}</Detail>
                    <Detail icon={MapPin} label="Return destination">{booking.returnTrip.dropoffLocation}</Detail>
                    <Detail icon={CalendarDays} label="Return date">{formatDate(booking.returnTrip.pickupDate)}</Detail>
                    <Detail icon={Clock3} label="Return time">{booking.returnTrip.pickupTime || "Not provided"}</Detail>
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-[28px] border border-gray-100 bg-white p-5 shadow-soft sm:p-8">
              <h2 className="mb-7 text-2xl font-black text-primary-900">Passenger details</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <Detail icon={Users} label="Lead passenger">{booking.customerName}</Detail>
                <Detail icon={Mail} label="Confirmation email">{booking.customerEmail}</Detail>
                <Detail icon={Users} label="Passengers">{booking.passengers}</Detail>
                <Detail icon={Briefcase} label="Luggage">{bags} {bags === 1 ? "item" : "items"}</Detail>
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-[28px] border border-gray-100 bg-white p-5 shadow-soft sm:p-7 lg:sticky lg:top-28">
            <div className="mb-6 flex items-center gap-3">
              <BadgeCheck className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-black text-primary-900">Order summary</h2>
            </div>

            <div className="space-y-5">
              <Detail icon={CarFront} label="Vehicle">{selectedCar?.name || "Airport taxi"}</Detail>
              <Detail icon={Plane} label="Journey type">{booking.isReturnTrip ? "Return journey" : "One way"}</Detail>
              {booking.flight?.flightNumber && (
                <Detail icon={Plane} label="Flight number">{booking.flight.flightNumber}</Detail>
              )}
              {booking.flight?.meetAndGreet && (
                <div className="rounded-2xl bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-900">
                  Meet &amp; Greet service included
                </div>
              )}
            </div>

            <div className="mt-7 border-t border-gray-100 pt-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total paid</p>
                  <p className="mt-1 text-xs font-medium text-green-700">Payment confirmed</p>
                </div>
                <p className="text-4xl font-black text-accent-500">£{booking.pricing?.totalFare}</p>
              </div>
            </div>

            <Link
              to="/"
              className="mt-7 flex w-full items-center justify-center rounded-xl bg-primary-900 px-5 py-3.5 font-bold text-white transition-colors hover:bg-primary-800"
            >
              Return to home
            </Link>
            <p className="mt-4 text-center text-xs leading-relaxed text-gray-500">
              Need help? Email support@myairporttaxis.uk and quote reference {reference}.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
