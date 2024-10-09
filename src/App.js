// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Snackbar,
    Alert,
    IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const API_URL = 'http://localhost:5000/courses';

function App() {
    const [courses, setCourses] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        const response = await axios.get(API_URL);
        setCourses(response.data);
    };

    const addCourse = async () => {
        if (!title || !description || !duration) {
            setSnackbarMessage('All fields must be filled out.');
            setOpenSnackbar(true);
            return;
        }

        const response = await axios.post(API_URL, { title, description, duration });
        setCourses([...courses, response.data]);
        clearInputs();
    };

    const updateCourse = async () => {
        if (!title || !description || !duration) {
            setSnackbarMessage('All fields must be filled out.');
            setOpenSnackbar(true);
            return;
        }

        await axios.put(`${API_URL}/${editingId}`, { title, description, duration });
        fetchCourses();
        clearInputs();
    };

    const deleteCourse = async (id) => {
        await axios.delete(`${API_URL}/${id}`);
        fetchCourses();
    };

    const clearInputs = () => {
        setTitle('');
        setDescription('');
        setDuration('');
        setEditingId(null);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container maxWidth="md" style={{ marginTop: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Course Management
            </Typography>
            <Paper style={{ padding: '20px', marginBottom: '20px' }}>
                <TextField
                    label="Title"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                    label="Description"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <TextField
                    label="Duration"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                />
                {editingId ? (
                    <Button variant="contained" color="primary" onClick={updateCourse}>
                        Update Course
                    </Button>
                ) : (
                    <Button variant="contained" color="secondary" onClick={addCourse}>
                        Add Course
                    </Button>
                )}
            </Paper>

            <Typography variant="h5" gutterBottom>
                Courses
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Duration</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {courses.length > 0 ? (
                            courses.map((course) => (
                                <TableRow key={course.id}>
                                    <TableCell>{course.title}</TableCell>
                                    <TableCell>{course.description}</TableCell>
                                    <TableCell>{course.duration}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => {
                                                setTitle(course.title);
                                                setDescription(course.description);
                                                setDuration(course.duration);
                                                setEditingId(course.id);
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => deleteCourse(course.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} style={{ textAlign: 'center' }}>
                                    No courses available.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="warning" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default App;
