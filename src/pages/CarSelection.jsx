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

  const handleSelectCar = (car) => {
    setSelectedCar(car);
  };

  const handleContinue = () => {
    if (!selectedCar) return;

    const updatedBooking = {
      ...bookingData,
      selectedCar,
      totalPrice: calculatePrice(selectedCar),
    };

    localStorage.setItem('bookingData', JSON.stringify(updatedBooking));
    navigate('/booking/info');
  };

  if (!bookingData) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Map Preview */}
        <div className="w-full bg-gray-200 h-40 md:h-44 rounded-xl flex items-center justify-center mb-6 border">
          <span className="text-gray-500 font-semibold">Map preview here</span>
        </div>

        {/* Promo */}
        <div className="w-full bg-red-600 text-white font-bold text-center py-2 rounded-lg mb-6 md:mb-8 text-sm md:text-base">
          £3 OFF EVERY Online Journey + 5% Return Booking Discount!
        </div>

        {/* Header */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-3"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Booking Form
          </button>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
            Select Your Vehicle
          </h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
            Choose from our premium fleet
          </p>
        </div>

        {/* Car Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-24">

          {availableCars.map((car) => {
            const estimatedMiles = 25;
            const oneWayOld = car.basePrice + car.pricePerMile * estimatedMiles;
            const oneWayNew = Math.max(oneWayOld - 3, 0);
            let returnOld = Math.round(oneWayOld * 2);
            let returnNew = null;
            let returnDiscountPounds = 0;

            if (bookingData.isRoundTrip) {
              returnNew = Math.round(oneWayOld + oneWayOld * 0.95);
              returnDiscountPounds = returnOld - returnNew;
            }

            return (
              <div
                key={car.id}
                className={`card border shadow-sm transition-all p-3 md:p-5 space-y-1 md:space-y-2 ${selectedCar?.id === car.id ? 'ring-4 ring-primary-500' : ''
                  }`}
              >

                {/* Icon */}
                <div className="mx-auto bg-white border-2 border-gray-200 
                  w-10 h-10 md:w-16 md:h-16 
                  rounded-full flex items-center justify-center mb-1 md:mb-3">
                  <Car size={20} className="md:w-8 md:h-8 text-gray-600" />
                </div>

                {/* Name + capacity */}
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm md:text-lg text-gray-900">
                    {car.name}
                  </div>
                  <div className="flex gap-2 text-[10px] md:text-xs text-gray-600 items-center">
                    <Users className="h-3 w-3" /> {car.capacity.passengers}
                    <Briefcase className="h-3 w-3" /> {car.capacity.luggage}
                  </div>
                </div>

                {/* Description */}
                <div className="text-[11px] md:text-xs text-gray-500">
                  {car.description}
                </div>

                {/* Prices */}
                <div className="flex gap-2 mt-1 md:mt-2">

                  {/* One Way */}
                  <button
                    onClick={() => handleSelectCar(car)}
                    className={`relative flex-1 flex flex-col items-center justify-center 
                      py-1.5 px-1.5 md:py-2 md:px-2 
                      rounded-lg border-2 font-bold bg-blue-600 text-white ${selectedCar?.id === car.id ? 'ring-2 ring-blue-400' : ''
                      }`}
                  >
                    <span className="absolute top-1 left-1 bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                      -£3
                    </span>
                    <span className="line-through text-[10px] opacity-70">
                      £{oneWayOld}
                    </span>
                    <span className="text-sm md:text-lg">£{oneWayNew}</span>
                    <span className="text-[9px] md:text-[11px] uppercase">
                      One Way
                    </span>
                  </button>

                  {/* Return */}
                  <button
                    disabled={!bookingData.isRoundTrip}
                    onClick={() => bookingData.isRoundTrip && handleSelectCar(car)}
                    className={`relative flex-1 flex flex-col items-center justify-center 
                      py-1.5 px-1.5 md:py-2 md:px-2 
                      rounded-lg border-2 font-bold ${bookingData.isRoundTrip
                        ? 'bg-yellow-400 text-gray-900'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      } ${selectedCar?.id === car.id ? 'ring-2 ring-yellow-500' : ''
                      }`}
                  >
                    {bookingData.isRoundTrip && (
                      <span className="absolute top-1 left-1 bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                        -£{returnDiscountPounds}
                      </span>
                    )}
                    <span className="line-through text-[10px] opacity-70">
                      £{returnOld}
                    </span>
                    <span className="text-sm md:text-lg">
                      {bookingData.isRoundTrip ? `£${returnNew}` : '--'}
                    </span>
                    <span className="text-[9px] md:text-[11px] uppercase">
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
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Selected Vehicle</p>
                <p className="text-lg font-bold">
                  {selectedCar.name} – £{calculatePrice(selectedCar)}
                </p>
              </div>
              <button onClick={handleContinue} className="btn-primary">
                Move to Next Step
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CarSelection;
