import { useState, useRef } from 'react';
import { StyleSheet, Text, View, Button, Pressable, FlatList, Modal, Alert } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from './Types'
import { MainListProps, PlaceProps,  } from './Types'
import { getListCtx } from './Context';
import { EditPlace } from './EditPlace';
import { FavButton, maxRating } from './PlaceUtils';
import { globalStyles } from './Styles';
import { DisplayList } from './ListDisplay';

const Stack = createNativeStackNavigator<RootStackParamList>();

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
				<DDButton text="Edit" action={() => {navigation.navigate('EditPlace', {place: place, mode: 'edit'})}} />
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
