import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
    return (
        <Box
            sx={{
                backgroundColor: '#f5f5f5',
                padding: '1rem',
                textAlign: 'center',
                boxShadow: '0 -1px 5px rgba(0,0,0,0.1)',
            }}
        >
            <Typography variant="body2" color="text.secondary">
                &copy; {new Date().getFullYear()} Logify. All rights reserved.
            </Typography>
        </Box>
    );
};

export default Footer;
