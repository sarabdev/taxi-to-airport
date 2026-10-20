import { useEffect, useRef } from 'react';
import { getPlaceDisplayName, loadGooglePlaces } from '../lib/googlePlaces';

const PLACE_FIELDS = ['name', 'formatted_address', 'place_id'];

/**
 * Text input backed by Google Places Autocomplete.
 *
 * - `onTextChange(text)` fires while the user types. Typed text is not a
 *   confirmed place, so parents should clear any stored place id here.
 * - `onPlaceSelect({ location, placeId })` fires when a suggestion is chosen.
 *
 * Callbacks are read through refs so the Autocomplete widget is attached once
 * per mounted input rather than on every render.
 */
const PlaceAutocompleteInput = ({ value, onTextChange, onPlaceSelect, ...inputProps }) => {
  const inputRef = useRef(null);
  const onPlaceSelectRef = useRef(onPlaceSelect);

  useEffect(() => {
    onPlaceSelectRef.current = onPlaceSelect;
  }, [onPlaceSelect]);

  useEffect(() => {
    let autocomplete = null;
    let cancelled = false;

    loadGooglePlaces()
      .then((maps) => {
        if (cancelled || !maps || !inputRef.current) return;

        autocomplete = new maps.places.Autocomplete(inputRef.current, {
          fields: PLACE_FIELDS,
        });
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          onPlaceSelectRef.current?.({
            location: getPlaceDisplayName(place),
            placeId: place?.place_id || '',
          });
        });
      })
      .catch((error) => console.error(error));

    return () => {
      cancelled = true;
      if (autocomplete) {
        window.google?.maps?.event?.clearInstanceListeners(autocomplete);
      }
    };
  }, []);

  return (
    <input
      {...inputProps}
      ref={inputRef}
      type="text"
      value={value}
      onChange={(event) => onTextChange?.(event.target.value)}
      autoComplete="off"
    />
  );
};

export default PlaceAutocompleteInput;
