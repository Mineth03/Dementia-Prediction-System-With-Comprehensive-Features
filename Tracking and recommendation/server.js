const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('add_the_mongodbatlas_connectionstring', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

const patientSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    age: Number,
    stage_of_dementia: String,
    precautions: String,
    medications: [
        {
            medication_name: String,
            dosage: String,
            scheduled_time: String
        }
    ],
    daily_routines: [
        {
            routine_name: String,
            scheduled_time: String
        }
    ]
});

const Patient = mongoose.model('Patient', patientSchema);

app.post('/register-patient', (req, res) => {
    const newPatient = new Patient(req.body);

    newPatient.save()
        .then(() => res.json({ message: 'Patient registered successfully!' }))
        .catch(err => res.status(400).json({ error: 'Failed to register patient', details: err }));
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
