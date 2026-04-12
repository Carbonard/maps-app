import { useState, useRef } from 'react';
import { Text, View } from 'react-native';

import { Place } from './Types'
import { DisplayListProps } from './Types'
import { getListCtx } from './Context';
import { MapCircle, MapTemplate } from './Maps';

export function DisplayList({route, navigation}: DisplayListProps) {
	console.log("Rendering DisplayList");
	const placesList = getListCtx().placeList;

	const cameraRef = useRef<any>(null);
	const [mapReady, setMapReady] = useState<boolean>(false)
	// const [bounds, setBounds] = useState<Bounds | undefined>(undefined);

	const calculateBounds = () => {
		if (placesList.length == 0) return undefined;

		let minLat = placesList[0].coordinates.latitude;
		let maxLat = placesList[0].coordinates.latitude;
		let minLng = placesList[0].coordinates.longitude;
		let maxLng = placesList[0].coordinates.longitude;

		placesList.forEach(place => {
			minLat = Math.min(minLat, place.coordinates.latitude);
			maxLat = Math.max(maxLat, place.coordinates.latitude);
			minLng = Math.min(minLng, place.coordinates.longitude);
			maxLng = Math.max(maxLng, place.coordinates.longitude);
		});

		return {
			ne: [maxLng + (maxLng - minLng) * 0.1,
				 maxLat + (maxLat - minLat) * 0.1],
			sw: [minLng - (maxLng - minLng) * 0.1,
				 minLat - (maxLat - minLat) * 0.1]
		};
	};

	const setCamera = () => {
		if (cameraRef.current && placesList.length > 0) {
			const bounds = calculateBounds();
			if (bounds) {
				cameraRef.current.fitBounds(
					bounds.ne,
					bounds.sw,
					{
						padding: 50, // Padding in pixels
						animated: true,
						duration: 1000
					}
				);
			}
		}
	};

	if (placesList.length == 0) {
		return (
			<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
				<Text>No places to display</Text>
			</View>
		);
	}

	return(
		<View style={{flex: 1}}>
			<MapTemplate
				onMapLoaded={setCamera}
				zoomLevel={15}
				centerCoordinate={placesList[0].coordinates}
				cameraRef={cameraRef}
			>
				{placesList.map((place: Place) => (
					<MapCircle
						id={place.id}
						key={place.id}
						center={place.coordinates}
					/>
				))}
			</MapTemplate>
		</View>
	);
}