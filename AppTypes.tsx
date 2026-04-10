import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type Coordinates = {
	latitude: number;
	longitude: number
}

export type Place = {
	id: string;
	name: string;
	coordinates: Coordinates;
	fav: boolean;
	rating?: number;
};

export type PlaceSetter = React.Dispatch<React.SetStateAction<Place[]>>;

export interface PlaceProps {
	place: Place;
	setPlaces: PlaceSetter;
	navigation: any;
};

export interface PlaceListProps {
	placesList: Place[];
	setPlaces: PlaceSetter;
};

// PROPS

export type RootStackParamList = {
  MainList: undefined;
  EditPlace: { place: Place };
  DisplayList: { placesList: Place[] };
};

export type MainListProps = NativeStackScreenProps<RootStackParamList, 'MainList'>;// & {placesList: Place[]; setPlaces: PlaceSetter};
export type EditPlaceProps = NativeStackScreenProps<RootStackParamList, 'EditPlace'>;// & { place: Place; setPlaces: PlaceSetter };
export type DisplayListProps = NativeStackScreenProps<RootStackParamList, 'DisplayList'>;// & { placesList: Place[] };
