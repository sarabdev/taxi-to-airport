import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  Smartphone,
  Briefcase,
  Plane,
  Users,
  CheckCircle,
  Shield,
  ArrowLeft,
  BadgeCheck,
  MapPin,
  Calendar,
  Clock,
  ChevronDown,
  Loader2,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

const TIME_OPTIONS = Array.from({ length: 24 * 12 }, (_, index) => {
  const hours = Math.floor(index / 12);
  const minutes = (index % 12) * 5;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
});

const initialForm = {
  fullName: "",
  email: "",
  mobile: "",
  passengers: 1,

  returnTrip: {
    pickupLocation: "",
    pickupPlaceId: "",
    dropoffLocation: "",
    dropoffPlaceId: "",
    pickupDate: "",
    pickupTime: "",
  },

  luggage: {
    largeBags23kg: 0,
    smallBags15kg: 0,
    shoulderBags: 0,
    extraLargeItemType: "none",
    extraLargeItemNote: "",
  },

  flight: {
    flightNumber: "",
    arrivingFrom: "",
    arrivalDateTime: "",
    meetAndGreet: false,
  },
};

const UserInfo = () => {
  const navigate = useNavigate();

  const returnPickupRef = useRef(null);
  const returnDropoffRef = useRef(null);

  const [form, setForm] = useState(initialForm);

  const [errors, setErrors] = useState({});

  const [bookingData, setBookingData] = useState(null);

  const [pricingLoading, setPricingLoading] = useState(false);

  const [pricingError, setPricingError] = useState("");

  const bookingDataRef = useRef(null);

  useEffect(() => {
    bookingDataRef.current = bookingData;
  }, [bookingData]);

  const handleReturnTripChange = useCallback((updates) => {
    setForm((prev) => ({
      ...prev,
      returnTrip: {
        ...prev.returnTrip,
        ...updates,
      },
    }));
  }, []);

  /* ========================================================= */
  /* LOAD */
  /* ========================================================= */

  useEffect(() => {
    const bookingDataRaw = localStorage.getItem("bookingData");

    if (!bookingDataRaw) {
      navigate("/booking");
      return;
    }

    const parsed = JSON.parse(bookingDataRaw);

    if (!parsed?.selectedCar) {
      navigate("/booking/cars");
      return;
    }

    const defaultReturnTrip = {
      pickupLocation:
        parsed.returnTrip?.pickupLocation || parsed.toLocation || "",
      pickupPlaceId:
        parsed.returnTrip?.pickupPlaceId || parsed.toPlaceId || "",
      dropoffLocation:
        parsed.returnTrip?.dropoffLocation || parsed.fromLocation || "",
      dropoffPlaceId:
        parsed.returnTrip?.dropoffPlaceId || parsed.fromPlaceId || "",
      pickupDate:
        parsed.returnTrip?.pickupDate || parsed.returnDate || "",
      pickupTime:
        parsed.returnTrip?.pickupTime || parsed.returnTime || "",
    };

    const nextForm = {
      ...initialForm,
      ...(parsed.user || {}),
      returnTrip: defaultReturnTrip,
    };

    setForm(nextForm);

    setBookingData({
      ...parsed,
      returnTrip: defaultReturnTrip,
      isReturnTrip: parsed.tripType === "RETURN",
    });
  }, [navigate]);

  useEffect(() => {
    if (!GOOGLE_KEY || bookingData?.tripType !== "RETURN") {
      return;
    }

    const initAutocomplete = () => {
      if (returnPickupRef.current) {
        const pickupAuto = new window.google.maps.places.Autocomplete(
          returnPickupRef.current
        );

        pickupAuto.addListener("place_changed", () => {
          const place = pickupAuto.getPlace();

          handleReturnTripChange({
            pickupLocation: place.formatted_address || "",
            pickupPlaceId: place.place_id || "",
          });
        });
      }

      if (returnDropoffRef.current) {
        const dropoffAuto = new window.google.maps.places.Autocomplete(
          returnDropoffRef.current
        );

        dropoffAuto.addListener("place_changed", () => {
          const place = dropoffAuto.getPlace();

          handleReturnTripChange({
            dropoffLocation: place.formatted_address || "",
            dropoffPlaceId: place.place_id || "",
          });
        });
      }
    };

    if (!window.google) {
      const existingScript = document.querySelector(
        `script[src*="maps.googleapis.com/maps/api/js"]`
      );

      if (existingScript) {
        existingScript.addEventListener("load", initAutocomplete, {
          once: true,
        });
      } else {
        const script = document.createElement("script");

        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&libraries=places`;
        script.async = true;
        script.onload = initAutocomplete;

        document.body.appendChild(script);
      }
    } else {
      initAutocomplete();
    }
  }, [bookingData?.tripType, handleReturnTripChange]);

  useEffect(() => {
    const currentBooking = bookingDataRef.current;

    if (!currentBooking || currentBooking.tripType !== "RETURN") return;

    const { pickupPlaceId, dropoffPlaceId } = form.returnTrip;

    if (!pickupPlaceId || !dropoffPlaceId) return;

    const controller = new AbortController();

    async function refreshReturnPricing() {
      setPricingLoading(true);
      setPricingError("");

      try {
        const res = await fetch(`${API_BASE}/api/pricing/calculate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            carId: currentBooking.selectedCar?._id,
            fromPlaceId: currentBooking.fromPlaceId,
            toPlaceId: currentBooking.toPlaceId,
            returnFromPlaceId: pickupPlaceId,
            returnToPlaceId: dropoffPlaceId,
            isReturnTrip: true,
            couponCode: currentBooking.pricing?.appliedCoupon || null,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("Unable to update return fare");
        }

        const result = await res.json();
        const originalRoundTripFare = Number(
          (
            result.breakdown.baseFare +
            result.breakdown.returnBaseFare
          ).toFixed(2)
        );

        const updatedBooking = {
          ...currentBooking,
          returnTrip: form.returnTrip,
          isReturnTrip: true,
          pricing: {
            ...currentBooking.pricing,
            ...result.breakdown,
            originalRoundTripFare,
            returnDiscountAmount: result.breakdown.carDiscountAmount,
            totalFare: result.totalFare,
            appliedCoupon: result.appliedCoupon,
            type: "RETURN",
          },
        };

        bookingDataRef.current = updatedBooking;
        setBookingData(updatedBooking);
        localStorage.setItem("bookingData", JSON.stringify(updatedBooking));
      } catch (err) {
        if (err.name !== "AbortError") {
          setPricingError(err.message || "Unable to update return fare");
        }
      } finally {
        setPricingLoading(false);
      }
    }

    refreshReturnPricing();

    return () => controller.abort();
  }, [
    form.returnTrip,
  ]);

  /* ========================================================= */
  /* HELPERS */
  /* ========================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedChange = (path, value) => {
    setForm((prev) => {
      const updated = { ...prev };

      let ref = updated;

      for (let i = 0; i < path.length - 1; i++) {
        ref = ref[path[i]];
      }

      ref[path[path.length - 1]] = value;

      return updated;
    });
  };

  const handleArrivalDateTimeChange = (part, value) => {
    setForm((prev) => {
      const [currentDate = "", currentTime = ""] =
        prev.flight.arrivalDateTime?.split("T") || [];

      const nextDate = part === "date" ? value : currentDate;
      const nextTime = part === "time" ? value : currentTime;

      return {
        ...prev,
        flight: {
          ...prev.flight,
          arrivalDateTime: nextDate || nextTime ? `${nextDate}T${nextTime}` : "",
        },
      };
    });
  };

  const validate = () => {
    const err = {};

    if (!form.fullName.trim()) err.fullName = "Required";

    if (!form.mobile.trim()) err.mobile = "Required";

    if (!form.email.trim()) err.email = "Required";

    if (!form.flight.flightNumber.trim())
      err.flightNumber = "Required";

    if (!form.flight.arrivingFrom.trim())
      err.arrivingFrom = "Required";

    const [arrivalDate = "", arrivalTime = ""] =
      form.flight.arrivalDateTime?.split("T") || [];

    if (!arrivalDate || !arrivalTime)
      err.arrivalDateTime = "Required";

    if (
      form.luggage.extraLargeItemType === "other" &&
      !form.luggage.extraLargeItemNote.trim()
    ) {
      err.extraLargeItemNote = "Please specify the item";
    }

    if (bookingData?.tripType === "RETURN") {
      if (!form.returnTrip.pickupLocation.trim()) {
        err.returnPickupLocation = "Required";
      }

      if (!form.returnTrip.dropoffLocation.trim()) {
        err.returnDropoffLocation = "Required";
      }

      if (!form.returnTrip.pickupPlaceId || !form.returnTrip.dropoffPlaceId) {
        err.returnRoute = "Please choose return locations from the address suggestions";
      }

      if (!form.returnTrip.pickupDate) {
        err.returnPickupDate = "Required";
      }

      if (!form.returnTrip.pickupTime) {
        err.returnPickupTime = "Required";
      }
    }

    if (
      form.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      err.email = "Enter a valid email";
    }

    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const err = validate();

    setErrors(err);

    if (Object.keys(err).length) return;

    const existing = JSON.parse(localStorage.getItem("bookingData") || "{}");
    const { returnTrip, ...userForm } = form;

    localStorage.setItem(
      "bookingData",
      JSON.stringify({
        ...existing,
        returnTrip,
        isReturnTrip: existing.tripType === "RETURN",
        user: userForm,
      })
    );

    navigate("/booking/payment");
  };

  const renderError = (field) =>
    errors[field] ? (
      <p className="mt-2 text-sm text-red-600">
        {errors[field]}
      </p>
    ) : null;

  const numberOptions = [0, 1, 2, 3, 4];

  if (!bookingData) return null;

  return (
    <div className="min-h-screen overflow-hidden bg-surface-light py-6 sm:py-8 md:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ========================================================= */}
        {/* HEADER */}
        {/* ========================================================= */}

        <div className="mb-8 sm:mb-10">
          <button
            onClick={() => navigate("/booking/cars")}
            className="mb-5 inline-flex items-center text-sm font-semibold text-primary-900 transition-colors hover:text-accent-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4 shrink-0" />

            <span className="leading-none">
              Back To Vehicle Selection
            </span>
          </button>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-900 sm:mb-5">
                <BadgeCheck className="h-4 w-4 text-accent-500" />

                Step 3 Of 4
              </div>

              <h1 className="text-3xl font-black leading-tight text-primary-900 sm:text-4xl md:text-5xl">
                Passenger Information
              </h1>

              <p className="mt-3 text-base text-gray-600 sm:mt-4 sm:text-lg">
                Complete your booking details
              </p>
            </div>

            {/* Summary */}
            <div className="w-full rounded-[24px] border border-gray-100 bg-white px-5 py-5 shadow-soft sm:rounded-[28px] sm:px-8 sm:py-6 lg:w-auto lg:min-w-[300px]">
              <p className="mb-2 text-sm text-gray-500">
                Selected Vehicle
              </p>

              <h3 className="break-words text-xl font-black text-primary-900 sm:text-2xl">
                {bookingData.selectedCar?.name}
              </h3>

              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                {bookingData.tripType === "RETURN"
                  ? "Return Journey"
                  : "One Way Journey"}
              </p>

              <div className="mt-4 text-3xl font-black text-accent-500">
                £{bookingData.pricing?.totalFare}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MAIN GRID */}
        {/* ========================================================= */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
          {/* ========================================================= */}
          {/* FORM */}
          {/* ========================================================= */}

          <div className="xl:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-premium sm:rounded-[36px]"
            >
              {/* ========================================================= */}
              {/* TOP HEADER */}
              {/* ========================================================= */}

              <div className="bg-primary-900 px-5 py-6 sm:px-8 sm:py-8 md:px-10">
                <h2 className="text-2xl font-black text-white sm:text-3xl">
                  Booking Information
                </h2>

                <p className="mt-2 text-base text-gray-300 sm:mt-3 sm:text-lg">
                  Passenger, luggage and flight details
                </p>
              </div>

              {/* ========================================================= */}
              {/* CONTENT */}
              {/* ========================================================= */}

              <div className="p-5 sm:p-6 md:p-10">
                {/* ========================================================= */}
                {/* PASSENGER */}
                {/* ========================================================= */}

                <section>
                  {/* Section Header */}
                  <div className="mb-6 flex items-start gap-4 sm:mb-8 sm:items-center">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-900 text-accent-400 sm:h-14 sm:w-14">
                      <User className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-xl font-black text-primary-900 sm:text-2xl">
                        Passenger Details
                      </h3>

                      <p className="mt-1 text-sm text-gray-500 sm:text-base">
                        Main passenger information
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5 sm:space-y-6">
                    {/* Name */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700 sm:mb-3">
                        Full Name *
                      </label>

                      <div className="relative">
                        <User className="icon-left" />

                        <input
                          name="fullName"
                          value={form.fullName}
                          onChange={handleChange}
                          className="input-field h-12 border-gray-200 pl-11 focus:ring-primary-900 sm:h-14"
                          placeholder="John Doe"
                        />
                      </div>

                      {renderError("fullName")}
                    </div>

                    {/* Mobile + Email */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700 sm:mb-3">
                          Mobile Number *
                        </label>

                        <div className="relative">
                          <Smartphone className="icon-left" />

                          <input
                            name="mobile"
                            value={form.mobile}
                            onChange={handleChange}
                            className="input-field h-12 border-gray-200 pl-11 focus:ring-primary-900 sm:h-14"
                            placeholder="+44 7000 000000"
                          />
                        </div>

                        {renderError("mobile")}
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700 sm:mb-3">
                          Email Address *
                        </label>

                        <div className="relative">
                          <Mail className="icon-left" />

                          <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="input-field h-12 border-gray-200 pl-11 focus:ring-primary-900 sm:h-14"
                            placeholder="you@example.com"
                          />
                        </div>

                        {renderError("email")}
                      </div>
                    </div>

                    {/* Passengers */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700 sm:mb-3">
                        Number Of Passengers
                      </label>

                      <div className="select-wrapper">
                        <select
                          className="select-field h-12 border-gray-200 focus:ring-primary-900 sm:h-14"
                          value={form.passengers}
                          onChange={(e) =>
                            handleNestedChange(
                              ["passengers"],
                              Number(e.target.value)
                            )
                          }
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <option
                              key={n}
                              value={n}
                            >
                              {n}
                            </option>
                          ))}
                        </select>

                        <span className="select-icon">
                          ⌄
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {bookingData.tripType === "RETURN" && (
                  <>
                    <div className="my-8 border-t border-gray-100 sm:my-10 md:my-12"></div>

                    <section>
                      <div className="mb-6 flex items-start gap-4 sm:mb-8 sm:items-center">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-900 text-accent-400 sm:h-14 sm:w-14">
                          <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-xl font-black text-primary-900 sm:text-2xl">
                            Return Journey
                          </h3>

                          <p className="mt-1 text-sm text-gray-500 sm:text-base">
                            Return route is pre-filled from your destination back to pickup
                          </p>
                        </div>
                      </div>

                      <div className="space-y-5 sm:space-y-6">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-gray-700 sm:mb-3">
                            Return Pickup Location *
                          </label>

                          <div className="relative">
                            <MapPin className="icon-left" />

                            <input
                              ref={returnPickupRef}
                              value={form.returnTrip.pickupLocation}
                              onChange={(e) =>
                                handleReturnTripChange({
                                  pickupLocation: e.target.value,
                                  pickupPlaceId: "",
                                })
                              }
                              className="input-field h-12 border-gray-200 pl-11 focus:ring-primary-900 sm:h-14"
                              placeholder="Return pickup address"
                              autoComplete="off"
                            />
                          </div>

                          {renderError("returnPickupLocation")}
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-gray-700 sm:mb-3">
                            Return Dropoff Location *
                          </label>

                          <div className="relative">
                            <MapPin className="icon-left" />

                            <input
                              ref={returnDropoffRef}
                              value={form.returnTrip.dropoffLocation}
                              onChange={(e) =>
                                handleReturnTripChange({
                                  dropoffLocation: e.target.value,
                                  dropoffPlaceId: "",
                                })
                              }
                              className="input-field h-12 border-gray-200 pl-11 focus:ring-primary-900 sm:h-14"
                              placeholder="Return dropoff address"
                              autoComplete="off"
                            />
                          </div>

                          {renderError("returnDropoffLocation")}
                          {renderError("returnRoute")}
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-gray-700 sm:mb-3">
                            <Calendar className="mr-2 inline h-4 w-4 text-primary-900" />
                            Return Date & Time *
                          </label>

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                            <div className="relative">
                              <input
                                type="date"
                                value={form.returnTrip.pickupDate}
                                onChange={(e) =>
                                  handleReturnTripChange({
                                    pickupDate: e.target.value,
                                  })
                                }
                                onClick={(e) => e.currentTarget.showPicker?.()}
                                min={bookingData.pickupDate}
                                className={`peer input-field ios-date-input min-h-12 w-full cursor-pointer border-gray-200 focus:ring-primary-900 sm:min-h-14 ${
                                  form.returnTrip.pickupDate
                                    ? "text-black"
                                    : "text-transparent focus:text-gray-400"
                                }`}
                              />

                              {!form.returnTrip.pickupDate && (
                                <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-sm text-gray-400 peer-focus:hidden sm:text-base">
                                  Return date
                                </span>
                              )}
                            </div>

                            <TimeSelect
                              value={form.returnTrip.pickupTime}
                              placeholder="Return time"
                              onChange={(pickupTime) =>
                                handleReturnTripChange({ pickupTime })
                              }
                            />
                          </div>

                          {renderError("returnPickupDate")}
                          {renderError("returnPickupTime")}
                        </div>

                        <div className="rounded-2xl border border-primary-100 bg-primary-50 p-4 text-sm font-semibold text-primary-900 sm:p-5">
                          {pricingLoading ? (
                            <span className="inline-flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Updating return fare...
                            </span>
                          ) : pricingError ? (
                            <span className="text-red-600">{pricingError}</span>
                          ) : (
                            <span>
                              Updated total fare: £{bookingData.pricing?.totalFare}
                            </span>
                          )}
                        </div>
                      </div>
                    </section>
                  </>
                )}

                {/* DIVIDER */}
                <div className="my-8 border-t border-gray-100 sm:my-10 md:my-12"></div>

                {/* ========================================================= */}
                {/* LUGGAGE */}
                {/* ========================================================= */}

                <section>
                  {/* Header */}
                  <div className="mb-6 flex items-start gap-4 sm:mb-8 sm:items-center">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-900 text-accent-400 sm:h-14 sm:w-14">
                      <Briefcase className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-xl font-black text-primary-900 sm:text-2xl">
                        Luggage Information
                      </h3>

                      <p className="mt-1 text-sm text-gray-500 sm:text-base">
                        Help us prepare the right vehicle
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5 sm:space-y-6">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                      {/* Large */}
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700 sm:mb-3">
                          Large Bags (23kg)
                        </label>

                        <div className="relative">
                          <select
                            className="h-12 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 pr-10 font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-900 sm:h-14"
                            value={form.luggage.largeBags23kg}
                            onChange={(e) =>
                              handleNestedChange(
                                ["luggage", "largeBags23kg"],
                                Number(e.target.value)
                              )
                            }
                          >
                            {numberOptions.map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>

                          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <svg
                              className="h-4 w-4 text-primary-900"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Small */}
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700 sm:mb-3">
                          Small Bags (15kg)
                        </label>

                        <div className="relative">
                          <select
                            className="h-12 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 pr-10 font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-900 sm:h-14"
                            value={form.luggage.smallBags15kg}
                            onChange={(e) =>
                              handleNestedChange(
                                ["luggage", "smallBags15kg"],
                                Number(e.target.value)
                              )
                            }
                          >
                            {numberOptions.map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>

                          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <svg
                              className="h-4 w-4 text-primary-900"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Shoulder / Handcarry */}
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700 sm:mb-3">
                          Shoulder Bag / Handcarry
                        </label>

                        <div className="relative">
                          <select
                            className="h-12 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 pr-10 font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-900 sm:h-14"
                            value={form.luggage.shoulderBags}
                            onChange={(e) =>
                              handleNestedChange(
                                ["luggage", "shoulderBags"],
                                Number(e.target.value)
                              )
                            }
                          >
                            {numberOptions.map((n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            ))}
                          </select>

                          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <svg
                              className="h-4 w-4 text-primary-900"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Extra Large */}
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700 sm:mb-3">
                          Extra Large Item
                        </label>

                        <div className="relative">
                          <select
                            className="h-12 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 pr-10 font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-900 sm:h-14"
                            value={form.luggage.extraLargeItemType}
                            onChange={(e) =>
                              handleNestedChange(
                                ["luggage", "extraLargeItemType"],
                                e.target.value
                              )
                            }
                          >
                            <option value="none">None</option>
                            <option value="extra_large_bag_35kg">
                              Extra Large Bag (35kg)
                            </option>
                            <option value="wheelchair">Wheelchair</option>
                            <option value="pram">Pram</option>
                            <option value="golf_bag">Golf Bag</option>
                            <option value="other">Other</option>
                          </select>

                          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <svg
                              className="h-4 w-4 text-primary-900"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>

                        {form.luggage.extraLargeItemType === "other" && (
                          <div className="mt-4">
                            <input
                              className="input-field h-12 border-gray-200 focus:ring-primary-900 sm:h-14"
                              placeholder="Please specify"
                              value={form.luggage.extraLargeItemNote}
                              onChange={(e) =>
                                handleNestedChange(
                                  ["luggage", "extraLargeItemNote"],
                                  e.target.value
                                )
                              }
                            />
                            {renderError("extraLargeItemNote")}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                {/* DIVIDER */}
                <div className="my-8 border-t border-gray-100 sm:my-10 md:my-12"></div>

                {/* ========================================================= */}
                {/* FLIGHT */}
                {/* ========================================================= */}

                <section>
                  {/* Header */}
                  <div className="mb-6 flex items-start gap-4 sm:mb-8 sm:items-center">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-900 text-accent-400 sm:h-14 sm:w-14">
                      <Plane className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-xl font-black text-primary-900 sm:text-2xl">
                        Flight Information
                      </h3>

                      <p className="mt-1 text-sm text-gray-500 sm:text-base">
                        Arrival and airport details
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5 sm:space-y-6">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                      {/* Flight */}
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700 sm:mb-3">
                          Flight Number *
                        </label>

                        <input
                          className="input-field h-12 border-gray-200 focus:ring-primary-900 sm:h-14"
                          value={form.flight.flightNumber}
                          onChange={(e) =>
                            handleNestedChange(
                              ["flight", "flightNumber"],
                              e.target.value
                            )
                          }
                        />

                        {renderError("flightNumber")}
                      </div>

                      {/* From */}
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700 sm:mb-3">
                          Arriving From *
                        </label>

                        <input
                          className="input-field h-12 border-gray-200 focus:ring-primary-900 sm:h-14"
                          value={form.flight.arrivingFrom}
                          onChange={(e) =>
                            handleNestedChange(
                              ["flight", "arrivingFrom"],
                              e.target.value
                            )
                          }
                        />

                        {renderError("arrivingFrom")}
                      </div>
                    </div>

                    {/* Date */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700 sm:mb-3">
                        <Calendar className="mr-2 inline h-4 w-4 text-primary-900" />
                        Arrival Date & Time *
                      </label>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                        <div className="relative">
                          <input
                            type="date"
                            className={`peer input-field ios-date-input min-h-12 w-full cursor-pointer border-gray-200 focus:ring-primary-900 sm:min-h-14 ${
                              form.flight.arrivalDateTime?.split("T")[0]
                                ? "text-black"
                                : "text-transparent focus:text-gray-400"
                            }`}
                            value={form.flight.arrivalDateTime?.split("T")[0] || ""}
                            onChange={(e) =>
                              handleArrivalDateTimeChange("date", e.target.value)
                            }
                            onClick={(e) => e.currentTarget.showPicker?.()}
                          />

                          {!form.flight.arrivalDateTime?.split("T")[0] && (
                            <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-sm text-gray-400 peer-focus:hidden sm:text-base">
                              Arrival date
                            </span>
                          )}
                        </div>

                        <TimeSelect
                          value={form.flight.arrivalDateTime?.split("T")[1] || ""}
                          placeholder="Arrival time"
                          onChange={(value) =>
                            handleArrivalDateTimeChange("time", value)
                          }
                        />
                      </div>

                      {renderError("arrivalDateTime")}
                    </div>

                    {/* Meet */}
                    <div className="rounded-2xl border border-primary-100 bg-primary-50 p-4 sm:p-5">
                      <label className="flex cursor-pointer items-start gap-3 sm:gap-4">
                        <input
                          type="checkbox"
                          className="mt-1 h-5 w-5 shrink-0 rounded border-gray-300 text-primary-900 focus:ring-primary-900"
                          checked={form.flight.meetAndGreet}
                          onChange={(e) =>
                            handleNestedChange(
                              ["flight", "meetAndGreet"],
                              e.target.checked
                            )
                          }
                        />

                        <div>
                          <div className="font-bold text-primary-900">
                            Meet & Greet Service
                          </div>

                          <p className="mt-1 text-sm text-gray-600">
                            Driver will meet you inside the
                            airport arrivals terminal.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </section>

                {/* BUTTON */}
                <div className="pt-8 sm:pt-10 md:pt-12">
                  <button
                    disabled={pricingLoading}
                    className="w-full rounded-2xl bg-primary-900 px-6 py-4 text-sm font-bold text-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:bg-primary-800 hover:shadow-premium disabled:cursor-not-allowed disabled:opacity-60 sm:px-8 sm:py-5 sm:text-base"
                  >
                    Continue To Payment
                  </button>
                </div>
              </div>
            </form>
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
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="mb-1 text-sm text-gray-500">
                      Vehicle
                    </p>

                    <p className="break-words font-bold text-primary-900">
                      {bookingData.selectedCar?.name}
                    </p>
                  </div>

                  <Users className="h-5 w-5 shrink-0 text-accent-500" />
                </div>

                <div className="border-t border-gray-100"></div>

                {bookingData.tripType === "RETURN" && (
                  <>
                    <div>
                      <p className="mb-2 text-sm text-gray-500">
                        Return Pickup
                      </p>

                      <p className="break-words font-semibold leading-relaxed text-primary-900">
                        {form.returnTrip.pickupLocation}
                      </p>
                    </div>

                    <div>
                      <p className="mb-2 text-sm text-gray-500">
                        Return Dropoff
                      </p>

                      <p className="break-words font-semibold leading-relaxed text-primary-900">
                        {form.returnTrip.dropoffLocation}
                      </p>
                    </div>

                    <div className="border-t border-gray-100"></div>
                  </>
                )}

                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="mb-1 text-sm text-gray-500">
                      Journey Type
                    </p>

                    <p className="font-bold text-primary-900">
                      {bookingData.tripType === "RETURN"
                        ? "Return Journey"
                        : "One Way"}
                    </p>
                  </div>

                  <Plane className="h-5 w-5 shrink-0 text-accent-500" />
                </div>

                <div className="border-t border-gray-100"></div>

                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="mb-1 text-sm text-gray-500">
                      Total Fare
                    </p>

                    <div className="break-words text-3xl font-black text-accent-500 sm:text-4xl">
                      £{bookingData.pricing?.totalFare}
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust */}
              <div className="mt-8 rounded-2xl border border-primary-100 bg-primary-50 p-5 sm:mt-10 sm:p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Shield className="h-6 w-6 text-accent-500" />

                  <h4 className="font-bold text-primary-900">
                    Safe & Secure Booking
                  </h4>
                </div>

                <div className="space-y-3">
                  {[
                    "Professional licensed chauffeurs",
                    "Secure payment processing",
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

function TimeSelect({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <Clock className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400 sm:h-5 sm:w-5" />

      <select
        aria-label={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`input-field min-h-12 w-full cursor-pointer appearance-none border-gray-200 bg-white pl-11 pr-11 focus:ring-primary-900 sm:min-h-14 ${
          value ? "text-gray-900" : "text-gray-400"
        }`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {TIME_OPTIONS.map((time) => (
          <option key={time} value={time} className="text-gray-900">
            {time}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
    </div>
  );
}

export default UserInfo;
