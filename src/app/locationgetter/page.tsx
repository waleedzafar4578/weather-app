'use client';
import {useState ,useEffect} from 'react';
import {useRouter} from 'next/navigation';
interface LocationData {
    latitude: number | null;
    longitude: number | null;
    error: string | null;
}
function Page() {
    const [location, setLocation] = useState<LocationData | null>(null);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const getLocation =  () => {
        setLoading(true);
        if (!navigator.geolocation) {
            setLocation({
                ...location,
                error:'Geolocation is not supported',
            })
            setLoading(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            setLocation({
                latitude: lat,
                longitude: lon,
                error: null,
            })
            router.push(`/weather?lat=${lat}&lon=${lon}`);
            console.log('Latitude->',lat,'Longitude->', lon);
            setLoading(false);
        },error => {
            setLocation({
                latitude:null,
                longitude:null,
                error:`Error: ${error}`,
            });
            setLoading(false);
        });
    };

    return(
        <div className={"p-4"}>
            <h1 className={'text-xl font-bold mb-4'}>Device Location</h1>
            <button
                type="button"
                onClick={getLocation}
                disabled={loading}
                className={'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300'}
            >
                {loading? 'Geolocation is loading...' : 'Get Weather for my location'}
            </button>
            {location?.error && (
                <p className={'mt-2 text-red-500'}>{location.error}</p>
            )}
        </div>
    )
}
export default Page;