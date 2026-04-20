import React, { useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule, themeQuartz } from 'ag-grid-community';
import { Button, Stack, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

ModuleRegistry.registerModules([AllCommunityModule]);

function DataGrid({ rowData, onDelete, userRole }) {
  const navigate = useNavigate();
  const gridRef = useRef();

  // Function for CSV Export
  const onExportClick = () => {
    gridRef.current.api.exportDataAsCsv();
  };

  const columnDefs = useMemo(() => {
    if (!rowData || rowData.length === 0) return [];

    // Generic colums logic
    const keys = Object.keys(rowData[0]);
    const dynamicCols = keys.map(key => ({
      field: key,
      headerName: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
      filter: true,
      sortable: true,
      flex: 1,
      hide: key.toLowerCase() === 'id',
      
      valueFormatter: (params) => {
        if (!params.value) return "";
        if (key.toLowerCase().includes('price') || key.toLowerCase().includes('euro')) {
          return '€ ' + Number(params.value).toLocaleString();
        }
        return params.value;
      }
    }));

  
    return [
      ...dynamicCols,
      {
        headerName: "Actions",
        pinned: 'right',
        flex: 1.5,
        cellRenderer: (params) => (
          <Stack direction="row" spacing={1} sx={{ height: '100%', alignItems: 'center' }}>
            <Button 
              variant="contained" size="small" 
              sx={{ bgcolor: '#1c69d4', fontSize: '0.7rem', height: 25 }}
              onClick={() => navigate(`/view/${params.data.id}`)}
            >
              View
            </Button>
            
            {/* ONLY ADMINS CAN SEE AND CLICK DELETE */}
            {userRole === 'admin' && (
              <Button 
                variant="contained" size="small" color="error" 
                sx={{ fontSize: '0.7rem', height: 25 }}
                onClick={() => onDelete(params.data.id)}
              >
                Delete
              </Button>
            )}
          </Stack>
        )
      }
    ];
  }, [rowData, navigate, onDelete, userRole]);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="caption" sx={{ color: '#aaa' }}>
          Showing {rowData.length} entries
        </Typography>
        
        <Button 
          variant="text" 
          startIcon={<FileDownloadIcon />} 
          onClick={onExportClick}
          sx={{ color: '#aaa', '&:hover': { color: '#fff' }, fontSize: '0.75rem' }}
        >
          Export to CSV
        </Button>
      </Stack>

      <div className="ag-theme-quartz-dark" style={{ height: '520px', width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          theme={themeQuartz}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50]}
          defaultColDef={{
            minWidth: 120,
            resizable: true,
          }}
          autoSizeStrategy={{
            type: 'fitCellContents'
          }}
        />
      </div>
    </Box>
  );
}

export default DataGrid;