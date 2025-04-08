// app/page.tsx
'use client';

import { useState } from 'react';
import WeatherDisplay, {WeatherData} from "@/app/weatherDisplay";

import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
import Precautions from './precontions';

export default function HomePage() {
  const [coordinates, setCoordinates] = useState<{lat: number, lon: number} | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [showPreco,setShowPreco]=useState<boolean>(true);

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
      console.log(data);
    } catch (error) {
      setWeatherError('Failed to fetch weather data. Please try again.');
      console.error(error);
    } finally {
      setWeatherLoading(false);
    }
  };

  return (
      <div style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}>
        <div style={{
          width: "100vw",
          display: "flex",
          flexDirection: "row",
          justifyContent:'space-between',
        }}>
            {coordinates ?(
                <>
                    <IoMdArrowRoundBack
                        size={50}
                        onClick={()=>{
                          if (showPreco === true) {
                            setCoordinates(null)  
                          }
                          else{
                            setShowPreco(true)
                          }
                        }}
                        color={'#FF9149'}
                        className="hover:text-[#99BC85]"
                    />
                    <h1 className="text-3xl font-bold text-center mb-6" style={{color:'#FF9149'}}>Weather App</h1>
                    {showPreco ? (
                      <IoMdArrowRoundForward
                      size={50}
                      onClick={()=>setShowPreco(!showPreco)}
                      color={'#FF9149'}
                      className="hover:text-[#99BC85]"
                  />
                    ):(<h1/>)}
                    
                </>

            ):(
                <>
                    <h1/>
                    <h1 className="text-8xl font-bold text-center mb-6" style={{color:'#FF9149'}}>Weather App</h1>
                    <h1/>
                </>
            )}


        </div>

        {!coordinates ?

            (
                <div className={"flex  "}>
                  <div className="mb-6 text-center">
                    <button
                        onClick={getLocation}
                        disabled={loading}
                        className="w-[20rem] h-[20rem] px-4 py-2 bg-[#FF9149] text-white rounded-[14rem] hover:bg-[#BBC3A4] disabled:bg-gray-400"
                    >
                        {loading ? 'Getting location...' : <h1>GO</h1>}
                    </button>

                    {error && <p className="mt-2 text-red-500">{error}</p>}
                  </div>
                </div>
            )
            :
            (
                <div className={"flex w-full align-middle justify-stretch  h-full"}>
                  
                  {showPreco ? (
                      <WeatherDisplay weatherData={weatherData} />
                  ):(
                      <Precautions weatherData={weatherData} />
                  )}
                  
                  {weatherError && (
                      <div className="text-center py-4">
                        <p className="text-red-500">{weatherError}</p>
                      </div>
                  )}
                </div>
            )}

      </div>
  );
}