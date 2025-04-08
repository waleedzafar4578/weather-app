import React, { useState, useEffect, useCallback } from 'react';
import { WeatherData } from "@/app/weatherDisplay";

interface WeatherPrecautions {
  precautions: string[];
  risk_level: string;
  recommendation: string;
}

function Precautions({ weatherData }: { weatherData: WeatherData | null }) {
  const [precautions, setPrecautions] = useState<WeatherPrecautions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrecautions = useCallback(async () => {
    if (!weatherData) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const prompt = `Based on the following weather data, provide specific precautions in JSON format:
        Temperature: ${weatherData?.main.temp}°F
        Humidity: ${weatherData?.main.humidity}%
        Wind Speed: ${weatherData?.wind.speed} m/s
        Weather Condition: ${weatherData?.weather[0].description}

        Return ONLY a JSON object with EXACTLY this structure, with no additional text or explanation:
        {
          "precautions": [
            "Precaution 1",
            "Precaution 2",
            "Precaution 3"
          ],
          "risk_level": "Low/Medium/High",
          "recommendation": "Brief recommendation"
        }`;

      const res = await fetch('/api/mustdo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch precautions');
      }

      const data = await res.json();
      
      // Parse the JSON string from the answer
      try {
        const parsedData = JSON.parse(data.answer);
        setPrecautions(parsedData);
      } catch (e) {
        console.error('Error parsing JSON:', e);
        setError('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching precautions:', error);
      setError('Failed to load precautions');
    } finally {
      setLoading(false);
    }
  }, [weatherData]);

  useEffect(() => {
    if (weatherData) {
      fetchPrecautions();
    }
  }, [weatherData, fetchPrecautions]);

  if (!weatherData) {
    return <div className="text-center p-4">No weather data available</div>;
  }

  if (loading) {
    return (
      <div className="flex w-full justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF9149]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!precautions) {
    return <div className="text-center p-4">No precautions available</div>;
  }

  return (
    <div className="flex w-[90vw] flex-col bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-[#FF9149] mb-4">Weather Precautions</h2>
      
      <div className="mb-4">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
          Risk Level: 
        </span>
        <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${
          precautions.risk_level.toLowerCase() === 'high' ? 'bg-red-200 text-red-800' :
          precautions.risk_level.toLowerCase() === 'medium' ? 'bg-yellow-200 text-yellow-800' :
          'bg-green-200 text-green-800'
        }`}>
          {precautions.risk_level}
        </span>
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Precautions:</h3>
        <ul className="list-disc pl-5 space-y-1">
          {precautions.precautions.map((precaution, index) => (
            <li key={index} className="text-gray-700">{precaution}</li>
          ))}
        </ul>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <h3 className="text-lg font-semibold mb-1">Recommendation:</h3>
        <p className="text-gray-700">{precautions.recommendation}</p>
      </div>
    </div>
  );
}

export default Precautions;