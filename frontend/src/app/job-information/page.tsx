"use client";
import * as React from 'react';
import { Box, Typography, useTheme, useMediaQuery} from '@mui/material';
import JobListings from './components/JobListings';

export default function jobInformation(){
    const theme = useTheme();
    const captionSize = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <>
        <Box sx={{
            backgroundColor: '#F0F4FC',
            minHeight: '100vh'
        }}>
            <Box
                sx = {{
                    textAlign: 'left',  
                    padding: '3% 0%',      
                    width: '100%',
                    marginLeft:'3%'
                }}
            >  
                <Typography component="div" gutterBottom
                    sx={ captionSize ? { fontFamily: 'Arial', fontWeight: '500', letterSpacing: '1.2px', fontSize: '28px', color: '#003060' }: {
                        fontFamily: 'Arial', fontWeight: '500', letterSpacing: '1.5px', fontSize: '34px', color: '#003060'
                    }}
                >
                    JOB LISTINGS
                </Typography>
            </Box>
            <JobListings />
        </Box>
        </>
    );
}