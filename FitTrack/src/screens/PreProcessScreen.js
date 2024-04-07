import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';

const PreprocessScreen = () => {
  const [processedData, setProcessedData] = useState([]);

  useEffect(() => {
    preprocessData();
  }, []);

  const preprocessData = async () => {
    try {
      const path = FileSystem.documentDirectory + 'Download/accelerometer_data.csv';
      const fileInfo = await FileSystem.getInfoAsync(path);
      
      if (fileInfo.exists) {
        const content = await FileSystem.readAsStringAsync(path);
        const contentTrimmed = content.trim();
        const result = Papa.parse(content, { header: true });
        console.log('Last row:', rawData[rawData.length - 1]);
        // Check if parsing was successful
        if (!result || !result.data) {
          console.error('Error parsing CSV data');
          return;
        }
  
        // Log the content of the last row
        const rawData = result.data;
        console.log('Last row:', rawData[rawData.length - 1]);
  
        // Check if there are any parsing errors
        if (result && result.errors && result.errors.length > 0) {
          console.error('CSV parsing errors:', result.errors);
          return;
        }
  
        // Filter out rows with too few fields
        const filteredData = rawData.filter(row => Object.keys(row).length >= 4);
  
        // Process userAcceleration data
        const processedData = [];
        for (let i = 0; i < filteredData.length; i++) {
          const row = filteredData[i];
          const magnitude = Math.sqrt(
            Math.pow(parseFloat(row['userAcceleration.x']) || 0, 2) +
            Math.pow(parseFloat(row['userAcceleration.y']) || 0, 2) +
            Math.pow(parseFloat(row['userAcceleration.z']) || 0, 2)
          );
          processedData.push({ magnitude });
        }
  
        setProcessedData(processedData);
        
        // Save the processed data to a new CSV file
        await saveProcessedDataToCSV(processedData);
      } else {
        console.log('CSV file does not exist.');
      }
    } catch (error) {
      console.error('Error preprocessing data:', error);
    }
  };
  
  
  
  

  const saveProcessedDataToCSV = async (data) => {
    try {
      const csvContent = Papa.unparse(data);
      const newPath = FileSystem.documentDirectory + 'Download/processed_data.csv';
      await FileSystem.writeAsStringAsync(newPath, csvContent);
      console.log('Processed data saved to:', newPath);
    } catch (error) {
      console.error('Error saving processed data:', error);
    }
  };

  return (
    <View>
      <Text>Processed Data:</Text>
      {processedData.map((row, index) => (
        <Text key={index}>Magnitude: {row.magnitude}</Text>
      ))}
      <Button title="Reload Data" onPress={preprocessData} />
    </View>
  );
};

export default PreprocessScreen;
