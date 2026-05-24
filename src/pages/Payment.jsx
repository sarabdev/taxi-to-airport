import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  CreditCard,
  Lock,
  CheckCircle,
  Shield,
  BadgeCheck,
  Plane,
  Users,
  Briefcase,
} from "lucide-react";

import {
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5000";

const Payment = () => {
  const navigate = useNavigate();

  const stripe = useStripe();

  const elements = useElements();

  const [bookingData, setBookingData] = useState(null);

  const [processing, setProcessing] = useState(false);

  const [completed, setCompleted] = useState(false);

  const [error, setError] = useState(null);

  /* ========================================================= */
  /* LOAD */
  /* ========================================================= */

  useEffect(() => {
    const data = localStorage.getItem("bookingData");

    if (!data) {
      navigate("/");
      return;
    }

    const booking = JSON.parse(data);

    if (!booking.selectedCar || !booking.pricing?.totalFare) {
      navigate("/booking/cars");
      return;
    }

    setBookingData(booking);
  }, [navigate]);

  /* ========================================================= */
  /* SUBMIT */
  /* ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);

    setError(null);

    try {
      /* 1️⃣ Create payment intent */
      const intentRes = await fetch(
        `${API_BASE}/api/payments/create-intent`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            amount: bookingData.pricing.totalFare,
            currency: "gbp",
          }),
        }
      );

      const { clientSecret } = await intentRes.json();

      /* 2️⃣ Confirm card payment */
      const result = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (result.error) {
        setError(result.error.message);

        setProcessing(false);

        return;
      }

      /* 3️⃣ Create booking AFTER payment success */
      if (result.paymentIntent.status === "succeeded") {
        await fetch(`${API_BASE}/api/bookings`, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            customerName: bookingData.user.fullName,
            customerEmail: bookingData.user.email,
            customerPhone: bookingData.user.mobile,

            pickupLocation: bookingData.fromLocation,
            dropoffLocation: bookingData.toLocation,

            carId: bookingData.selectedCar._id,
            distanceMiles:
              bookingData.pricing.distanceMiles,

            isReturnTrip:
              bookingData.isReturnTrip,

            couponCode:
              bookingData.pricing?.appliedCoupon ||
              null,

            passengers:
              bookingData.user.passengers,

            luggage: {
              largeBags23kg:
                bookingData.user.luggage
                  .largeBags23kg,

              smallBags15kg:
                bookingData.user.luggage
                  .smallBags15kg,
              shoulderBags:
                bookingData.user.luggage
                  .shoulderBags,

              extraLargeItemType:
                bookingData.user.luggage
                  .extraLargeItemType,

              extraLargeItemNote:
                bookingData.user.luggage
                  .extraLargeItemNote || "",
            },

            flight: {
              flightNumber:
                bookingData.user.flight
                  .flightNumber,

              arrivingFrom:
                bookingData.user.flight
                  .arrivingFrom,

              arrivalDateTime:
                bookingData.user.flight
                  .arrivalDateTime,

              meetAndGreet:
                bookingData.user.flight
                  .meetAndGreet,
            },
          }),
        });

        setCompleted(true);

        setTimeout(() => {
          localStorage.removeItem("bookingData");

          navigate("/");
        }, 3000);
      }
    } catch (err) {
      setError(
        "Payment failed. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  if (!bookingData) return null;

  /* ========================================================= */
  /* SUCCESS */
  /* ========================================================= */

  if (completed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-light px-4 py-10">
        <div className="w-full max-w-lg rounded-[28px] border border-gray-100 bg-white p-6 text-center shadow-premium sm:rounded-[36px] sm:p-10 md:p-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 sm:mb-8 sm:h-24 sm:w-24">
            <CheckCircle className="h-12 w-12 text-green-600 sm:h-14 sm:w-14" />
          </div>

          <h2 className="mb-4 text-3xl font-black text-primary-900 sm:mb-5 sm:text-4xl">
            Booking Confirmed
          </h2>

          <p className="text-base leading-relaxed text-gray-600 sm:text-lg">
            Payment completed successfully.
            Your airport transfer has been booked.
          </p>

          <div className="mt-8 inline-flex max-w-full items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 sm:mt-10 sm:px-5 sm:text-base">
            <BadgeCheck className="h-5 w-5 shrink-0" />

            Redirecting shortly...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-surface-light py-6 sm:py-8 md:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ========================================================= */}
        {/* HEADER */}
        {/* ========================================================= */}

        <div className="mb-8 sm:mb-10">
          <button
            onClick={() => navigate("/booking/info")}
            className="mb-5 inline-flex items-center text-sm font-semibold text-primary-900 transition-colors hover:text-accent-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4 shrink-0" />

            <span className="leading-none">
              Back To Passenger Information
            </span>
          </button>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-900 sm:mb-5">
                <BadgeCheck className="h-4 w-4 text-accent-500" />

                Final Step
              </div>

              <h1 className="text-3xl font-black leading-tight text-primary-900 sm:text-4xl md:text-5xl">
                Secure Payment
              </h1>

              <p className="mt-3 text-base text-gray-600 sm:mt-4 sm:text-lg">
                Complete your booking securely with Stripe
              </p>
            </div>

            {/* Total Card */}
            <div className="w-full rounded-[24px] border border-gray-100 bg-white px-5 py-5 shadow-soft sm:rounded-[28px] sm:px-8 sm:py-6 lg:w-auto lg:min-w-[300px]">
              <p className="mb-2 text-sm text-gray-500">
                Total Amount
              </p>

              <div className="break-words text-4xl font-black text-accent-500 sm:text-5xl">
                £{bookingData.pricing.totalFare}
              </div>

              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                Secure encrypted payment
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* GRID */}
        {/* ========================================================= */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
          {/* ========================================================= */}
          {/* PAYMENT */}
          {/* ========================================================= */}

          <div className="xl:col-span-2">
            <div className="overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-premium sm:rounded-[36px]">
              {/* Header */}
              <div className="bg-primary-900 px-5 py-6 sm:px-8 sm:py-8 md:px-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                  <div>
                    <h2 className="text-2xl font-black text-white sm:text-3xl">
                      Payment Details
                    </h2>

                    <p className="mt-2 text-base text-gray-300 sm:mt-3 sm:text-lg">
                      Your payment is fully secured
                    </p>
                  </div>

                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                    <Lock className="h-4 w-4 text-accent-400" />

                    SSL Protected
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6 md:p-10">
                {/* Card Option */}
                <div className="mb-6 rounded-[24px] border border-gray-100 bg-primary-50 p-5 sm:mb-8 sm:rounded-[28px] sm:p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-900 text-accent-400 sm:h-14 sm:w-14">
                      <CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-primary-900 sm:text-xl">
                        Credit / Debit Card
                      </h3>

                      <p className="mt-1 text-sm text-gray-500 sm:text-base">
                        Visa, Mastercard, American Express
                      </p>
                    </div>
                  </div>
                </div>

                {/* FORM */}
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 sm:space-y-8"
                >
                  {/* Stripe */}
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-gray-700 sm:mb-4">
                      Card Details
                    </label>

                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                      <div className="px-4 py-5 sm:px-5">
                        <CardElement
                          options={{
                            hidePostalCode: true,

                            style: {
                              base: {
                                fontSize: "16px",
                                color: "#111827",
                                fontFamily: "Inter, sans-serif",

                                "::placeholder": {
                                  color: "#9ca3af",
                                },
                              },

                              invalid: {
                                color: "#dc2626",
                              },
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700 sm:px-5 sm:text-base">
                      {error}
                    </div>
                  )}

                  {/* Total */}
                  <div className="rounded-[24px] border border-gray-100 bg-gray-50 p-5 sm:rounded-[28px] sm:p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="mb-2 text-gray-500">
                          Total Amount
                        </p>

                        <div className="break-words text-3xl font-black text-primary-900 sm:text-4xl">
                          £
                          {
                            bookingData.pricing
                              .totalFare
                          }
                        </div>
                      </div>

                      <Shield className="h-9 w-9 shrink-0 text-accent-500 sm:h-10 sm:w-10" />
                    </div>
                  </div>

                  {/* Button */}
                  <button
                    type="submit"
                    disabled={
                      processing || !stripe
                    }
                    className="w-full rounded-2xl bg-primary-900 px-6 py-4 text-sm font-bold text-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:bg-primary-800 hover:shadow-premium disabled:cursor-not-allowed disabled:opacity-50 sm:px-8 sm:py-5 sm:text-base"
                  >
                    {processing
                      ? "Processing Payment..."
                      : `Pay £${bookingData.pricing.totalFare}`}
                  </button>

                  {/* Stripe */}
                  <div className="flex flex-wrap items-center justify-center gap-2 text-center text-sm text-gray-500">
                    <Lock className="h-4 w-4 shrink-0" />

                    Payments securely processed by Stripe
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SIDEBAR */}
          {/* ========================================================= */}

          <div>
            <div className="rounded-[28px] border border-gray-100 bg-white p-5 shadow-soft sm:rounded-[32px] sm:p-8 xl:sticky xl:top-28">
              <h3 className="mb-6 text-2xl font-black text-primary-900 sm:mb-8">
                Booking Summary
              </h3>

              <div className="space-y-5 sm:space-y-6">
                {/* Vehicle */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="mb-1 text-sm text-gray-500">
                      Vehicle
                    </p>

                    <p className="break-words font-bold text-primary-900">
                      {
                        bookingData.selectedCar
                          .name
                      }
                    </p>
                  </div>

                  <Users className="h-5 w-5 shrink-0 text-accent-500" />
                </div>

                <div className="border-t border-gray-100"></div>

                {/* From */}
                <div>
                  <p className="mb-2 text-sm text-gray-500">
                    Pickup
                  </p>

                  <p className="break-words font-semibold leading-relaxed text-primary-900">
                    {bookingData.fromLocation}
                  </p>
                </div>

                <div className="border-t border-gray-100"></div>

                {/* To */}
                <div>
                  <p className="mb-2 text-sm text-gray-500">
                    Destination
                  </p>

                  <p className="break-words font-semibold leading-relaxed text-primary-900">
                    {bookingData.toLocation}
                  </p>
                </div>

                <div className="border-t border-gray-100"></div>

                {/* Journey */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="mb-1 text-sm text-gray-500">
                      Journey Type
                    </p>

                    <p className="font-bold text-primary-900">
                      {bookingData.tripType ===
                        "RETURN"
                        ? "Return Journey"
                        : "One Way"}
                    </p>
                  </div>

                  <Plane className="h-5 w-5 shrink-0 text-accent-500" />
                </div>

                <div className="border-t border-gray-100"></div>

                {/* Passengers */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="mb-1 text-sm text-gray-500">
                      Passengers
                    </p>

                    <p className="font-bold text-primary-900">
                      {
                        bookingData.user
                          .passengers
                      }
                    </p>
                  </div>

                  <Users className="h-5 w-5 shrink-0 text-accent-500" />
                </div>

                <div className="border-t border-gray-100"></div>

                {/* Luggage */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="mb-1 text-sm text-gray-500">
                      Luggage
                    </p>

                    <p className="font-bold text-primary-900">
                      {bookingData.user
                        .luggage
                        .largeBags23kg +
                        bookingData.user
                          .luggage
                          .smallBags15kg}
                    </p>
                  </div>

                  <Briefcase className="h-5 w-5 shrink-0 text-accent-500" />
                </div>

                {/* Total */}
                <div className="border-t border-gray-100 pt-5 sm:pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-2 text-sm text-gray-500">
                        Total Fare
                      </p>

                      <div className="text-3xl font-black text-accent-500 sm:text-4xl">
                        £
                        {
                          bookingData.pricing
                            .totalFare
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust */}
              <div className="mt-8 rounded-2xl border border-primary-100 bg-primary-50 p-5 sm:mt-10 sm:p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Shield className="h-6 w-6 text-accent-500" />

                  <h4 className="font-bold text-primary-900">
                    Secure Checkout
                  </h4>
                </div>

                <div className="space-y-3">
                  {[
                    "256-bit SSL encryption",
                    "Secure Stripe payments",
                    "No card data stored",
                    "24/7 customer support",
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />

                      <span className="text-sm text-gray-700">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;