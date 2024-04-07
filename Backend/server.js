const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;
const CSV_FILE_PATH = 'accelerometer_data.csv';
const columnHeaders = 'X,Y,Z,Timestamp\n';

app.use(bodyParser.json({ limit: '10mb' }));

// Route for handling POST requests to /csv-data
app.post('/csv-data', (req, res) => {
    const accelerometerData = req.body;
    console.log('Received accelerometer data:', accelerometerData);

    // Filter out unwanted entries
    const filteredData = accelerometerData.filter(entry => isValidEntry(entry));

    // Convert accelerometer data to CSV format
    const csvData = convertToCSV(filteredData);

    // Check if the CSV file already exists
    fs.access(CSV_FILE_PATH, fs.constants.F_OK, (err) => {
        if (err) {
            // File doesn't exist, create it
            fs.writeFile(CSV_FILE_PATH, columnHeaders + csvData, (err) => {
                if (err) {
                    console.error('Error creating CSV file:', err);
                    res.status(500).send('Error creating CSV file');
                } else {
                    console.log('CSV file created and data written successfully');
                    res.send('Data received and CSV file created successfully');
                }
            });
        } else {
            // File exists, append data
            fs.appendFile(CSV_FILE_PATH, csvData, (err) => {
                if (err) {
                    console.error('Error appending to CSV file:', err);
                    res.status(500).send('Error appending to CSV file');
                } else {
                    console.log('Data appended to CSV file successfully');
                    res.send('Data received and appended to CSV file successfully');
                }
            });
        }
    });
});

// Function to convert accelerometer data to CSV format
function convertToCSV(data) {
    let csv = '';

    // Convert each data entry to CSV format
    data.forEach(entry => {
        csv += `${entry.X},${entry.Y},${entry.Z},${entry.Timestamp}\n`;
    });

    return csv;
}

// Function to check if an entry is valid
function isValidEntry(entry) {
    // Check if all properties are not empty strings and not placeholder values
    return Object.values(entry).every(value => value !== '' && value !== 'X' && value !== 'Y' && value !== 'Z' && value !== 'Timestamp');
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://192.168.2.16:${PORT}`);
});
