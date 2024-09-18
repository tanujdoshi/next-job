"use client";

import JobListingsSearchBar from "../../../components/JobListingsSearchBar/JobListingsSearchBar";
import JobListingsItems from "../../../components/JobListingsItems/JobListingsItems";
import { Grid } from "@mui/material";
import { useState, useEffect } from "react";
import { FilterChangeEvent, JobData } from "./types";
import JobFilter from "../../../components/JobFilter/JobFilter";

import { axiosInstance, isAuthenticatedUser } from "../../../api";

export default function JobListings() {
  const [searchValue, setSearchValue] = useState("");
  const [jobDataArr, setJobDataArr] = useState([]);
  const [displayedJobDataArr, setDisplayedJobDataArr] = useState([]);
  const [checked, setChecked] = useState({
    fullTime: false,
    partTime: false,
    contract: false,
    internship: false,
  });
  const [minFilterAmount, setMinFilterAmount] = useState(0);
  const [maxFilterAmount, setMaxFilterAmount] = useState(0);
  const [minFilterAmountError, setMinFilterAmountError] = useState(false);
  const [maxFilterAmountError, setMaxFilterAmountError] = useState(false);

  useEffect(() => {
    isAuthenticatedUser();
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/getJobs");
        const res = response?.data?.jobs?.filter((value: any) => {
          if (value?.employerEmail) {
            return value;
          }
        });
        setJobDataArr(res);
        setDisplayedJobDataArr(res);
      } catch (error) {
        console.error("An error occurred while fetching job data: ", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    var tempArr = jobDataArr
      .filter((item: JobData) => {
        if (
          checked.fullTime &&
          (item.jobType.toLowerCase().includes("full-time") ||
            item.jobType.toLowerCase().includes("full time"))
        ) {
          return true;
        } else if (
          checked.partTime &&
          (item.jobType.toLowerCase().includes("part-time") ||
            item.jobType.toLowerCase().includes("part time"))
        ) {
          return true;
        } else if (
          checked.contract &&
          item.jobType.toLowerCase().includes("contract")
        ) {
          return true;
        } else if (
          checked.internship &&
          item.jobType.toLowerCase().includes("intern")
        ) {
          return true;
        } else if (
          !checked.fullTime &&
          !checked.partTime &&
          !checked.contract &&
          !checked.internship
        ) {
          return true;
        } else {
          return false;
        }
      })
      .filter((item: JobData) => {
        const salaryAsNumber = parseInt(item.salary);
        if (!minFilterAmountError && !maxFilterAmountError) {
          if (maxFilterAmount != 0 || Object.is(maxFilterAmount, NaN)) {
            return (
              salaryAsNumber >= minFilterAmount &&
              salaryAsNumber <= maxFilterAmount
            );
          } else {
            return salaryAsNumber >= minFilterAmount;
          }
        } else {
          return false;
        }
      });

    if (searchValue !== "") {
      tempArr = tempArr.filter((item: JobData) => {
        return (
          item.jobTitle.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.jobCompany.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.location.placeName
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          item.jobType.toLowerCase().includes(searchValue.toLowerCase())
        );
      });
    }

    setDisplayedJobDataArr(tempArr);
  }, [checked, searchValue, minFilterAmount, maxFilterAmount]);

  function applySearch(val: string) {
    setSearchValue(val);
  }

  const handleCheckChange = (event: FilterChangeEvent) => {
    setChecked({ ...checked, [event.target.name]: event.target.checked });
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={3} sm={3} md={2} lg={2} mt={4}>
            <JobFilter
              checked={checked}
              setChecked={setChecked}
              handleCheckChange={handleCheckChange}
              minFilterAmount={minFilterAmount}
              setMinFilterAmount={setMinFilterAmount}
              maxFilterAmount={maxFilterAmount}
              setMaxFilterAmount={setMaxFilterAmount}
              minFilterAmountError={minFilterAmountError}
              setMinFilterAmountError={setMinFilterAmountError}
              maxFilterAmountError={maxFilterAmountError}
              setMaxFilterAmountError={setMaxFilterAmountError}
            />
          </Grid>
          <Grid item xs={9} sm={9} md={9.5} lg={9.5} mt={1.5}>
            <JobListingsSearchBar
              searchValue={searchValue}
              applySearch={applySearch}
            />
            <JobListingsItems jobData={displayedJobDataArr} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
