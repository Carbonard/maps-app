import { useRef, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Pressable, Keyboard } from 'react-native';

import { Place, Coordinates } from './AppTypes'
import { EditPlaceProps, } from './AppTypes'
import { getListCtx } from './AppContext';
import { maxRating } from './AppPlaceUtils';
import { globalStyles } from './AppStyles';
import { MapCircle, MapTemplate } from './AppMaps';

function EditItem({title, children}: {title: string, children: React.ReactNode}) {
	return(
		<View style={styles.editItemContainer}>
			<Text>{title}</Text>
			<View style={{flex:1}}>
				{children}
			</View>
		</View>
	);
}

function EditionMap({coord, setCoord}: {coord: Coordinates, setCoord: React.Dispatch<React.SetStateAction<Coordinates>>}) {
	console.log("Rendering EditionMap")

	return(
	<View style={{flex: 1, alignSelf: 'stretch', margin: 25, borderWidth: 1}}>
		<MapTemplate
			onPress={(e: any) => {const [longitude, latitude] = e.geometry.coordinates; setCoord({latitude: latitude, longitude: longitude})}}
			centerCoordinate={coord}
			zoomLevel={15}
			displayUser={true}
		>
			<MapCircle center={coord}/>
		</MapTemplate>
	</View>
	);
}

export function EditPlace({route, navigation}: EditPlaceProps) {
	console.log("Rendering EditPlace");
	const { place } = route.params;

	const ctx = getListCtx();
	const [name, setName] = useState<string>(place.name);
	const [coord, setCoord] = useState<Coordinates>(place.coordinates);
	const [rating, setRating] = useState<string|undefined>(place.rating != undefined? place.rating.toString() : '');
	const [fav, setFav] = useState<boolean>(place.fav);
	const changed = (name != place.name || coord != place.coordinates || rating != place.rating || fav !== place.fav)

	const originalFav = place.fav;
	const [width, setWidth] = useState(40);
	const [height, setHeight] = useState(20);
	const ratingRef = useRef<TextInput>(null);

	function checkRating(input: string | undefined) {
		if (!input)
			return 1;
		if (input.split('.').length > 2)
			return 0;
		if (input.includes('-') || input.includes(','))
			return 0;
		if (parseFloat(input) < 0 || parseFloat(input) > maxRating)
			return 0;
		return 1;
	}

	return (
		<Pressable style={styles.editContainer} onPress={Keyboard.dismiss}>
			<EditItem title='Name'>
				<TextInput
					value={name}
					onChangeText={text => setName(text)}
					style={styles.name}
					multiline
				/>
			</EditItem>

			<EditItem title='Rating'>
				<View style={styles.ratingContainer}>
				<TextInput
					ref={ratingRef}
					placeholder='...'
					placeholderTextColor='#ccc'
					keyboardType='numeric'
					value={rating?? ''}
					onChangeText={(rating: string | undefined) => {
						rating = rating?.replace(',', '.');
						checkRating(rating)? setRating(rating) : {}}}
					onContentSizeChange={(e) => {setHeight(e.nativeEvent.contentSize.height); setWidth(e.nativeEvent.contentSize.width)}}
					style={styles.rating}
				/>
				<Text style={[globalStyles.text, rating? null : {color: '#ccc'}]}
					onPress={() => {
						if (ratingRef.current?.isFocused())
							ratingRef.current.blur();
						ratingRef.current?.focus()}}
				>
					/{maxRating}
				</Text>
				</View>
			</EditItem>

			<EditItem title='Favorite'>
				<Pressable style={{alignSelf: 'flex-start'}} onPress={() => setFav(prev => !prev)}>
					<Text style={[globalStyles.text, {padding: 10, borderWidth:1, }]}>
						{fav? '❤️' : '🖤'}
					</Text>
				</Pressable>
			</EditItem>

			<EditionMap coord={coord} setCoord={setCoord} />

			<View style={styles.buttonsContainer}>
				{(changed || place.fav != originalFav)? <Button title="Save" onPress={() => {
					ctx.updatePlaces((prev: Place[]) => prev.map(item => item.id !== place.id? item : {
						...item,
						name: name,
						coordinates: coord,
						rating: rating? parseFloat(rating): undefined,
						fav: fav
					}));
					navigation.goBack();
				}}/> : null}
				<Button title="Cancel" onPress={navigation.goBack}/>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	editContainer: {
		flex: 1,
		alignItems: 'center',
		paddingTop:15
	},
	editItemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 20
	},
	name: {
		borderWidth: 1,
		borderColor: '#ddd',
		margin: 10,
		width: 'auto',
		minWidth: 150
	},
	ratingContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	rating: {
		...globalStyles.text,
		borderWidth: 1,
		borderColor: '#eee',
		marginLeft: 10,
		// width: 60,
		textAlign: 'center'
	},
	mapContainer: {
		flex: 1,
		marginHorizontal: 30,
		marginVertical: 10,
		borderWidth: 1,
		alignSelf: 'stretch',
	},
	buttonsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignSelf: 'stretch',
		margin: 20,
	},
})
