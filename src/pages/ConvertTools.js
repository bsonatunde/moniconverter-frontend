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
  Snackbar,
  Paper,
} from '@mui/material';
import FileUpload from '../components/FileUpload';
import axios from 'axios';
import DownloadIcon from '@mui/icons-material/Download';
import AdComponent from '../components/AdComponent';

const ConvertTools = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [activeConverter, setActiveConverter] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const converters = [
    {
      id: 'image-to-pdf',
      title: 'Image to PDF',
      description: 'Convert JPG, PNG images to PDF format',
      acceptedTypes: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/jpg': ['.jpg'], 'image/png': ['.png'] },
      endpoint: '/api/convert/image-to-pdf',
    },
    {
      id: 'word-to-pdf',
      title: 'Word to PDF',
      description: 'Convert Word documents (.docx) to PDF',
      acceptedTypes: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
      endpoint: '/api/convert/word-to-pdf',
    },
    {
      id: 'excel-to-pdf',
      title: 'Excel to PDF',
      description: 'Convert Excel spreadsheets (.xlsx) to PDF',
      acceptedTypes: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
      endpoint: '/api/convert/excel-to-pdf',
    },
    {
      id: 'html-to-pdf',
      title: 'HTML to PDF',
      description: 'Convert HTML files to PDF format',
      acceptedTypes: { 'text/html': ['.html', '.htm'] },
      endpoint: '/api/convert/html-to-pdf',
    },
    {
      id: 'pdf-to-jpg',
      title: 'PDF to JPG',
      description: 'Convert PDF pages to JPG images',
      acceptedTypes: { 'application/pdf': ['.pdf'] },
      endpoint: '/api/convert/pdf-to-jpg',
    },
    {
      id: 'image-to-text',
      title: 'Image to Text',
      description: 'Extract text from images using OCR',
      acceptedTypes: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/jpg': ['.jpg'], 'image/png': ['.png'] },
      endpoint: '/api/convert/image-to-text',
    },
    {
      id: 'pdf-to-word',
      title: 'PDF to Word',
      description: 'Convert PDF files to Word documents',
      acceptedTypes: { 'application/pdf': ['.pdf'] },
      endpoint: '/api/convert/pdf-to-word',
    },
  ];

  const handleFileSelect = (files, converterId) => {
    setSelectedFiles(files);
    setActiveConverter(converterId);
    setResult(null);
    setError('');
  };

  const handleConvert = async () => {
    if (!selectedFiles.length || !activeConverter) return;

    setIsProcessing(true);
    setError('');
    setResult(null);

    try {
      const converter = converters.find(c => c.id === activeConverter);
      const formData = new FormData();
      formData.append('file', selectedFiles[0]);

      const response = await axios.post(`${converter.endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setResult(response.data);
        setSnackbarOpen(true);
      } else {
        setError(response.data.error || 'Conversion failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during conversion');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result?.downloadUrl) {
      const link = document.createElement('a');
      // Use full backend URL for downloads since frontend and backend are on different domains
      link.href = `https://moniconverter-api.onrender.com${result.downloadUrl}`;
      link.download = result.filename || 'converted-file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 2, pb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center" sx={{ mb: 4 }}>
        PDF Conversion Tools
      </Typography>

      {/* Advertisement */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <AdComponent adSlot="5000079882" width="360px" height="800px" />
      </Box>

      <Grid container spacing={4}>
        {converters.map((converter) => (
          <Grid item xs={12} md={6} lg={4} key={converter.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: activeConverter === converter.id ? 2 : 1,
                borderColor: activeConverter === converter.id ? 'primary.main' : 'divider',
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {converter.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {converter.description}
                </Typography>

                <FileUpload
                  onFilesSelected={(files) => handleFileSelect(files, converter.id)}
                  acceptedFileTypes={converter.acceptedTypes}
                  maxFiles={1}
                  title="Select File"
                  description="Click or drag file here"
                />

                {activeConverter === converter.id && selectedFiles.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleConvert}
                      disabled={isProcessing}
                      fullWidth
                      startIcon={isProcessing ? <CircularProgress size={20} /> : null}
                    >
                      {isProcessing ? 'Converting...' : 'Convert File'}
                    </Button>
                  </Box>
                )}

                {result && activeConverter === converter.id && (
                  <Box sx={{ mt: 2 }}>
                    <Alert severity="success" sx={{ mb: 2 }}>
                      {result.message}
                    </Alert>
                    
                    {result.extractedText && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          Extracted Text Preview:
                        </Typography>
                        <Paper sx={{ p: 2, bgcolor: 'grey.50', maxHeight: 200, overflow: 'auto' }}>
                          <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                            {result.extractedText}
                          </Typography>
                        </Paper>
                        {result.confidence !== undefined && (
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            OCR Confidence: {result.confidence.toFixed(1)}%
                          </Typography>
                        )}
                      </Box>
                    )}
                    
                    <Button
                      variant="outlined"
                      onClick={handleDownload}
                      startIcon={<DownloadIcon />}
                      fullWidth
                    >
                      Download {result.extractedText ? 'Text File' : 'Converted File'}
                    </Button>
                  </Box>
                )}

                {error && activeConverter === converter.id && (
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
        message="File converted successfully!"
      />
    </Container>
  );
};

export default ConvertTools;
