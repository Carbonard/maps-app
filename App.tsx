import { useState, useCallback } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { Place, Coordinates, PlaceListProps, PlaceSetter } from './App_types'
import { ListStack } from './App_list'
import { ListCtx } from './App_context';


type IconName = React.ComponentProps<typeof Ionicons>['name'];

const Tab = createBottomTabNavigator();

function MapWindow({placesList, setPlaces}: PlaceListProps) {
	const [userText, setText] = useState<string>('');
	const [coord, setCoord] = useState<Coordinates | undefined | void>();
	const [errorMsg, setError] = useState<string>('');
	const debug = false;

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
				setPlaces((prev: Place[]) => [...prev, {id: Math.random().toString(), coordinates: {latitude: 0, longitude: 0}, name: 'Default Name', fav: false}]);
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
			setPlaces((prev: Place[]) => [...prev, {id: Math.random().toString(), coordinates: coord, name: userText, fav: false}]);
			if (debug) {
				setText('Test Name');
				setCoord({latitude: 0, longitude: 0});
			}
			else {
				setText('');
				setCoord();
			}
			setError('');
			}} />
	</View>
	<View style={{flex:1}}>
		<MapView
			style={{flex:1}}
			initialRegion={{
			latitude: 40.4168,
			longitude: -3.7038,
			latitudeDelta: 0.05,
			longitudeDelta: 0.05,
			}}
			showsUserLocation={true}
			onPress={(e) => {
				setCoord(e.nativeEvent.coordinate);
			}}
		>
			{coord ? <Marker coordinate={{latitude: coord.latitude, longitude: coord.longitude}} title='XXX' /> : null}
		</MapView>
	</View>
		</>)
}

function MainTabs() {
	const [placesList, setPlaces] = useState<Place[]>([]);

	const createIcon = (Name: IconName, focusName: IconName) => (
		useCallback(({ focused, color, size }: {focused: boolean, color: string, size: number}) =>
					<Ionicons
						name={focused? focusName : Name}
						size={size}
						color={color}
					/>, [Name, focusName]));
	const displayMapWindow = useCallback(
		(props: any) => <MapWindow {...props} placesList={placesList} setPlaces={setPlaces} />,
		[ placesList, setPlaces ]
	);
	const displayListStack = useCallback(
		(props: any) => <ListStack {...props} placesList={placesList} setPlaces={setPlaces} />,
		[ placesList, setPlaces ]
	);

	return(
		<ListCtx.Provider value={{placeList: placesList, setPlaces: setPlaces}}>
		<Tab.Navigator initialRouteName="Explorer"
			screenOptions={{
				tabBarActiveTintColor: 'red',
				tabBarInactiveTintColor: 'black',
			}}>
			<Tab.Screen name="List of places"
				options={{ tabBarIcon: createIcon("list-outline", "list-sharp") }}
				children={displayListStack}
			/>
			<Tab.Screen name="Explorer"
				options={{ tabBarIcon: createIcon("compass-outline", "compass-sharp") }}
				children={displayMapWindow}
			/>
		</Tab.Navigator>
		</ListCtx.Provider>
	);
}

export default function App() {
	return (
		<SafeAreaProvider>
			<NavigationContainer>
				<MainTabs />
			</NavigationContainer>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#305',
		alignItems: 'stretch',
		textAlign: 'center'
	},
	title: {
		paddingTop:10,
		alignSelf: 'center',
		fontSize: 30,
	},
	text: {
		color: '#000',
	},
	mainWindow: {
		flex:1,
		padding:20,
		width: '100%',
		alignSelf: 'center'

	},
});
