import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Alert,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
} from '@mui/material';
import FileUpload from '../components/FileUpload';
import axios from 'axios';
import DownloadIcon from '@mui/icons-material/Download';

const OrganizeTools = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [activeTool, setActiveTool] = useState('');
  const [toolOptions, setToolOptions] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const organizeTools = [
    {
      id: 'merge',
      title: 'Merge PDFs',
      description: 'Combine multiple PDF files into one document',
      acceptsMultiple: true,
      maxFiles: 10,
      endpoint: '/api/organize/merge',
      options: [],
    },
    {
      id: 'split',
      title: 'Split PDF',
      description: 'Split PDF into separate pages or ranges',
      acceptsMultiple: false,
      maxFiles: 1,
      endpoint: '/api/organize/split',
      options: [
        {
          key: 'splitType',
          label: 'Split Type',
          type: 'select',
          choices: [
            { value: 'pages', label: 'Split into individual pages' },
            { value: 'ranges', label: 'Split by custom ranges' }
          ],
          default: 'pages'
        },
        {
          key: 'ranges',
          label: 'Page Ranges (e.g., [{"start":1,"end":3},{"start":5,"end":7}])',
          type: 'text',
          condition: { splitType: 'ranges' },
          placeholder: '[{"start":1,"end":3},{"start":5,"end":7}]'
        }
      ],
    },
    {
      id: 'remove-pages',
      title: 'Remove Pages',
      description: 'Remove specific pages from PDF',
      acceptsMultiple: false,
      maxFiles: 1,
      endpoint: '/api/organize/remove-pages',
      options: [
        {
          key: 'pagesToRemove',
          label: 'Pages to Remove (e.g., 1,3,5 or 1-3,5)',
          type: 'text',
          required: true,
          placeholder: '1,3,5 or 1-3,5'
        }
      ],
    },
    {
      id: 'extract-pages',
      title: 'Extract Pages',
      description: 'Extract specific pages from PDF into a new document',
      acceptsMultiple: false,
      maxFiles: 1,
      endpoint: '/api/organize/extract-pages',
      options: [
        {
          key: 'pagesToExtract',
          label: 'Pages to Extract (e.g., 1,3,5 or 1-3,5)',
          type: 'text',
          required: true,
          placeholder: '1,3,5 or 1-3,5'
        }
      ],
    },
  ];

  const handleFileSelect = (files, toolId) => {
    setSelectedFiles(files);
    setActiveTool(toolId);
    setResult(null);
    setError('');
    // Initialize tool options with default values
    const tool = organizeTools.find(t => t.id === toolId);
    const initialOptions = {};
    tool.options.forEach(option => {
      if (option.default) {
        initialOptions[option.key] = option.default;
      }
    });
    setToolOptions(initialOptions);
  };

  const handleOptionChange = (key, value) => {
    setToolOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleProcess = async () => {
    if (!selectedFiles.length || !activeTool) return;

    // Validate required options
    const tool = organizeTools.find(t => t.id === activeTool);
    const requiredOptions = tool.options.filter(opt => opt.required);
    
    for (const option of requiredOptions) {
      if (!toolOptions[option.key]) {
        setError(`${option.label} is required`);
        return;
      }
    }

    setIsProcessing(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      
      if (tool.acceptsMultiple) {
        selectedFiles.forEach(file => {
          formData.append('files', file);
        });
      } else {
        formData.append('file', selectedFiles[0]);
      }

      // Add tool options to form data
      Object.entries(toolOptions).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await axios.post(`${tool.endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setResult(response.data);
        setSnackbarOpen(true);
      } else {
        setError(response.data.error || 'Operation failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during processing');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    // Use full backend URL for downloads since frontend and backend are on different domains
    link.href = `https://moniconverter-api.onrender.com${url}`;
    link.download = filename || 'processed-file';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderToolOptions = (tool) => {
    return tool.options.map(option => {
      // Check if option should be rendered based on conditions
      if (option.condition) {
        const shouldRender = Object.entries(option.condition).every(([key, value]) => 
          toolOptions[key] === value
        );
        if (!shouldRender) return null;
      }

      if (option.type === 'select') {
        return (
          <FormControl fullWidth key={option.key} sx={{ mb: 2 }}>
            <InputLabel>{option.label}</InputLabel>
            <Select
              value={toolOptions[option.key] || ''}
              label={option.label}
              onChange={(e) => handleOptionChange(option.key, e.target.value)}
            >
              {option.choices.map(choice => (
                <MenuItem key={choice.value} value={choice.value}>
                  {choice.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      }

      return (
        <TextField
          key={option.key}
          fullWidth
          label={option.label}
          placeholder={option.placeholder}
          value={toolOptions[option.key] || ''}
          onChange={(e) => handleOptionChange(option.key, e.target.value)}
          required={option.required}
          sx={{ mb: 2 }}
        />
      );
    });
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 2, pb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center" sx={{ mb: 4 }}>
        PDF Organization Tools
      </Typography>

      <Grid container spacing={4}>
        {organizeTools.map((tool) => (
          <Grid item xs={12} md={6} key={tool.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: activeTool === tool.id ? 2 : 1,
                borderColor: activeTool === tool.id ? 'primary.main' : 'divider',
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {tool.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {tool.description}
                </Typography>

                <FileUpload
                  onFilesSelected={(files) => handleFileSelect(files, tool.id)}
                  acceptedFileTypes={{ 'application/pdf': ['.pdf'] }}
                  maxFiles={tool.maxFiles}
                  title={tool.acceptsMultiple ? `Select PDF Files (max ${tool.maxFiles})` : "Select PDF File"}
                  description={tool.acceptsMultiple ? "You can select multiple PDFs" : "Select a single PDF file"}
                />

                {activeTool === tool.id && selectedFiles.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    {renderToolOptions(tool)}
                    
                    <Button
                      variant="contained"
                      onClick={handleProcess}
                      disabled={isProcessing}
                      fullWidth
                      startIcon={isProcessing ? <CircularProgress size={20} /> : null}
                    >
                      {isProcessing ? 'Processing...' : `${tool.title}`}
                    </Button>
                  </Box>
                )}

                {result && activeTool === tool.id && (
                  <Box sx={{ mt: 2 }}>
                    <Alert severity="success" sx={{ mb: 2 }}>
                      {result.message}
                    </Alert>
                    
                    {result.files ? (
                      // Multiple files result (split)
                      result.files.map((file, index) => (
                        <Button
                          key={index}
                          variant="outlined"
                          onClick={() => handleDownload(file.downloadUrl, file.filename)}
                          startIcon={<DownloadIcon />}
                          fullWidth
                          sx={{ mb: 1 }}
                        >
                          Download {file.filename}
                        </Button>
                      ))
                    ) : result.downloadUrl ? (
                      // Single file result
                      <Button
                        variant="outlined"
                        onClick={() => handleDownload(result.downloadUrl, result.filename)}
                        startIcon={<DownloadIcon />}
                        fullWidth
                      >
                        Download Processed File
                      </Button>
                    ) : null}
                  </Box>
                )}

                {error && activeTool === tool.id && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message="PDF processed successfully!"
      />
    </Container>
  );
};

export default OrganizeTools;
