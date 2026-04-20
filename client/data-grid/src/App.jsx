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
import Papa from 'papaparse';
import DataGrid from './components/DataGrid';
import Login from './components/Login';
import Signup from './components/Signup';
import Details from './components/Details';
import logo from './assets/logo.jpg';

// Grid Manager page
function GridManager({ allGrids, setAllGrids, setCurrentGrid, handleFileUpload,  userRole, handleLogout }) {
  const navigate = useNavigate();

  const openGrid = (index) => {
    setCurrentGrid(allGrids[index]);
    navigate('/view-grid');
  };

  const deleteGrid = (e, index) => {
    e.stopPropagation(); // Prevents opening the grid
    if (index === 0) return alert("Cannot delete main inventory");
    setAllGrids(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
    
<Box sx={{ mb: 6 }}>
    <Typography variant="h3" sx={{ color: 'white', fontWeight: '900', mb: 1 }}>Data Grids</Typography>
    <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: '400', mb: 4 }}>
      Explore and manage your generic datasets</Typography>

  {userRole === 'admin' && (
          <Box>
            <input 
              type="file" 
              accept=".csv" 
              id="csv-upload" 
              style={{ display: 'none' }} 
              onChange={handleFileUpload} 
            />
            <label htmlFor="csv-upload">
              <Button 
                variant="contained" 
                component="span" 
                sx={{ 
                  bgcolor: '#1c69d4', 
                  px: 4, py: 1.5, 
                  borderRadius: '8px', 
                  fontWeight: 'bold',
                  textTransform: 'none',
                  boxShadow: '0 4px 14px 0 rgba(28, 105, 212, 0.39)'
                }}
              >
                + Create New Grid 
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
                bgcolor: 'rgba(255,255,255,0.05)', 
                color: 'white', 
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', transform: 'translateY(-5px)' },
                transition: '0.3s'
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between">
                   <StorageIcon sx={{ color: '#1c69d4', fontSize: 40, mb: 2 }} />
                   {index !== 0 && (
                     <IconButton size="small" onClick={(e) => deleteGrid(e, index)}>
                        <DeleteIcon sx={{ color: '#ff4d4d' }} />
                     </IconButton>
                   )}
                </Stack>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{grid.name}</Typography>
                <Typography variant="caption" sx={{ color: '#888' }}>
                  {grid.data.length} records | Created: {grid.date}
                </Typography>
                <Box sx={{ mt: 2 }}>
                   <Chip label="Generic Grid" size="small" sx={{ color: '#aaa', borderColor: '#444' }} variant="outlined" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

// Grid Viewer page
function GridViewer({ currentGrid, fetchCars, userRole }) {
  const navigate = useNavigate();
  const [displayData, setDisplayData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Update display data whenever currentGrid changes
  useEffect(() => {
    if (currentGrid) setDisplayData(currentGrid.data);
  }, [currentGrid]);

  if (!currentGrid) return <Navigate to="/" />;

  const handleSearch = () => {
    if (!searchTerm) {
      setDisplayData(currentGrid.data);
      return;
    }
    const filtered = currentGrid.data.filter(row => 
      Object.values(row).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setDisplayData(filtered);
  };

  // Price filter handler
  const handlePriceFilter = () => {
    const filtered = currentGrid.data.filter(row => {
      const price = parseFloat(row.PriceEuro || row.price || 0);
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Infinity;
      return price >= min && price <= max;
    });
    setDisplayData(filtered);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Button 
        onClick={() => navigate('/')} sx={{ color: '#aaa', mb: 2, textTransform: 'none' }}> Back to Hub
      </Button>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
          {currentGrid.name}
        </Typography>
      </Stack>

      <Stack spacing={2} sx={{ mb: 3 }}>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Search all columns..."
            variant="outlined" size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={inputStyle}
          />
          <Button variant="contained" onClick={handleSearch} sx={{ bgcolor: '#1c69d4' }}>Search</Button>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Typography sx={{ color: '#aaa', fontSize: '0.9rem' }}>Price Range (€):</Typography>
          <TextField
            label="Min" type="number" variant="outlined" size="small"
            value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
            sx={inputStyle}
          />
          <TextField
            label="Max" type="number" variant="outlined" size="small"
            value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
            sx={inputStyle}
          />
          <Button variant="outlined" onClick={handlePriceFilter} sx={{ color: 'white', borderColor: 'white' }}>Apply Filter</Button>
          <Button variant="text" onClick={() => {setSearchTerm(""); setMinPrice(""); setMaxPrice(""); setDisplayData(currentGrid.data);}} sx={{ color: '#aaa' }}>Reset</Button>
        </Stack>
      </Stack>

      <Box sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 2, backdropFilter: 'blur(5px)' }}>
        <DataGrid rowData={displayData} onDelete={() => {}} userRole={userRole} />
      </Box>
    </Container>
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

// MAIN APP 
function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [allGrids, setAllGrids] = useState([]);
  const [currentGrid, setCurrentGrid] = useState(null);

  // Load Initial BMW Data from Backend
  const fetchInitialData = () => {
    axios.get(import.meta.env.VITE_API_URL + "/cars").then((res) => {
      const bmwGrid = {
        name: "BMW Car Inventory",
        data: res.data,
        date: new Date().toLocaleDateString(),
        type: 'database'
      };
      setAllGrids([bmwGrid]); // Set it as the first saved grid
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const newGrid = {
          name: file.name.replace('.csv', ''),
          data: results.data,
          date: new Date().toLocaleDateString(),
          type: 'csv'
        };
        setAllGrids(prev => [...prev, newGrid]);
        alert(`New Grid "${newGrid.name}" created!`);
      },
    });
  };

  useEffect(() => { if (user) fetchInitialData(); }, [user]);

  return (
    <BrowserRouter>
      {user && (
        <AppBar position="static" sx={{ bgcolor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(10px)' }}> 
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>BMW GROUP</Typography>
            <Chip label={user.username} sx={{ color: 'white', mr: 2 }} />
            <Button color="inherit" onClick={() => { localStorage.removeItem('user'); setUser(null); }}>Logout</Button>
            <Box component="img" src={logo} sx={{ height: 35, ml: 2, borderRadius: '50%' }} />
          </Toolbar>
        </AppBar>
      )}

      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a192f 0%, #2d1b4e 100%)', pb: 5 }}>
        <Routes>
          <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/" element={user ? 
            <GridManager 
              allGrids={allGrids} 
              setAllGrids={setAllGrids} 
              setCurrentGrid={setCurrentGrid} 
              handleFileUpload={handleFileUpload}
              userRole={user.role}
            /> : <Navigate to="/login" /> 
          } />

          <Route path="/view-grid" element={<GridViewer currentGrid={currentGrid} userRole={user?.role} />} />
          <Route path="/view/:id" element={<Details />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

export default App;