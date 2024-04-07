import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';
import { calculateMagnitude, createTimeSeriesDataset, saveTimeSeriesToCSV } from '../services/CSVHelper';

const ReadCSVScreen = () => {
  const [csvData, setCSVData] = useState([]);

  useEffect(() => {
    readCSV();
  }, []);

  const readCSV = async () => {
    try {
      const path = FileSystem.documentDirectory + 'Download/accelerometer_data.csv';
      const fileInfo = await FileSystem.getInfoAsync(path);
      if (fileInfo.exists) {
        const content = await FileSystem.readAsStringAsync(path);
        const result = Papa.parse(content, { header: true, skipEmptyLines: true, error: (error) => console.error('CSV parsing error:', error) });
  
        if (result.errors.length > 0) {
          console.error('CSV parsing errors:', result.errors);
        }
  
        // Filter out rows with too few fields
        const filteredData = result.data.filter(row => Object.keys(row).length === 4);
  
        setCSVData(filteredData);
      } else {
        console.log('CSV file does not exist.');
      }
    } catch (error) {
      console.error('Error reading CSV file:', error);
    }
  };
  
  
  
  
  

  const clearCSV = async () => {
    try {
      const path = FileSystem.documentDirectory + 'Download/accelerometer_data.csv';
      await FileSystem.deleteAsync(path);
      setCSVData([]); // Clear the CSV data state after clearing the file
    } catch (error) {
      console.error('Error clearing CSV file:', error);
    }
  };

  const processAndSaveTimeSeries = async () => {
    try {
      // Step 1: Perform preprocessing - Calculate magnitude of user acceleration
      const processedData = calculateMagnitude(csvData);

      // Step 2: Create time series dataset
      const timeSeriesData = createTimeSeriesDataset(processedData);

      // Step 3: Save time series dataset to a new CSV file
      const newFilePath = FileSystem.documentDirectory + 'Download/time_series_data.csv';
      await saveTimeSeriesToCSV(timeSeriesData, newFilePath);
    } catch (error) {
      console.error('Error processing and saving time series data:', error);
    }
  };

  return (
    <ScrollView>
      <View>
        <Button title="Clear CSV Data" onPress={clearCSV} style={styles.button} />
        <Button title="Process and Save Time Series" onPress={processAndSaveTimeSeries} style={styles.button} />
        {csvData.map((row, index) => (
          <View key={index}>
            <Text>X: {row.X}, Y: {row.Y}, Z: {row.Z}, Timestamp: {row.Timestamp}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  button: {
    marginBottom: 10,
  },
  rowContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  rowText: {
    fontSize: 16,
  },
});

export default ReadCSVScreen;
