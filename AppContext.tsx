import { createContext, useContext } from 'react';
import { Place, PlaceUpdater } from './AppTypes';

export type ListCtxType = {
	placeList: Place[];
	updatePlaces: PlaceUpdater;
};

export const ListCtx = createContext<ListCtxType>(null!);

export function getListCtx() {
	const ctx = useContext(ListCtx);
	if (!ctx)
		alert("Context Error");
	return (ctx);
}
