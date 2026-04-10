import { useState, useRef } from 'react';
import { StyleSheet, Text, View, Button, Pressable, FlatList, Modal, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList, Place, PlaceSetter } from './AppTypes'
import {MainListProps, PlaceProps, DisplayListProps,  } from './AppTypes'
import { getListCtx } from './AppContext';
import { EditPlace } from './AppEditPlace';
import { FavButton, maxRating } from './AppPlaceUtils';
import { globalStyles } from './AppStyles';

const Stack = createNativeStackNavigator<RootStackParamList>();

function DisplayList({route, navigation}: DisplayListProps) {
	const { placesList } = route.params;

	return(
	<View style={{flex:1}}>
	<MapView style={{flex:1}}>
		{placesList.map((item: Place) => (
			<Marker key={item.id} title={item.name} coordinate={item.coordinates} />
		))}
	</MapView>
	</View>
	);
}

function DropdownButton({ place, setPlaces, navigation } : PlaceProps) {
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
							setPlaces(prev => prev.filter(item => item.id !== place.id))},
						{text: "Cancel", onPress: () => {;}},
					])} />
				<DDButton text="Cancel" action={()=>{}} />
			</View>
		</Pressable>
	</Modal>
	</>);
}

function PlaceItem({place, setPlaces, navigation} : PlaceProps) {

	return(
		<View style={styles.listItemPlaces}>
			<View style={{flexDirection: 'row', flex: 1}}>
				<FavButton placeId={place.id}/>
				<Text style={[styles.listText, {flexShrink:1}]}>{place.name}</Text>
			</View>
			<View style={{flexDirection: 'row'}}>
				<Text style={styles.listText}>{place.rating != undefined? place.rating + '/' + maxRating : null}</Text>
				<DropdownButton place={place} setPlaces={setPlaces} navigation={navigation} />
			</View>
		</View>
	);
}

// function ListWindow({route, navigation, placesList, setPlaces} : MainListProps & {placesList: Place[], setPlaces: PlaceSetter}) {
function ListWindow({route, navigation} : MainListProps) {
	const ctx = getListCtx();

	return (<View style={styles.listWindow}>
		<FlatList
			data={ctx.placeList}
			keyExtractor={(item) => item.id}
			renderItem={({item}) => (
				<PlaceItem
					place={item}
					setPlaces={ctx.setPlaces}
					navigation={navigation}
				/>)}
		/>
		<Button onPress={() => navigation.navigate('DisplayList', { placesList: ctx.placeList })} title='View Map' />
		</View>
	)
}

export function ListStack({placesList, setPlaces} : {placesList: Place[], setPlaces: PlaceSetter}) {
	return(
		<Stack.Navigator initialRouteName='MainList'>
			<Stack.Screen name="MainList" options={{headerShown: false}} component={ListWindow} />
			<Stack.Screen name="EditPlace" options={{headerShown: false}} component={EditPlace} />
			<Stack.Screen name="DisplayList" options={{headerShown: false}} component={DisplayList} />
		</Stack.Navigator>
	);
}

const styles = StyleSheet.create({
	listWindow: {
		flex: 1,
		backgroundColor: '#fff',
	},
	listItemPlaces: {
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
