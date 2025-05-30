import React, { useEffect, useRef } from 'react';

const MapView = ({ charger, onClose }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!charger?.location) return;

    const { latitude, longitude } = charger.location;

    if (!mapRef.current) {
      // Initialize map once
      mapRef.current = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: { lat: latitude, lng: longitude },
      });

      // Create marker once
      markerRef.current = new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: mapRef.current,
      });
    } else {
      // Update map center and marker position on charger change
      const newPos = { lat: latitude, lng: longitude };
      mapRef.current.setCenter(newPos);
      markerRef.current.setPosition(newPos);
    }
  }, [charger]);

  return (
    <div className="map-view-container">
      <button onClick={onClose} className="close-map-btn">Close Map</button>
      <div id="map" style={{ width: '100%', height: '400px' }}></div>
    </div>
  );
};

export default MapView;
