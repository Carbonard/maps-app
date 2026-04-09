import { createContext, useContext } from 'react';
import { Place, PlaceSetter } from './App_types';

export type ListCtxType = {
	placeList: Place[];
	setPlaces: PlaceSetter;
};

export const ListCtx = createContext<ListCtxType>(null!);

export function getListCtx() {
	const ctx = useContext(ListCtx);
	if (!ctx)
		alert("Context Error");
	return (ctx);
}
