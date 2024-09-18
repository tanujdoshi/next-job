import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import { format } from "date-fns";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import WorkIcon from "@mui/icons-material/Work";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Groups2Icon from "@mui/icons-material/Groups2";
import { axiosInstance } from "../../api";
import {
  Alert,
  Backdrop,
  Chip,
  CircularProgress,
  Grid,
  ListItemIcon,
  ListSubheader,
  Snackbar,
  Stack,
} from "@mui/material";
import { useContext } from "react";
import { UserContext } from "@/app/(context)/UserContext";
export default function JobDetails({
  jobDetailsOpen,
  handleClose,
  jobData,
  isClickedByEmployer,
}: any) {
  const theme = useTheme();
  const { state } = useContext(UserContext);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const date = new Date(jobData?.openDate || new Date());
  date.setDate(date.getDate() + 1);
  const formattedDate = format(date, "MMMM d, yyyy");
  const [responseMessage, setResponseMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleApply = async () => {
    setIsLoading(true);
    var seekerData;
    try {
      const res = await axiosInstance.get(`/api/seeker/${state.id}`);
      seekerData = res.data.seekers[0];
    } catch (error) {
      console.error("Failed to get seeker data:", error);
    }
    const userID = state.id;
    const jobID = jobData?.id;
    const candidateFullName = state.firstName + " " + state.lastName;
    const candidateEmail = state.email;
    const contact = seekerData.phone;
    const employerName = jobData?.jobCompany;
    const jobTitle = jobData?.jobTitle;
    const jobType = jobData?.jobType;
    const applicationDate = formattedDate;
    const employerEmail = jobData?.employerEmail;

    try {
      const response = await axiosInstance.post("/api/apply", {
        userID,
        jobID,
        candidateFullName,
        candidateEmail,
        contact,
        employerName,
        jobTitle,
        jobType,
        applicationDate,
        employerEmail,
      });
      const data = await response.data;
      setIsLoading(false);
      setResponseMessage(data.message);
      setIsError(false);
      setOpenSnackbar(true);
    } catch (error: any) {
      console.error(error);
      setIsLoading(false);

      if (error.response) {
        if (error.response.status === 400 && error.response.data.errors) {
          const errorKeys = Object.keys(error.response.data.errors);
          if (errorKeys.length > 0) {
            setResponseMessage(error.response.data.errors[errorKeys[0]]);
          } else {
            setResponseMessage("An error occurred while applying for the job");
          }
          setIsError(true);
        } else if (error.response.status === 409) {
          setResponseMessage(error.response.data.message);
          setIsError(false);
        } else {
          setResponseMessage("An error occurred while applying for the job");
          setIsError(true);
        }
      } else {
        setResponseMessage("An error occurred while applying for the job");
        setIsError(true);
      }

      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={jobDetailsOpen}
        onClose={handleClose}
        aria-labelledby="job-details"
      >
        <DialogTitle id="job-details">{`${jobData?.jobTitle} - Job Details`}</DialogTitle>
        <DialogContent>
          <Card>
            <CardHeader
              avatar={
                <Avatar
                  sx={{ height: 60, width: 60 }}
                  aria-label="recipe"
                  alt="companyLogo"
                  src={jobData?.jobCompanyLogo}
                />
              }
              title={jobData?.jobCompany}
              titleTypographyProps={{ variant: "subtitle1" }}
              subheader={formattedDate}
              subheaderTypographyProps={{ variant: "subtitle2" }}
            />
            <CardContent>
              <List
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    Job Description
                  </ListSubheader>
                }
              >
                <ListItem>
                  <ListItemIcon>
                    <WorkIcon />
                  </ListItemIcon>
                  <ListItemText primary="Experience Required:" />
                  <ListItemText secondary={`${jobData?.experience} years`} />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <WorkspacesIcon />
                  </ListItemIcon>
                  <ListItemText primary="Employment Type:" />
                  <ListItemText secondary={jobData?.jobType} />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <AttachMoneyIcon />
                  </ListItemIcon>
                  <ListItemText primary="Salary Package:" />
                  <ListItemText secondary={`\$ ${jobData?.salary} per annum`} />
                </ListItem>
                <Divider />
                <ListItem>
                  <Grid container>
                    <Grid item xs={12} sx={{ display: "inline-flex" }}>
                      <ListItemIcon>
                        <MilitaryTechIcon />
                      </ListItemIcon>
                      <ListItemText primary="Desired Skills:" />
                    </Grid>
                    <Grid item xs={12}>
                      <Stack direction="row" columnGap={1} spacing={1}>
                        <Grid
                          container
                          sx={{ flexWrap: "wrap", justifyContent: "center" }}
                          spacing={1}
                        >
                          {jobData?.skills.map(
                            (skill: string, index: number) => {
                              return (
                                <Grid item key={index}>
                                  {" "}
                                  <Chip label={skill} />
                                </Grid>
                              );
                            }
                          )}
                        </Grid>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <Divider />
                <ListItem>
                  <Grid container>
                    <Grid item xs={12} sx={{ display: "inline-flex" }}>
                      <ListItemIcon>
                        <FactCheckIcon />
                      </ListItemIcon>
                      <ListItemText primary="Job Role & Responsibilities:" />
                    </Grid>
                    <Grid item xs={12}>
                      <ListItemText secondary={`${jobData?.jobDescription}`} />
                    </Grid>
                  </Grid>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <Groups2Icon />
                  </ListItemIcon>
                  <ListItemText primary="Vacancies Available:" />
                  <ListItemText
                    secondary={`${jobData?.noOfPositions} openings`}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <LocationOnIcon />
                  </ListItemIcon>
                  <ListItemText primary="Work Location:" />
                  <ListItemText secondary={`${jobData?.location.placeName}`} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          {isClickedByEmployer ? null : (
            <Button variant="outlined" onClick={handleApply}>
              Apply
            </Button>
          )}
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={isError ? "error" : "success"}
        >
          {responseMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
