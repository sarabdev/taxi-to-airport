import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, ArrowLeft, Car } from 'lucide-react';
import { getAvailableCars } from '../data/cars';

const CarSelection = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [availableCars, setAvailableCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('bookingData');
    if (!data) {
      navigate('/');
      return;
    }

    const booking = JSON.parse(data);
    setBookingData(booking);

    const cars = getAvailableCars(
      parseInt(booking.passengers),
      parseInt(booking.luggage)
    );
    setAvailableCars(cars);
  }, [navigate]);

  const calculatePrice = (car) => {
    const estimatedMiles = 25;
    const oneWayPrice = car.basePrice + car.pricePerMile * estimatedMiles;

    if (bookingData?.isRoundTrip) {
      const returnPrice = oneWayPrice * 0.9;
      return (oneWayPrice + returnPrice).toFixed(2);
    }

    return oneWayPrice.toFixed(2);
  };

  const handleSelectCar = (car) => setSelectedCar(car);

  const handleContinue = () => {
    if (!selectedCar) return;

    localStorage.setItem(
      'bookingData',
      JSON.stringify({
        ...bookingData,
        selectedCar,
        totalPrice: calculatePrice(selectedCar),
      })
    );

    navigate('/booking/info');
  };

  if (!bookingData) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-5 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Map */}
        <div className="w-full bg-gray-200 h-36 md:h-44 rounded-xl flex items-center justify-center mb-5 border">
          <span className="text-gray-500 text-sm md:text-base font-semibold">
            Map preview here
          </span>
        </div>

        {/* Promo */}
        <div className="w-full bg-red-600 text-white font-bold text-center py-1.5 rounded-lg mb-5 text-xs md:text-base">
          £3 OFF EVERY Online Journey + 5% Return Booking Discount!
        </div>

        {/* Header */}
        <div className="mb-5 md:mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-2 text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <h1 className="text-xl md:text-4xl font-bold text-gray-900">
            Select Your Vehicle
          </h1>
          <p className="text-gray-600 text-xs md:text-base">
            Choose from our premium fleet
          </p>
        </div>

        {/* Cars */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6 mb-24">
          {availableCars.map((car) => {
            const estimatedMiles = 25;
            const oneWayOld = car.basePrice + car.pricePerMile * estimatedMiles;
            const oneWayNew = Math.max(oneWayOld - 3, 0);

            let returnOld = Math.round(oneWayOld * 2);
            let returnNew = null;
            let returnDiscount = 0;

            if (bookingData.isRoundTrip) {
              returnNew = Math.round(oneWayOld + oneWayOld * 0.95);
              returnDiscount = returnOld - returnNew;
            }

            return (
              <div
                key={car.id}
                className={`card border shadow-sm p-2 md:p-5 transition-all ${selectedCar?.id === car.id ? 'ring-3 ring-primary-500' : ''
                  }`}
              >
                {/* Icon */}
                <div className="mx-auto bg-white border w-9 h-9 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-1">
                  <Car size={16} className="md:w-8 md:h-8 text-gray-600" />
                </div>

                {/* Name & capacity */}
                <div className="flex justify-between items-center mb-0.5">
                  <div className="font-semibold text-[11px] md:text-lg truncate">
                    {car.name}
                  </div>
                  <div className="flex gap-1 text-[9px] md:text-xs text-gray-600">
                    <Users className="h-3 w-3" /> {car.capacity.passengers}
                    <Briefcase className="h-3 w-3" /> {car.capacity.luggage}
                  </div>
                </div>

                {/* Description */}
                <div className="text-[9px] md:text-xs text-gray-500 leading-tight mb-1">
                  {car.description}
                </div>

                {/* Prices */}
                <div className="flex gap-1.5 mt-1">
                  {/* One Way */}
                  <button
                    onClick={() => handleSelectCar(car)}
                    className={`relative flex-1 flex flex-col items-center justify-center 
                      py-1 md:py-2 rounded-md border-2 bg-blue-600 text-white ${selectedCar?.id === car.id ? 'ring-2 ring-blue-400' : ''
                      }`}
                  >
                    <span className="absolute top-0.5 left-0.5 bg-red-600 text-white text-[8px] px-1 rounded-full">
                      -£3
                    </span>

                    <span className="text-[8px] line-through opacity-70 leading-none">
                      £{oneWayOld}
                    </span>

                    <span className="text-xs md:text-lg font-bold leading-tight">
                      £{oneWayNew}
                    </span>

                    <span className="text-[8px] md:text-[11px] uppercase leading-none">
                      One Way
                    </span>
                  </button>

                  {/* Return */}
                  <button
                    disabled={!bookingData.isRoundTrip}
                    onClick={() => bookingData.isRoundTrip && handleSelectCar(car)}
                    className={`relative flex-1 flex flex-col items-center justify-center 
                      py-1 md:py-2 rounded-md border-2 ${bookingData.isRoundTrip
                        ? 'bg-yellow-400 text-gray-900'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      } ${selectedCar?.id === car.id ? 'ring-2 ring-yellow-500' : ''
                      }`}
                  >
                    {bookingData.isRoundTrip && (
                      <span className="absolute top-0.5 left-0.5 bg-red-600 text-white text-[8px] px-1 rounded-full">
                        -£{returnDiscount}
                      </span>
                    )}

                    <span className="text-[8px] line-through opacity-70 leading-none">
                      £{returnOld}
                    </span>

                    <span className="text-xs md:text-lg font-bold leading-tight">
                      {bookingData.isRoundTrip ? `£${returnNew}` : '--'}
                    </span>

                    <span className="text-[8px] md:text-[11px] uppercase leading-none">
                      Return
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue */}
        {selectedCar && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-3 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Selected</p>
                <p className="text-sm md:text-lg font-bold">
                  {selectedCar.name} – £{calculatePrice(selectedCar)}
                </p>
              </div>
              <button onClick={handleContinue} className="btn-primary text-sm">
                Next
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CarSelection;
