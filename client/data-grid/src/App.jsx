import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Container, Typography, TextField, Button, Stack, 
  Box, AppBar, Toolbar, Chip, Avatar, Grid, Card, 
  CardContent, IconButton 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import StorageIcon from '@mui/icons-material/Storage';
import LogoutIcon from '@mui/icons-material/Logout';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Papa from 'papaparse';

// Components
import DataGrid from './components/DataGrid';
import Login from './components/Login';
import Signup from './components/Signup';
import Details from './components/Details';
import AddVehicleModal from './components/AddVehicleModal';
import logo from './assets/logo.jpg';

// Global Styles
const inputStyle = { 
  '& input:-webkit-autofill': {
    WebkitBoxShadow: '0 0 0 100px #1a2238 inset !important',
    WebkitTextFillColor: 'white !important',
  },
  bgcolor: 'rgba(255, 255, 255, 0.1)', 
  borderRadius: 1,
  input: { color: 'white' },
  label: { color: '#ccc' },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
    '&:hover fieldset': { borderColor: 'white' },
  }
};
const doDelete = (id) => {
  if (window.confirm("Are you sure? Admin action required.")) {
    axios.delete(`${import.meta.env.VITE_API_URL}/cars/${id}`)
      .then((res) => {
        console.log("Success:", res.data);
        
        alert("Vehicle deleted successfully.");

        // 2. Refresh the data
        fetchInitialData();

        if (typeof navigate === 'function') {
            navigate('/');
        }
      })
      .catch((err) => {
        console.error("Delete Error:", err);
      });
  }
};

// --- 1. GRID MANAGER PAGE ---
function GridManager({ allGrids, setAllGrids, setCurrentGrid, handleFileUpload, userRole }) {
  const navigate = useNavigate();

  const openGrid = (index) => {
    setCurrentGrid(allGrids[index]);
    navigate('/view-grid');
  };

  const deleteGrid = (e, index) => {
    e.stopPropagation();
    if (index === 0) return alert("Cannot delete main inventory");
    setAllGrids(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 8 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ color: 'white', fontWeight: '900', mb: 1 }}>Data Hub</Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: '400', mb: 4 }}>
          BMW Battery Cell Competence Center | Generic Data Explorer
        </Typography>

        {userRole === 'admin' && (
          <Box>
            <input type="file" accept=".csv" id="csv-upload" style={{ display: 'none' }} onChange={handleFileUpload} />
            <label htmlFor="csv-upload">
              <Button variant="contained" component="span" startIcon={<CloudUploadIcon />} sx={{ bgcolor: '#1c69d4', px: 4, py: 1.2, fontWeight: 'bold' }}>
                Add New Data Grid
              </Button>
            </label>
          </Box>
        )}
      </Box>

      <Grid container spacing={3}>
        {allGrids.map((grid, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              onClick={() => openGrid(index)}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer',
                backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)',
                '&:hover': { transform: 'translateY(-5px)', borderColor: '#1c69d4' }, transition: '0.3s'
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between">
                   <StorageIcon sx={{ color: '#1c69d4', fontSize: 40, mb: 2 }} />
                   {index !== 0 && (
                     <IconButton size="small" onClick={(e) => deleteGrid(e, index)}><DeleteIcon sx={{ color: '#ff4d4d' }} /></IconButton>
                   )}
                </Stack>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{grid.name}</Typography>
                <Typography variant="caption" sx={{ color: '#888' }}>{grid.data.length} records • Created: {grid.date}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

// --- 2. GRID VIEWER PAGE ---
function GridViewer({ currentGrid, fetchInitialData, user,doDelete }) {
  const navigate = useNavigate();
  const [displayData, setDisplayData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (currentGrid) setDisplayData(currentGrid.data);
  }, [currentGrid]);

  if (!currentGrid) return <Navigate to="/" />;

  const handleSearch = () => {
    const filtered = currentGrid.data.filter(row => 
      Object.values(row).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setDisplayData(filtered);
  };

  const handlePriceFilter = () => {
    const filtered = currentGrid.data.filter(row => {
      const price = parseFloat(row.PriceEuro || row.price || 0);
      return price >= (minPrice || 0) && price <= (maxPrice || Infinity);
    });
    setDisplayData(filtered);
  };

  return (
    <Container maxWidth="x2" sx={{ mt: 4, pb: 5 }}>
      <Button onClick={() => navigate('/')} sx={{ color: '#aaa', mb: 2 }}>← Back to Hub</Button>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>{currentGrid.name}</Typography>
        {user?.role === 'admin' && currentGrid.type === 'database' && (
          <Button variant="contained" color="success" onClick={() => setOpenModal(true)} sx={{ bgcolor: '#1c69d4', fontWeight: 'bold' }}>
            + Add New Vehicle
          </Button>
        )}
      </Stack>

      <Stack spacing={2} sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2}>
          <TextField label="Global Search..." variant="outlined" size="small" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={inputStyle} />
          <Button variant="contained" onClick={handleSearch} sx={{ bgcolor: '#1c69d4' }}>Search</Button>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Typography sx={{ color: '#aaa' }}>Price Filter:</Typography>
          <TextField label="Min" type="number" variant="outlined" size="small" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} sx={inputStyle} />
          <TextField label="Max" type="number" variant="outlined" size="small" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} sx={inputStyle} />
          <Button variant="outlined" onClick={handlePriceFilter} sx={{ color: 'white', borderColor: 'white' }}>Apply</Button>
          <Button variant="text" onClick={() => setDisplayData(currentGrid.data)} sx={{ color: '#aaa' }}>Reset</Button>
        </Stack>
      </Stack>

      <Box sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 2 }}>
        <DataGrid rowData={displayData} onDelete={doDelete} userRole={user?.role} />
      </Box>

      <AddVehicleModal open={openModal} handleClose={() => setOpenModal(false)} fetchCars={fetchInitialData} />
    </Container>
  );
}

