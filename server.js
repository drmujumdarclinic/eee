const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Store appointments in a JSON file
const appointmentsFile = path.join(__dirname, 'appointments.json');

// Create a new appointment
app.post('/appointments', (req, res) => {
    const { name, email, phone, date, time } = req.body;
    const appointment = { name, email, phone, date, time };

    fs.readFile(appointmentsFile, (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }

        const appointments = JSON.parse(data);
        appointments.push(appointment);

        fs.writeFile(appointmentsFile, JSON.stringify(appointments, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error saving file');
            }
            res.status(201).send('Appointment booked');
        });
    });
});

// Get all appointments
app.get('/appointments', (req, res) => {
    fs.readFile(appointmentsFile, (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }
        res.json(JSON.parse(data));
    });
});

// Serve static HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
