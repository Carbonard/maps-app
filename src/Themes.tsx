import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { newStyles } from './Styles';
import { StyleSheet } from 'react-native';

export type StyleCtxType = {
	theme: number;
	setTheme: React.Dispatch<React.SetStateAction<number>>;
	globalStyles: ReturnType<typeof newStyles>;
};

export const StyleCtx = createContext<StyleCtxType>(null!);

export function StylesProvider({children}: {children: ReactNode}) {
	const [theme, setTheme] = useState<number>(0);
	const [style, setStyle] = useState<ReturnType<typeof newStyles>>(newStyles(0));

	const currentStyle = useMemo(() => {
		return(StyleSheet.create(newStyles(theme)));
	}, [theme]);
	
	useEffect(() => {
		setStyle(currentStyle);
	}, [theme]);

	return(
		<StyleCtx.Provider value={{theme: theme, setTheme: setTheme, globalStyles: style}}>
			{children}
		</StyleCtx.Provider>
	);
}

export function useStyle() {
	const ctx = useContext(StyleCtx);
	if (!ctx)
		alert("Places Context Error");
	return (ctx);
}
