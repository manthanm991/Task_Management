import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Button, Box, Modal, TextField, IconButton, Select, MenuItem, FormControl, InputLabel, Card, CardContent, CardActions, Grid, CircularProgress, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { TaskForm } from './TaskForm';
import "./css/TaskList.css";

export const TaskList = ({ token }) => {
    const [tasks, setTasks] = useState([]);
    const [sortField, setSortField] = useState('id');
    const [sortDirection, setSortDirection] = useState('asc');
    const [prioritySort, setPrioritySort] = useState('asc');
    const [editOpen, setEditOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const apiBaseUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${apiBaseUrl}/api/tasks/`, {
                    headers: { Authorization: `Token ${token}` }
                });
                setTasks(response.data);
            } catch (error) {
                setError('Error fetching tasks. Please try again later.');
                setSnackbarOpen(true);
            } finally {setLoading(false);
            }};
        if (token) {
            fetchTasks();
        }}, [token, apiBaseUrl]);

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this task?\nNote: It cannot be recovered once deleted.");
        if (!confirmed) return;
        try {
            await axios.delete(`${apiBaseUrl}/api/tasks/${id}/`, {
                headers: { Authorization: `Token ${token}` }
            });
            setTasks(tasks.filter(task => task.id !== id));
        } catch (error) {
            setError('Error deleting task. Please try again later.');
            setSnackbarOpen(true);
        }};

    const handleSort = (field) => {
        if (field === 'priority') {
            const isAsc = prioritySort === 'asc';
            setPrioritySort(isAsc ? 'desc' : 'asc');
            setSortField(field);
        } else {
            const isAsc = sortField === field && sortDirection === 'asc';
            setSortField(field);
            setSortDirection(isAsc ? 'desc' : 'asc');
        }};

    const sortedTasks = [...tasks].sort((a, b) => {
        const priorityOrder = { low: 1, medium: 2, high: 3 };
        if (sortField === 'priority') {
            const priorityA = priorityOrder[a.priority] || Infinity;
            const priorityB = priorityOrder[b.priority] || Infinity;
            return prioritySort === 'asc' ? priorityA - priorityB : priorityB - priorityA;
        }
        if (sortField === 'due_date') {
            return sortDirection === 'asc'
                ? new Date(a.due_date) - new Date(b.due_date)
                : new Date(b.due_date) - new Date(a.due_date);
        }
        return sortDirection === 'asc' ? a.id - b.id : b.id - a.id;
        });

    const handleEditOpen = (task) => {
        setCurrentTask(task);
        setEditOpen(true);
    };

    const handleEditClose = () => {
        setCurrentTask(null);
        setEditOpen(false);
    };

    const handleEditChange = (e) => {
        setCurrentTask({ ...currentTask, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${apiBaseUrl}/api/tasks/${currentTask.id}/`, currentTask, {
                headers: { Authorization: `Token ${token}` }
            });
            setTasks(tasks.map(task => (task.id === currentTask.id ? currentTask : task)));
            handleEditClose();
        } catch (error) {
            setError('Error updating task. Please try again later.');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <>
            <Typography variant="h3" sx={{ margin: '1rem', fontFamily: '"Zilla Slab", serif', fontWeight: 400 }}>Tasks</Typography>
            <Box className="Box">
                <FormControl sx={{ mr: 2 }} variant="outlined">
                    <InputLabel id="priority-sort-label">Sort by Priority</InputLabel>
                    <Select labelId="priority-sort-label" value={prioritySort} onChange={(e) => {
                        setPrioritySort(e.target.value);
                        setSortField('priority');
                    }} label="Sort by Priority">
                        <MenuItem value="asc">Low to High</MenuItem>
                        <MenuItem value="desc">High to Low</MenuItem>
                    </Select>
                </FormControl>
                <Button onClick={() => handleSort('due_date')} sx={{ backgroundColor: "#17a2b8", color: "white" }} variant="contained">Sort by Due Date</Button>
                <Box sx={{ flexGrow: 1 }} />
                <TaskForm token={token} onTaskAdded={(newTask) => setTasks([...tasks, newTask])} />
            </Box>

            {loading ? (<Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
            ) : (
                <Grid container spacing={2}>
                    {sortedTasks.length > 0 ? (
                        sortedTasks.map(task => (
                            <Grid item xs={12} sm={6} md={4} key={task.id}>
                                <Card className="task-card" sx={{ backgroundColor: '#e7f1f9' }}>
                                    <CardContent>
                                        <Typography variant="h5" color="#26344F">{task.title}</Typography>
                                        <Typography color="textPrimary">{task.description}</Typography>
                                        <Typography color="textSecondary" mt="2rem"><strong>Priority</strong>: {task.priority}</Typography>
                                        <Typography color="textSecondary"><b>Status</b>: {task.status}</Typography>
                                        <Typography color="textSecondary"><b>Due</b>: {task.due_date}</Typography>
                                    </CardContent>
                                    <CardActions style={{ justifyContent: 'flex-end' }}>
                                        <IconButton edge="end" aria-label="edit" onClick={() => handleEditOpen(task)} sx={{ mr: 2 }}> <EditIcon /> </IconButton>
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(task.id)} sx={{ mr: 1 }}> <DeleteIcon /> </IconButton>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Typography variant="body1" align="center">There are no tasks.</Typography>
                        </Grid>
                    )}
                </Grid>
            )}
            <Modal open={editOpen} onClose={handleEditClose}>
                <Box className="Edit-Modal-Box">
                    <div className="modal-header">
                        <Typography variant="h4">Edit Task</Typography>
                        <IconButton onClick={handleEditClose} aria-label="close"><CloseIcon /></IconButton>
                    </div>
                    <hr />
                    <form onSubmit={handleEditSubmit}>
                        <TextField name="title" label="Title" value={currentTask?.title || ''} onChange={handleEditChange} fullWidth margin="normal" required />
                        <TextField name="description" label="Description" value={currentTask?.description || ''} onChange={handleEditChange} fullWidth margin="normal" multiline />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Priority</InputLabel>
                            <Select name="priority" label="Priority" value={currentTask?.priority || ''} onChange={handleEditChange} required>
                                <MenuItem value="low">Low</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="high">High</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Status</InputLabel>
                            <Select name="status" label="Status" value={currentTask?.status || ''} onChange={handleEditChange} required>
                                <MenuItem value="todo">To Do</MenuItem>
                                <MenuItem value="in_progress">In Progress</MenuItem>
                                <MenuItem value="done">Done</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField name="due_date" label="Due Date" type="date" value={currentTask?.due_date || ''} onChange={handleEditChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" type="submit" color="primary">Update Task</Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </>
    );
};