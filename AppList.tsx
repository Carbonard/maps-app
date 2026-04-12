import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Pressable, FlatList, Modal, Alert } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MapView, Camera, RasterSource, RasterLayer, ShapeSource, CircleLayer, UserLocation} from '@maplibre/maplibre-react-native';

import { RootStackParamList, Place } from './AppTypes'
import { MainListProps, PlaceProps, DisplayListProps,  } from './AppTypes'
import { getListCtx } from './AppContext';
import { EditPlace } from './AppEditPlace';
import { FavButton, maxRating } from './AppPlaceUtils';
import { globalStyles } from './AppStyles';
import { MapCircle, MapTemplate } from './AppMaps';

const Stack = createNativeStackNavigator<RootStackParamList>();

type Bounds = {
	ne: number[];
	sw: number[];
}

function DisplayList({route, navigation}: DisplayListProps) {
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

function DropdownButton({ place, navigation } : PlaceProps) {
	console.log("Rendering DropdownButton");
	const updatePlaces = getListCtx().updatePlaces;

	const [isOpen, setOpen] = useState(false);
	const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
	const buttonRef = useRef<View>(null);
	
	function DDButton({text, action}: {text: string, action: ()=>void}){
		return(
		<Pressable style={styles.dropdownButton} onPress={() => {action(); setOpen(false)}}>
			<Text style={styles.dropdownText}>{text}</Text>
		</Pressable>
	);}

	return(<>
	<Pressable ref={buttonRef}
		onPress={() => {buttonRef.current?.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) =>
			setMenuPosition({
				top: pageY,
				left: pageX,
			}));
			setOpen(prev => !prev)}}>
		<Text style={[styles.listText, {padding:10}]}>{"\u2807"}</Text>
	</Pressable>
	<Modal visible={isOpen} transparent >
		<Pressable style={{flex:1}} onPress={() => setOpen(false)}>
			<View style={[styles.dropdownContainer, {
				top: menuPosition.top,
				right: 20,
			}]}>
				<DDButton text="Edit" action={() => {navigation.navigate('EditPlace', {place: place})}} />
				<DDButton text="Delete" action={() => Alert.alert("Confirm", "Delete this place?", [
						{text: "Delete", onPress: () =>
							updatePlaces(prev => prev.filter(item => item.id !== place.id))},
						{text: "Cancel", onPress: () => {;}},
					])} />
				<DDButton text="Cancel" action={()=>{}} />
			</View>
		</Pressable>
	</Modal>
	</>);
}

// const PlaceItem = memo(
function PlaceItem({place, updatePlaces, navigation} : PlaceProps) {
	console.log("Rendering PlaceItem");

	return(
		<View style={styles.listItem}>
			<View style={{flexDirection: 'row', flex: 1}}>
				<FavButton placeId={place.id}/>
				<Text style={[styles.listText, {flexShrink:1}]}>{place.name}</Text>
			</View>
			<View style={{flexDirection: 'row'}}>
				<Text style={styles.listText}>{place.rating != undefined? place.rating + '/' + maxRating : null}</Text>
				<DropdownButton place={place} updatePlaces={updatePlaces} navigation={navigation} />
			</View>
		</View>
	);
}

function ListWindow({route, navigation} : MainListProps) {
	console.log("Rendering ListWindow");
	const ctx = getListCtx();

	return (<View style={styles.listWindow}>
		<FlatList
			data={ctx.placeList}
			keyExtractor={(item) => item.id}
			renderItem={({item}) => (
				<PlaceItem
					place={item}
					updatePlaces={ctx.updatePlaces}
					navigation={navigation}
				/>
			)}
		/>
		<Button onPress={() => navigation.navigate('DisplayList')} title='View Map' />
		</View>
	)
}

export function ListStack() {
	console.log("Rendering ListStack");
	
	return(
		<Stack.Navigator initialRouteName='MainList' screenOptions={{headerShown: true}}>
			<Stack.Screen name="MainList" options={{title: 'My places'}} component={ListWindow} />
			<Stack.Screen name="EditPlace" options={{title: 'Edit places'}} component={EditPlace} />
			<Stack.Screen name="DisplayList" options={{title: 'My places'}} component={DisplayList} />
		</Stack.Navigator>
	);
}

const styles = StyleSheet.create({
	listWindow: {
		flex: 1,
		backgroundColor: '#fff',
	},
	listItem: {
		backgroundColor: '#eee',
		borderBottomColor: '#aaa',
		borderBottomWidth: 1,
		// padding: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	listText: {
		...globalStyles.text,
		padding: 10,
	},
	dropdownContainer: {
		backgroundColor: '#fff',
		position: 'absolute',
		right: 10,
		top: 40,
		// padding: 10,
		flexDirection: 'column',
		zIndex: 2,
	},
	dropdownButton: {
		borderWidth: 1,
		borderColor: '#aaa',
		padding:10,
	},
	dropdownText: {
		fontSize: 20,
	},
})
