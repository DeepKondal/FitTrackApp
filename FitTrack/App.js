import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import AccelerometerDataScreen from './src/screens/AccelerometerDataScreen';
import ReadCSVScreen from './src/screens/CSVScreen';
import CollectedData from './src/screens/DataCollectorScreen';
import AboutUs from './src/screens/AboutUs';
import TimeSeriesDataScreen from './src/screens/TimeSeriesDataScreen';
import PreprocessScreen from './src/screens/PreProcessScreen';
const Stack = createStackNavigator();
console.disableYellowBox = true;
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
        <Stack.Screen name="AccelerometerData" component={AccelerometerDataScreen} options={{ title: 'Accelerometer Data' }} />
        <Stack.Screen name="ReadCSV" component={ReadCSVScreen} options={{ title: 'CSV Data' }}/>
        <Stack.Screen name="CollectData" component={CollectedData} options={{ title: 'Collect Data' }}/>
        <Stack.Screen name="AccelerometerDatabase" component={AccelerometerDataScreen} options={{title : 'Accelerometer Data'}}/>
        <Stack.Screen name="AboutUs" component={AboutUs} options={{title : 'About Us'}}/>
        <Stack.Screen name="TimeSeriesData" component={TimeSeriesDataScreen} options={{title : 'TimeSeries'}}/>
        <Stack.Screen name="PreProcess" component={PreprocessScreen} options={{title : 'PreProcess'}}/>
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;