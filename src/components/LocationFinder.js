import {
  useMapEvents,
} from 'react-leaflet'

function LocationFinder({ onClick }) {
  const map = useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

export default LocationFinder;