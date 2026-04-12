import { useRef, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Pressable, Keyboard } from 'react-native';

import { Place, Coordinates } from './Types'
import { EditPlaceProps, } from './Types'
import { getListCtx } from './Context';
import { FavButton, maxRating } from './PlaceUtils';
import { globalStyles } from './Styles';
import { MapCircle, MapTemplate } from './Maps';

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
			userCentered={false}
		>
			<MapCircle center={coord}/>
		</MapTemplate>
	</View>
	);
}

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

export function EditPlace({route, navigation}: EditPlaceProps) {
	console.log("Rendering EditPlace");
	const { place, mode } = route.params;

	const ctx = getListCtx();
	const [name, setName] = useState<string>(place.name);
	const [coord, setCoord] = useState<Coordinates>(place.coordinates);
	const [rating, setRating] = useState<string>(place.rating != undefined? place.rating.toString() : '');
	const [fav, setFav] = useState<boolean>(place.fav);
	const changed = ( name != place.name
		|| coord != place.coordinates
		|| (parseFloat(rating) != place.rating && rating != '')
		|| (rating == '' && place.rating === 0)
		|| fav !== place.fav
	) 

	const [width, setWidth] = useState(40);
	const [height, setHeight] = useState(20);
	const ratingRef = useRef<TextInput>(null);

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
					onChangeText={(rating) => {
						rating = rating?.replace(',', '.');
						checkRating(rating) && setRating(rating)}}
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
				<FavButton placeId={place.id} onPress={() => setFav(prev => !prev)} checkFav={fav} />
			</EditItem>

			<EditionMap coord={coord} setCoord={setCoord} />

			<View style={styles.buttonsContainer}>
				<Button
					title="Save"
					disabled={coord === undefined || fav === undefined}
					onPress={() => {
						if (mode === 'edit')
						{
							ctx.updatePlaces(prev => prev.map(item => item.id !== place.id? item : {
								...item,
								name: name,
								coordinates: coord,
								rating: (rating && rating != '.')? parseFloat(rating): undefined,
								fav: fav
							}));
						}
						else if (mode === 'add')
						{
							place.name = name;
							place.coordinates = coord;
							if (fav !== undefined)
								place.fav = fav;
							if (rating && rating != '.')
								place.rating = parseFloat(rating);
							ctx.updatePlaces(prev => [...prev, place])
						}
						navigation.goBack();
					}}/>
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
