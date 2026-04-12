import { MapView, Camera, RasterSource, RasterLayer, ShapeSource, CircleLayer, UserLocation} from '@maplibre/maplibre-react-native';
import { ReactNode, useState } from 'react';
import { Coordinates } from './AppTypes';
import { Button, View, Text } from 'react-native';

const getTileUrl = (mode: string): {urls: string[], attribution: string} => {
    const baseUrls = [
        'https://mt1.google.com/vt/lyrs=',
        'https://mt2.google.com/vt/lyrs=',
        'https://mt3.google.com/vt/lyrs='
    ];
    
    let layer = '';
    switch (mode) {
        case 'street':
            layer = 'm';  // Road map
            break;
        case 'satellite':
            layer = 's';  // Pure satellite
            break;
        case 'hybrid':
            layer = 'y';  // Satellite + labels
            break;
        case 'terrain':
            layer = 'p';  // Terrain
            break;
        case 'terrainLabels':
            layer = 'r';  // Terrain with labels
            break;
        case 'roads':
            layer = 'h';  // Transparent roads overlay
            break;
		case 'ESRI':
			return {
				urls: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
				attribution: '© ESRI, © OpenStreetMap contributors'
			}
        default:
            return {
				urls: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
				attribution: '© OpenStreetMap contributors'
			};
    }
    
    return {
		urls: baseUrls.map(url => `${url}${layer}&x={x}&y={y}&z={z}`),
		attribution: '© Google'
	};
};

interface MapInterfaceProps {
	children?: ReactNode;
	onPress?: ((feature: any) => void);
	defaultCamera?: boolean;
	centerCoordinate?: Coordinates;
	cameraRef?: React.RefObject<any>;
	zoomLevel?: number;
	bounds?: {ne: number[], sw: number[]};
	userCentered?: boolean;
	displayUser?: boolean;
	mode?: 'osm' | 'street' | 'satellite' | 'hybrid' | 'terrain';
	onMapLoaded?: () => void;
};

export function MapTemplate ({
	children = undefined,
	onPress = undefined,
	defaultCamera = true,
	centerCoordinate = undefined,
	cameraRef = undefined,
	zoomLevel = 9,
	bounds = undefined,
	userCentered = true,
	displayUser = true,
	mode = 'satellite',
	onMapLoaded = undefined
	}: MapInterfaceProps){

	const [currentMode, setCurrentMode] = useState<string>(mode);

	// const modeArray = ['osm', 'street', 'satellite', 'hybrid', 'terrain', 'ESRI'];
	const modeArray = ['street', 'satellite', 'hybrid'];
	// const modeCompass = ['normal', 'compass', 'course'];

	return(
		<>
		<MapView style={{flex:1}} onPress={onPress} key={currentMode} onDidFinishLoadingMap={onMapLoaded}>
			<RasterSource
				id={currentMode}
				tileUrlTemplates={getTileUrl(currentMode).urls}
				tileSize={256}
				attribution={getTileUrl(currentMode).attribution}
			>
				<RasterLayer id={currentMode+"Layer"} sourceID={currentMode} maxZoomLevel={18} />
			</RasterSource>

			{defaultCamera && centerCoordinate &&
			<Camera
				ref={cameraRef}
				defaultSettings={{
					zoomLevel: zoomLevel,
					centerCoordinate: [centerCoordinate.longitude, centerCoordinate.latitude],
				}}
				maxZoomLevel={18}
				followUserLocation={userCentered}
				// followUserMode='normal'
				bounds={bounds}
			/>}

			{displayUser &&
			<UserLocation showsUserHeadingIndicator={true} />}

			{children}
		</MapView>
		{/* <Text>{currentMode}</Text> */}
		<View>
			<Button title='Map Mode' onPress={() => {
				setCurrentMode(prev => modeArray[(modeArray.indexOf(prev)+1)%modeArray.length]);
			}} />
		</View>
		</>
	);
}


interface MapCircleProps {
	id?: string;
	key?: string;
	center: Coordinates;
	radious?: number;
	color?: string;
	opacity?: number;
	borderWidth?: number;
	borderColor?: string;
}

export function MapCircle({
	id = '',
	center,
	radious = 8,
	color = '#f00',
	opacity = 0.7,
	borderWidth = 3,
	borderColor = '#000'
	}: MapCircleProps){

	return(
		<ShapeSource
			id={"point-source"+id}
			key={id}
			shape={{
				type: 'FeatureCollection',
				features: [{
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: [center.longitude, center.latitude],
					},
					properties: {}
				}]
			}}
		>
			<CircleLayer
				id={"point-layer"+id}
				style={{
					circleRadius: radious,
					circleColor: color,
					circleOpacity: opacity,
					circleStrokeWidth: borderWidth,
					circleStrokeColor: borderColor
				}}
			/>
		</ShapeSource>
	);
}
