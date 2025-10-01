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
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import FileUpload from '../components/FileUpload';
import axios from 'axios';
import DownloadIcon from '@mui/icons-material/Download';

const SecurityTools = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [activeTool, setActiveTool] = useState('');
  const [toolOptions, setToolOptions] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const securityTools = [
    {
      id: 'protect',
      title: 'Protect PDF',
      description: 'Add password protection to your PDF files',
      endpoint: '/api/security/protect',
      maxFiles: 1,
      options: [
        {
          key: 'password',
          label: 'Password',
          type: 'password',
          required: true,
          placeholder: 'Enter password (min 4 characters)'
        },
        {
          key: 'permissions',
          label: 'Permissions',
          type: 'select',
          choices: [
            { value: 'full', label: 'Full access (print, copy, edit)' },
            { value: 'print', label: 'Print only' },
            { value: 'view', label: 'View only' }
          ],
          default: 'full'
        }
      ],
    },
    {
      id: 'unlock',
      title: 'Unlock PDF',
      description: 'Remove password protection from PDF files',
      endpoint: '/api/security/unlock',
      maxFiles: 1,
      options: [
        {
          key: 'password',
          label: 'Current Password',
          type: 'password',
          required: true,
          placeholder: 'Enter current password'
        }
      ],
    },
    {
      id: 'sign',
      title: 'Digital Signature',
      description: 'Add digital signature to PDF (demo implementation)',
      endpoint: '/api/security/sign',
      maxFiles: 1,
      options: [
        {
          key: 'signatureName',
          label: 'Signature Name',
          type: 'text',
          required: true,
          default: 'Digital Signature',
          placeholder: 'Your full name'
        },
        {
          key: 'reason',
          label: 'Reason for Signing',
          type: 'text',
          default: 'Document approval',
          placeholder: 'Document approval, review, etc.'
        },
        {
          key: 'location',
          label: 'Location',
          type: 'text',
          default: 'Digital',
          placeholder: 'City, Country'
        },
        {
          key: 'contactInfo',
          label: 'Contact Information',
          type: 'text',
          placeholder: 'Email or phone (optional)'
        }
      ],
    },
    {
      id: 'compare',
      title: 'Compare PDFs',
      description: 'Compare two PDF files for differences',
      endpoint: '/api/security/compare',
      maxFiles: 2,
      options: [],
    },
    {
      id: 'redact',
      title: 'Redact Content',
      description: 'Black out sensitive information in PDF (demo)',
      endpoint: '/api/security/redact',
      maxFiles: 1,
      options: [
        {
          key: 'areas',
          label: 'Redaction Areas (JSON format)',
          type: 'textarea',
          required: true,
          placeholder: '[{"x":50,"y":100,"width":200,"height":20,"page":1}]',
          helperText: 'Specify areas to redact as JSON array with x, y, width, height coordinates'
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
    const tool = securityTools.find(t => t.id === toolId);
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
    const tool = securityTools.find(t => t.id === activeTool);
    const requiredOptions = tool.options.filter(opt => opt.required);
    
    for (const option of requiredOptions) {
      if (!toolOptions[option.key]) {
        setError(`${option.label} is required`);
        return;
      }
    }

    // Special validation for password length
    if (toolOptions.password && activeTool === 'protect' && toolOptions.password.length < 4) {
      setError('Password must be at least 4 characters long');
      return;
    }

    setIsProcessing(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      
      if (tool.maxFiles > 1) {
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

  const handleDownload = () => {
    if (result?.downloadUrl) {
      const link = document.createElement('a');
      link.href = `${result.downloadUrl}`;
      link.download = result.filename || 'secured-file';
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

      if (option.type === 'password') {
        return (
          <TextField
            key={option.key}
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label={option.label}
            placeholder={option.placeholder}
            value={toolOptions[option.key] || ''}
            onChange={(e) => handleOptionChange(option.key, e.target.value)}
            required={option.required}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        );
      }

      if (option.type === 'textarea') {
        return (
          <TextField
            key={option.key}
            fullWidth
            multiline
            rows={4}
            label={option.label}
            placeholder={option.placeholder}
            value={toolOptions[option.key] || ''}
            onChange={(e) => handleOptionChange(option.key, e.target.value)}
            required={option.required}
            helperText={option.helperText}
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
        PDF Security Tools
      </Typography>

      <Grid container spacing={4}>
        {securityTools.map((tool) => (
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
                  title={tool.maxFiles > 1 ? `Select ${tool.maxFiles} PDF Files` : "Select PDF File"}
                  description={tool.maxFiles > 1 ? `Select exactly ${tool.maxFiles} PDF files` : "Select a PDF file"}
                />

                {activeTool === tool.id && selectedFiles.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    {renderToolOptions(tool)}
                    
                    <Button
                      variant="contained"
                      onClick={handleProcess}
                      disabled={isProcessing || (tool.maxFiles > 1 && selectedFiles.length !== tool.maxFiles)}
                      fullWidth
                      startIcon={isProcessing ? <CircularProgress size={20} /> : null}
                    >
                      {isProcessing ? 'Processing...' : `Apply ${tool.title}`}
                    </Button>
                    
                    {tool.maxFiles > 1 && selectedFiles.length !== tool.maxFiles && (
                      <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                        Please select exactly {tool.maxFiles} files
                      </Typography>
                    )}
                  </Box>
                )}

                {result && activeTool === tool.id && (
                  <Box sx={{ mt: 2 }}>
                    <Alert severity="success" sx={{ mb: 2 }}>
                      {result.message}
                      
                      {/* Special handling for compare results */}
                      {result.comparison && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2">
                            <strong>File 1:</strong> {result.comparison.file1.name} ({result.comparison.file1.pages} pages, {result.comparison.file1.size})
                          </Typography>
                          <Typography variant="body2">
                            <strong>File 2:</strong> {result.comparison.file2.name} ({result.comparison.file2.pages} pages, {result.comparison.file2.size})
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            <strong>Differences:</strong> 
                            {result.comparison.differences.identical ? ' Files appear identical' : 
                             ` Page count differs: ${result.comparison.differences.pageCountDiff}, Size differs: ${result.comparison.differences.sizeDiff}`}
                          </Typography>
                        </Box>
                      )}
                      
                      {/* Signature info */}
                      {result.signature && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2">
                            <strong>Signed by:</strong> {result.signature.name}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Reason:</strong> {result.signature.reason}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Date:</strong> {new Date(result.signature.timestamp).toLocaleString()}
                          </Typography>
                        </Box>
                      )}
                    </Alert>
                    
                    {result.downloadUrl && (
                      <Button
                        variant="outlined"
                        onClick={handleDownload}
                        startIcon={<DownloadIcon />}
                        fullWidth
                      >
                        Download {tool.title === 'Compare PDFs' ? 'Comparison Report' : 'Secured File'}
                      </Button>
                    )}
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
        message="Security operation completed successfully!"
      />
    </Container>
  );
};

export default SecurityTools;
