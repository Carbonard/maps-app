import { Pressable, Text } from "react-native";
import { useStyle } from "./Themes";

interface TappableProps {
	title: string;
	color?: string;
	BGcolor?: string;
}

export function Tappable({
	title,
	BGcolor,
	color
}: TappableProps) {
	const {globalStyles} = useStyle();

	if (!BGcolor)
		BGcolor = globalStyles.button.backgroundColor;
	if (!color)
		color = globalStyles.button.color;

	return(
		<Pressable style={[globalStyles.button, {backgroundColor: BGcolor,}]}>
			<Text style={{color: color}}>
				{title}
			</Text>
		</Pressable>
	);
}
