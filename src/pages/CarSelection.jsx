import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, Check, ArrowLeft, Car } from 'lucide-react';
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
    
    // Get available cars based on passengers and luggage
    const cars = getAvailableCars(
      parseInt(booking.passengers),
      parseInt(booking.luggage)
    );
    setAvailableCars(cars);
  }, [navigate]);

  const calculatePrice = (car) => {
    // Simplified pricing calculation
    // In real app, you'd calculate actual distance
    const estimatedMiles = 25;
    const oneWayPrice = car.basePrice + (car.pricePerMile * estimatedMiles);
    
    // If round trip, add return journey with 10% discount
    if (bookingData?.isRoundTrip) {
      const returnPrice = oneWayPrice * 0.9; // 10% discount on return
      const total = oneWayPrice + returnPrice;
      return total.toFixed(2);
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

  if (!bookingData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Map Preview */}
        <div className="w-full bg-gray-200 h-44 rounded-xl flex flex-col items-center justify-center mb-6 border">
          <span className="text-gray-500 font-semibold text-lg">Map preview here</span>
        </div>

        {/* Info Notification */}
        <div className="w-full bg-red-600 text-white font-bold text-center py-2 rounded-lg mb-8">
          £3 OFF EVERY Online Journey + 5% Return Booking Discount!
        </div>

        {/* Header (unchanged) */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')} 
            className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Booking Form
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Select Your Vehicle</h1>
          <p className="text-gray-600 mt-2">Choose from our premium fleet of vehicles</p>
        </div>

        {/* Booking Summary */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Trip Details</h2>
            {bookingData.isRoundTrip && (
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
                Round Trip - 10% Off Return
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">From</p>
              <p className="font-semibold">{bookingData.fromLocation}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">To</p>
              <p className="font-semibold">{bookingData.toLocation}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Passengers</p>
              <p className="font-semibold">{bookingData.passengers} {bookingData.passengers === '1' ? 'Person' : 'People'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Luggage</p>
              <p className="font-semibold">{bookingData.luggage} {bookingData.luggage === '1' ? 'Bag' : 'Bags'}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-gray-500">Pickup Date & Time</p>
              <p className="font-semibold">
                {bookingData.pickupDate && new Date(bookingData.pickupDate).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })} at {bookingData.pickupTime}
              </p>
            </div>
            {bookingData.isRoundTrip && bookingData.returnDate && (
              <div>
                <p className="text-sm text-gray-500">Return Date & Time</p>
                <p className="font-semibold">
                  {new Date(bookingData.returnDate).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })} at {bookingData.returnTime}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Car List / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {availableCars.map((car) => {
            // Price calculations
            const estimatedMiles = 25;
            const oneWayOld = car.basePrice + car.pricePerMile * estimatedMiles;
            const oneWayNew = Math.max(oneWayOld - 3, 0); // £3 off per screenshot
            let returnOld = oneWayOld * 2;
            let returnNew = null;
            let returnDiscountPounds = 0;
            if (bookingData.isRoundTrip) {
              returnNew = Math.round((oneWayOld + (oneWayOld * 0.95)) - 0.01); // 5% discount (simulate as screenshot)
              returnDiscountPounds = returnOld - returnNew;
            }
            returnOld = Math.round(returnOld);
            
            return (
              <div
                key={car.id}
                className={`card flex flex-col space-y-2 shadow-sm border border-gray-200 p-5 transition-all ${selectedCar?.id === car.id ? 'ring-4 ring-primary-500' : ''}`}
              >
                <div className='mx-auto bg-white border-2 border-gray-200 w-16 h-16 rounded-full flex items-center justify-center mb-3'>
                  <Car size={32} className='text-gray-600' />
                </div>
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="font-bold text-lg text-gray-900">{car.name}</div>
                  <div className="flex gap-3 text-gray-600 text-xs font-medium items-center">
                    <Users className='inline h-4 w-4 mr-1' />{car.capacity.passengers}
                    <Briefcase className='inline h-4 w-4 mr-1' />{car.capacity.luggage}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  {car.description}
                </div>
                {/* Prices Row */}
                <div className="flex gap-3 mt-2">
                  {/* One Way Price */}
                  <button
                    className={`relative flex-1 flex flex-col items-center justify-center py-2 px-2 rounded-lg border-2 font-bold bg-blue-600 text-white transition-all ${selectedCar?.id === car.id ? 'ring-2 ring-blue-400' : ''}`}
                    type="button"
                    onClick={() => handleSelectCar(car)}
                  >
                    {/* Discount badge */}
                    <span className="absolute top-1 left-1 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">-£3</span>
                    <span className="line-through text-xs opacity-70">£{oneWayOld}</span>
                    <span className="text-lg font-bold">£{oneWayNew}</span>
                    <span className="text-[11px] font-semibold uppercase">One Way</span>
                  </button>
                  {/* Return Price */}
                  <button
                    className={`relative flex-1 flex flex-col items-center justify-center py-2 px-2 rounded-lg border-2 font-bold ${bookingData.isRoundTrip ? 'bg-yellow-400 text-gray-900' : 'bg-gray-200 text-gray-400 cursor-not-allowed'} transition-all ${selectedCar?.id === car.id ? 'ring-2 ring-yellow-500' : ''}`}
                    type="button"
                    disabled={!bookingData.isRoundTrip}
                    onClick={() => bookingData.isRoundTrip && handleSelectCar(car)}
                  >
                    {bookingData.isRoundTrip && (
                      <span className="absolute top-1 left-1 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">-£{returnDiscountPounds}</span>
                    )}
                    <span className="line-through text-xs opacity-70">£{returnOld}</span>
                    <span className="text-lg font-bold">{bookingData.isRoundTrip ? `£${returnNew}` : '--'}</span>
                    <span className="text-[11px] font-semibold uppercase">Return</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Continue Button */}
        {selectedCar && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Selected Vehicle</p>
                <p className="text-lg font-bold">{selectedCar.name} - £{calculatePrice(selectedCar)}</p>
              </div>
              <button
                onClick={handleContinue}
                className="btn-primary"
              >
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

