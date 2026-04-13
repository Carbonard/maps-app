import { Pressable, Text } from "react-native";
import { useStyle } from "./Themes";

interface TappableProps {
	title: string;
	onPress: () => void;
	style?: any;
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
		disabledBGcolor = globalStyles.button.dissabledBackgroundColor;
	if (!disabledColor)
		disabledColor = globalStyles.button.dissabledColor;

	return(
		<Pressable
			style={[
				globalStyles.button, {backgroundColor: disabled? disabledBGcolor : BGcolor,}, style]}
			onPress={onPress}
			disabled={disabled}
		>
			<Text style={{color: disabled? disabledColor : color}}>
				{title}
			</Text>
		</Pressable>
	);
}
