import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Signup = ({ onSignupSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/users/signup/`, { username, password });
      onSignupSuccess();
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            setError('Invalid input. Please check your username and password.');
            break;
          case 409:
            setError('Username already exists. Please choose a different one.');
            break;
          default:
            setError('An unexpected error occurred. Please try again later.');
        } } else if (error.request) { setError('No response from the server. Please try again later.');
      } else { setError('Error in sending request. Please try again later.');
      }} finally { setLoading(false); 
    }};

  const handleCloseSnackbar = () => { setError(''); };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h4" sx={{ margin: '1rem', fontFamily: '"Zilla Slab", serif', fontWeight: 400}}>Sign Up</Typography>
      <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth margin="normal" required />
      <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" required />
      <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ marginTop: '1rem'}}> {loading ? 'Signing Up...' : 'Sign Up'} </Button>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error">{error}</Alert>
      </Snackbar>
    </form>
  );
};