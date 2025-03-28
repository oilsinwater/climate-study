import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useFilters } from '../../../components/FilterContext';
import { filterData } from '../../../utils/filters.utils';
import { useListQuery } from '../../../utils/useListQuery';
import { taskflow } from '../_config/taskflow.config';
import Plot from 'react-plotly.js';

interface MapViewProps {
  searchTerm: string;
  setPreviewItem: React.Dispatch<React.SetStateAction<any>>;
}

/**
 * Map visualization view for the data
 */
export const MapView: React.FC<MapViewProps> = ({
  searchTerm,
  setPreviewItem,
}) => {
  const { activeFilters } = useFilters();
  const filterConfigs = taskflow.pages.index.tableFilters;
  
  const { isPending, isError, data, error } = useListQuery({
    activeFilters,
    dataSource: taskflow.data.list.source,
    filterConfigs,
    queryMode: taskflow.data.list.queryMode,
    staticParams: taskflow.data.list.staticParams,
  });

  if (isPending) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading map data...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error loading map data: {error.message}</Typography>
      </Box>
    );
  }

  // Filter the data based on active filters and search term
  const filteredData = filterData(data, activeFilters, filterConfigs, searchTerm);

  // Extract columns for potential map data
  const columns = taskflow.pages.index.tableColumns;
  const numericColumns = columns.filter(col => col.type === 'number');
  
  // For a map, we need to generate some latitude and longitude data
  // In a real application, this would come from the actual data
  // Here we'll generate random coordinates for demonstration
  const mapData = filteredData.map((item, index) => {
    // Generate random coordinates centered around different regions based on some property
    // This is just for demonstration - in a real app, you'd use actual coordinates
    const baseLatitude = 0;
    const baseLongitude = 0;
    
    // Use some property to determine the region, or just use the index
    const region = index % 5;
    
    let regionLatitude, regionLongitude;
    
    switch(region) {
      case 0: // North America
        regionLatitude = 40;
        regionLongitude = -100;
        break;
      case 1: // Europe
        regionLatitude = 50;
        regionLongitude = 10;
        break;
      case 2: // Asia
        regionLatitude = 30;
        regionLongitude = 100;
        break;
      case 3: // South America
        regionLatitude = -20;
        regionLongitude = -60;
        break;
      case 4: // Africa
        regionLatitude = 0;
        regionLongitude = 20;
        break;
      default:
        regionLatitude = 0;
        regionLongitude = 0;
    }
    
    // Add some random variation
    const latitude = regionLatitude + (Math.random() - 0.5) * 20;
    const longitude = regionLongitude + (Math.random() - 0.5) * 20;
    
    // Use a numeric field for the size of the marker if available
    const sizeField = numericColumns[0]?.field;
    const size = sizeField ? Math.max(5, Math.min(20, item[sizeField] / 10)) : 10;
    
    return {
      ...item,
      latitude,
      longitude,
      size
    };
  });

  // Handle clicking on a map point to show preview
  const handleMapClick = (data: any) => {
    const pointIndex = data.points[0].pointIndex;
    setPreviewItem(filteredData[pointIndex]);
  };

  // Get a field to use for coloring the points
  const colorField = numericColumns[1]?.field || numericColumns[0]?.field;
  const colorValues = colorField ? mapData.map(item => item[colorField]) : [];
  
  // Get a field for the hover text
  const titleField = columns[0].field;

  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Global Distribution Map
        </Typography>
        <Box sx={{ height: 600 }}>
          <Plot
            data={[
              {
                type: 'scattergeo',
                mode: 'markers',
                lon: mapData.map(item => item.longitude),
                lat: mapData.map(item => item.latitude),
                text: mapData.map(item => item[titleField]),
                marker: {
                  size: mapData.map(item => item.size),
                  color: colorField ? colorValues : 'blue',
                  colorscale: 'Viridis',
                  showscale: !!colorField,
                  colorbar: colorField ? {
                    title: columns.find(col => col.field === colorField)?.headerName || colorField
                  } : undefined,
                  opacity: 0.8,
                },
                name: 'Data Points',
                hoverinfo: 'text',
                hovertext: mapData.map(item => {
                  // Create hover text with key information
                  return `${item[titleField]}<br>` + 
                    columns.slice(1, 4).map(col => 
                      `${col.headerName}: ${item[col.field]}${col.units ? ` ${col.units}` : ''}`
                    ).join('<br>');
                })
              }
            ]}
            layout={{
              title: 'Climate Data Geographic Distribution',
              autosize: true,
              margin: { l: 0, r: 0, b: 0, t: 50, pad: 4 },
              geo: {
                scope: 'world',
                showland: true,
                landcolor: 'rgb(217, 217, 217)',
                subunitcolor: 'rgb(255, 255, 255)',
                countrycolor: 'rgb(255, 255, 255)',
                showlakes: true,
                lakecolor: 'rgb(255, 255, 255)',
                showsubunits: true,
                showcountries: true,
                resolution: 50,
                projection: {
                  type: 'natural earth'
                }
              }
            }}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true}
            onClick={(data) => handleMapClick(data)}
          />
        </Box>
      </Paper>
    </Box>
  );
};
