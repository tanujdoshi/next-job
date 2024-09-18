
'use client';
import * as React from 'react';
import "../styles.css";
import Button from '@mui/material/Button';
import { Box, Tab, Tabs, Typography } from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { axiosInstance } from '../../../../api';



import CompaniesDescTabPage from '../../CompaniesDescTabPage/page';
import ActiveJobsTabPage from '../../ActiveJobsTabPage/page';
import ReviewComponent from '@/app/reviews/page';
import JobListings from '@/app/job-information/components/JobListings';

interface EmployerData {
  id: string;
  jobTitle: string;
  phone: string;
  companyName: string;
  industry: string;
  foundedYear: string;
  companySize: string;
  companyType: string;
  description: string;
  websiteURL: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}




export default function CompanyDescriptionPage({ params }: { params: { companyId: string } }) {
  const { companyId } = params;
  const [value, setValue] = useState('1');
  const [employerData, setEmployerData] = useState<EmployerData | null>(null);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    fetchEmployerData();
  }, []);

  const fetchEmployerData = async () => {
    try {
      const response = await axiosInstance.get(`/api/employer/${companyId}`);
      const data = await response.data;
      // console.log("data", response);
      if (data.employers && data.employers.length > 0) {
        setEmployerData(data.employers[0]); // Assuming there's only one employer in the response
      } else {
        setEmployerData(null);
      }
    } catch (error) {
      console.error('Error fetching employer data:', error);
      setEmployerData(null);
    }
  };

  // console.log('companyid ==>', companyId)
  return (
    <div className="mainContainer">
      <div className="parentContainer">

      </div>
      <div className="container">
        <div className="content">
          <div className="coverImage">
            <Typography variant="h1" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontVariant: 'all-small-caps' }}>{employerData?.companyName}</Typography>

          </div>
          {/* <div className="logoDiv">
        <div className="logoContainer">
          <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" 
          className="logoImage"
          alt="Google" />
        </div>
        </div> */}
          <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <TabContext value={value}>
              <Tabs value={value} onChange={handleChange} variant="fullWidth">
                <Tab label="Description" value="1" />
                <Tab label="Reviews" value="2" />
                <Tab label="Active Jobs" value="3" />
              </Tabs>

              <TabPanel value="1" >

                {employerData && (
                  <div className="mainContentContainer">
                    <CompaniesDescTabPage
                      companyId={employerData.id}
                      website={employerData.websiteURL}
                      hq={employerData.city}
                      orgSize={employerData.companySize}
                      type={employerData.companyType}
                      industry={employerData.industry}
                      foundedYear={employerData.foundedYear}
                      description={employerData.description}

                    />
                  </div>
                )}

              </TabPanel>

              <TabPanel value="2">
                <div className="mainContentContainer">
                  {/* Page under construction by Maulik */}
                  <ReviewComponent companyId={companyId} />
                </div>
              </TabPanel>

              <TabPanel value="3">
                <div className="mainContentContainer">
                  {/* <ActiveJobsTabPage employerName={employerData?.companyName}/> */}
                  <JobListings companyName={employerData?.companyName} />
                </div>
              </TabPanel>

            </TabContext>
          </Box>

        </div>
      </div>
    </div>

  );
}


