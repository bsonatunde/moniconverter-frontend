import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Transform,
  Security,
  Edit,
  FolderOpen,
  PictureAsPdf,
  Speed,
  CloudUpload,
  Lock,
} from '@mui/icons-material';
import AdComponent from '../components/AdComponent';

const Home = () => {
  const features = [
    {
      title: 'Convert Files',
      description: 'Convert between PDF and various formats including JPG, Word, PowerPoint, Excel, and HTML.',
      icon: <Transform color="primary" sx={{ fontSize: 40 }} />,
      link: '/convert',
      tools: ['JPG to PDF', 'Word to PDF', 'PDF to JPG', 'Excel to PDF', 'HTML to PDF'],
    },
    {
      title: 'Organize PDFs',
      description: 'Merge, split, extract, and remove pages from your PDF documents with ease.',
      icon: <FolderOpen color="primary" sx={{ fontSize: 40 }} />,
      link: '/organize',
      tools: ['Merge PDF', 'Split PDF', 'Extract Pages', 'Remove Pages'],
    },
    {
      title: 'Edit PDFs',
      description: 'Rotate pages, add watermarks, page numbers, and compress your PDF files.',
      icon: <Edit color="primary" sx={{ fontSize: 40 }} />,
      link: '/edit',
      tools: ['Rotate Pages', 'Add Watermark', 'Page Numbers', 'Compress PDF'],
    },
    {
      title: 'Security Tools',
      description: 'Protect, unlock, sign, and compare PDF documents with advanced security features.',
      icon: <Security color="primary" sx={{ fontSize: 40 }} />,
      link: '/security',
      tools: ['Protect PDF', 'Unlock PDF', 'Digital Sign', 'Compare PDFs'],
    },
  ];

  const benefits = [
    {
      icon: <Speed color="secondary" />,
      title: 'Fast Processing',
      description: 'Quick and efficient PDF processing with optimized algorithms',
    },
    {
      icon: <CloudUpload color="secondary" />,
      title: 'Easy Upload',
      description: 'Drag and drop interface with support for multiple file formats',
    },
    {
      icon: <Lock color="secondary" />,
      title: 'Secure & Private',
      description: 'Your files are processed securely and automatically deleted after 24 hours',
    },
    {
      icon: <PictureAsPdf color="secondary" />,
      title: 'Professional Quality',
      description: 'High-quality output with preservation of original formatting',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ pt: 2, pb: 4 }}>
      {/* Hero Section */}
      <Box textAlign="center" sx={{ mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Moniconverter
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
          Your complete solution for PDF conversion, editing, and organization. 
          Process your documents quickly and securely with professional-grade tools.
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/convert"
          sx={{ mr: 2, px: 4, py: 1.5, fontSize: '1.1rem' }}
        >
          Start Converting
        </Button>
        <Button
          variant="outlined"
          size="large"
          component={Link}
          to="/organize"
          sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
        >
          Organize PDFs
        </Button>
      </Box>

      {/* Main Features */}
      <Typography variant="h4" component="h2" textAlign="center" sx={{ mb: 4 }}>
        Powerful PDF Tools
      </Typography>
      
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', pb: 1 }}>
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {feature.description}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                  {feature.tools.slice(0, 3).map((tool, toolIndex) => (
                    <Chip 
                      key={toolIndex} 
                      label={tool} 
                      size="small" 
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  ))}
                  {feature.tools.length > 3 && (
                    <Chip 
                      label={`+${feature.tools.length - 3} more`} 
                      size="small" 
                      variant="outlined"
                      color="primary"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  )}
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pt: 0 }}>
                <Button 
                  component={Link} 
                  to={feature.link}
                  variant="contained" 
                  size="small"
                  fullWidth
                  sx={{ mx: 2, mb: 2 }}
                >
                  Explore Tools
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Benefits Section */}
      <Typography variant="h4" component="h2" textAlign="center" sx={{ mb: 4 }}>
        Why Choose Moniconverter?
      </Typography>
      
      <Grid container spacing={4}>
        {benefits.map((benefit, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box textAlign="center">
              <Box sx={{ mb: 2 }}>{benefit.icon}</Box>
              <Typography variant="h6" component="h3" gutterBottom>
                {benefit.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {benefit.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Ad Component */}
      <Box sx={{ my: 4 }}>
        <AdComponent adSlot="5000079882" width="360px" height="800px" />
      </Box>
    </Container>
  );
};

export default Home;
