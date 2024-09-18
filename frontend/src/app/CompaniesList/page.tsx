
'use client';
import * as React from 'react';
import "./companies-list.css";
import { Box, Grid, Typography, useTheme, useMediaQuery, Container, Toolbar, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, CssBaseline, AppBar, IconButton, Drawer, FormGroup, FormControlLabel, Checkbox, FormLabel } from '@mui/material';
import Button from '@mui/material/Button';
import CompanyCard from '../CompanyCard/CompanyCard';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { axiosInstance } from '../../../api';

const drawerWidth = 240;

interface CompanyData {
  id: string;
  jobTitle: string;
  phone: string;
  companyName: string;
  industry: string;
  foundedYear: string;
  companySize: string;
  companyType: string;
  description: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  companyLogo: string;
}





export default function CompaniesList(props: any) {
  const { window } = props;


  const [mobileOpen, setMobileOpen] = React.useState(false);
  const container = window !== undefined ? () => window().document.body : undefined;

  const [companyData, setCompanyData] = useState<CompanyData[]>([]);
  const [filteredCompanyData, setFilteredCompanyData] = useState<CompanyData[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);


  const fetchCompanyData = async () => {
    try {
      const response = await axiosInstance.get('api/getEmployers');
      const data = await response.data;
      // console.log('Company data:', response)
      setCompanyData(data.employers);
      setFilteredCompanyData(data.employers); // Initialize filtered data with all companies
    } catch (error) {
      console.error('Error fetching company data:', error);
      setCompanyData([]);
      setFilteredCompanyData([]);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Handle checkbox change
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filterValue = event.target.value;
    // console.log('filterValue:', filterValue);
    const updatedFilters = selectedFilters.includes(filterValue)
      ? selectedFilters.filter((filter) => filter !== filterValue)
      : [...selectedFilters, filterValue];

    setSelectedFilters(updatedFilters);
  };

  // Apply filters and update filteredCompanyData
  useEffect(() => {
    if (selectedFilters.length > 0) {
      const filteredData = companyData.filter((company) => {
        const filterArray = [company.industry, company.companySize];
        return selectedFilters.every((val) => filterArray.includes(val));
      });
      setFilteredCompanyData(filteredData);
    } else {
      setFilteredCompanyData(companyData);
    }
  }, [selectedFilters, companyData]);


  const theme = useTheme();
  const captionSize = useMediaQuery(theme.breakpoints.down('sm'));

  //companydata to be fetched here


  const drawer = (
    <div>
      <div className="indentation" style={{ borderRight: 'none' }}>
        <Typography variant="h6" component="h6" sx={{ textAlign: "center" }}>
          Filter By Size
        </Typography>
        <FormGroup className='flexclass'>
          {Array.from(new Set(companyData.map((company) => company.companySize))).map((companySize) => (
            <FormControlLabel
              // className='flexclass'
              key={companySize}
              control={
                <Checkbox
                  checked={selectedFilters.includes(companySize)}
                  onChange={handleCheckboxChange}
                  value={companySize}
                />
              }
              label={companySize}
            />
          ))}
        </FormGroup>
      </div>
      <div className="indentation">
        <Typography variant="h6" component="h6" sx={{ textAlign: "center" }}>
          Filter By Industry
        </Typography>
        <FormGroup className='flexclass'>
          {Array.from(new Set(companyData.map((company) => company.industry))).map((industry) => (
            <FormControlLabel
              // className='flexclass'
              key={industry}
              control={
                <Checkbox
                  checked={selectedFilters.includes(industry)}
                  onChange={handleCheckboxChange}
                  value={industry}
                />
              }
              label={industry}
            />
          ))}
        </FormGroup>
      </div>
    </div>
  );

  // State variable to hold the selected companyId
  const [selectedCompanyId, setSelectedCompanyId] = useState('');

  const router = useRouter();

  const handleViewButtonClick = (companyId: string) => {
    setSelectedCompanyId(companyId);
    router.push(`/companies/${companyId}`);
  };



  return (

    <Box sx={{ display: 'flex' }}>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { width: drawerWidth, top: '110px', borderRight: 'none' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        {/* <Toolbar /> */}
        <Box sx={{
          backgroundColor: '#F0F4FC',
        }}>
          <Box
            sx={{
              textAlign: 'left',
              padding: '3% 0%',
              width: '100%',
            }}
          >
            <Typography component="div" gutterBottom
              sx={captionSize ? { fontFamily: 'Arial', fontWeight: '500', letterSpacing: '1.2px', fontSize: '28px', color: '#003060', textAlign: 'center' } : {
                fontFamily: 'Arial', fontWeight: '500', letterSpacing: '1.5px', fontSize: '34px', color: '#003060', textAlign: 'center'
              }}
            >
              Companies
            </Typography>
          </Box>

        </Box>
        <Box sx={{
          display: 'flex', mr: 2
          // , justifyContent:'center'
        }}>
          <div>


            <Button
              variant="outlined"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}>Apply Filter</Button>
          </div>

        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>


          {filteredCompanyData.map((company) => (
            <CompanyCard
              companyId={company.id}
              key={company.id}
              companyDate={company.foundedYear}
              companyTitle={company.companyName}
              companyCompany={company.companyName}
              companyType={company.companyType}
              salary={company.description}
              companyLocation={company.city}
              companyLogo={company.companyLogo}
              onViewButtonClick={() => { handleViewButtonClick(company.id); }}
            />
          ))}
        </Box>

      </Box>
    </Box>




  );

}