
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());


let courses = [];

// Create a course
app.post('/courses', (req, res) => {
    const { title, description, duration } = req.body;
    const newCourse = { id: courses.length + 1, title, description, duration };
    courses.push(newCourse);
    res.status(201).json(newCourse);
});

// Get all courses
app.get('/courses', (req, res) => {
    res.json(courses);
});

// Update a course by ID
app.put('/courses/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, duration } = req.body;
    const courseIndex = courses.findIndex(course => course.id === parseInt(id));
    
    if (courseIndex === -1) {
        return res.status(404).json({ message: 'Course not found' });
    }

    const updatedCourse = { id: parseInt(id), title, description, duration };
    courses[courseIndex] = updatedCourse;
    res.json(updatedCourse);
});

// Delete a course by ID
app.delete('/courses/:id', (req, res) => {
    const { id } = req.params;
    courses = courses.filter(course => course.id !== parseInt(id));
    res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
