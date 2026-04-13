import { useState, useRef, use, useEffect } from 'react';
import { Text, View, Button, TextInput } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Place, Coordinates, RootStackParamList, ExploreScreenProps } from './Types'
import { UseListCtx } from './Context';
import { useLocationCtx } from './Location';
import { animationDuration, MapCircle, MapTemplate } from './Maps';
import { EditPlace } from './EditPlace';
import { useStyle } from './Themes';

const Stack = createNativeStackNavigator<RootStackParamList>();

const c0 = {longitude: -3.663, latitude: 40.515}

export function ExploreScreen({navigation}: ExploreScreenProps) {
	console.log("Rendering MapWindow");

	const {globalStyles} = useStyle();
	const [coord, setCoord] = useState<Coordinates | undefined>(undefined);
	const [error, setError] = useState<string | undefined>(undefined);
	const [userCentedMap, setUserCenteredMap] = useState<boolean>(true);

	const cameraRef = useRef<any>(null);


	function goToUser(zoom: number) {
		setUserCenteredMap(true);
		setTimeout(() => setUserCenteredMap(false), animationDuration / 2);
	};

	return(<>
	<View style={[globalStyles.screenContainer, {flex:1, marginVertical: 0}]}>
		<MapTemplate
			onPress={(feature:any) => {setError(undefined); setUserCenteredMap(false); const [longitude, latitude] = feature.geometry.coordinates; setCoord({latitude: latitude, longitude: longitude})}}
			cameraRef={cameraRef}
			zoomLevel={9}
			userCentered={userCentedMap}
			onMapLoaded={() => setUserCenteredMap(false)}
			displayUser={true}
		>
			{coord && <MapCircle 
				center={coord}
			/>}
		</MapTemplate>
		<View style={{alignItems: 'center'}}>
			{error &&
			<Text style={{color: 'white', backgroundColor: 'red', fontWeight: 'bold', padding: 5, marginTop: 10}}>
				{error}
			</Text>}
		</View>
		<View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10}}>
			<Button title='Save place' onPress={() => {
				if (!coord)
				{
					setError('Select a point on the map!');
					return;
				}
				const place = {
					id: Math.random().toString(),
					coordinates: coord,
					name: '',
					fav: false,
				};
				navigation.navigate("EditPlace", {place: place, mode: 'add'});
				setCoord(undefined);
				setError('');
			}}/>
			<Button title='Find me' onPress={() => goToUser(14)} />
		</View>
	</View>
		</>)
}

export function ExploreStack() {
	console.log("Rendering ListStack");
	const {globalStyles} = useStyle();
	
	return(
		<Stack.Navigator initialRouteName='Explore' screenOptions={{
			headerShown: true,
			headerTitleStyle: globalStyles.title,
			headerStyle: globalStyles.titleContainer,
		}}>
			<Stack.Screen name="Explore" options={{title: 'Map', headerShown: false}} component={ExploreScreen} />
			<Stack.Screen name="EditPlace" options={{title: 'Add place'}} component={EditPlace} />
		</Stack.Navigator>
	);
}
