import { FlatList, Pressable, ScrollView, StyleProp, StyleSheet, Text, TextInput, View, ViewStyle, Modal } from "react-native";
import { CommentType, Place, PlaceProps } from "./Types";
import { useStyle } from "./Themes";
import { ReactNode, useEffect, useLayoutEffect, useState } from "react";
import { maxRating } from "./PlaceUtils";
import { MapCircle, MapTemplate } from "./Maps";
import { Tappable } from "./Buttons";
import { UseListCtx } from "./Context";
import { usePlaces } from "./SaveData";
import { Ionicons } from "@expo/vector-icons";

// interface ItemContainerProps {
// 	title: string;
// 	children: ReactNode;
// 	style?: StyleProp<ViewStyle>;
// }

// function ItemContainer({title, children, style}: ItemContainerProps) {
// 	const {globalStyles} = useStyle();

// 	return(
// 		<View style={[style]}>
// 			<Text style={globalStyles.text}>{title}</Text>
// 			<View>
// 				{children}
// 			</View>
// 		</View>
// 	);
// }

function PlaceMap({place}: {place: Place}) {
	console.log("Rendering EditionMap")
	const [key, setKey] = useState<number>(0);

	return(
	<View style={{flex: 1, alignSelf: 'stretch', marginHorizontal: 25}}>
		<MapTemplate
			centerCoordinate={place.coordinates}
			key={key}
			zoomLevel={15}
			displayUser={true}
			userCentered={false}
			rightButtons={[
				<Tappable title="Center" onPress={() => setKey(key => key + 1)}/>
			]}
		>
			<MapCircle center={place.coordinates}/>
		</MapTemplate>
	</View>
	);
}

function PlaceComments({placeId}: {placeId: string}) {
	console.log("Rendering PlaceComments");

	const {globalStyles} = useStyle();
	const {placeList, updatePlaces} = UseListCtx();

	const place = placeList.find(p => p.id === placeId) as Place;

	const [commentList, setCommentList] = useState<CommentType[]>(place?.comments? place.comments : undefined!);
	const [comment, setComment] = useState<string>('');
	const [addCommentVisible, setAddCommentVisible] = useState(false);

	useEffect(() => {
		updatePlaces(prev => prev.map(prevPlace => prevPlace.id === place.id ? {...prevPlace, comments: commentList} : prevPlace));
	}, [commentList]);

	function AddComment() {
		return(
			<Modal transparent={false} animationType='slide' visible={addCommentVisible} backdropColor='rgba(0,0,0,0.3)' >
			<View style={{position: 'absolute', left: 10, right: 10, top: '33%', padding: 20, backgroundColor:'#aaa'}}>
				<Text style={globalStyles.text}>Add comment:</Text>
				<TextInput
					value={comment}
					onChangeText={(comm) => setComment(comm)}
					multiline
					placeholder="Comment..."
					style={globalStyles.textBox}
				/>
				<View style={{flexDirection: 'row', justifyContent: 'space-around', alignSelf: 'stretch', marginTop: 20}}>
					<Tappable
						title="Save"
						onPress={() => {
								setCommentList(prev => [...prev, {text: comment, id: Math.random().toString()}]);
								
								// updatePlaces(prev => prev.map(prevPlace => prevPlace.id !== place.id ? prevPlace :
									// {...prevPlace, comments: [...prevPlace.comments, {text: comment, id: Math.random().toString()}]}));
								setAddCommentVisible(false)
							}
						}
					/>
					<Tappable title="Discard" onPress={() => setAddCommentVisible(false)}/>
				</View>
			</View>
			</Modal>
		);
	}

	function CommentComp({comment}: {comment: CommentType}) {
		return(
			<View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding:5, borderWidth:1, borderRadius: 50, borderBottomLeftRadius:0, borderTopLeftRadius: 20, margin:5}}>
				<Text style={[globalStyles.text, {flexShrink: 1}]}>
					{comment.text}
				</Text>
				<Pressable onPress={() => {
					setCommentList(prev => prev.filter(prev => prev.id !== comment.id));
					// updatePlaces(prev => prev.map(prevPlace => prevPlace.id !== place.id ? prevPlace :
					// 	{...prevPlace, comments: prevPlace.comments.filter(comm => comm.id !== comment.id)}));
				}}>
					<Text style={{marginRight:3}}>{'\u00D7'}</Text>
				</Pressable>
			</View>
		)
	}

	if (!place)
		return (<View style={{flex:1,alignItems:'center',justifyContent:'center', backgroundColor:'red'}}><Text style={{color:'white', fontWeight:'bold', fontSize: 40, textAlign: 'center'}}>Error 404{'\n\n'}Place not found</Text></View>)

	return(
		<View style={styles.property}>
			<Text style={globalStyles.text}>Comments</Text>
			<FlatList
				scrollEnabled={false}
				data={place.comments}
				extraData={commentList}
				keyExtractor={(comment) => comment.id}
				renderItem={(comment) =>
					<CommentComp comment={comment.item} key={comment.index} />
				}
			/>
			{
				AddComment()
			}
			<Tappable title="Add comment" onPress={() => setAddCommentVisible(true)} style={{margin:10, alignSelf: 'center'}} />
		</View>
	)
}

export function PlaceScreen({navigation, route}: PlaceProps) {
	console.log("Rendering PlaceScreen");
	const {placeId} = route.params;
	const {globalStyles} = useStyle();
	const {placesList} = usePlaces();
	const place = placesList.find(p => p.id === placeId) as Place;

	const getTitle = () => {
		const p = placesList.find(p => p.id === placeId);
		if (!p)
			return ('Error');
		return(p.name);
	}

	useLayoutEffect(() => navigation.setOptions({title: getTitle()}), [place]);

	if (!place)
		return (<View style={{flex:1,alignItems:'center',justifyContent:'center', backgroundColor:'red'}}><Text style={{color:'white', fontWeight:'bold', fontSize: 40, textAlign: 'center'}}>Error 404{'\n\n'}Place not found</Text></View>)

	return(
		<ScrollView style={globalStyles.screenContainer}>
			{/* <ItemContainer title='Name'>
				<Text style={globalStyles.text}>
					{place.name}
				</Text>
			</ItemContainer> */}

			{place.rating &&
			<View style={{flexDirection: 'row'}}>
				<Text style={[globalStyles.text, styles.property]}>Rating:</Text>
				<Text style={[globalStyles.text, styles.property]}>
					{place.rating}/{maxRating}
				</Text>
			</View>}

			<View style={{height: 500}}>
				<Text style={[globalStyles.text, styles.property]}>
					Location:
				</Text>
				<PlaceMap place={place} />
			</View>

			<PlaceComments placeId={placeId} />
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	property: {
		margin: 10,
	}
})
