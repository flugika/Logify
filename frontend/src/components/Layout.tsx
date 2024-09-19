import React from 'react';
import { Box } from '@mui/material';
import Footer from './Footer'; // Adjust the path as necessary

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Box
            sx={{
                minHeight: '100vh', // Full viewport height
                display: 'flex',
                flexDirection: 'column', // Stack children vertically
            }}
        >
            <Box
                sx={{
                    flex: 1, // Allows the main content to take up available space
                }}
            >
                {children} {/* Render child components here */}
            </Box>
            <Footer />
        </Box>
    );
};

export default Layout;
