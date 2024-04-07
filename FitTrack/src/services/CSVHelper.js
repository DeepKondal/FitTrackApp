import Papa from 'papaparse';
import * as FileSystem from 'expo-file-system';

// Function to read the CSV file
export const readCSVFile = async (filePath) => {
    try {
        console.log('Reading CSV file:', filePath);
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        if (fileInfo.exists) {
            const content = await FileSystem.readAsStringAsync(filePath);
            const parsedData = Papa.parse(content, { header: true }).data;
            console.log('CSV file read successfully:', parsedData);
            return parsedData;
        } else {
            console.log('CSV file does not exist.');
            return [];
        }
    } catch (error) {
        console.error('Error reading CSV file:', error);
        return [];
    }
};

// Function to calculate magnitude of user acceleration
export const calculateMagnitude = (data) => {
    return data.map(entry => {
        // Check if X, Y, and Z values are not NaN
        if (!isNaN(entry['X']) && !isNaN(entry['Y']) && !isNaN(entry['Z'])) {
            return {
                ...entry,
                userAcceleration: Math.sqrt(entry['X'] ** 2 + entry['Y'] ** 2 + entry['Z'] ** 2)
            };
        } else {
            // If any value is NaN, return null or any default value
            return {
                ...entry,
                userAcceleration: null // or set to any default value
            };
        }
    });
};


// Function to save time series dataset to a new CSV file
export const saveTimeSeriesToCSV = async (data, filePath) => {
    try {
        console.log('Saving time series to CSV:', data);
        const csvContent = Papa.unparse(data);
        await FileSystem.writeAsStringAsync(filePath, csvContent, { encoding: FileSystem.EncodingType.UTF8 });
        console.log('Time series CSV file written successfully:', filePath);
    } catch (error) {
        console.error('Error saving time series to CSV:', error);
    }
};

// Function to create time series dataset
// Function to create a time series dataset including both original accelerometer data and magnitude of user acceleration vectors
// Function to create a time series dataset including both original accelerometer data and magnitude of user acceleration vectors
export const createTimeSeriesDataset = (data) => {
    console.log('Creating time series dataset:', data);
    return data.map(entry => ({
        ...entry,
        userAccelerationMagnitude: Math.sqrt(parseFloat(entry['X']) ** 2 + parseFloat(entry['Y']) ** 2 + parseFloat(entry['Z']) ** 2)
    }));
};

