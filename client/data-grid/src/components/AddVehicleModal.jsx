import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, MenuItem, Typography } from '@mui/material';
import axios from 'axios';

const AddVehicleModal = ({ open, handleClose, fetchCars }) => {
  const initialState = {
    Brand: '', Model: '', AccelSec: '', TopSpeed_KmH: '', Range_Km: '',
    Efficiency_WhKm: '', FastCharge_KmH: '', RapidCharge: 'Yes',
    PowerTrain: 'AWD', PlugType: 'Type 2', BodyStyle: 'Sedan',
    Segment: 'C', Seats: '5', PriceEuro: '', Date: new window.Date().toISOString().slice(0, 10)
  };

  const [formData, setFormData] = useState(initialState);

  const handleSubmit = async () => {
    if (!formData.Brand || !formData.Model || !formData.PriceEuro) {
      alert("Please fill in Brand, Model, and Price.");
      return;
    }

    try {
      await axios.post(import.meta.env.VITE_API_URL + '/cars', formData);
      fetchCars();
      handleClose();
      setFormData(initialState);
    } catch (err) {
      alert("Error: " + (err.response?.data || "Could not add vehicle"));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ bgcolor: '#0a192f', color: '#1c69d4', fontWeight: 'bold' }}>
        Add New BMW Inventory Item
      </DialogTitle>
      
      <DialogContent sx={{ bgcolor: '#0a192f', pt: 2 }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: 2, 
          mt: 1 
        }}>
          <TextField label="Brand *" sx={inputStyle} value={formData.Brand} onChange={(e)=>setFormData({...formData, Brand: e.target.value})}/>
          <TextField label="Model *" sx={inputStyle} value={formData.Model} onChange={(e)=>setFormData({...formData, Model: e.target.value})}/>
          
          <TextField label="Accel (0-100)" type="number" sx={inputStyle} onChange={(e)=>setFormData({...formData, AccelSec: e.target.value})}/>
          <TextField label="Top Speed (km/h)" type="number" sx={inputStyle} onChange={(e)=>setFormData({...formData, TopSpeed_KmH: e.target.value})}/>
          
          <TextField label="Range (km)" type="number" sx={inputStyle} onChange={(e)=>setFormData({...formData, Range_Km: e.target.value})}/>
          <TextField label="Efficiency (Wh/km)" type="number" sx={inputStyle} onChange={(e)=>setFormData({...formData, Efficiency_WhKm: e.target.value})}/>


          <TextField label="Price (Euro) *" type="number" sx={inputStyle} value={formData.PriceEuro} onChange={(e)=>setFormData({...formData, PriceEuro: e.target.value})}/>
          <TextField label="Date" type="date" sx={inputStyle} value={formData.Date} onChange={(e)=>setFormData({...formData, Date: e.target.value})}/>

          <TextField select label="Rapid Charge" sx={inputStyle} value={formData.RapidCharge} onChange={(e)=>setFormData({...formData, RapidCharge: e.target.value})}>
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>

          <TextField select label="Power Train" sx={inputStyle} value={formData.PowerTrain} onChange={(e)=>setFormData({...formData, PowerTrain: e.target.value})}>
            <MenuItem value="AWD">AWD</MenuItem>
            <MenuItem value="RWD">RWD</MenuItem>
            <MenuItem value="FWD">FWD</MenuItem>
          </TextField>

          <TextField label="Plug Type" sx={inputStyle} value={formData.PlugType} onChange={(e)=>setFormData({...formData, PlugType: e.target.value})}/>
          <TextField label="Body Style" sx={inputStyle} value={formData.BodyStyle} onChange={(e)=>setFormData({...formData, BodyStyle: e.target.value})}/>
          
          <TextField label="Seats" type="number" sx={inputStyle} value={formData.Seats} onChange={(e)=>setFormData({...formData, Seats: e.target.value})}/>
          <TextField label="Segment" sx={inputStyle} value={formData.Segment} onChange={(e)=>setFormData({...formData, Segment: e.target.value})}/>
        </Box>
        <Typography variant="caption" sx={{ color: '#666', mt: 2, display: 'block' }}>* Required fields</Typography>
      </DialogContent>

      <DialogActions sx={{ bgcolor: '#0a192f', p: 3 }}>
        <Button onClick={handleClose} sx={{ color: 'white' }}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#1c69d4', px: 4 }}>Save Vehicle</Button>
      </DialogActions>
    </Dialog>
  );
};

const inputStyle = {
  '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } },
  '& .MuiInputLabel-root': { color: '#aaa' },
  bgcolor: 'rgba(255,255,255,0.05)',
  borderRadius: 1
};

export default AddVehicleModal;