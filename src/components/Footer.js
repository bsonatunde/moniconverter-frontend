import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  Divider,
  IconButton,
} from '@mui/material';
import {
  PictureAsPdf,
  Email,
  GitHub,
  LinkedIn,
} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.900',
        color: 'grey.300',
        py: 6,
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'grey.800',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    bgcolor: 'primary.main',
                    borderRadius: 2,
                    p: 1,
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PictureAsPdf sx={{ fontSize: 28, color: 'white' }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 0 }}>
                    Moniconverter
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'primary.light', fontWeight: 500 }}>
                    Professional PDF Solutions
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ lineHeight: 1.7, mb: 2 }}>
                Transform, edit, and organize your PDF documents with our comprehensive suite of professional tools.
                Secure, fast, and reliable PDF processing for individuals and businesses.
              </Typography>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', mb: 3 }}>
              Tools
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {/*
                { label: 'Convert', path: '/convert' },
                { label: 'Organize', path: '/organize' },
                { label: 'Edit', path: '/edit' },
                { label: 'Security', path: '/security' },
              */}
              {['Convert', 'Organize', 'Edit', 'Security'].map((label) => (
                <Link
                  key={label}
                  href={`/${label.toLowerCase()}`}
                  sx={{
                    color: 'grey.400',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 400,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: 'primary.light',
                      textDecoration: 'none',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  {label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Contact & Social */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', mb: 3 }}>
              Connect
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: 'grey.400' }}>
              Get in touch with the developer and explore more projects.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <a href="mailto:onatunde.samuel@gmail.com" style={{ textDecoration: 'none' }}>
                <IconButton
                  sx={{
                    bgcolor: 'grey.800',
                    color: 'grey.400',
                    '&:hover': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                  size="small"
                >
                  <Email fontSize="small" />
                </IconButton>
              </a>
              <IconButton
                component="a"
                href="https://github.com/bsonatunde"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  bgcolor: 'grey.800',
                  color: 'grey.400',
                  '&:hover': {
                    bgcolor: 'grey.700',
                    color: 'white',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease',
                }}
                size="small"
              >
                <GitHub fontSize="small" />
              </IconButton>
              <IconButton
                component="a"
                href="https://www.linkedin.com/in/bolaji-onatunde-b42130100/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  bgcolor: 'grey.800',
                  color: 'grey.400',
                  '&:hover': {
                    bgcolor: '#0077b5',
                    color: 'white',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease',
                }}
                size="small"
              >
                <LinkedIn fontSize="small" />
              </IconButton>
              <IconButton
                component="a"
                href="https://bsonat.onrender.com/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  bgcolor: 'grey.800',
                  color: 'grey.400',
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease',
                }}
                size="small"
              >
                <PictureAsPdf fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Newsletter/CTA */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', mb: 3 }}>
              Stay Updated
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: 'grey.400' }}>
              Follow for the latest PDF tools and features.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: 'primary.light', fontWeight: 500 }}>
                Moniconverter
              </Typography>
              <Typography variant="caption" sx={{ color: 'grey.500' }}>
                • Professional Solutions
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, bgcolor: 'grey.800' }} />

        {/* Bottom Section */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="body2" sx={{ color: 'grey.500' }}>
            © {currentYear} Moniconverter. Crafted with precision by Bolaji Onatunde.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link
              href="#"
              sx={{
                color: 'grey.500',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': { color: 'primary.light' }
              }}
            >
              Privacy
            </Link>
            <Link
              href="#"
              sx={{
                color: 'grey.500',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': { color: 'primary.light' }
              }}
            >
              Terms
            </Link>
            <Link
              href="#"
              sx={{
                color: 'grey.500',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': { color: 'primary.light' }
              }}
            >
              Support
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
