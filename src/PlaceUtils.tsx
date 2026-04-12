import { Pressable, Text, View } from "react-native";
import { getListCtx } from "./Context";
import { Place } from "./Types";
import { globalStyles } from "./Styles";

export const maxRating = 10;

export function FavButton({placeId, onPress, checkFav}: {placeId: string, onPress?: () => void, checkFav?: boolean}) {
	const ctx = getListCtx();
	const place = ctx.placeList.filter(p => p.id === placeId)[0];

	if (onPress === undefined)
		onPress = () => ctx.updatePlaces((prev: Place[]) =>
							prev.map((mapPlace: Place) =>
								mapPlace.id === place.id? {...mapPlace, fav: !mapPlace.fav} : mapPlace));
	if (checkFav === undefined)
		checkFav = place.fav;
	return(
		<Pressable style={{alignSelf: 'flex-start'}}
			onPress={onPress}
		>
			<Text style={[globalStyles.text, {padding: 10}]}>
				{checkFav? '❤️' : '🖤'}
			</Text>
		</Pressable>
	);
}