// --- 3. MAIN APP COMPONENT ---
function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [allGrids, setAllGrids] = useState([]);
  const [currentGrid, setCurrentGrid] = useState(null);

  const fetchInitialData = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/cars`).then((res) => {
      const bmwGrid = { name: "BMW Car Inventory", data: res.data, date: new Date().toLocaleDateString(), type: 'database' };
      setAllGrids([bmwGrid]);
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true, skipEmptyLines: true,
      complete: (results) => {
        const newGrid = { name: file.name.replace('.csv', ''), data: results.data, date: new Date().toLocaleDateString(), type: 'csv' };
        setAllGrids(prev => [...prev, newGrid]);
      },
    });
  };

  useEffect(() => { if (user) fetchInitialData(); }, [user]);

  return (
    <BrowserRouter>
      {user && (
        <AppBar position="static" sx={{ bgcolor: 'rgba(10, 25, 47, 0.8)', backdropFilter: 'blur(10px)' }}> 
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>BMW GROUP</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
               <Chip label={`${user.username} (${user.role})`} sx={{ color: 'white', bgcolor: 'rgba(28, 105, 212, 0.3)' }} />
               <Button color="inherit" onClick={() => { localStorage.removeItem('user'); setUser(null); }} startIcon={<LogoutIcon />}>Logout</Button>
               <Box component="img" src={logo} sx={{ height: 35, width: 35, borderRadius: '50%', border: '1px solid #1c69d4' }} />
            </Stack>
          </Toolbar>
        </AppBar>
      )}

      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a192f 0%, #2d1b4e 100%)' }}>
        <Routes>
          <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/" element={user ? 
            <GridManager allGrids={allGrids} setAllGrids={setAllGrids} setCurrentGrid={setCurrentGrid} handleFileUpload={handleFileUpload} userRole={user.role} /> 
            : <Navigate to="/login" /> 
          } />

          <Route path="/view-grid" element={<GridViewer currentGrid={currentGrid} fetchInitialData={fetchInitialData} user={user}  doDelete={doDelete} />} />
          <Route path="/view/:id" element={user ? <Details /> : <Navigate to="/login" />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

export default App;