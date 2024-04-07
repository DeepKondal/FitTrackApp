import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Button } from 'react-native';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';

const TimeSeriesDataScreen = () => {
  const [timeSeriesData, setTimeSeriesData] = useState([]);

  useEffect(() => {
    readTimeSeriesCSV();
  }, []);

  const readTimeSeriesCSV = async () => {
    try {
      const path = FileSystem.documentDirectory + 'Download/time_series_data.csv';
      const fileInfo = await FileSystem.getInfoAsync(path);
      if (fileInfo.exists) {
        const content = await FileSystem.readAsStringAsync(path);
        const result = Papa.parse(content, { header: true });
        // Remove rows with NaN values
        const cleanedData = result.data.filter(row => {
          return !Object.values(row).some(value => isNaN(value));
        });
        setTimeSeriesData(cleanedData);
        console.log(cleanedData);
      } else {
        console.log('Time series CSV file does not exist.');
      }
    } catch (error) {
      console.error('Error reading time series CSV file:', error);
    }
  };

  const clearCSVFile = async () => {
    try {
      const path = FileSystem.documentDirectory + 'Download/time_series_data.csv';
      await FileSystem.writeAsStringAsync(path, '', { encoding: FileSystem.EncodingType.UTF8 });
      setTimeSeriesData([]);
      console.log('CSV file cleared successfully.');
    } catch (error) {
      console.error('Error clearing CSV file:', error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Time Series Data</Text>
        <Button title="Clear CSV File" onPress={clearCSVFile} />
        {timeSeriesData.map((row, index) => (
          <View key={index} style={styles.rowContainer}>
            <Text style={styles.rowText}>User Acceleration: {row.userAcceleration}</Text>
            {/* Add more fields if needed */}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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

export default TimeSeriesDataScreen;
