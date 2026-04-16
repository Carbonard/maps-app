import { useRef, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Pressable, Keyboard, StyleProp, ViewStyle } from 'react-native';

import { Coordinates } from './Types'
import { EditPlaceProps, } from './Types'
import { UseListCtx } from './Context';
import { FavButton, maxRating } from './PlaceUtils';
import { MapCircle, MapTemplate } from './Maps';
import { useStyle } from './Themes';
import { Tappable } from './Buttons';

function EditItem({title, children, style}: {title: string, children: React.ReactNode, style?: StyleProp<ViewStyle>}) {
	const {globalStyles} = useStyle();

	return(
		<View style={[styles.editItemContainer, style]}>
			<Text style={globalStyles.text}>{title}</Text>
			<View >
				{children}
			</View>
		</View>
	);
}

function EditionMap({coord, setCoord}: {coord: Coordinates, setCoord: React.Dispatch<React.SetStateAction<Coordinates>>}) {
	console.log("Rendering EditionMap")

	return(
	<View style={{flex: 1, alignSelf: 'stretch', marginHorizontal: 25}}>
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
	const { globalStyles } = useStyle();
	const { place, mode } = route.params;

	const ctx = UseListCtx();
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
		<Pressable style={[globalStyles.screenContainer, styles.editContainer]} onPress={Keyboard.dismiss}>
			<EditItem title='Name'>
				<TextInput
					value={name}
					onChangeText={text => setName(text)}
					style={[globalStyles.textBox, styles.name]}
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
					style={[globalStyles.text, globalStyles.textBox, styles.rating]}
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

			<EditItem title='Favorite' style={{marginBottom: 10}}>
				<FavButton placeId={place.id} onPress={() => setFav(prev => !prev)} checkFav={fav} />
			</EditItem>

			<EditionMap coord={coord} setCoord={setCoord} />

			<View style={styles.buttonsContainer}>
				<Tappable
					title="Save"
					disabled={!changed || coord === undefined || fav === undefined}
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
				<Tappable title="Cancel" onPress={navigation.goBack}/>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	editContainer: {
		flex: 1,
		alignItems: 'flex-start',
		paddingTop:15
	},
	editItemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 20
	},
	name: {
		margin: 10,
		maxWidth: '90%',
		minWidth: 150
	},
	ratingContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	rating: {
		borderWidth: 1,
		borderColor: 'rgba(0,0,0,0.1)',
		marginLeft: 10,
		// height: 30,
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
