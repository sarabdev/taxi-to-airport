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
import executiveCar from "../assets/cars/executive_car.webp";
import estateCar from "../assets/cars/estate_car.webp";
import peopleCarrier from "../assets/cars/people_carrier.webp";
import executivePeopleCarrier from "../assets/cars/executive_people_carrier.webp";
import minibus8 from "../assets/cars/8_seater_minibus.webp";

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

  minibus: minibus8,
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

    title: "Executive Car",

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

    title: "Executive People Carrier",

    description:
      "Mercedes V-Class or similar. These can accommodate up to 5 passengers plus 5 standard suitcases (23kg max), or 6 passengers plus hand luggage.",

    image: vehicleImages.executivepeoplecarrier,
  },

  {
    key: "minibus",

    title: "8 Seater Minibus",

    description:
      "VW Transporter or similar. These can accommodate 8 passengers plus up to 8 standard suitcases (23kg max).",

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
        },
      })
    );

    navigate("/booking/info");
  };

  if (!bookingData || loading) return null;

  return (
    <div className="min-h-screen bg-surface-light py-6 pb-36 sm:py-8 sm:pb-36 md:py-10 lg:pb-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ========================================================= */}
        {/* HEADER */}
        {/* ========================================================= */}

        <div className="mb-8 md:mb-12">
          <button
            onClick={() => navigate("/")}
            className="mb-5 inline-flex items-center text-sm font-semibold text-primary-900 transition-colors hover:text-accent-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />

            Back
          </button>

          <h1 className="text-3xl font-black leading-tight text-primary-900 sm:text-4xl md:text-5xl">
            Select Your Vehicle
          </h1>

          <p className="mt-3 max-w-3xl text-base text-gray-600 sm:text-lg">
            Choose from our premium fleet of airport transfer vehicles
          </p>
        </div>

        {/* ========================================================= */}
        {/* VEHICLES */}
        {/* ========================================================= */}

        <div className="mb-14 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 xl:mb-20 xl:grid-cols-3">
          {availableCars.map((car) => {
            const {
              oneWayFare,
              roundTripFare,
              originalOneWayFare,
              originalRoundTripFare,
            } = car.pricing || {};

            const isSelected = selectedCar?._id === car._id;

            return (
              <div
                key={car._id}
                className={`relative overflow-hidden rounded-[24px] border bg-white p-5 shadow-soft transition-all duration-300 hover:shadow-premium sm:rounded-[28px] sm:p-6 ${isSelected
                    ? "border-primary-900 ring-2 ring-primary-900"
                    : "border-gray-100"
                  }`}
              >
                {isSelected && (
                  <div className="absolute right-4 top-4 rounded-full bg-primary-900 px-3 py-1 text-xs font-semibold text-white">
                    Selected
                  </div>
                )}

                {/* IMAGE */}
                <div className="mb-5 flex min-h-[110px] items-center justify-center sm:mb-6 sm:min-h-[120px]">
                  <img
                    src={getVehicleImage(car.name)}
                    alt={car.name}
                    className="h-[85px] w-full max-w-[200px] object-contain sm:h-[95px] sm:max-w-[220px] md:h-[110px]"
                  />
                </div>

                {/* NAME */}
                <h3 className="mb-4 text-center text-xl font-black text-primary-900 sm:text-2xl">
                  {car.name}
                </h3>

                {/* CAPACITY */}
                <div className="mb-5 flex items-center justify-center gap-6 text-gray-600 sm:gap-8">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-accent-500" />

                    <span className="font-semibold">
                      {car.capacity?.passengers ?? 0}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-accent-500" />

                    <span className="font-semibold">
                      {car.capacity?.luggage ?? 0}
                    </span>
                  </div>
                </div>

                {/* FEATURES */}
                {car.features?.length > 0 && (
                  <div className="mb-6 flex flex-wrap justify-center gap-2">
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

                {/* PRICE BUTTONS */}
                <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-2">
                  <button
                    onClick={() => handleSelectOneWay(car)}
                    className={`rounded-2xl border-2 p-4 transition-all duration-300 ${isSelected && tripType === "ONE_WAY"
                        ? "border-primary-900 bg-primary-900 text-white"
                        : "border-primary-100 bg-primary-50 hover:border-primary-900"
                      }`}
                  >
                    {originalOneWayFare && (
                      <div className="mb-1 text-xs line-through opacity-70">
                        £{originalOneWayFare}
                      </div>
                    )}

                    <div className="text-xl font-black sm:text-2xl">
                      £{oneWayFare}
                    </div>

                    <div className="mt-1 text-xs uppercase tracking-wide">
                      One Way
                    </div>
                  </button>

                  <button
                    disabled={!car.supportsReturnTrip}
                    onClick={() => handleSelectReturn(car)}
                    className={`rounded-2xl border-2 p-4 transition-all duration-300 ${!car.supportsReturnTrip
                        ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                        : isSelected && tripType === "RETURN"
                          ? "border-accent-500 bg-accent-500 text-primary-950"
                          : "border-accent-100 bg-accent-50 hover:border-accent-500"
                      }`}
                  >
                    {originalRoundTripFare && (
                      <div className="mb-1 text-xs line-through opacity-70">
                        £{originalRoundTripFare}
                      </div>
                    )}

                    <div className="text-xl font-black sm:text-2xl">
                      {car.supportsReturnTrip
                        ? `£${roundTripFare}`
                        : "--"}
                    </div>

                    <div className="mt-1 text-xs uppercase tracking-wide">
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