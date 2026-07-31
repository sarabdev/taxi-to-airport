import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Users,
  Briefcase,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

/* ========================================================= */
/* LOCAL CAR IMAGES */
/* ========================================================= */

import saloonCar from "../assets/cars/saloon_car.webp";
import executiveCar from "../assets/cars/executive_saloon.png";
import estateCar from "../assets/cars/estate_car.webp";
import peopleCarrier from "../assets/cars/people_carrier_doc.png";
import executivePeopleCarrier from "../assets/cars/executive_people_car.png";
import minibus16 from "../assets/cars/minibus_16.png";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

/* ========================================================= */
/* VEHICLE IMAGES */
/* ========================================================= */

const vehicleImages = {
  saloon: saloonCar,

  executive: executiveCar,

  estate: estateCar,

  peoplecarrier: peopleCarrier,

  executivepeoplecarrier: executivePeopleCarrier,

  minibus: minibus16,
};

/* ========================================================= */
/* VEHICLE DETAILS */
/* ========================================================= */

const vehicleDetails = [
  {
    key: "saloon",

    title: "Saloon Car",

    description:
      "Ford Mondeo, VW Passat or similar. These can accommodate up to 3 passengers plus 3 standard suitcases (23kg max), or 4 passengers plus hand luggage.",

    image: vehicleImages.saloon,
  },

  {
    key: "executive",

    title: "Executive Saloon",

    description:
      "Mercedes E-Class or similar. These can accommodate up to 3 passengers plus 3 standard suitcases (23kg max), or 4 passengers plus hand luggage.",

    image: vehicleImages.executive,
  },

  {
    key: "estate",

    title: "Estate Car",

    description:
      "Volvo Estate, VW Passat or similar. These can accommodate up to 4 passengers plus 4 standard suitcases (23kg max).",

    image: vehicleImages.estate,
  },

  {
    key: "peoplecarrier",

    title: "People Carrier",

    description:
      "VW Sharan, Ford Galaxy or similar. These can accommodate up to 5 passengers plus 5 standard suitcases (23kg max), or 6 passengers plus hand luggage.",

    image: vehicleImages.peoplecarrier,
  },

  {
    key: "executivepeoplecarrier",

    title: "Executive People Car",

    description:
      "Mercedes V-Class or similar. These can accommodate up to 5 passengers plus 5 standard suitcases (23kg max), or 6 passengers plus hand luggage.",

    image: vehicleImages.executivepeoplecarrier,
  },

  {
    key: "minibus",

    title: "Mini Bus Up to 16 Passengers",

    description:
      "Mercedes Sprinter or similar. These can accommodate up to 16 passengers, subject to luggage requirements.",

    image: vehicleImages.minibus,
  },
];

/* ========================================================= */
/* GET VEHICLE IMAGE */
/* ========================================================= */

const getVehicleImage = (name = "") => {
  const lower = name.toLowerCase().replace(/\s/g, "");

  if (lower.includes("executivepeople")) {
    return vehicleImages.executivepeoplecarrier;
  }

  if (lower.includes("people")) {
    return vehicleImages.peoplecarrier;
  }

  if (lower.includes("executive")) {
    return vehicleImages.executive;
  }

  if (lower.includes("estate")) {
    return vehicleImages.estate;
  }

  if (lower.includes("minibus")) {
    return vehicleImages.minibus;
  }

  return vehicleImages.saloon;
};

