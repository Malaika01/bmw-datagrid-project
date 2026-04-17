import React, { useMemo, useRef } from 'react'; // Added useRef
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule, themeQuartz } from 'ag-grid-community';
import { Button, Stack, Box } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload'; // Icon for export
import { useNavigate } from 'react-router-dom';

ModuleRegistry.registerModules([AllCommunityModule]);

function DataGrid({ rowData, onDelete }) {
  const navigate = useNavigate();
  const gridRef = useRef(); 
  const onExportClick = () => {
    gridRef.current.api.exportDataAsCsv();
  };

  const columnDefs = useMemo(() => {
    if (!rowData || rowData.length === 0) return [];

    const keys = Object.keys(rowData[0]);
    
    const dynamicCols = keys.map(key => ({
      field: key,
      headerName: key.replace(/_/g, ' '),
      filter: true,
      sortable: true,
      flex: 1,
      hide: key.toLowerCase() === 'id',
      
      valueFormatter: (params) => {
        if (!params.value) return "";
        if (key.toLowerCase().includes('price') || key.toLowerCase().includes('euro')) {
          return '€ ' + Number(params.value).toLocaleString();
        }
        if (typeof params.value === 'number') {
          return params.value.toLocaleString();
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
              variant="contained" size="small" sx={{ bgcolor: '#1c69d4', fontSize: '0.7rem' }}
              onClick={() => navigate(`/view/${params.data.id}`)}
            >View</Button>
            <Button 
              variant="contained" size="small" color="error" sx={{ fontSize: '0.7rem' }}
              onClick={() => onDelete(params.data.id)}
            >Delete</Button>
          </Stack>
        )
      }
    ];
  }, [rowData, navigate, onDelete]);

  return (
    <Box>
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
        <Button 
          variant="text" 
          startIcon={<FileDownloadIcon />} 
          onClick={onExportClick}
          sx={{ color: '#aaa', '&:hover': { color: '#fff' } }}
        >
          Export to CSV
        </Button>
      </Stack>

      <div className="ag-theme-quartz-dark" style={{ height: '520px', width: '100%' }}>
        <AgGridReact
          ref={gridRef} // Attach the ref here
          rowData={rowData}
          columnDefs={columnDefs}
          theme={themeQuartz}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50]}
        />
      </div>
    </Box>
  );
}

export default DataGrid;