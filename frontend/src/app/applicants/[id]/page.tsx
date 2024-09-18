"use client";
import * as React from 'react';
import { Box, Grid, Typography, useTheme, useMediaQuery, Container} from '@mui/material';
import ApplicantsListing from './components/ApplicantsListing';

export default function ApplicantPage({params}: {params: {id: string}}) {
    const theme = useTheme();
    const captionSize = useMediaQuery(theme.breakpoints.down('sm'));
    const jobId = params.id;
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
                    Applicants
                </Typography>
            </Box>
            <ApplicantsListing id={jobId}/>
        </Box>
        </>
    );
}