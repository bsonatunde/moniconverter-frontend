import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';

const FileUpload = ({ 
  onFilesSelected, 
  acceptedFileTypes = {}, 
  maxFiles = 1, 
  title = "Upload Files",
  description = "Drag and drop files here, or click to select files"
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState('');

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    accept: acceptedFileTypes,
    maxFiles: maxFiles,
    onDrop: (files) => {
      setError('');
      setUploadComplete(false);
      simulateUpload(files);
      onFilesSelected(files);
    },
    onDropRejected: (rejectedFiles) => {
      setError(`File type not accepted. Please upload: ${Object.keys(acceptedFileTypes).join(', ')}`);
    }
  });

  const simulateUpload = (files) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Paper
        {...getRootProps()}
        sx={{
          p: 4,
          textAlign: 'center',
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'action.hover',
          },
        }}
      >
        <input {...getInputProps()} />
        
        {uploadComplete ? (
          <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 2 }} />
        ) : (
          <CloudUploadIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
        )}
        
        <Typography variant="h6" gutterBottom>
          {uploadComplete ? 'Files Uploaded Successfully!' : title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {uploadComplete ? `${acceptedFiles.length} file(s) ready for processing` : description}
        </Typography>

        {isUploading && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Uploading... {uploadProgress}%
            </Typography>
          </Box>
        )}

        {uploadComplete && acceptedFiles.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {acceptedFiles.map((file, index) => (
              <Typography key={index} variant="body2" sx={{ color: 'success.main' }}>
                ✓ {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </Typography>
            ))}
          </Box>
        )}
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default FileUpload;
