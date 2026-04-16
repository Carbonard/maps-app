import { Pressable, Text, StyleProp, ViewStyle, TextStyle } from "react-native";
import { useStyle } from "./Themes";

export interface TappableProps {
	title: string;
	onPress: () => void;
	style?: StyleProp<ViewStyle>;
	textStyle?: StyleProp<TextStyle>,
	color?: string;
	BGcolor?: string;
	disabledColor?: string;
	disabledBGcolor?: string;
	disabled?: boolean;
}

export function Tappable({
	title,
	onPress,
	style,
	textStyle,
	BGcolor,
	color,
	disabledColor,
	disabledBGcolor,
	disabled = false,
}: TappableProps) {
	const {globalStyles} = useStyle();

	if (!BGcolor)
		BGcolor = globalStyles.button.backgroundColor;
	if (!color)
		color = globalStyles.button.color;
	if (!disabledBGcolor)
		disabledBGcolor = globalStyles.disabledButton.backgroundColor;
	if (!disabledColor)
		disabledColor = globalStyles.disabledButton.color;

	return(
		<Pressable
			style={[
				globalStyles.button, {backgroundColor: disabled? disabledBGcolor : BGcolor,}, style]}
			onPress={onPress}
			disabled={disabled}
		>
			<Text style={[{color: disabled? disabledColor : color}, textStyle]}>
				{title}
			</Text>
		</Pressable>
	);
}
