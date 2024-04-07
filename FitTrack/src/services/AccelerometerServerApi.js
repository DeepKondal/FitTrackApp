import axios from 'axios';

const BASE_URL = 'http://192.168.2.16:3000'; 

const sendAccelerometerDataToServer = async (accelerometerData) => {
    try {
        const response = await axios.post(`${BASE_URL}/accelerometer-data`, accelerometerData);
        console.log('Server response:', response.data);
    } catch (error) {
        console.error('Error sending accelerometer data:', error);
    }
};

export default sendAccelerometerDataToServer;
