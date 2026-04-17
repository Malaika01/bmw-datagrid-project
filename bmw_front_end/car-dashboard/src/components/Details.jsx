import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Card, CardContent, Box, Divider, CircularProgress } from '@mui/material';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import for a better look

function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/cars/${id}`)
      .then(res => setCar(res.data));
  }, [id]);

  if (!car) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress sx={{ color: 'white' }} />
      <Typography sx={{ ml: 2, color: 'white' }}>Fetching Car Details...</Typography>
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button 
        variant="outlined" 
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)} 
        sx={{ 
          mb: 3, 
          color: 'white', 
          borderColor: 'rgba(255,255,255,0.5)',
          '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
        }}
      >
        Back to Inventory
      </Button>

      <Card sx={{ 
        bgcolor: 'rgba(255, 255, 255, 0.07)', 
        backdropFilter: 'blur(15px)', 
        borderRadius: 4,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: 'white',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, color: '#1c69d4' }}>
            {car.Brand} 
          </Typography>
          <Typography variant="h5" sx={{ mb: 3, opacity: 0.8 }}>
            {car.Model}
          </Typography>

          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 3 }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
            {Object.entries(car).map(([key, value]) => (
              <Box key={key} sx={{ mb: 1 }}>
                <Typography variant="caption" sx={{ color: '#aaa', textTransform: 'uppercase', letterSpacing: 1 }}>
                  {key.replace('_', ' ')}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {value || "N/A"}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Details;