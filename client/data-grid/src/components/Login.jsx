import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Alert, InputAdornment,Divider } from '@mui/material';
import { AccountCircle, Lock } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle form submission for traditional login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + '/login', { username, password });
    
      localStorage.setItem('user', JSON.stringify(res.data));
      
      setUser(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'linear-gradient(135deg, #0a192f 0%, #2d1b4e 100%)' 
    }}>
      <Card sx={{ 
        maxWidth: 400, 
        width: '100%', 
        bgcolor: 'rgba(255, 255, 255, 0.08)', 
        backdropFilter: 'blur(15px)',
        borderRadius: 4,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)'
      }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Box component="img" src={logo} sx={{ height: 60, mb: 2 }} />
          
          <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold', mb: 1 }}>
            BMW Inventory Portal
          </Typography>
          <Typography variant="body2" sx={{ color: '#aaa', mb: 3 }}>
             User Login
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(211, 47, 47, 0.2)', color: '#ff8a80' }}>{error}</Alert>}

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (<InputAdornment position="start"><AccountCircle sx={{ color: '#fff' }} /></InputAdornment>),
              }}
              sx={inputStyle}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (<InputAdornment position="start"><Lock sx={{ color: '#fff' }} /></InputAdornment>),
              }}
              sx={inputStyle}
            />
            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              sx={{ mt: 3, mb: 2, bgcolor: '#1c69d4', fontWeight: 'bold', height: 45 }}
            >
              Sign In
            </Button>
          </form>
          <Divider sx={{ my: 3, color: '#666', fontSize: '0.8rem' }}>OR </Divider>

<Box sx={{ display: 'flex', justifyContent: 'center' }}>
  <GoogleLogin
    onSuccess={async (credentialResponse) => {
      const details = jwtDecode(credentialResponse.credential);
      console.log("Google User:", details);
      
      const res = await axios.post(import.meta.env.VITE_API_URL + '/google-login', {
        token: credentialResponse.credential
      });
      
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      navigate('/');
    }}
      onError={() => console.log('Login Failed')}
    theme="filled_blue"
    shape="pill"
  />
</Box>
          <Typography variant="body2" sx={{ color: '#aaa', mt: 2 }}>
  Don't have an account? <Link to="/signup" style={{ color: '#1c69d4', textDecoration: 'none' }}>Sign Up</Link>
</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

const inputStyle = {
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
    '&:hover fieldset': { borderColor: 'white' },
    '&.Mui-focused fieldset': { borderColor: '#1c69d4' },
  },
  '& .MuiInputLabel-root': { color: '#aaa' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#1c69d4' },
  bgcolor: 'rgba(255, 255, 255, 0.05)',
  borderRadius: 1
};

export default Login;