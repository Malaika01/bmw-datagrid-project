import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Card, CardContent, Box, Divider, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(import.meta.env.VITE_API_URL + `/cars/${id}`)
      .then(res => setCar(res.data))
      .catch(err => setError("Could not find vehicle details. Check if the ID exists in the database."));
  }, [id]);

  if (error) return (
    <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>
  );

  if (!car) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress sx={{ color: 'white' }} />
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4, pb: 5 }}>
      <Button 
        variant="contained" 
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)} 
        sx={{ mb: 3, bgcolor: 'rgba(94, 68, 168, 0.1)', color: 'black' }}
      >
        Back to Inventory
      </Button>

      <Card sx={{ 
        bgcolor: '#1a2238', 
        borderRadius: 4,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: 'white',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, color: '#1c69d4' }}>
            {car.Brand} 
          </Typography>
          <Typography variant="h5" sx={{ mb: 3, opacity: 0.7 }}>
            {car.Model}
          </Typography>

          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 3 }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
            {Object.entries(car).map(([key, value]) => (
              <Box key={key}>
                <Typography variant="caption" sx={{ color: '#888', textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 0.5 }}>
                  {key.replace(/_/g, ' ')}
                </Typography>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: '500', fontSize: '1.1rem' }}>
                  {key.toLowerCase().includes('price') 
                    ? `€ ${Number(value).toLocaleString()}` 
                    : String(value) || "N/A"}
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