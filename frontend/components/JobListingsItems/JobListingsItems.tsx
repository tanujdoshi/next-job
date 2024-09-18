"use client";

import { Grid } from "@mui/material";
import JobCard from "../JobCard/JobCard";
import { JobListingsItemsProps } from "@/app/job-listings/types";

const JobListingsItems = ({ jobData }: JobListingsItemsProps) => {
  return (
    <Grid container>
      {jobData?.map((card, index) => {
        return (
          card.jobStatus === "Active" && (
            <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
              <JobCard key={index} {...card} />
            </Grid>
          )
        );
      })}
    </Grid>
  );
};

export default JobListingsItems;
