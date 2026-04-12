import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from "@expo/vector-icons/Ionicons"

import { ListCtx } from './Context';
import { usePlaces } from './SaveData';
import { LocationProvider } from './Location';
import { ExploreStack, ExploreScreen } from './Explore';
import { ListStack } from './ListMain';
import { ConfigurationScreen } from './Configuration';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const Tab = createBottomTabNavigator();

function MainTabs() {
	console.log("Rendering MainTabs");
	const {placesList, updatePlaces} = usePlaces();

	const createIcon = (Name: IconName, focusName: IconName) => (
		({ focused, color, size }: {focused: boolean, color: string, size: number}) =>
					<Ionicons
						name={focused? focusName : Name}
						size={size}
						color={color}
					/>);

	return(
		<LocationProvider>
		<ListCtx.Provider value={{placeList: placesList, updatePlaces: updatePlaces}}>
			<Tab.Navigator initialRouteName="Explore"
				screenOptions={{
					tabBarActiveTintColor: 'red',
					tabBarInactiveTintColor: 'black',
					headerShown: false,
				}}>
				<Tab.Screen name="List of places"
					options={{ tabBarIcon: createIcon("list-outline", "list-sharp")}}
					component={ListStack}
				/>
				<Tab.Screen name="Explore"
					options={{ tabBarIcon: createIcon("compass-outline", "compass-sharp")}}
					component={ExploreStack}
				/>
				<Tab.Screen name="Configuration"
					options={{
						tabBarIcon: createIcon("cog-outline", "cog-sharp"),
						headerShown: true,
					}}
					component={ConfigurationScreen}
				/>
			</Tab.Navigator>
		</ListCtx.Provider>
		</LocationProvider>
	);
}

export default function App() {
	console.log("Rendering default");
	return (
		<SafeAreaProvider>
			<NavigationContainer>
				<MainTabs />
			</NavigationContainer>
		</SafeAreaProvider>
	);
}

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: '#305',
// 		alignItems: 'stretch',
// 		textAlign: 'center'
// 	},
// 	title: {
// 		paddingTop:10,
// 		alignSelf: 'center',
// 		fontSize: 30,
// 	},
// 	text: {
// 		color: '#000',
// 	},
// 	mainWindow: {
// 		flex:1,
// 		padding:20,
// 		width: '100%',
// 		alignSelf: 'center'

// 	},
// });
