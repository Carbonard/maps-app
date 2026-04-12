import { createContext, useContext } from 'react';
import { Place, PlaceUpdater } from './Types';

export type ListCtxType = {
	placeList: Place[];
	updatePlaces: PlaceUpdater;
};

export const ListCtx = createContext<ListCtxType>(null!);

export function getListCtx() {
	const ctx = useContext(ListCtx);
	if (!ctx)
		alert("Places Context Error");
	return (ctx);
}
