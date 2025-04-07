// app/page.tsx
'use client';

import { useState } from 'react';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
  }>;
}

export default function HomePage() {
  const [coordinates, setCoordinates] = useState<{lat: number, lon: number} | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  // Get user's location
  const getLocation = () => {
    setLoading(true);
    setError(null);
    setWeatherData(null);
    setWeatherError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setCoordinates({ lat, lon });
          setLoading(false);

          // Immediately fetch weather after getting coordinates
          await fetchWeather(lat, lon);
        },
        (error) => {
          setError(`Location error: ${error.message}`);
          setLoading(false);
        }
    );
  };

  // Fetch weather data
  const fetchWeather = async (lat: number, lon: number) => {
    setWeatherLoading(true);
    setWeatherError(null);

    try {
      // Note: In client components, we should use an API route to hide API keys
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      setWeatherError('Failed to fetch weather data. Please try again.');
      console.error(error);
    } finally {
      setWeatherLoading(false);
    }
  };

  return (
      <div className="container mx-auto p-8 max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Weather App</h1>

        <div className="mb-6 text-center">
          <button
              onClick={getLocation}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Getting location...' : 'Get My Location Weather'}
          </button>

          {error && <p className="mt-2 text-red-500">{error}</p>}

          {coordinates && !loading &&(
              <div className="mt-4 text-sm text-gray-600">
                <p>Latitude: {coordinates.lat.toFixed(4)}</p>
                <p>Longitude: {coordinates.lon.toFixed(4)}</p>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Your Location</h2>
                  <iframe
                      src={`https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lon}&z=15&output=embed`}
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      loading="lazy"
                      className="rounded-lg"

                  ></iframe>
                </div>
              </div>
          )}
        </div>


        {weatherLoading && (
            <div className="text-center py-8">
              <p>Loading weather data...</p>
            </div>
        )}

        {weatherError && (
            <div className="text-center py-4">
              <p className="text-red-500">{weatherError}</p>
            </div>
        )}

        {weatherData && (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">
                Weather in {weatherData.name}
              </h2>
              <div className="text-5xl font-bold my-4">
                {Math.round(weatherData.main.temp)}°C
              </div>
              <p className="capitalize text-gray-700 mb-3">
                {weatherData.weather[0]?.description}
              </p>
              <p className="text-gray-600">
                Humidity: {weatherData.main.humidity}%
              </p>
            </div>
        )}

      </div>
  );
}