'use client';
import { Button, Card, CardActions, CardContent, CardMedia, Container, Grid, Typography } from '@mui/material';
import * as React from 'react';
import JobCard from '../JobCard/JobCard';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../../api';


interface JobData {
  id: string;
  jobTitle: string;
  jobDescription: string;
  skills: string[];
  jobStatus: string;
  noOfPositions: string;
  jobType: string;
  location: {
    type: string;
    coordinates: number[];
    placeId: string;
    placeName: string;
    city: string;
    state: string;
    country: string;
  };
  salary: string;
  experience: string;
  openDate: string;
  employerId: string;
  jobCompany: string;
  jobCompanyLogo: string;
}


const ActiveJobsTabPage = (props: any) => {
  const { employerName } = props;
  const [jobData, setJobData] = useState<JobData[]>([]);

  useEffect(() => {
    fetchJobData();
  }, []);

  const fetchJobData = async () => {
    try {
      const response = await axiosInstance.get(`/api/getJobsByCompany/${employerName}`);
      const data = await response.data.response.json();
      setJobData(data.jobs);
    } catch (error) {
      console.error('Error fetching job data:', error);
      setJobData([]);
    }
  };
  //generate more job data with different values for each field

  return (
    <>
      {jobData.map((job) => (
        <JobCard
          key={job.id}
          jobDate={job.openDate}
          jobTitle={job.jobTitle}
          jobCompany={job.jobCompany}
          jobType={job.jobType}
          salary={job.salary}
          jobLocation={job.location.placeName}
          companyLogo={job.jobCompanyLogo}
        />
      ))}
    </>
  );
}

export default ActiveJobsTabPage;