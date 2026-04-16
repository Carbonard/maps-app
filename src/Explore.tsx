import { useState, useRef, use, useEffect } from 'react';
import { Text, View, Button, TextInput } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Place, Coordinates, RootStackParamList, ExploreScreenProps } from './Types'
import { UseListCtx } from './Context';
import { useLocationCtx } from './Location';
import { animationDuration, MapCircle, MapTemplate } from './Maps';
import { EditPlace } from './EditPlace';
import { useStyle } from './Themes';
import { Tappable } from './Buttons';

const Stack = createNativeStackNavigator<RootStackParamList>();

const c0 = {longitude: -3.663, latitude: 40.515}

export function ExploreScreen({navigation}: ExploreScreenProps) {
	console.log("Rendering ExploreScreen");

	const {globalStyles} = useStyle();
	const [coord, setCoord] = useState<Coordinates | undefined>(undefined);
	const [error, setError] = useState<string | undefined>(undefined);
	const [userCentedMap, setUserCenteredMap] = useState<boolean>(true);
	let timeoutRef = useRef<number | undefined>(undefined);

	const cameraRef = useRef<any>(null);

	function printError(err: string) {
		setError(err);
		if (timeoutRef.current !== undefined)
				clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {setError(undefined); timeoutRef.current = undefined}, 3000);
	};

	useEffect(() => {
		return () => {
			if (timeoutRef.current !== undefined) {
				clearTimeout(timeoutRef.current);
			}
			setError(undefined);
		};
	}, []);

	// useEffect(clearError, [error]);

	function goToUser(zoom: number) {
		setUserCenteredMap(true);
		setTimeout(() => setUserCenteredMap(false), animationDuration / 2);
	};

	return(<>
	<View style={[globalStyles.screenContainer, {flex:1, marginVertical: 0}]}>
		<MapTemplate
			onPress={(feature:any) => {
				setError(undefined);
				setUserCenteredMap(false);
				setTimeout(() => {
					const [longitude, latitude] = feature.geometry.coordinates;
					setCoord({latitude: latitude, longitude: longitude});
				}, );
			}}
			cameraRef={cameraRef}
			zoomLevel={9}
			userCentered={userCentedMap}
			onMapLoaded={() => setUserCenteredMap(false)}
			displayUser={true}
			rightButtons={[
				<Tappable title='Save place' onPress={() => {
					if (!coord)
					{
						printError('Select a point on the map!');
						// setError('Select a point on the map!');
						// clearError();
						return;
					}
					const place : Place = {
						id: Math.random().toString(),
						coordinates: coord,
						name: '',
						fav: false,
						comments: [],
					};
					navigation.navigate("EditPlace", {place: place, mode: 'add'});
					setCoord(undefined);
					setError(undefined);
				}}/>,
				<Tappable title='Find me' onPress={() => goToUser(14)} />
			]}
		>
			{coord && <MapCircle 
				center={coord}
			/>}
		</MapTemplate>
		<View style={{alignItems: 'center'}}>
			{error &&
			<Text style={{
				color: 'white',
				backgroundColor: 'red',
				fontWeight: 'bold',
				padding: 5,
				// marginTop: 10,
				position: 'absolute',
				bottom: 100,
			}}>
				{error}
			</Text>}
		</View>
		{/* <View >
		</View> */}
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
