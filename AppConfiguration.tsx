import { ContextType, ReactNode } from "react";
import { StyleSheet, FlatList, View, Text, Pressable } from "react-native";
import { globalStyles } from "./AppStyles";
import { exportBackup, exportBackupToExternalStorage, importBackup } from "./AppExternalData";
import { getListCtx } from "./AppContext";

type ConfigItemType = {
	type: 'item' | 'title';
	title: string;
	component?: ReactNode;
	onPress?: () => void,
	openScreen?: string,
}

interface ConfigurationItemProps {
	item: ConfigItemType;
}

function ConfigurationItem({item}: ConfigurationItemProps) {
	return(
		<Pressable style={styles.listItem} onPress={item.onPress}>
			<Text style ={styles.listText}>
				{item.title}
			</Text>
		</Pressable>
	);
}

export function ConfigurationScreen() {
	const ctxList = getListCtx()
	const configOptions: ConfigItemType[] = [
		{
			type: 'title',
			title: 'Backup',
		},
		{
			type: 'item',
			title: "Export backup",
			onPress: () => exportBackupToExternalStorage(ctxList.placeList),
		},
		{
			type: 'item',
			title: "Import backup",
			onPress: () => importBackup(ctxList.updatePlaces),
		},
		{
			type: 'item',
			title: "Share backup",
			onPress: () => exportBackup(ctxList.placeList),
		},
	]
	return(
		<View style={styles.listWindow}>
			<FlatList
				data={configOptions}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({item}) => 
					(item.type == 'title'?
						<Text style={styles.configTitle}>{item.title}</Text>
					:
						<ConfigurationItem item={item} />
					)
				}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	listWindow: {
		flex: 1,
		backgroundColor: '#fff',
	},
	listItem: {
		backgroundColor: '#eee',
		borderBottomColor: '#aaa',
		borderBottomWidth: 1,
		// padding: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	configTitle: {
		fontSize: 15,
		backgroundColor: '#666',
		color: '#fff',
		padding: 5,
		fontWeight: 'bold',
	},
	listText: {
		...globalStyles.text,
		padding: 10,
	},
	// dropdownContainer: {
	// 	backgroundColor: '#fff',
	// 	position: 'absolute',
	// 	right: 10,
	// 	top: 40,
	// 	// padding: 10,
	// 	flexDirection: 'column',
	// 	zIndex: 2,
	// },
	// dropdownButton: {
	// 	borderWidth: 1,
	// 	borderColor: '#aaa',
	// 	padding:10,
	// },
	// dropdownText: {
	// 	fontSize: 20,
	// },
})
