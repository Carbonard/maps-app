import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { createContext, useContext } from 'react';
import { Coordinates } from './AppTypes';

export type LocationCtxType = {
	userLocation: Coordinates | null,
	refreshLocation: () => Promise<void>,
}

const LocationCtx = createContext<LocationCtxType | null>(null);

export function useLocationCtx() {
	const ctx = useContext(LocationCtx);
	if (!ctx) {
		throw new Error("useLocationCtx must be used inside LocationProvider");
	}
	return (ctx);
}


async function requestLocationPermission() {
	const {status} = await Location.requestForegroundPermissionsAsync();

	if (status !== 'granted') {
		console.log('Location permission denied');
		return false;
	}
	return true;
}

export function LocationProvider({children}: {children: React.ReactNode}) {

	const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
	async function refreshLocation() {
		const permissions = await requestLocationPermission();
			if (!permissions) return;

			const location = await Location.getCurrentPositionAsync({});
			console.log("Location refreshed")
			setUserLocation({
			latitude: location.coords.latitude,
			longitude: location.coords.longitude,
			})
	};
	useEffect(() => {refreshLocation(); console.log("Location effect");}, []);
	

	return (
		<LocationCtx.Provider value={{userLocation: userLocation, refreshLocation: refreshLocation}}>
			{children}
		</LocationCtx.Provider>
	);
}