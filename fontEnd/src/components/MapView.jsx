import React, { useEffect, useRef } from 'react';
import useGoogleMaps from './useGoogleMaps';  // import the hook you created

const MapView = ({ charger, onClose }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const apiKey = 'AIzaSyCdUKj-j6A5yysU6wwkSfZF-2y-77qXofk';  // Put your API key here or in .env
  const loaded = useGoogleMaps(apiKey);

  useEffect(() => {
    if (!loaded) return;  // wait for script to load
    if (!charger?.location) return;

    const { latitude, longitude } = charger.location;

    if (!mapRef.current) {
      mapRef.current = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: { lat: latitude, lng: longitude },
      });

      markerRef.current = new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: mapRef.current,
      });
    } else {
      const newPos = { lat: latitude, lng: longitude };
      mapRef.current.setCenter(newPos);
      markerRef.current.setPosition(newPos);
    }
  }, [charger, loaded]);

  if (!loaded) {
    return <div>Loading map...</div>;
  }

  return (
    <div className="map-view-container">
      <button onClick={onClose} className="close-map-btn">Close Map</button>
      <div id="map" style={{ width: '100%', height: '400px' }}></div>
    </div>
  );
};

export default MapView;
