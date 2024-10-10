import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { TaskList } from './components/TaskList';
import { Container, AppBar, Toolbar, Typography, Button, Grid } from '@mui/material';
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [showSignup, setShowSignup] = useState(false);

  const handleSignupSuccess = () => { setShowSignup(false); };

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <Grid container justifyContent="center">
      <AppBar position="static" >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 10, fontSize: 25}}> Task Management System </Typography>
          {token ? (
            <Button color="inherit" onClick={handleLogout} style={{marginRight:"8rem", fontWeight:"bold"}}> Logout </Button>
          ) : (
            <Button color="inherit" onClick={() => setShowSignup(!showSignup)} style={{marginRight:"8rem", fontWeight:"bold"}}>{showSignup ? 'Back to Login' : 'Sign Up'} </Button>
          )}
        </Toolbar>
      </AppBar>
      
      <Grid item xs={12} sm={6} md={10} style={{ margin: '0 auto' }}>
      <Container>
        <Routes>
          <Route path="/login" element={ token ? <Navigate to="/" /> : showSignup ? <Signup onSignupSuccess={handleSignupSuccess} /> : <Login setToken={handleLogin} /> }/>
          <Route path="/" element={ !token ? <Navigate to="/login" /> : ( <TaskList token={token} /> ) }/>
        </Routes>
      </Container>
      </Grid>
      </Grid>
    </Router>
  );
}

export default App;