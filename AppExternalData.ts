import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Place, PlaceUpdater } from './AppTypes';

export const exportBackup = async (appData: Place[]) => {
	try {
		const jsonString = JSON.stringify(appData, null, 2);
		const backupFile = new File(Paths.cache, 'backup.json');
		
		try{
		backupFile.create();}
		catch {}
		backupFile.write(jsonString);

		if (await Sharing.isAvailableAsync())
		{
			await Sharing.shareAsync(backupFile.uri, {
				mimeType: 'application/json',
				dialogTitle: 'Save your backup file',
			});
		}
	} catch (error) {
		console.error('Export failed:', error);
		alert('Failed to export data.');
	}
};

export const importBackup = async (updateStateFunction: PlaceUpdater) => {
	try {
		const result = await DocumentPicker.getDocumentAsync({
			type: ['application/json'],
			copyToCacheDirectory: true,
		});
		if (result.canceled) return;

		const selectedFile = new File(result.assets[0].uri);
		const fileContent = await selectedFile.text();
		const parsedData: Place[] = JSON.parse(fileContent);
		updateStateFunction(prev => parsedData);
		
		alert('Data imported successfully!');
	} catch (error) {
		console.error('Import failed:', error);
		alert('Failed to import data.');
	}
};

export const exportBackupToExternalStorage = async (appData: Place[], fileName = 'backup') => {
	try {
		const jsonString = JSON.stringify(appData, null, 2);
		
		const directory = await Directory.pickDirectoryAsync('Documents');
		const createdFile = directory.createFile(fileName, 'application/json');
		createdFile.write(jsonString);

		alert(`File saved to ${directory.uri}`);
	} catch (error) {
		console.error('Export failed:', error);
		alert('Failed to export data.');
	}
};