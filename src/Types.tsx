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
	visited?: boolean;
	wished?: boolean;
};

// export type PlaceSetter = React.Dispatch<React.SetStateAction<Place[]>>;
export type PlaceUpdater = (updater: (prev: Place[]) => Place[]) => void;

export interface PlaceProps {
	place: Place;
	updatePlaces: PlaceUpdater;
	navigation: any;
};

export interface PlaceListProps {
	placesList: Place[];
	updatePlaces: PlaceUpdater;
};

// PROPS

export type RootStackParamList = {
	MainList: undefined;
	EditPlace: { place: Place, mode: 'edit' | 'add' };
	DisplayList: undefined;
	Explore: undefined;
};

export type MainListProps = NativeStackScreenProps<RootStackParamList, 'MainList'>;// & {placesList: Place[]; updatePlaces: PlaceSetter};
export type EditPlaceProps = NativeStackScreenProps<RootStackParamList, 'EditPlace'>;// & { place: Place; updatePlaces: PlaceSetter };
export type DisplayListProps = NativeStackScreenProps<RootStackParamList, 'DisplayList'>;// & { placesList: Place[] };
export type ExploreScreenProps = NativeStackScreenProps<RootStackParamList, 'Explore'>;// & { placesList: Place[] };
