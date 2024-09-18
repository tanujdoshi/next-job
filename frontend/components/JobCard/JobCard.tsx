"use client";
import React, { useState } from "react";
import "./JobCard.css";
import { Avatar, Button } from "@mui/material";
import JobDetails from "../JobDetails/JobDetails";
import { JobData } from "../../src/app/job-listings/types";

const JobCard = (props: JobData) => {
  const [jobDetailsOpen, setJobDetailsOpen] = useState(false);

  const handleClickOpen = () => {
    setJobDetailsOpen(true);
  };

  const handleClose = () => {
    setJobDetailsOpen(false);
  };

  return (
    <>
      <div className="card">
        <div className="job-content">
          <div className="job-date">
            <text>{props.openDate}</text>
          </div>

          <div className="company-desc">
            <div className="comp-div">
              <text className="company">{props.jobCompany}</text>
              <text className="title">{props.jobTitle}</text>
            </div>

            <div className="company-logo">
              {/* <img src="https://images.pexels.com/photos/2896668/pexels-photo-2896668.jpeg?auto=compress&cs=tinysrgb&w=800" /> */}
              <Avatar
                src={props.jobCompanyLogo}
                sx={{ width: 56, height: 56 }}
              />
            </div>
          </div>

          <div className="job-type">
            <text>{props.jobType}</text>
          </div>
        </div>

        <div className="footer">
          <div className="salary-div">
            <text className="sal">$ {props.salary} / Annum</text>
            <text className="location">
              {props.location.city},{props.location.country}
            </text>
          </div>

          <div>
            <Button
              className="details-bttn"
              style={{
                backgroundColor: "rgba(140, 226, 112, 0.859)",
                color: "#000",
                borderRadius: "24px",
                paddingLeft: "1.3rem",
                paddingRight: "1.3rem",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.16)",
              }}
              onClick={handleClickOpen}
            >
              Details
            </Button>
          </div>
        </div>
      </div>
      <JobDetails
        jobDetailsOpen={jobDetailsOpen}
        handleClose={handleClose}
        jobData={props}
        isClickedByEmployer={false}
      />
    </>
  );
};

export default JobCard;
