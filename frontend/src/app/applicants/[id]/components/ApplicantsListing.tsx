"use client";

import { useState, useEffect, useContext } from "react";
import { axiosInstance } from "../../../../../api";
import { useRouter } from "next/navigation";
import { ApplicantsType } from "../(constants)/ApplicantInformation";
import ApplicantDetails from "./ApplicantDetails";

import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  Table,
  Typography,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import styles from "../(constants)/applicants.module.css";
import { Console } from "console";
import { UserContext } from "@/app/(context)/UserContext";

export default function ApplicantsListing(props: { id: string }) {
  interface userInformation {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    id: string;
  }

  const jobId = props.id;
  const [loading, setLoading] = useState(true);
  var router = useRouter();
  const theme = useTheme();
  const captionSize = useMediaQuery(theme.breakpoints.down("md"));
  const { state } = useContext(UserContext);
  // console.log("state => ", state);

  const [isHydrated, setIsHydrated] = useState(false);
  const [users, setUsers] = useState<userInformation[]>([]);
  const [applicants, setApplicants] = useState([]);
  const [seekersData, setSeekersData] = useState<ApplicantsType[]>([]);
  const [filteredSeekers, setFilteredSeekers] = useState<ApplicantsType[]>([]);
  const [searchRecentExperience, setSearchRecentExperince] = useState("");
  const [searchFieldOfStudy, setSearchFieldOfStudy] = useState("");
  const [searchDegree, setSearchDegree] = useState("");
  const [applicantDetailsOpen, setJobDetailsOpen] = useState(false);
  const [applicantDetails, setJobDetails] = useState<ApplicantsType>();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axiosInstance.get(
          `api/getJobApplicantIdsByJobId/${jobId}`
        );
        setApplicants(response.data.applicants);
        // console.log("applicants => ", response.data.applicants);
        setFilteredSeekers(response.data.applicants);
      } catch (error) {
        console.error("Error fetching applicant data:", error);
      }
    };

    fetchApplicants();
  }, []);

  useEffect(() => {
    const fetchSeekers = async () => {
      let seekers = [];
      for (let i = 0; i < applicants.length; i++) {
        try {
          const response = await axiosInstance.get(
            `api/seeker/${applicants[i]}`
          );
          seekers.push(response.data.seekers[0]);

          setLoading(false);

          const usersData = [];
          for (const seeker of seekers) {
            const response = await axiosInstance.get(
              `api/getUser/${seeker.userId}`
            );
            usersData.push(response.data.user);
          }
          setUsers(usersData);
        } catch (error) {
          console.error("Error fetching seeker data:", error);
        }
      }
      setSeekersData(seekers);
      setFilteredSeekers(seekers);
    };

    if (applicants !== null) {
      if (applicants.length > 0) fetchSeekers();
    }
  }, [applicants]);

  const getUserById = (userId: string) => {
    const user = users.find((user) => user.email === userId);
    const userFullName = user?.firstName + " " + user?.lastName;
    return userFullName;
  };

  // console.log("users => ", users);
  // console.log("seekersData => ", seekersData);
  useEffect(() => {
    let result = [...seekersData];

    if (
      searchRecentExperience ||
      searchRecentExperience.length <= 0 ||
      searchRecentExperience
    ) {
      result = result.filter((seeker) =>
        seeker.experiences[0].title
          .toLowerCase()
          .includes(searchRecentExperience.toLowerCase())
      );
    }

    if (searchFieldOfStudy) {
      result = result.filter((seeker) =>
        seeker.educations[0].fieldOfStudy
          .toLowerCase()
          .includes(searchFieldOfStudy.toLowerCase())
      );
    }

    if (searchDegree) {
      result = result.filter((seeker) =>
        seeker.educations[0].degree
          .toLowerCase()
          .includes(searchDegree.toLowerCase())
      );
    }

    setFilteredSeekers(result);
  }, [searchRecentExperience, searchFieldOfStudy, searchDegree, seekersData]);

  const handleClickOpen = (
    event: any,
    applicant: ApplicantsType,
    userName: string
  ) => {
    setJobDetails(applicant);
    setJobDetailsOpen(true);
    setUserName(userName);
  };

  const handleClose = () => {
    setJobDetailsOpen(false);
  };

  return (
    <>
      {isHydrated && (
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
                    Filter for Applicants
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
                    value={searchRecentExperience}
                    onChange={(e) => setSearchRecentExperince(e.target.value)}
                    placeholder="Search from recent experience"
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
                    value={searchFieldOfStudy}
                    onChange={(e) => setSearchFieldOfStudy(e.target.value)}
                    placeholder="Search By field of study"
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
                    value={searchDegree}
                    onChange={(e) => setSearchDegree(e.target.value)}
                    placeholder="Search By degree"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={8} lg={8.8} xl={8.8}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ height: "80px" }}>
                    <TableRow>
                      <TableCell className={styles.titles}>Name</TableCell>
                      <TableCell className={styles.titles}>
                        Recent Experience
                      </TableCell>
                      <TableCell className={styles.titles}>
                        Field of study
                      </TableCell>
                      <TableCell className={styles.titles}>Degree</TableCell>
                      <TableCell className={styles.titles}>
                        View Details
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!loading &&
                      filteredSeekers.map((seeker) => {
                        return (
                          seeker && (
                            <TableRow
                              key={seeker.id}
                              className={styles.description}
                              sx={{ height: "100px" }}
                            >
                              <TableCell className={styles.description}>
                                {getUserById(seeker.email)}
                              </TableCell>
                              {seeker.experiences &&
                                seeker.experiences[0].title !== "" ? (
                                <TableCell className={styles.description}>
                                  {seeker.experiences[0].title}
                                </TableCell>
                              ) : (
                                <TableCell></TableCell>
                              )}
                              {seeker.educations &&
                                seeker.educations[0].fieldOfStudy !== "" ? (
                                <TableCell className={styles.description}>
                                  {seeker.educations[0].fieldOfStudy}
                                </TableCell>
                              ) : (
                                <TableCell></TableCell>
                              )}
                              {seeker.educations &&
                                seeker.educations[0].fieldOfStudy !== "" ? (
                                <TableCell>
                                  {seeker.educations[0].degree}
                                </TableCell>
                              ) : (
                                <TableCell></TableCell>
                              )}
                              <TableCell>
                                <Button
                                  variant="contained"
                                  className={styles.buttonApplicants}
                                  onClick={(event) =>
                                    handleClickOpen(
                                      event,
                                      seeker,
                                      getUserById(seeker.email)
                                    )
                                  }
                                >
                                  View Details
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        );
                      })}
                    {applicants === null && (
                      <Box sx={{ textAlign: "center", width: "100%" }}>
                        <h3>No Applicants applied for this job.</h3>
                      </Box>
                    )}
                    {applicants && applicants.length == 0 && (
                      <Box sx={{ textAlign: "center", width: "100%" }}>
                        <h3>No Applicants applied for this job.</h3>
                      </Box>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
          {applicantDetails && (
            <ApplicantDetails
              applicantDataOpen={applicantDetailsOpen}
              handleClose={handleClose}
              applicantData={applicantDetails}
              userName={userName}
              jobId={jobId}
            />
          )}
        </Box>
      )}
    </>
  );
}
