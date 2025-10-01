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
  Slider,
  Snackbar,
} from '@mui/material';
import FileUpload from '../components/FileUpload';
import axios from 'axios';
import DownloadIcon from '@mui/icons-material/Download';

const EditTools = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [activeTool, setActiveTool] = useState('');
  const [toolOptions, setToolOptions] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const editTools = [
    {
      id: 'rotate',
      title: 'Rotate Pages',
      description: 'Rotate PDF pages by 90, 180, or 270 degrees',
      endpoint: '/api/edit/rotate',
      options: [
        {
          key: 'rotation',
          label: 'Rotation Angle',
          type: 'select',
          choices: [
            { value: '90', label: '90° Clockwise' },
            { value: '180', label: '180°' },
            { value: '270', label: '270° Clockwise' },
            { value: '-90', label: '90° Counter-clockwise' }
          ],
          default: '90'
        },
        {
          key: 'pages',
          label: 'Pages to Rotate (e.g., 1,3,5 or "all")',
          type: 'text',
          default: 'all',
          placeholder: 'all or 1,3,5 or 1-3,5'
        }
      ],
    },
    {
      id: 'watermark',
      title: 'Add Watermark',
      description: 'Add text watermark to PDF pages',
      endpoint: '/api/edit/watermark',
      options: [
        {
          key: 'text',
          label: 'Watermark Text',
          type: 'text',
          required: true,
          default: 'CONFIDENTIAL',
          placeholder: 'Enter watermark text'
        },
        {
          key: 'opacity',
          label: 'Opacity (0.1 - 1.0)',
          type: 'slider',
          min: 0.1,
          max: 1.0,
          step: 0.1,
          default: 0.3
        },
        {
          key: 'fontSize',
          label: 'Font Size',
          type: 'number',
          default: 50,
          min: 12,
          max: 100
        },
        {
          key: 'color',
          label: 'Color',
          type: 'text',
          default: '#999999',
          placeholder: '#999999'
        },
        {
          key: 'position',
          label: 'Position',
          type: 'select',
          choices: [
            { value: 'center', label: 'Center' },
            { value: 'top-left', label: 'Top Left' },
            { value: 'top-right', label: 'Top Right' },
            { value: 'bottom-left', label: 'Bottom Left' },
            { value: 'bottom-right', label: 'Bottom Right' }
          ],
          default: 'center'
        }
      ],
    },
    {
      id: 'page-numbers',
      title: 'Add Page Numbers',
      description: 'Add page numbers to PDF pages',
      endpoint: '/api/edit/page-numbers',
      options: [
        {
          key: 'position',
          label: 'Position',
          type: 'select',
          choices: [
            { value: 'bottom-center', label: 'Bottom Center' },
            { value: 'bottom-left', label: 'Bottom Left' },
            { value: 'bottom-right', label: 'Bottom Right' },
            { value: 'top-center', label: 'Top Center' },
            { value: 'top-left', label: 'Top Left' },
            { value: 'top-right', label: 'Top Right' }
          ],
          default: 'bottom-center'
        },
        {
          key: 'fontSize',
          label: 'Font Size',
          type: 'number',
          default: 12,
          min: 8,
          max: 24
        },
        {
          key: 'color',
          label: 'Color',
          type: 'text',
          default: '#000000',
          placeholder: '#000000'
        },
        {
          key: 'startPage',
          label: 'Start Page Number',
          type: 'number',
          default: 1,
          min: 1
        },
        {
          key: 'format',
          label: 'Format',
          type: 'select',
          choices: [
            { value: '{page}', label: 'Page number only' },
            { value: 'Page {page}', label: 'Page X' },
            { value: '{page} of {total}', label: 'X of Y' },
            { value: '- {page} -', label: '- X -' }
          ],
          default: '{page}'
        }
      ],
    },
    {
      id: 'compress',
      title: 'Compress PDF',
      description: 'Reduce PDF file size while maintaining quality',
      endpoint: '/api/edit/compress',
      options: [],
    },
  ];

  const handleFileSelect = (files, toolId) => {
    setSelectedFiles(files);
    setActiveTool(toolId);
    setResult(null);
    setError('');
    
    // Initialize tool options with default values
    const tool = editTools.find(t => t.id === toolId);
    const initialOptions = {};
    tool.options.forEach(option => {
      if (option.default !== undefined) {
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
    const tool = editTools.find(t => t.id === activeTool);
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
      formData.append('file', selectedFiles[0]);

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

  const handleDownload = () => {
    if (result?.downloadUrl) {
      const link = document.createElement('a');
      link.href = `${result.downloadUrl}`;
      link.download = result.filename || 'edited-file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderToolOptions = (tool) => {
    return tool.options.map(option => {
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

      if (option.type === 'slider') {
        return (
          <Box key={option.key} sx={{ mb: 3 }}>
            <Typography gutterBottom>
              {option.label}: {toolOptions[option.key] || option.default}
            </Typography>
            <Slider
              value={toolOptions[option.key] || option.default}
              onChange={(e, value) => handleOptionChange(option.key, value)}
              min={option.min}
              max={option.max}
              step={option.step}
              marks
              valueLabelDisplay="auto"
            />
          </Box>
        );
      }

      if (option.type === 'number') {
        return (
          <TextField
            key={option.key}
            fullWidth
            type="number"
            label={option.label}
            value={toolOptions[option.key] || ''}
            onChange={(e) => handleOptionChange(option.key, parseInt(e.target.value) || '')}
            required={option.required}
            inputProps={{ min: option.min, max: option.max }}
            sx={{ mb: 2 }}
          />
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
        PDF Editing Tools
      </Typography>

      <Grid container spacing={4}>
        {editTools.map((tool) => (
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
                  maxFiles={1}
                  title="Select PDF File"
                  description="Select a PDF file to edit"
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
                      {isProcessing ? 'Processing...' : `Apply ${tool.title}`}
                    </Button>
                  </Box>
                )}

                {result && activeTool === tool.id && (
                  <Box sx={{ mt: 2 }}>
                    <Alert severity="success" sx={{ mb: 2 }}>
                      {result.message}
                      {result.compression && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2">
                            Original: {result.compression.originalSize} → 
                            Compressed: {result.compression.compressedSize} 
                            (Saved {result.compression.savedSpace})
                          </Typography>
                        </Box>
                      )}
                    </Alert>
                    
                    <Button
                      variant="outlined"
                      onClick={handleDownload}
                      startIcon={<DownloadIcon />}
                      fullWidth
                    >
                      Download Edited File
                    </Button>
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
        message="PDF edited successfully!"
      />
    </Container>
  );
};

export default EditTools;
