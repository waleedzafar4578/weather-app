import Image from 'next/image';

export interface WeatherData {
    coord: {
        lon: number;
        lat: number;
    };
    weather: Array<{
        id: number;
        main: string;
        description: string;
        icon: string;
    }>;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
        sea_level?: number;
        grnd_level?: number;
    };
    visibility: number;
    wind: {
        speed: number;
        deg: number;
        gust?: number;
    };
    clouds: {
        all: number;
    };
    dt: number;
    sys: {
        country: string;
        sunrise: number;
        sunset: number;
    };
    timezone: number;
    id: number;
    name: string;
    cod: number;
}

export default function WeatherDisplay({weatherData}: {weatherData: WeatherData|null}) {

    // Convert timestamp to readable time
    const formatTime = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Format temperature from Kelvin to Celsius or Fahrenheit
    const formatTemp = (temp: number) => {
        // Assuming the temperature is already in Fahrenheit as in your sample data
        return Math.round(temp);
    };


    return (
        <div className="flex items-center justify-center w-full h-full">
            {weatherData ? (
                <div className="w-[100vw] mx-auto bg-white rounded-xl shadow-lg">
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">{weatherData.name}</h1>
                                <p className="text-gray-600">{weatherData.sys.country}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-4xl font-bold text-gray-800">{formatTemp(weatherData.main.temp)}°F</p>
                                <p className="text-gray-600">Feels like {formatTemp(weatherData.main.feels_like)}°F</p>
                            </div>
                        </div>

                        <div className="flex items-center mb-6">
                            <Image
                                src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                                alt={weatherData.weather[0].description}
                                width={50}
                                height={50}
                            />
                            <div className="ml-2">
                                <p className="text-lg font-medium capitalize">{weatherData.weather[0].main}</p>
                                <p className="text-gray-600 capitalize">{weatherData.weather[0].description}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <p className="text-gray-600">Humidity</p>
                                <p className="text-lg font-medium">{weatherData.main.humidity}%</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Wind</p>
                                <p className="text-lg font-medium">{weatherData.wind.speed} m/s</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Pressure</p>
                                <p className="text-lg font-medium">{weatherData.main.pressure} hPa</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Visibility</p>
                                <p className="text-lg font-medium">{weatherData.visibility / 1000} km</p>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-gray-600">Sunrise</p>
                                    <p className="text-lg font-medium">{formatTime(weatherData.sys.sunrise)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-600">Sunset</p>
                                    <p className="text-lg font-medium">{formatTime(weatherData.sys.sunset)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Map section */}
                        <div className="mt-6">
                            <h2 className="text-lg font-medium mb-2">Location</h2>
                            <iframe
                                src={`https://maps.google.com/maps?q=${weatherData.coord.lat},${weatherData.coord.lon}&z=13&output=embed`}
                                width="100%"
                                height="200"
                                style={{ border: 0 }}
                                allowFullScreen={false}
                                loading="lazy"
                                className="rounded-lg"
                            ></iframe>
                        </div>
                    </div>
                </div>
            ):(
                <div className="flex w-full justify-center items-center p-8">
                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF9149]"></div>
                </div>
            )}
        </div>
    );
}