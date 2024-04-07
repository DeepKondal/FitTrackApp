import { queryDataFromDatabase, clearDatabase } from './DatabaseService';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import Papa from 'papaparse';


export const exportDataToCSV = async () => {
    try {
        // Query data from SQLite database
        const data = await queryDataFromDatabase();
        console.log('Data from database:', data);

        // Filter out rows with missing values
        const filteredData = data.filter(entry => !isNaN(entry.x) && !isNaN(entry.y) && !isNaN(entry.z) && !isNaN(entry.timestamp));
        console.log('Filtered data:', filteredData);

        // Format filtered data into CSV
        const csvData = formatDataToCSV(filteredData);
        console.log('Formatted CSV data:', csvData);

        // Check if csvData is valid
        if (!csvData || csvData.trim() === '') {
            console.error('CSV data is empty.');
            return;
        }

        // Specify the directory path where the file will be saved
        const directoryPath = FileSystem.documentDirectory + 'Download/';
        // Create the directory if it doesn't exist
        await FileSystem.makeDirectoryAsync(directoryPath, { intermediates: true });

        // Specify the file path
        const filePath = directoryPath + 'accelerometer_data.csv';

        let combinedData = csvData; // Initialize combined data with new data
        // Check if file exists
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        if (fileInfo.exists) {
            // Read existing data
            const existingData = await FileSystem.readAsStringAsync(filePath);
            // Combine existing data with new data
            combinedData = existingData + '\n' + csvData;
        }

        // Write combined data to the file (appending to existing data)
        await FileSystem.writeAsStringAsync(filePath, combinedData, { encoding: FileSystem.EncodingType.UTF8, append: true });

        console.log('CSV file written successfully:', filePath);

        // Clear the database after successful export
        clearDatabase();

    } catch (error) {
        console.error('Error exporting data:', error);
    }
};

// Function to format data into CSV format
const formatDataToCSV = (data) => {
    if (!data || data.length === 0) {
        return ''; // Return empty string if no data
    }

    // Header row
    let csv = 'X,Y,Z,Timestamp\n';

    // Iterate over each data entry and append to CSV
    data.forEach((entry) => {
        // Check if all required fields are present and valid
        if (
            !isNaN(entry.x) && !isNaN(entry.y) && !isNaN(entry.z) && !isNaN(entry.timestamp) &&
            entry.x !== null && entry.y !== null && entry.z !== null && entry.timestamp !== null &&
            typeof entry.x === 'number' && typeof entry.y === 'number' && typeof entry.z === 'number' &&
            typeof entry.timestamp === 'number'
        ) {
            // Append only if all values are present and valid
            csv += `${entry.x},${entry.y},${entry.z},${entry.timestamp}\n`;
        }
    });

    return csv;
};

export const sendCSVDataToServer = async () => {
    try {
        console.log('Starting to send CSV data to server...');
        
        // Path to the CSV file on the device's storage
        const csvFilePath = FileSystem.documentDirectory + 'Download/accelerometer_data.csv';
        console.log('CSV file path:', csvFilePath);
        
        // Read the CSV file
        const csvData = await FileSystem.readAsStringAsync(csvFilePath);
        console.log('CSV data read successfully:', csvData);
        
        // Parse the CSV data
        const parsedData = Papa.parse(csvData, { header: true });
        console.log('Parsed CSV data:', parsedData);
        
        // Extract the data rows
        const rows = parsedData.data;
        console.log('Extracted data rows:', rows);
        
        // Send the data to the server
        const BASE_URL = 'http://192.168.2.16:3000'; // Change this to your server's URL
        const endpoint = '/csv-data'; // Change this to your server's endpoint for uploading CSV data
        const url = `${BASE_URL}${endpoint}`;
        console.log('Sending CSV data to server at URL:', url);
        
        // Make an HTTP POST request to send the CSV data
        const response = await axios.post(url, rows);
        console.log('CSV data sent to server:', response.data);
        
        console.log('CSV data sent successfully to server!');
    } catch (error) {
        console.error('Error sending CSV data to server:', error);
    }
};

  
  



