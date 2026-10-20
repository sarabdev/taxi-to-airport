// Must match MAX_STOPS in backend/src/modules/pricing/distance.service.js. The
// backend prices at most this many stops, so the form never offers more.
export const MAX_STOPS = 5;

let nextStopId = 0;

/** A blank stop row for the booking form. `id` is a stable React key only. */
export const createStop = () => {
  nextStopId += 1;
  return { id: `stop-${nextStopId}`, location: '', placeId: '' };
};

/**
 * The confirmed intermediate stops of a booking, in order, as the
 * `{ location, placeId }` objects the API expects. Rows without a place id
 * (never chosen from suggestions) are excluded.
 */
export const getRouteStops = (booking) =>
  (Array.isArray(booking?.stops) ? booking.stops : [])
    .filter((stop) => stop?.placeId)
    .map(({ location, placeId }) => ({ location: location || '', placeId }));
