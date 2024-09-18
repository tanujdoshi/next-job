

"use client";

import { Box, Grid , Typography, CardHeader, Card, Avatar,CardContent, useTheme, useMediaQuery} from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Jobstepsinformation as Steps } from "./jobstepsinformation";
import { JobStepsInformationType } from './types';

export default function JobSteps() {
    const theme = useTheme();
    const captionSize = useMediaQuery(theme.breakpoints.down('sm'));
    
    return (
        <Box sx={{ marginTop: '5%' , marginBottom:'5%', padding: '0 20px' }}>
            <Box textAlign="center">
                <Typography
                component="div"
                sx={ captionSize ? { fontFamily: 'Arial', fontWeight: '500', letterSpacing: '1.2px', fontSize: '32px' }: {
                    fontFamily: 'Arial', fontWeight: '500', letterSpacing: '1.2px', fontSize: '42px'
                }}
                >
                Get Hired in <span style={{ color: '#3556AC', fontWeight: '600' }}>4 Quick Easy Steps</span>
                </Typography>
                <br />
                <br />
            </Box>
            <Grid container rowSpacing={6} spacing={2} sx={{ maxWidth: '100%', margin: '0 auto' }}>
                {Steps.map((step:JobStepsInformationType) => (
                <Grid item xs={12} md={6} lg={3} key={step.id}>
                    <Card
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                        padding: '16px',
                        borderRadius: '8px',
                    }}
                    >
                    <CardHeader
                        avatar={
                        <Avatar
                            sx={{
                            bgcolor: step.backgroundColor,
                            width: 60,
                            height: 60,
                            fontSize: '1.5rem',
                            }}
                            aria-label="recipe"
                        >
                            <FontAwesomeIcon icon={step.iconName} style={{ color: step.iconColor }} />
                        </Avatar>
                        }
                    />
                    <CardContent sx={{ flex: '1 0 auto', paddingTop: '8px' }}>
                        <Typography variant="h6" color="text.primary" fontWeight="bold" gutterBottom>
                        {step.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                        {step.description}
                        </Typography>
                    </CardContent>
                    </Card>
                </Grid>
                ))}
            </Grid>
        </Box>
    );
}