// context/RouteContext.js
import React, { createContext, useContext, useState } from 'react';

const RouteContext = createContext();

export const RouteProvider = ({ children }) => {
  const [routePoints, setRoutePoints] = useState([]);

  const addPoint = ({ coordinate, airport = null }) => {
    const name = airport?.name || `Point ${routePoints.length + 1}`;
    const altitude = '2500';
    const frequency = airport ? airport.frequency || 'TWR 118.5' : 'N/A';

    setRoutePoints((prev) => [
      ...prev,
      {
        name,
        coordinate,
        airport,
        altitude,
        frequency,
        distance: 'auto',
        duration: 'auto',
      },
    ]);
  };

  const removePoint = (indexToRemove) => {
    setRoutePoints((prevPoints) =>
      prevPoints.filter((_, index) => index !== indexToRemove)
    );
  };

  const updateAltitude = (index, altitude) => {
    const newPoints = [...routePoints];
    if (newPoints[index]) {
      newPoints[index].altitude = altitude;
      setRoutePoints(newPoints);
    }
  };

  const updateTime = (index, newTime) => {
    setRoutePoints((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], time: newTime };
      return updated;
    });
  };

  return (
    <RouteContext.Provider value={{ routePoints, addPoint, updateAltitude, updateTime, removePoint }}>
      {children}
    </RouteContext.Provider>
  );
};

export const useRoute = () => useContext(RouteContext);
