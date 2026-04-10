import AsyncStorage from '@react-native-async-storage/async-storage';

import { Place } from './AppTypes';
import { useEffect, useState } from 'react';

const saveLocally = async (places: Place[]) => {
	try {
		await AsyncStorage.setItem('places', JSON.stringify(places));
	} catch (e) {
		console.error('Save error', e);
	}
};

const loadPlaces = async () => {
	try {
		const data = await AsyncStorage.getItem('places');
		if (data)
			return JSON.parse(data);
		return [];
	} catch (e) {
		return [];
	}
};

export function usePlaces() {
	const [placesList, setPlaces] = useState<Place[]>([]);

	useEffect(() => {
	loadPlaces().then(setPlaces);
	}, []);

	const updatePlaces = (updater: (prev: Place[]) => Place[]) => {
		setPlaces(prev => {
			const updated = updater(prev);

			saveLocally(updated);
			// syncToServer(updated);

			return updated;
		});
	};

	return { placesList, updatePlaces };
}