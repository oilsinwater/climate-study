import { Repository } from '../../pages/search-repositories/_config/taskflow.types';

/**
 * Common interface for all climate data source adapters
 */
export interface DataSourceAdapter {
  /**
   * Unique identifier for the data source
   */
  id: string;
  
  /**
   * Descriptive name of the data source
   */
  name: string;
  
  /**
   * Search for datasets in this data source with optional filters
   */
  searchDatasets(options: SearchOptions): Promise<SearchResult>;
  
  /**
   * Get detailed information about a specific dataset
   */
  getDatasetDetails(datasetId: string): Promise<Repository>;
  
  /**
   * Get metadata about the data source, including available variables,
   * regions, time periods, etc.
   */
  getSourceMetadata(): Promise<SourceMetadata>;
}

/**
 * Options for searching datasets
 */
export interface SearchOptions {
  query?: string;
  source?: string[];
  variables?: string[];
  spatial_coverage?: string[];
  temporal_coverage?: string | { startDate: string; endDate: string };
  spatial_resolution?: string[];
  temporal_resolution?: string[];
  type?: string[];
  publication_date?: string | { startDate: string; endDate: string };
  quality?: number;
  tags?: string[];
  category?: string[];
  page?: number;
  limit?: number;
}

/**
 * Result from a search operation
 */
export interface SearchResult {
  datasets: Repository[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Metadata about a data source
 */
export interface SourceMetadata {
  variables: string[];
  regions: string[];
  resolutions: {
    spatial: string[];
    temporal: string[];
  };
  types: string[];
  timePeriod: {
    start: string;
    end: string;
  };
}

/**
 * Attachment/file in a dataset
 */
export interface DatasetAttachment {
  id: string;
  name: string;
  description?: string;
  fileType: string;
  fileSize: number;
  url: string;
  dateAdded: string;
  format: string;
}

/**
 * Common parameters for all APIs
 */
export interface ApiParams {
  baseUrl?: string;
  apiKey?: string;
  timeout?: number;
}
