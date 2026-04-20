import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Alert, MenuItem } from '@mui/material';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', password: '', role: 'user' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(import.meta.env.VITE_API_URL + '/register', formData);
      setMessage({ type: 'success', text: 'Account created! Redirecting to login...' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data || 'Registration failed' });
    }
  };

  return (
    <Box sx={{ 
      height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
      background: 'linear-gradient(135deg, #0a192f 0%, #2d1b4e 100%)' 
    }}>
      <Card sx={{ 
        maxWidth: 400, width: '100%', bgcolor: 'rgba(255, 255, 255, 0.08)', 
        backdropFilter: 'blur(15px)', borderRadius: 4, border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Box component="img" src={logo} sx={{ height: 50, mb: 2 }} />
          <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold', mb: 3 }}>Create Account</Typography>

          {message.text && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}

          <form onSubmit={handleSignup}>
            <TextField
              fullWidth label="Username" variant="outlined" margin="normal"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              sx={inputStyle}
            />
            <TextField
              fullWidth label="Password" type="password" variant="outlined" margin="normal"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              sx={inputStyle}
            />

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, bgcolor: '#1c69d4' }}>
              Sign Up
            </Button>
          </form>
          
          <Typography variant="body2" sx={{ color: '#aaa' }}>
            Already have an account? <Link to="/login" style={{ color: '#1c69d4', textDecoration: 'none' }}>Login here</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

const inputStyle = {
  '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' } },
  '& .MuiInputLabel-root': { color: '#aaa' },
  '& .MuiSvgIcon-root': { color: 'white' }, 
  bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 1
};

export default Signup;