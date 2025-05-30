import React, { useEffect, useRef } from "react";

const AdvancedMarker = ({ position, map, title }) => {
  const markerRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    // Create new AdvancedMarkerElement
    markerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
      position,
      map,
      title,
    });

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [map, position, title]);

  return null; // This component only manages marker on the map, no DOM output
};

export default AdvancedMarker;
