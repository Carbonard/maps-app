import { useState } from 'react';
import { StyleSheet } from 'react-native';
// import { currentTheme } from './Configuration';

type theme = {
	titleBackgrondColor: string;
	titleColor: string;
	backgroundColor: string;
	textBackgroundColor: string;
	iconFocusColor: string;
	textInputBorder: string;
}

export const themes:theme[] = [
	{// B/N
		titleBackgrondColor: 'rgba(50, 50, 50, 1)',
		textInputBorder: 'rgba(50, 50, 50, 0.3)',
		titleColor: 'rgba(230, 230, 230, 1)',
		backgroundColor: 'rgba(230, 230, 230, 0.75)',
		textBackgroundColor: 'rgba(200, 200, 200, 1)',
		iconFocusColor: 'red',
	},
	{// PurpleTheme
		titleBackgrondColor: 'rgba(40, 0, 70, 1)',
		textInputBorder: 'rgba(40, 0, 70, 0.3)',
		titleColor: 'rgba(200, 200, 250, 1)',
		backgroundColor: 'rgba(200, 200, 250, 0.75)',
		textBackgroundColor: 'rgba(200, 200, 250, 1)',
		iconFocusColor: 'red',
	}
];

export const themesLength = themes.length;

export function newStyles(currentTheme: number) {
	return ({
		titleContainer: {
			backgroundColor: themes[currentTheme].titleBackgrondColor,
		},
		title: {
			color: themes[currentTheme].titleColor,
			fontSize: 25,
		},
		subTitle: {
			color: '#a0f',
			fontSize: 25,
		},
		text: {
			color: '#000',
			fontSize: 15,
		},
		textContainer: {
			backgroundColor: themes[currentTheme].textBackgroundColor,
		},
		listItemContainer: {
			backgroundColor: themes[currentTheme].textBackgroundColor,
			fontSize: 20,
			borderBottomColor: themes[currentTheme].textInputBorder,
			borderBottomWidth: 1,
		},
		listText: {
			color: '#507',
			fontSize: 20,
		},
		screenContainer: {
			backgroundColor: themes[currentTheme].backgroundColor,
		},
		textBox: {
			borderWidth: 1,
			borderColor: themes[currentTheme].textInputBorder,
			borderRadius: 10,
		},
		button: {
			borderRadius: 10,
			backgroundColor: '#000',
			color: '#fff',
		}
	})
}