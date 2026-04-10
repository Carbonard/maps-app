import { Pressable, Text, View } from "react-native";
import { getListCtx } from "./AppContext";
import { Place } from "./AppTypes";
import { globalStyles } from "./AppStyles";

export const maxRating = 10;

export function FavButton({placeId}: {placeId: string}) {
	const ctx = getListCtx();
	const place = ctx.placeList.filter(p => p.id === placeId)[0];

	return(
		<Pressable style={{alignSelf: 'flex-start'}}
			onPress={() =>
				ctx.setPlaces((prev: Place[]) =>
					prev.map((mapPlace: Place) =>
						mapPlace.id === place.id? {...mapPlace, fav: !mapPlace.fav} : mapPlace))}
		>
			<Text style={[globalStyles.text, {padding: 10}]}>
				{place.fav? '❤️' : '🖤'}
			</Text>
		</Pressable>
	);
}