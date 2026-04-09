import { useState, useRef, useCallback, useContext } from 'react';
import { StyleSheet, Text, View, Button, Pressable, FlatList, TextInput, Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Place, PlaceProps, PlaceListProps, PlaceSetter } from './App_types'
import {MainListProps, EditPlaceProps, DisplayListProps, RootStackParamList } from './App_types'
import { getListCtx } from './App_context';

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

function EditPlace({route, navigation}: EditPlaceProps) {
	const { place } = route.params;
	const ctx = getListCtx();
	const [changed, setChanged] = useState<boolean>(false);
	const [name, setName] = useState<string>(place.name);

	return (
		<View style={{alignItems: 'center'}}>
			<Text>Name</Text>
			<TextInput
				value={name}
				onChangeText={text => {setName(text); setChanged(true)}}
				style={{borderWidth:1, margin:10, width: 'auto', minWidth: 100 }}
			/>
			<View style={{flexDirection: 'row', justifyContent: 'space-around', alignSelf:'stretch' }}>
				{changed? <Button title="Save" onPress={() => {
					ctx.setPlaces((prev: Place[]) => prev.map(item => item.id !== place.id? item : {
						...item,
						name: name
					}));
					navigation.goBack();
				}}/> : null}
				<Button title="Cancel" onPress={navigation.goBack}/>
			</View>
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
				position: 'absolute',
				top: menuPosition.top,
				right: 20,
				backgroundColor: 'white',
				padding: 10
			}]}>
				<DDButton text="Edit" action={() => {navigation.navigate('EditPlace', {place: place})}} />
				<DDButton text="Delete" action={() => setPlaces(prev => prev.filter(item => item.id !== place.id))} />
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
				<Pressable onPress={() =>
					setPlaces((prev: Place[]) =>
						prev.map((mapPlace: Place) =>
							mapPlace.id === place.id? {...mapPlace, fav: !mapPlace.fav} : mapPlace))}>
					<Text style={[styles.listText]}>
						{place.fav? '❤️' : '🖤'}
					</Text>
				</Pressable>
				<Text style={[styles.listText, {flexShrink:1}]}>{place.name}</Text>
			</View>
			<DropdownButton place={place} setPlaces={setPlaces} navigation={navigation} />
		</View>
	);
}

// function ListWindow({route, navigation, placesList, setPlaces} : MainListProps & {placesList: Place[], setPlaces: PlaceSetter}) {
function ListWindow({route, navigation} : MainListProps) {
	const ctx = getListCtx();

	return (<>
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
		</>
	)
}

export function ListStack({placesList, setPlaces} : {placesList: Place[], setPlaces: PlaceSetter}) {
	// const displayListWindow = useCallback((props: MainListProps) => (
	// 				<ListWindow
	// 					{...props}
	// 					placesList={placesList}
	// 					setPlaces={setPlaces}
	// 				/>), [ placesList, setPlaces ]);

	return(
		<Stack.Navigator initialRouteName='MainList'>
			{/* <Stack.Screen name="MainList" options={{headerShown: false}} children={displayListWindow}/> */}
			<Stack.Screen name="MainList" options={{headerShown: false}} component={ListWindow} />
			<Stack.Screen name="EditPlace" options={{headerShown: false}} component={EditPlace} />
			<Stack.Screen name="DisplayList" options={{headerShown: false}} component={DisplayList} />
		</Stack.Navigator>
	);
}

const styles = StyleSheet.create({
	listItemPlaces: {
		borderBottomColor: '#F80',
		borderBottomWidth: 1,
		// padding: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	listText: {
		color: '#000',
		fontSize: 20,
		padding: 10,
	},
	dropdownContainer: {
		backgroundColor: 'cyan',
		position: 'absolute',
		right: 10,
		top: 40,
		padding: 10,
		flexDirection: 'column',
		zIndex: 2,
	},
	dropdownButton: {
		borderWidth: 1,
		borderColor: '#444',
		padding:5,
	},
	dropdownText: {
		fontSize: 20,
	},
})
