import React from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Link,
  Paper,
  Rating,
  Stack,
  Typography,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share';
import { Link as RouterLink } from 'react-router-dom';
import { LabelValueTable } from '../../../components/LabelValueTable';
import { DataGrid } from '@mui/x-data-grid';
import { GridColDef } from '@mui/x-data-grid';
import { taskflow } from '../_config/taskflow.config';

/**
 * Placeholder columns for attached files table
 */
const attachedFilesColumns: GridColDef[] = [
  {
    field: 'file_name',
    headerName: 'File Name',
    flex: 1,
  },
  {
    field: 'file_type',
    headerName: 'Type',
    width: 120,
  },
  {
    field: 'file_size',
    headerName: 'Size',
    type: 'number',
    width: 100,
  },
];

/**
 * Placeholder rows for attached files table
 */
const attachedFiles = [
  {
    file_name: 'temperature_data_2020.nc',
    file_type: 'NetCDF',
    file_size: '15 MB',
  },
  {
    file_name: 'precipitation_daily.csv',
    file_type: 'CSV',
    file_size: '117 MB',
  },
  {
    file_name: 'dataset_metadata.json',
    file_type: 'JSON',
    file_size: '4 MB',
  },
  {
    file_name: 'region_boundaries.geojson',
    file_type: 'GeoJSON',
    file_size: '8 MB',
  },
];

interface PreviewPanelProps {
  /**
   * Data for the selected card from the main list
   */
  previewItem: any;
  /**
   * Function to handle hiding
   */
  onClose: () => void;
}

/**
 * Panel to show detailed information about a climate dataset
 * next to the `<DataListPanel>`.
 */
export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  previewItem,
  onClose,
}) => {
  const cardFields = taskflow.pages.index.cardFields;

  // Content to render on the page for this component
  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        padding: 2,
        overflowY: 'auto',
      }}
    >
      <Stack spacing={3}>
        {/* Header Section */}
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center">
            <Typography variant="h6" component="h3" flex={1}>
              <Link
                component={RouterLink}
                to={`./${previewItem.id}`}
                underline="hover"
              >
                {previewItem[cardFields.title]}
              </Link>
            </Typography>
            <IconButton size="small" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
          
          {/* Source and Quality */}
          <Stack direction="row" spacing={2} alignItems="center">
            {previewItem[cardFields.source] && (
              <Chip 
                label={previewItem[cardFields.source]} 
                color="primary" 
                variant="outlined" 
                size="small"
              />
            )}
            
            {previewItem[cardFields.quality] && (
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" color="text.secondary">Quality:</Typography>
                <Rating 
                  value={previewItem[cardFields.quality]} 
                  readOnly 
                  size="small"
                  precision={0.5}
                />
              </Stack>
            )}
          </Stack>
        </Stack>

        {/* Dataset Thumbnail/Map */}
        {previewItem[cardFields.thumbnail] && (
          <Box
            sx={{
              height: '200px',
              width: '100%',
              overflow: 'hidden',
              backgroundColor: 'neutral.light'
            }}
          >
            <Box
              component="img"
              src={previewItem[cardFields.thumbnail]} 
              alt={previewItem[cardFields.title]} 
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
        )}
        
        {/* Summary */}
        {previewItem[cardFields.content] && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Summary
            </Typography>
            <Typography>{previewItem[cardFields.content]}</Typography>
          </Box>
        )}
        
        <Divider />
        
        {/* Dataset Details */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Dataset Details
          </Typography>
          
          <Grid container spacing={2}>
            {/* Temporal Coverage */}
            {previewItem[cardFields.temporal_coverage] && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Time Period
                </Typography>
                <Typography>
                  {previewItem[cardFields.temporal_coverage]}
                </Typography>
              </Grid>
            )}
            
            {/* Spatial Coverage */}
            {previewItem[cardFields.spatial_coverage] && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Geographic Region
                </Typography>
                <Typography>
                  {previewItem[cardFields.spatial_coverage]}
                </Typography>
              </Grid>
            )}
            
            {/* Resolution */}
            {previewItem[cardFields.resolution] && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Resolution
                </Typography>
                <Typography>
                  {previewItem[cardFields.resolution]}
                </Typography>
              </Grid>
            )}
            
            {/* Publication Date */}
            {previewItem.publication_date && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Publication Date
                </Typography>
                <Typography>
                  {previewItem.publication_date}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
        
        {/* Climate Variables */}
        {previewItem[cardFields.variables] && previewItem[cardFields.variables].length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Climate Variables
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {previewItem[cardFields.variables].map((variable: string, i: number) => (
                <Chip 
                  key={`${variable}-${i}`}
                  label={variable}
                  color="secondary"
                />
              ))}
            </Box>
          </Box>
        )}
        
        {/* Tags */}
        {previewItem[cardFields.tags] && previewItem[cardFields.tags].length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Tags
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {previewItem[cardFields.tags].map((tag: string, i: number) => (
                <Chip 
                  key={`${tag}-${i}`}
                  label={tag}
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}
        
        {/* Citation */}
        {previewItem[cardFields.citation] && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Citation
            </Typography>
            <Typography variant="body2" sx={{ fontStyle: 'italic', padding: 2, backgroundColor: 'background.paper', borderLeft: '4px solid', borderColor: 'primary.main', borderRadius: 1 }}>
              {previewItem[cardFields.citation]}
            </Typography>
          </Box>
        )}
        
        <Divider />
        
        {/* Attached Files */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Available Files
          </Typography>
          <DataGrid
            getRowId={(row) => row.file_name}
            rows={attachedFiles}
            columns={attachedFilesColumns}
            disableRowSelectionOnClick
            autoHeight
            hideFooterPagination
            hideFooter
            sx={{ minHeight: 200 }}
          />
        </Box>
        
        {/* Action Buttons */}
        <Stack direction="row" spacing={2}>
          <Button 
            variant="contained" 
            component={RouterLink} 
            to={`./${previewItem.id}`}
            startIcon={<DownloadIcon />}
          >
            Download Dataset
          </Button>
          <Button 
            variant="outlined"
            startIcon={<BookmarkIcon />}
          >
            Save to Workspace
          </Button>
          <Button 
            variant="outlined"
            startIcon={<ShareIcon />}
          >
            Share
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};
