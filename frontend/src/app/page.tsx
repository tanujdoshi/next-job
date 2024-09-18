
"use client";
import { Grid } from "@mui/material";
import Cover from "./home/Cover";
import JobSteps from "./home/JobSteps";
import RecrutingOption from "./home/RecrutingOption";
import 'antd/dist/antd.css';

export default function MyApp() {
  return (
    <Grid container rowSpacing={3}>
      <Grid item marginLeft={{ xs: 0, md: 4, lg: 10, xl: 16 }}>
        <Cover />
      </Grid>
      <Grid item>
        <JobSteps />
      </Grid>
      <Grid item>
        <RecrutingOption />
      </Grid>
    </Grid>
  );
}

