import { useState, useRef } from 'react';
import { StyleSheet, Text, View, Button, Pressable, FlatList, Modal, Alert } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Place, PlaceUpdater, RootStackParamList } from './Types'
import { MainListProps  } from './Types'
import { UseListCtx } from './Context';
import { EditPlace } from './EditPlace';
import { FavButton, maxRating } from './PlaceUtils';
import { DisplayList } from './ListDisplay';
import { useStyle } from './Themes';
import { Tappable } from './Buttons';
import { PlaceScreen } from './Place';


interface PlaceProps {
	place: Place;
	navigation: any;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function DropdownButton({ place, navigation } : PlaceProps) {
	console.log("Rendering DropdownButton");
	const updatePlaces = UseListCtx().updatePlaces;

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
	<Modal visible={isOpen} backdropColor='rgba(0,0,0,0)' animationType='fade'>
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

function PlaceItem({place, navigation} : PlaceProps) {
	console.log("Rendering PlaceItem");
	const {globalStyles} = useStyle();

	return(
		<View style={[globalStyles.listItemContainer, styles.listItem]}>
			<View style={{flexDirection: 'row', flexShrink: 1}}>
				<FavButton placeId={place.id}/>
				<Pressable onPress={() => navigation.navigate("Place", {placeId: place.id})} style={{flexShrink:1, flex:1}} >
					<Text style={[globalStyles.listText, styles.listText, {flexShrink:1}]}>{place.name}</Text>
				</Pressable>
			</View>
			<View style={{flexDirection: 'row'}}>
				<Text style={[globalStyles.listText, styles.listText]}>{place.rating != undefined? place.rating + '/' + maxRating : null}</Text>
				<DropdownButton place={place} navigation={navigation} />
			</View>
		</View>
	);
}

function ListWindow({route, navigation} : MainListProps) {
	console.log("Rendering ListWindow");
	const {globalStyles} = useStyle();
	const ctx = UseListCtx();

	return (<View style={[globalStyles.screenContainer, styles.listWindow]}>
		<FlatList
			data={ctx.placeList}
			keyExtractor={(item) => item.id}
			renderItem={({item}) => (
				<PlaceItem
					place={item}
					navigation={navigation}
				/>
			)}
		/>
		<Tappable onPress={() => navigation.navigate('DisplayList')} title='View Map' style={{margin: 20, width: 'auto', alignSelf: 'center', position:'absolute', bottom: 20}} />
		</View>
	)
}

export function ListStack() {
	console.log("Rendering ListStack");
	const {globalStyles} = useStyle();
	
	return(
		<Stack.Navigator initialRouteName='MainList' screenOptions={{
			headerShown: true,
			headerTitleStyle: globalStyles.title,
			headerStyle: globalStyles.titleContainer,
			headerBackVisible: false,
		}} >
			<Stack.Screen name="MainList" options={{title: 'My Places'}} component={ListWindow} />
			<Stack.Screen name="Place" options={{title: 'Your Place'}} component={PlaceScreen} />
			<Stack.Screen name="EditPlace" options={{title: 'Edit Place'}} component={EditPlace} />
			<Stack.Screen name="DisplayList" options={{title: 'My Places'}} component={DisplayList} />
		</Stack.Navigator>
	);
}

const styles = StyleSheet.create({
	listWindow: {
		flex: 1,
	},
	listItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	listText: {
		padding: 7,
		paddingVertical: 10,
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
