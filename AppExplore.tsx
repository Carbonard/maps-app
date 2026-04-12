import { useState, useRef, use } from 'react';
import { Text, View, Button, TextInput } from 'react-native';
import {MapView, Camera, RasterSource, RasterLayer, ShapeSource, CircleLayer, UserLocation} from '@maplibre/maplibre-react-native';

import { Place, Coordinates } from './AppTypes'
import { getListCtx } from './AppContext';
import { useLocationCtx } from './AppLocation';
import { animationDuration, MapCircle, MapTemplate } from './AppMaps';

const c0 = {longitude: -3.663, latitude: 40.515}

export function MapScreen() {
	console.log("Rendering MapWindow");

	const updatePlaces = getListCtx().updatePlaces

	const [userText, setText] = useState<string>('');
	const [coord, setCoord] = useState<Coordinates | undefined>(undefined);
	const [errorMsg, setError] = useState<string>('');
	const [userCentedMap, setUserCenteredMap] = useState<boolean>(true);
	const debug = false;

	// const { userLocation, refreshLocation } = useLocationCtx();

	// useEffect(() => {refreshLocation()}, []);

	const cameraRef = useRef<any>(null);


	function goToUser(zoom: number) {
		setUserCenteredMap(true);
		setTimeout(() => setUserCenteredMap(false), animationDuration / 2);
		// if (!userLocation) return;
		// refreshLocation();
		// const lat = userLocation.latitude;
		// const lon = userLocation.longitude;
		// cameraRef.current?.setCamera({
		// 	centerCoordinate: [
		// 		lon,
		// 		lat
		// 	],
		// 	zoomLevel: zoom,
		// 	animationDuration: 2000,
		// })
	};

	return(<>
	<View style={{alignItems: 'center', marginBottom: 25}}>
		<TextInput 
			placeholder='Type some place'
			value={userText}
			onChangeText={setText}
			style={{borderWidth:1, margin:10, width: 200, borderColor: 'red', color: 'green'}}
		/>
		<Text style={{color:'red'}}>
			{errorMsg? errorMsg : null}
		</Text>
		<Button title='Add place' onPress={() => {
			if (debug){
				updatePlaces((prev: Place[]) => [...prev, {id: Math.random().toString(), coordinates: c0, name: '42 Madird', fav: false}]);
				return;
			}
			if (!userText || userText == '')
			{
				setError('Insert a name!');
				return;
			}
			if (!coord)
			{
				setError('Select a point on the map!');
				return;
			}
			updatePlaces((prev: Place[]) => [...prev, {id: Math.random().toString(), coordinates: coord, name: userText, fav: false}]);
			setText('');
			setCoord(undefined);
			setError('');
			}} />
	</View>
	<View style={{flex:1, marginVertical: 10}}>
		<MapTemplate
			onPress={(feature:any) => {setUserCenteredMap(false); const [longitude, latitude] = feature.geometry.coordinates; setCoord({latitude: latitude, longitude: longitude})}}
			cameraRef={cameraRef}
			zoomLevel={9}
			userCentered={userCentedMap}
			onMapLoaded={() => setUserCenteredMap(false)}
			displayUser={true}
			// centerCoordinate={userLocation !== null? userLocation : undefined}
		>
			{coord && <MapCircle 
				center={coord}
			/>}
		</MapTemplate>
		<View style={{alignSelf: 'center', marginTop: 10}}>
			<Button title='Find me' onPress={() => goToUser(14)} />
		</View>
	</View>
		</>)
}
