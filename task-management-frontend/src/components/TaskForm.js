import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography, Modal, Box, IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@mui/material/Alert';
import "./css/TaskForm.css";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const TaskForm = ({ token, onTaskAdded }) => {
  const [task, setTask] = useState({title: '',description: '',priority: 'medium',status: 'todo',due_date: '' });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => !loading && setOpen(false);
  const handleChange = (e) => {setTask({ ...task, [e.target.name]: e.target.value });};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.title || !task.description) {
      setError('Title and Description are required.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/tasks/`, task, {
        headers: { Authorization: `Token ${token}` }
      });
      onTaskAdded(response.data);
      setTask({ title: '',description: '',priority: 'medium',status: 'todo',due_date: ''});
      setOpen(false);
    } catch (error) {
      if (error.response) {setError(error.response.data.detail || 'Invalid Data.');
      } else if (error.request) {setError('No response from the server. Please try again later.');
      } else {setError('Error in sending request. Please try again later.');
      }} finally {setLoading(false);
    }};

  const handleCloseSnackbar = () => setError('');

  return (
    <>
      <Button type="button" variant="contained" className="btn btn-primary" onClick={handleOpen}> Add New Task </Button>
      <Modal open={open} onClose={handleClose} disableBackdropClick={loading} aria-labelledby="task-modal-title" aria-describedby="task-modal-description" >
        <Box className="Add-Modal-Box">
          <div className="modal-dialog modal-md col-md-10 col-sm-6 mx-auto">
            <div className="modal-content">
              <div className="modal-header">
                <Typography variant="h4">Add New Task</Typography>
                <IconButton onClick={handleClose} aria-label="close" disabled={loading}> <CloseIcon /> </IconButton>
              </div>
              <hr />
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <TextField name="title" label="Title" value={task.title} onChange={handleChange} fullWidth margin="normal" required />
                  <TextField name="description" label="Description" value={task.description} onChange={handleChange} fullWidth margin="normal" multiline required />
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Priority</InputLabel>
                    <Select name="priority" label="Priority" value={task.priority} onChange={handleChange}>
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Status</InputLabel>
                    <Select name="status" label="Status" value={task.status} onChange={handleChange}>
                      <MenuItem value="todo">To Do</MenuItem>
                      <MenuItem value="in_progress">In Progress</MenuItem>
                      <MenuItem value="done">Done</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField name="due_date" label="Due Date" type="date" value={task.due_date} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
                  <Button type="submit" variant="contained" color="primary" className="mt-3" disabled={loading}>
                    {loading ? 'Adding Task...' : 'Add Task'}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error">{error}</Alert>
      </Snackbar>
    </>
  );
};