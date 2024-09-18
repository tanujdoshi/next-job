"use client";

import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { axiosInstance, isAuthenticatedUser } from "../../../../api";
import { useRouter } from "next/navigation";
import JobDetails from "../../../../components/JobDetails/JobDetails";

import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Table,
  Typography,
  ListItemText,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { JobInformation } from "../(constants)/jobListings";
import styles from "../(constants)/joblisting.module.css";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { UserContext } from "@/app/(context)/UserContext";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

interface Props {
  companyName?: string | undefined
}
const JobListings: React.FC<Props> = (props) => {
  const theme = useTheme();
  const { state } = useContext(UserContext);
  const captionSize = useMediaQuery(theme.breakpoints.down("md"));
  const [jobs, setJobs] = useState<JobInformation[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobInformation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [jobStatus, setJobStatus] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [jobDetailsOpen, setJobDetailsOpen] = useState(false);
  const [jobDetails, setJobDetails] = useState<JobInformation>();
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleleId] = useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  // console.log('state', state)
  var router = useRouter();
  const companyName = state?.loginType === "employer" ? state?.companyName : props?.companyName;
  // console.log('companyName', companyName);

  useEffect(() => {
    setIsMounted(true);
    setIsLoading(true);
    isAuthenticatedUser();
    const fetchJobs = async () => {
      try {
        const res = await axiosInstance.get("api/getJobs");
        // console.log('res ==>', res)
        setJobs(res.data.jobs);
        setFilteredJobs(res.data.jobs);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      }
    };

    fetchJobs();

    setIsLoading
  }, []);

  const handleEdit = (job: JobInformation) => {
    if (isMounted) {
      router.push(`/update-job-posting/${job.id}`);
    }
  };

  useEffect(() => {
    let result = [...jobs];

    if (searchTitle) {
      result = result.filter((job) =>
        job.jobTitle.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }

    if (searchLocation) {
      result = result.filter((job) =>
        job.location.placeName
          .toLowerCase()
          .includes(searchLocation.toLowerCase())
      );
    }

    if (jobStatus) {
      result = result.filter(
        (job) => job.jobStatus.toLowerCase() === jobStatus.toLowerCase()
      );
    }

    setFilteredJobs(result);
  }, [searchTitle, searchLocation, jobStatus, jobs]);

  // console.log('filtered jobs ==>', filteredJobs)
  const handleDelete = async (id: string) => {
    try {
      const response = await axiosInstance.delete(`api/deleteJob/${id}`);
      const updatedJobs = jobs.filter((job) => job.id !== id);
      setJobs(updatedJobs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = async (event: any, id: String) => {
    const status = event.target.value;
    const jobToUpdate = jobs.find((job) => job.id === id);
    const updatedJobs = jobs.map((job) => {
      if (job.id === id) {
        return { ...job, jobStatus: status };
      }
      return job;
    });
    if (jobToUpdate) {
      const updatedJob = { ...jobToUpdate, jobStatus: status };
      // console.log('updated job ==>', updatedJob)
      try {
        const response = await axiosInstance.put(`api/updateJob`, {
          id: updatedJob.id,
          jobTitle: updatedJob.jobTitle,
          jobDescription: updatedJob.jobDescription,
          skills: updatedJob.skills,
          jobStatus: updatedJob.jobStatus,
          noOfPositions: updatedJob.noOfPositions,
          jobType: updatedJob.jobType,
          location: {
            lng: updatedJob.location.coordinates[0],
            lat: updatedJob.location.coordinates[1],
            placeId: updatedJob.location.placeId,
            placeName: updatedJob.location.placeName,
            city: updatedJob.location.city,
            state: updatedJob.location.state,
            country: updatedJob.location.country,
          },
          salary: updatedJob.salary,
          experience: updatedJob.experience,
          openDate: updatedJob.openDate,
          employerId: updatedJob.employerId,
          jobCompany: updatedJob.jobCompany,
          jobCompanyLogo: updatedJob.jobCompanyLogo
        });
        setJobs(updatedJobs);
      } catch (error) {
        console.error("API request failed", error);
      }
    } else {
      console.error(`No job found with id ${id}`);
    }
  };

  const handleClickOpen = (event: any, job: JobInformation) => {
    setJobDetailsOpen(true);
    setJobDetails(job);
  };

  const handleClose = () => {
    setJobDetailsOpen(false);
  };

  const handleDialogOpen = (id: string) => {
    setDeleleId(id);
    setOpen(true);
  };

  const handleDialogClose = (response: string) => {
    if (response == "yes") {
      handleDelete(deleteId);
    } else {
    }
    setOpen(false);
    location.reload();
  };

  const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  return (
    <>
      <Box>
        <Grid container sx={{ margin: "0px" }}>
          <Grid item xs={12} sm={12} md={3} lg={3}>
            <Card
              sx={
                captionSize
                  ? {
                    margin: "0% 5% 5% 5%",
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                    alignContent: "center",
                    alignItems: "center",
                    border: "1px solid #D4D2D0",
                    boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)",
                    borderRadius: "5px",
                  }
                  : {
                    margin: "0% 5%",
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                    alignContent: "center",
                    alignItems: "center",
                    border: "1px solid #D4D2D0",
                    boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)",
                    borderRadius: "5px",
                  }
              }
            >
              <CardContent>
                <Typography
                  component="div"
                  gutterBottom
                  className={styles.cardTitle}
                >
                  Filter for Jobs
                </Typography>
                <hr className={styles.hr} />
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  sx={{
                    fontWeight: "bold",
                    borderRadius: "10px",
                    width: "100%",
                    bgcolor: "#FFFFFF",
                    margin: "5% 0%",
                  }}
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  placeholder="Search for Job Title"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  sx={{
                    fontWeight: "bold",
                    borderRadius: "10px",
                    width: "100%",
                    bgcolor: "#FFFFFF",
                    margin: "5% 0%",
                  }}
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Search By Location"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControl
                  fullWidth
                  sx={{
                    margin: "5% 0%",
                  }}
                >
                  <InputLabel id="demo-simple-select-label">
                    Sort By: Job status
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    sx={{
                      fontWeight: "bold",
                      borderRadius: "5px",
                      width: "100%",
                      bgcolor: "#FFFFFF",
                    }}
                    id="demo-simple-select"
                    label="Sort By: Job status"
                    value={jobStatus}
                    onChange={(e) => setJobStatus(e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value={"Active"}>Active</MenuItem>
                    <MenuItem value={"Paused"}>Paused</MenuItem>
                    <MenuItem value={"Closed"}>Closed</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={8} lg={8.8} xl={8.8}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ height: "80px" }}>
                  <TableRow>
                    <TableCell className={styles.titles}>Job Title</TableCell>
                    <TableCell className={styles.titles}>Location</TableCell>
                    <TableCell className={styles.titles}>Openings</TableCell>
                    {state?.loginType === "employer" ? <TableCell className={styles.titles}>Job Status</TableCell> : null}
                    {state?.loginType === "employer" ? <TableCell className={styles.titles}>Candidates</TableCell> : null}
                    {state?.loginType === "employer" ? <TableCell className={styles.titles}>Actions</TableCell> : null}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!loading &&
                    filteredJobs.map((job) => {
                      return job.jobCompany === companyName ? (
                        <TableRow
                          key={job.id}
                          className={styles.description}
                          sx={{ height: "100px" }}
                        >
                          <TableCell
                            className={styles.titleDescription}
                            onClick={(event) => handleClickOpen(event, job)}
                          >
                            {job.jobTitle}
                          </TableCell>
                          <TableCell className={styles.description}>
                            {job.location.placeName}
                          </TableCell>
                          <TableCell
                            className={styles.description}
                            sx={{ width: "30px", textAlign: "center" }}
                          >
                            {job.noOfPositions}
                          </TableCell>
                          {state?.loginType === "employer" ? <TableCell
                            className={styles.description}
                            sx={{ width: "70px" }}
                          >
                            <Select
                              defaultValue=""
                              value={job.jobStatus}
                              onChange={(e) => handleChange(e, job.id)}
                              displayEmpty
                              sx={{
                                width: "115px",
                                height: "40px",
                              }}
                            >
                              <MenuItem value="Active">
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <FiberManualRecordIcon
                                    style={{ color: "green" }}
                                    sx={{
                                      fontSize: "15px",
                                      paddingRight: "5px",
                                    }}
                                  />
                                  <ListItemText primary="Active" />
                                </div>
                              </MenuItem>
                              <MenuItem value="Closed">
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <FiberManualRecordIcon
                                    style={{ color: "red" }}
                                    sx={{
                                      fontSize: "15px",
                                      paddingRight: "5px",
                                    }}
                                  />
                                  <ListItemText primary="Closed" />
                                </div>
                              </MenuItem>
                              <MenuItem value={"Paused"}>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <FiberManualRecordIcon
                                    style={{ color: "yellow" }}
                                    sx={{
                                      fontSize: "15px",
                                      paddingRight: "5px",
                                    }}
                                  />
                                  <ListItemText primary="Paused" />
                                </div>
                              </MenuItem>
                            </Select>
                          </TableCell> : null}
                          {state?.loginType === "employer" ? <TableCell>
                            <Button
                              variant="contained"
                              className={styles.buttonApplicants}
                              onClick={() =>
                                router.push(`/applicants/${job.id}`)
                              }
                            >
                              Applicants
                            </Button>
                          </TableCell> : null}
                          {state?.loginType === "employer" ? <TableCell>
                            <Grid container direction="row">
                              <Grid
                                item
                                xs={4}
                                lg={3}
                                sx={{ marginRight: "10px" }}
                              >
                                <Button>
                                  <EditIcon
                                    sx={{ color: "#008001" }}
                                    onClick={() => handleEdit(job)}
                                  />
                                </Button>
                              </Grid>
                              <Grid item xs={6} lg={3}>
                                <Button>
                                  <DeleteIcon
                                    sx={{ color: "red" }}
                                    onClick={() => {
                                      handleDialogOpen(job.id);
                                    }}
                                  />
                                </Button>
                              </Grid>
                            </Grid>
                          </TableCell> : null}
                        </TableRow>
                      ) : (
                        <></>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            {jobs === null && (
              <Box sx={{ textAlign: "center", width: "100%" }}>
                <h3>No Applicants applied for this job.</h3>
              </Box>
            )}
            {jobs && jobs.length == 0 && (
              <Box sx={{ textAlign: "center", width: "100%" }}>
                <h3>No Applicants applied for this job.</h3>
              </Box>
            )}
          </Grid>
        </Grid>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <br />

          <DialogTitle>
            {"Are you sure you want to delete the listing? "}
          </DialogTitle>
          <DialogActions>
            <br />
            <br />
            <Button
              onClick={() => {
                handleDialogClose("no");
              }}
            >
              No
            </Button>
            <Button
              onClick={() => {
                handleDialogClose("yes");
              }}
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
        {jobDetails && (
          <JobDetails
            jobDetailsOpen={jobDetailsOpen}
            handleClose={handleClose}
            jobData={jobDetails}
            isClickedByEmployer={state?.loginType === "employer" ? true : false}
          />
        )}
      </Box>
    </>
  );
}

export default JobListings;