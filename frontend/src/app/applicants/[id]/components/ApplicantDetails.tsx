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
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import WorkIcon from "@mui/icons-material/Work";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import {
  Alert,
  ListItemIcon,
  Snackbar,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { ApplicantsType } from "../(constants)/ApplicantInformation";
import { axiosInstance } from "../../../../../api";
import { useContext } from "react";
import { UserContext } from "@/app/(context)/UserContext";
export default function JobDetails({
  applicantDataOpen,
  handleClose,
  applicantData,
  userName,
  jobId,
}: {
  applicantDataOpen: boolean;
  handleClose: () => void;
  applicantData: ApplicantsType;
  userName: string;
  jobId: string;
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [responseMessage, setResponseMessage] = useState("");
  const { state } = useContext(UserContext);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleScheduleInterview = async () => {
    setIsLoading(true);
    try {
      const jobResponse = await axiosInstance.get(`/api/getJob/${jobId}`);
      if (
        jobResponse.status !== 200 ||
        !jobResponse.data.jobs ||
        jobResponse.data.jobs.length === 0
      ) {
        throw new Error("Failed to fetch job details.");
      }

      const jobData = jobResponse.data.jobs[0];
      const { jobTitle, jobType, salary, location, jobDescription } = jobData;

      const employerResponse = await axiosInstance.get(
        `/api/employerByUserId/${state.id}`
      );
      if (
        employerResponse.status !== 200 ||
        !employerResponse.data.employers ||
        employerResponse.data.employers.length === 0
      ) {
        throw new Error("Failed to fetch employer details.");
      }
      const employerData = employerResponse.data.employers[0];
      const { phone } = employerData;

      const response = await axiosInstance.post("/api/scheduleInterview", {
        candidateFirstName: userName,
        candidateEmail: applicantData.email,
        positionName: jobTitle,
        jobType: jobType,
        salary: salary,
        companyName: state.companyName,
        location: location.placeName,
        roleDescription: jobDescription,
        employerEmail: state.email,
        employerContact: phone,
      });

      if (response.status === 200) {
        setResponseMessage("Interview has been scheduled successfully!");
        setIsError(false);
      } else {
        throw new Error("Error scheduling the interview.");
      }
    } catch (error: any) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.errors
      ) {
        const errorKeys = Object.keys(error.response.data.errors);
        if (errorKeys.length > 0) {
          setResponseMessage(`${error.response.data.errors[errorKeys[0]]}`);
        } else {
          setResponseMessage(
            "Error scheduling the interview. Please try again."
          );
        }
      } else {
        setResponseMessage("Error scheduling the interview. Please try again.");
      }
      setIsError(true);
    }
    setIsLoading(false);
    setOpenSnackbar(true);
  };

  return (
    <div>
      {applicantData && (
        <Dialog
          fullScreen={fullScreen}
          open={applicantDataOpen}
          onClose={handleClose}
          aria-labelledby="applicant-details"
        >
          <DialogTitle>{`Applicant Details - ${userName}`}</DialogTitle>
          <DialogContent>
            <Card>
              <CardHeader
                title={applicantData.email}
                subheader={applicantData.phone}
              />

              <CardContent>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon sx={{ color: "#2159AA" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={applicantData.email}
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Phone"
                      secondary={applicantData.phone}
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemIcon>
                      <HomeIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Address"
                      secondary={`${applicantData.address1}, ${applicantData.address2}`}
                    />
                  </ListItem>

                  {applicantData.educations &&
                    applicantData.educations.map((edu: any, index: any) => (
                      <div key={index}>
                        <ListItem>
                          <ListItemIcon>
                            <SchoolIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={`Education ${index + 1}`}
                            secondary={`${edu.degree} in ${edu.fieldOfStudy} from ${edu.school} (${edu.startDate} - ${edu.endDate})`}
                          />
                        </ListItem>
                      </div>
                    ))}

                  {applicantData.experiences &&
                    applicantData.experiences.map((exp: any, index: any) => (
                      <div key={index}>
                        <ListItem>
                          <ListItemIcon>
                            <WorkIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={`Experience ${index + 1}`}
                            secondary={`${exp.title} at ${exp.company} (${exp.startDate} - ${exp.endDate}) in ${exp.location}`}
                          />
                        </ListItem>
                      </div>
                    ))}
                </List>
              </CardContent>
            </Card>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            <Button color="primary" onClick={handleScheduleInterview}>
              Schedule Interview
            </Button>
          </DialogActions>
          <Backdrop
            open={isLoading}
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={isError ? "error" : "success"}
              elevation={3}
            >
              {responseMessage}
            </Alert>
          </Snackbar>
        </Dialog>
      )}
    </div>
  );
}
