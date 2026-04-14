import { useState } from 'react';
import { StyleSheet } from 'react-native';
// import { currentTheme } from './Configuration';

type theme = {
	titleBackgroundColor: string;
	titleColor: string;
	backgroundColor: string;
	textColor: string;
	textBackgroundColor: string;
	buttonBackgroundColor: string;
	buttonColor: string;
	disabledBackground: string;
	disabledColor: string;
	iconFocusColor: string;
	iconNoFocusColor: string;
	textInputBorder: string;
}

type rgb = [number, number, number];

function lightTheme(
	headerColor: rgb,
	midColor: rgb,
	BGColor: rgb,
) {
	return {
		titleBackgroundColor: `rgba(${headerColor[0]}, ${headerColor[1]}, ${headerColor[2]}, 1)`,
		buttonBackgroundColor: `rgba(${headerColor[0]}, ${headerColor[1]}, ${headerColor[2]}, 1)`,
		disabledBackground: `rgba(${headerColor[0]}, ${headerColor[1]}, ${headerColor[2]}, 0.75)`,
		textInputBorder: `rgba(${headerColor[0]}, ${headerColor[1]}, ${headerColor[2]}, 0.3)`,
		textColor: `rgba(${headerColor[0]}, ${headerColor[1]}, ${headerColor[2]}, 1)`,
		textBackgroundColor: `rgba(${midColor[0]}, ${midColor[1]}, ${midColor[2]}, 1)`,
		titleColor: `rgba(${BGColor[0]}, ${BGColor[1]}, ${BGColor[2]}, 1)`,
		buttonColor: `rgba(${BGColor[0]}, ${BGColor[1]}, ${BGColor[2]}, 1)`,
		disabledColor: `rgba(${BGColor[0]}, ${BGColor[1]}, ${BGColor[2]}, 0.5)`,
		backgroundColor: `rgba(${BGColor[0]}, ${BGColor[1]}, ${BGColor[2]}, 1)`,
		iconNoFocusColor: `rgba(${BGColor[0]}, ${BGColor[1]}, ${BGColor[2]}, 1)`,
		iconFocusColor: 'red',
	}
}


export const themes:theme[] = [
	// B/N high constrast
	{...lightTheme([0, 0, 0], [170, 170, 170], [220, 220, 220]), iconFocusColor: '#d00'},
	// B/N low constras
	{...lightTheme([50, 50, 50], [230, 230, 230], [200, 200, 200]), iconFocusColor: '#fff'},
	// Purple
	{...lightTheme([40, 0, 70], [180, 180, 250], [200, 200, 250]), iconFocusColor: '#f60'},
	// Green
	{...lightTheme([0, 80, 40], [200, 230, 200], [230, 250, 230]), iconFocusColor: '#ff0'},
	// Red
	{...lightTheme([200, 0, 0], [170, 170, 170], [200, 200, 200]), textColor: '#000', iconFocusColor: '#fff', iconNoFocusColor: '#000'},
];

export const themesLength = themes.length;

export function newStyles(currentTheme: number) {
	return ({
		titleContainer: {
			backgroundColor: themes[currentTheme].titleBackgroundColor,
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
			color: themes[currentTheme].textColor,
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
			borderRadius: 100,
			padding: 10,
			backgroundColor: themes[currentTheme].buttonBackgroundColor,
			color: themes[currentTheme].buttonColor,
			dissabledBackgroundColor: themes[currentTheme].disabledBackground,
			dissabledColor: themes[currentTheme].disabledColor
		},
		icon: {
			focusColor: themes[currentTheme].iconFocusColor,
			noFocusColor: themes[currentTheme].iconNoFocusColor
		},
	})
}