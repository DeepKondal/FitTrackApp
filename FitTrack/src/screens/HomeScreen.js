import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import { sendCSVDataToServer } from "../services/CSVService"; // Import the function

// Inside your component or screen
const sendDataToServer = async () => {
  try {
    // Call the function to send CSV data to the server
    await sendCSVDataToServer();
    console.log('CSV data sent successfully.');
    // Optionally, you can perform additional actions after sending the data
  } catch (error) {
    console.error('Error sending CSV data:', error);
    // Handle errors if any
  }
};

const HomeScreen = () => {
  const navigation = useNavigation();

  const goToReadCSVScreen = () => {
    navigation.navigate('ReadCSV');
  };

 const goToCollectedData = () => {
  navigation.navigate('CollectData');
 };

 const goToAccelerometerDatabase = () => {
  navigation.navigate('AccelerometerData');
 };

 const goToAboutUs = () => {
  navigation.navigate('AboutUs');
 };


  return (
    <View style={styles.container}>
      <Text style={styles.text}>Fit-Track app</Text>
      <Button mode="contained" style={styles.button} onPress={goToReadCSVScreen}>
        Recorded Values
      </Button>
      <Button mode="contained" style={styles.button} onPress={goToCollectedData}>
        Collect Acc. Data
      </Button>
      <Button mode="contained" style={styles.button} onPress={goToAccelerometerDatabase}>
        Check Database
      </Button>   
      <Button mode="contained" style={styles.button} onPress={goToAboutUs}>
        About Us
      </Button>
      <Button mode="contained" style={styles.button} onPress={sendDataToServer} >
        Send to server
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // Set background color to white
  },
  text: {
    fontSize: 40,
    marginBottom: 20, // Add some spacing below the text
  },
  button: {
    marginVertical: 10, // Add vertical margin between buttons
    width: 200, // Set a fixed width for the buttons
  },
});

export default HomeScreen;





/*

 const goToPreProcess = () => {
  navigation.navigate('PreProcess')
 };
 
 const goToTimeSeriesDataScreen = () => {
  navigation.navigate('TimeSeriesData');
};

<Button mode="contained" style={styles.button} onPress={goToPreProcess}>
        PreProcess
      </Button>

<Button mode="contained" style={styles.button} onPress={goToTimeSeriesDataScreen}>
        Time Series Data
      </Button>
*/