const CarSelection = () => {
  const navigate = useNavigate();

  const [bookingData, setBookingData] = useState(null);

  const [availableCars, setAvailableCars] = useState([]);

  const [selectedCar, setSelectedCar] = useState(null);

  const [tripType, setTripType] = useState("ONE_WAY");

  const [loading, setLoading] = useState(true);

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

    setBookingData(booking);

    async function loadCars() {
      try {
        const res = await fetch(`${API_BASE}/api/cars/public`, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            fromPlaceId: booking.fromPlaceId,
            toPlaceId: booking.toPlaceId,
            couponCode: booking.couponCode || null,
          }),
        });

        const result = await res.json();

        const filtered = (result.cars || []).filter((car) => {
          const passengerOk =
            !car.capacity?.passengers ||
            car.capacity.passengers >= Number(booking.passengers);

          const luggageOk =
            !car.capacity?.luggage ||
            car.capacity.luggage >= Number(booking.luggage);

          return passengerOk && luggageOk;
        });

        setAvailableCars(filtered);
      } catch (err) {
        console.error("Failed to load cars", err);
      } finally {
        setLoading(false);
      }
    }

    loadCars();
  }, [navigate]);

  /* ========================================================= */
  /* SELECT */
  /* ========================================================= */

  const handleSelectOneWay = (car) => {
    setSelectedCar(car);

    setTripType("ONE_WAY");
  };

  const handleSelectReturn = (car) => {
    if (!car.supportsReturnTrip) return;

    setSelectedCar(car);

    setTripType("RETURN");
  };

  /* ========================================================= */
  /* CONTINUE */
  /* ========================================================= */

  const handleContinue = () => {
    if (!selectedCar) return;

    const totalFare =
      tripType === "RETURN"
        ? selectedCar.pricing.roundTripFare
        : selectedCar.pricing.oneWayFare;
    const appliedCoupon =
      tripType === "RETURN"
        ? selectedCar.pricing.returnAppliedCoupon
        : selectedCar.pricing.oneWayAppliedCoupon;
    const couponDiscountAmount =
      tripType === "RETURN"
        ? selectedCar.pricing.returnCouponDiscountAmount
        : selectedCar.pricing.oneWayCouponDiscountAmount;

    localStorage.setItem(
      "bookingData",
      JSON.stringify({
        ...bookingData,

        selectedCar,

        tripType,

        pricing: {
          ...selectedCar.pricing,

          totalFare,

          type: tripType,
          appliedCoupon: appliedCoupon || null,
          couponDiscountAmount: couponDiscountAmount || 0,
        },
      })
    );

    navigate("/booking/info");
  };

  if (!bookingData || loading) return null;

  return (
    <div className="min-h-screen bg-surface-light pb-36 pt-4 sm:py-8 sm:pb-36 md:py-10 lg:pb-40">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* ========================================================= */}
        {/* HEADER */}
        {/* ========================================================= */}

        <div className="mb-5 sm:mb-8 md:mb-12">
          <button
            onClick={() => navigate("/")}
            className="mb-5 inline-flex items-center text-sm font-semibold text-primary-900 transition-colors hover:text-accent-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />

            Back
          </button>

          <h1 className="text-2xl font-black leading-tight text-primary-900 sm:text-4xl md:text-5xl">
            Select Your Vehicle
          </h1>

          <p className="mt-2 max-w-3xl text-sm text-gray-600 sm:mt-3 sm:text-lg">
            Choose from our premium fleet of airport transfer vehicles
          </p>
        </div>

        {bookingData.couponCode && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-800 sm:mb-8 sm:px-5">
            <CheckCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm font-semibold sm:text-base">
              Voucher <span className="font-black">{bookingData.couponCode}</span> applied to eligible prices below.
            </p>
          </div>
        )}

        {/* ========================================================= */}
        {/* VEHICLES */}
        {/* ========================================================= */}

        <div className="mb-12 grid grid-cols-2 gap-2.5 sm:mb-14 sm:gap-6 md:grid-cols-2 xl:mb-20 xl:grid-cols-3">
          {availableCars.map((car) => {
            const {
              oneWayFare,
              roundTripFare,
              originalOneWayFare,
              originalRoundTripFare,
            } = car.pricing || {};

            const isSelected = selectedCar?._id === car._id;
            const hasVoucherPrice = Boolean(
              car.pricing?.oneWayAppliedCoupon ||
                car.pricing?.returnAppliedCoupon
            );

            return (
              <div
                key={car._id}
                className={`relative overflow-hidden rounded-2xl border bg-white p-2.5 shadow-soft transition-all duration-300 hover:shadow-premium sm:rounded-[28px] sm:p-6 ${isSelected
                    ? "border-primary-900 ring-2 ring-primary-900"
                    : "border-gray-100"
                  }`}
              >
                {isSelected && (
                  <div className="absolute right-2 top-2 z-10 rounded-full bg-primary-900 px-2 py-0.5 text-[9px] font-semibold text-white sm:right-4 sm:top-4 sm:px-3 sm:py-1 sm:text-xs">
                    Selected
                  </div>
                )}

                {/* IMAGE */}
                <div className="mb-2 flex min-h-[62px] items-center justify-center sm:mb-6 sm:min-h-[120px]">
                  <img
                    src={getVehicleImage(car.name)}
                    alt={car.name}
                    className="h-[58px] w-full max-w-[125px] object-contain sm:h-[95px] sm:max-w-[220px] md:h-[110px]"
                  />
                </div>

                {/* NAME */}
                <h3 className="mb-2 flex min-h-[36px] items-center justify-center text-center text-sm font-black leading-[18px] text-primary-900 sm:mb-4 sm:min-h-0 sm:text-2xl sm:leading-normal">
                  {car.name}
                </h3>

                {/* CAPACITY */}
                <div className="mb-2.5 flex items-center justify-center gap-3 text-gray-600 sm:mb-5 sm:gap-8">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Users className="h-3.5 w-3.5 text-accent-500 sm:h-5 sm:w-5" />

                    <span className="text-xs font-semibold sm:text-base">
                      {car.capacity?.passengers ?? 0}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2">
                    <Briefcase className="h-3.5 w-3.5 text-accent-500 sm:h-5 sm:w-5" />

                    <span className="text-xs font-semibold sm:text-base">
                      {car.capacity?.luggage ?? 0}
                    </span>
                  </div>
                </div>

                {/* FEATURES */}
                {car.features?.length > 0 && (
                  <div className="mb-6 hidden flex-wrap justify-center gap-2 sm:flex">
                    {car.features.map((feature, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-900"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}

                {hasVoucherPrice && (
                  <div className="mb-2.5 flex items-center justify-center gap-1.5 rounded-lg bg-green-50 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wide text-green-700 sm:mb-4 sm:text-xs">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Voucher applied
                  </div>
                )}

                {/* PRICE BUTTONS */}
                <div className="grid grid-cols-2 gap-1.5 sm:gap-3">
                  <button
                    onClick={() => handleSelectOneWay(car)}
                    aria-pressed={isSelected && tripType === "ONE_WAY"}
                    className={`min-w-0 rounded-xl border-2 px-1 py-2 transition-all duration-300 sm:rounded-2xl sm:p-4 ${isSelected && tripType === "ONE_WAY"
                        ? "-translate-y-1 scale-[1.02] border-primary-900 bg-primary-900 text-white shadow-xl ring-4 ring-primary-900/20"
                        : "border-primary-900 bg-primary-900 text-white hover:-translate-y-0.5 hover:brightness-110 hover:shadow-lg"
                      }`}
                  >
                    {originalOneWayFare && (
                      <div className="mb-0.5 text-[9px] line-through opacity-70 sm:mb-1 sm:text-xs">
                        £{originalOneWayFare}
                      </div>
                    )}

                    <div className="truncate text-sm font-black sm:text-2xl">
                      £{oneWayFare}
                    </div>

                    <div className="mt-0.5 text-[8px] font-semibold uppercase tracking-tight sm:mt-1 sm:text-xs sm:tracking-wide">
                      One Way
                    </div>
                  </button>

                  <button
                    disabled={!car.supportsReturnTrip}
                    onClick={() => handleSelectReturn(car)}
                    aria-pressed={isSelected && tripType === "RETURN"}
                    className={`min-w-0 rounded-xl border-2 px-1 py-2 transition-all duration-300 sm:rounded-2xl sm:p-4 ${!car.supportsReturnTrip
                        ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                        : isSelected && tripType === "RETURN"
                          ? "-translate-y-1 scale-[1.02] border-accent-500 bg-accent-500 text-primary-950 shadow-xl ring-4 ring-accent-500/30"
                          : "border-accent-500 bg-accent-500 text-primary-950 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-lg"
                      }`}
                  >
                    {originalRoundTripFare && (
                      <div className="mb-0.5 text-[9px] line-through opacity-70 sm:mb-1 sm:text-xs">
                        £{originalRoundTripFare}
                      </div>
                    )}

                    <div className="truncate text-sm font-black sm:text-2xl">
                      {car.supportsReturnTrip
                        ? `£${roundTripFare}`
                        : "--"}
                    </div>

                    <div className="mt-0.5 text-[8px] font-semibold uppercase tracking-tight sm:mt-1 sm:text-xs sm:tracking-wide">
                      Return
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* VEHICLE DETAILS */}
        {/* ========================================================= */}

        <div className="mb-20 rounded-[24px] border border-gray-100 bg-white p-5 shadow-premium sm:rounded-[32px] sm:p-6 md:mb-28 md:p-10">
          <div className="mb-8 sm:mb-10">
            <h2 className="mb-3 text-3xl font-black text-primary-900 md:mb-4 md:text-4xl">
              Vehicle Information
            </h2>

            <p className="text-base text-gray-600 sm:text-lg">
              Vehicle examples and luggage/passenger capacities
            </p>
          </div>

          <div className="space-y-8 sm:space-y-10">
            {vehicleDetails.map((vehicle, index) => (
              <div
                key={index}
                className="flex flex-col items-start gap-5 border-b border-gray-100 pb-8 last:border-0 last:pb-0 sm:gap-6 sm:pb-10 md:flex-row md:gap-10"
              >
                <div className="flex w-full shrink-0 justify-center md:w-[180px]">
                  <img
                    src={vehicle.image}
                    alt={vehicle.title}
                    className="h-[85px] w-full max-w-[180px] object-contain sm:h-[90px]"
                  />
                </div>

                <div className="w-full">
                  <h3 className="mb-3 text-xl font-black text-primary-900 sm:text-2xl">
                    {vehicle.title}
                  </h3>

                  <p className="text-base leading-relaxed text-gray-700 sm:text-lg">
                    {vehicle.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-green-700">
                    <CheckCircle className="h-4 w-4 shrink-0" />

                    Suitable for airport transfers
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONTINUE BAR */}
        {selectedCar && (
          <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 p-4 shadow-2xl backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="mb-1 text-sm text-gray-500">
                  Selected Vehicle
                </p>

                <p className="break-words text-lg font-black text-primary-900 md:text-2xl">
                  {selectedCar.name} — £
                  {tripType === "RETURN"
                    ? selectedCar.pricing.roundTripFare
                    : selectedCar.pricing.oneWayFare}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {tripType === "RETURN"
                    ? "Return Journey"
                    : "One Way Journey"}
                </p>
              </div>

              <button
                onClick={handleContinue}
                className="w-full rounded-2xl bg-primary-900 px-8 py-4 font-bold text-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:bg-primary-800 hover:shadow-premium sm:w-auto"
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarSelection;
