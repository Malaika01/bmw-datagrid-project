import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, TextField, Button, Stack, Box, AppBar, Toolbar } from '@mui/material';
import DataGrid from './components/DataGrid';
import Details from './components/Details';

function Dashboard({ cars, setCars, fetchCars, doDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const doSearch = () => {
    if (!searchTerm) return fetchCars();
    axios.get(`http://localhost:5000/api/cars/search?q=${searchTerm}`)
      .then((res) => setCars(res.data))
      .catch(() => setCars([])); 
  };

  const doFilter = () => {
    let url = `http://localhost:5000/api/cars/filter?`;
    if (minPrice) url += `price_gt=${minPrice}&`;
    if (maxPrice) url += `price_lt=${maxPrice}&`;
    
    axios.get(url)
      .then((res) => setCars(res.data))
      .catch(() => setCars([])); 
  };

  const resetAll = () => {
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
    fetchCars();
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#fff' }}>
          BMW Car Inventory
        </Typography>
    
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Search Brand/Model"
              variant="outlined" size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={inputStyle}
            />
            <Button variant="contained" onClick={doSearch} sx={{ bgcolor: '#1c69d4' }}>Search</Button>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Typography sx={{ color: '#aaa' }}>Price Range (€):</Typography>
            <TextField
              label="Min Price" type="number"
              variant="outlined" size="small"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              sx={inputStyle}
            />
            <TextField
              label="Max Price" type="number"
              variant="outlined" size="small"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              sx={inputStyle}
            />
            <Button variant="outlined" onClick={doFilter} sx={{ color: 'white', borderColor: 'white' }}>Apply Filter</Button>
            <Button variant="text" onClick={resetAll} sx={{ color: '#aaa' }}>Reset</Button>
          </Stack>
        </Stack>

        <Box sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 2, backdropFilter: 'blur(5px)' }}>
          {/* Ensure cars is always an array so AG Grid doesn't get stuck on loading */}
          <DataGrid rowData={cars || []} onDelete={doDelete} />
        </Box>
      </Box>
    </Container>
  );
}

//  APP COMPONENT
function App() {
  const [cars, setCars] = useState([]); 

  const fetchCars = () => {
    axios.get("http://localhost:5000/api/cars")
      .then((res) => setCars(res.data))
      .catch((err) => {
        console.error("Backend Error:", err);
        setCars([]); 
      });
  };

  const doDelete = (id) => {
    if (window.confirm("Delete this entry?")) {
      axios.delete(`http://localhost:5000/api/cars/${id}`).then(() => fetchCars());
    }
  };

  useEffect(() => { fetchCars(); }, []);

  return (
    <BrowserRouter>
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a192f 0%, #2d1b4e 100%)' }}>
        <AppBar position="static" sx={{ bgcolor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(10px)' }}> 
          <Toolbar>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff' }}>BMW GROUP</Typography>
          </Toolbar>
        </AppBar>

        <Routes>
          <Route path="/" element={
            <Dashboard cars={cars} setCars={setCars} fetchCars={fetchCars} doDelete={doDelete} />
          } />
          <Route path="/view/:id" element={<Details />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

const inputStyle = { 
  bgcolor: 'rgba(255, 255, 255, 0.1)', 
  borderRadius: 1,
  input: { color: 'white' },
  label: { color: '#ccc' },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
    '&:hover fieldset': { borderColor: 'white' },
  }
};

export default App;