
"use client";
import * as React from "react";
import "./styles.css";
import Button from "@mui/material/Button";
import { Box, Container, Tab, Tabs } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import CompaniesDescTabPage from "../CompaniesDescTabPage/page";
import ActiveJobsTabPage from "../ActiveJobsTabPage/page";

interface CompanyData {
  companyId: string;
  website: string;
  hq: string;
  orgSize: string;
  type: string;
  industry: string;
  revenue: string;
}

interface CompaniesPageProps {
  companyId: string;
  companyData: CompanyData;
}

export default function companiesPage() {
  const [value, setValue] = useState("1");
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const router = useRouter();
  const { companyId } = { companyId: "1" };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    // Fetch company data when the companyId changes
    if (companyId) {
      fetchCompanyData();
    }
  }, [companyId]);

  const fetchCompanyData = async () => {
    try {
      // Replace 'API_ENDPOINT' with the actual endpoint of your API
      const response = await fetch(
        `http://localhost:8080/employer/64bc0f0a85645b8733a7e95c`
      );
      const data = await response.json();
      setCompanyData(data);
    } catch (error) {
      console.error("Error fetching company data:", error);
      setCompanyData(null);
    }
  };

  return (
    <div className="mainContainer">
      <div className="parentContainer"></div>
      <div className="container">
        <div className="content">
          <div className="coverImage"></div>
          <div className="logoDiv">
            <div className="logoContainer">
              <img
                src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
                className="logoImage"
                alt="Google"
              />
            </div>
          </div>
          <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
            <TabContext value={value}>
              <Tabs value={value} onChange={handleChange} variant="fullWidth">
                <Tab label="Description" value="1" />
                <Tab label="Reviews" value="2" />
                <Tab label="Active Jobs" value="3" />
              </Tabs>

              <TabPanel value="1">
                {companyData && (
                  <CompaniesDescTabPage
                    companyId={companyData.companyId}
                    website={companyData.website}
                    hq={companyData.hq}
                    orgSize={companyData.orgSize}
                    type={companyData.type}
                    industry={companyData.industry}
                    revenue={companyData.revenue}
                  />
                )}
              </TabPanel>

              <TabPanel value="2">
                <div className="mainContentContainer">
                  Page under construction by Jeet
                </div>
              </TabPanel>

              <TabPanel value="3">
                <div className="mainContentContainer">
                  <ActiveJobsTabPage />
                </div>
              </TabPanel>
            </TabContext>
          </Box>
        </div>
      </div>
    </div>
  );
}
