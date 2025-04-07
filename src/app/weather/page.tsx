    // app/weather/page.tsx - Weather display page
    async function getWeatherData(lat: number, lon: number) {
        const API_KEY ='bb2e0c96ec173e278429ac293fa1676b';
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }

        return response.json();
    }

    export default async function WeatherPage({
                                                  searchParams
                                              }: {
        searchParams: { [key: string]: string | string[] | undefined }
    }) {
        const lat = parseFloat(searchParams.lat as string);
        const lon = parseFloat(searchParams.lon as string);

        if (isNaN(lat) || isNaN(lon)) {
            return <div className="p-4">Invalid location coordinates</div>;
        }

        try {
            const weatherData = await getWeatherData(lat, lon);

            return (
                <div className="p-4 text-center">
                    <h1 className="text-xl mb-4">Weather in {weatherData.name}</h1>
                    <div className="text-4xl font-bold">
                        {Math.round(weatherData.main.temp)}°C
                    </div>
                    <p>{weatherData.weather[0]?.description}</p>
                    <p>Humidity: {weatherData.main.humidity}%</p>
                    <a href="/" className="text-blue-500 block mt-4">Back</a>
                </div>
            );
        } catch (error) {
            return <div className="p-4 text-red-500">Failed to load weather data</div>;
        }
    }