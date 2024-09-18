"use client";

import {
  Container,
  Grid,
  Paper,
  Typography,
  CardContent,
  Card,
  CardHeader,
  Avatar,
  TextField,
  useTheme,
  useMediaQuery,
  Button,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";
import Image from "next/image";
import contactPic from "/public/3.png";
import SendSharpIcon from "@mui/icons-material/SendSharp";
import { useState } from "react";
import { axiosInstance } from "../../../api";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from "@mui/material/CircularProgress";

export default function Contact() {
  const theme = useTheme();
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<any>();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const onSubmit = (e: any) => {
    e.preventDefault()

    const nameRegex = /^[a-zA-Z ]{1,}$/;
    const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/;
    const mobileRegex = /^[0-9]{10}$/;
    const subjectRegex = /^[a-zA-Z0-9]{1,}$/;
    const messageRegex = /^[a-zA-Z ]{1,}$/;

    if (!name.trim()) {
      setError({ ...error ? error : {}, ...{ name: "Name is required" } });
      return
    } else if (!email.trim()) {
      setError({ ...error ? error : {}, ...{ email: "Email is required" } });
      return
    } else if (!mobile.trim()) {
      setError({ ...error ? error : {}, ...{ mobile: "Mobile is required" } });
      return
    } else if (!subject.trim()) {
      setError({ ...error ? error : {}, ...{ subject: "Subject is required" } });
      return
    } else if (!message.trim()) {
      setError({ ...error ? error : {}, ...{ message: "Message is required" } });
      return
    } else
      if (!nameRegex.test(name.trim())) {
        setError({ ...error ? error : {}, ...{ name: "Name must contain only alphabets!!!" } });
        return
      } else if (!emailRegex.test(email.trim())) {
        setError({ ...error ? error : {}, ...{ email: "Invalid Email Address!!!" } });
        return
      } else if (!mobileRegex.test(mobile.trim())) {
        setError({ ...error ? error : {}, ...{ mobile: "Mobile Number must be 10 digits and only digits!!!" } });
        return
      } else if (!subjectRegex.test(subject.trim())) {
        setError({ ...error ? error : {}, ...{ subject: "Invalid Subject!!!" } });
        return
      } else if (!messageRegex.test(message.trim())) {
        setError({ ...error ? error : {}, ...{ message: "Message is required" } });
        return
      } else {
        setError({});
      }
    setIsLoading(true);

    const data = {
      name: name.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      subject: subject.trim(),
      message: message.trim(),
    }

    axiosInstance.post("pub/contactUs", data).then(res => {
      setResponseMessage("Email Sent Successfully");
      setOpenSnackbar(true);
      setIsLoading(false);
      setName("");
      setEmail("");
      setMobile("");
      setSubject("");
      setMessage("");
    })
      .catch(err => {
        // console.log(err);
        setIsLoading(false);
      })
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };


  return (
    <Paper
      style={{
        padding: matchesSm ? "2em 1em" : "4em 2em",
        backgroundColor: "#ffffff",
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={matchesSm ? 2 : 4}
          direction="column"
          alignItems="center"
        >
          <Grid item xs={12}>
            <Typography
              variant={matchesSm ? "h4" : "h2"}
              align="center"
              color="#003060"
              sx={{ mb: 5 }}
            >
              Contact Us
            </Typography>
          </Grid>
          <Grid item xs={12} width={1}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Card elevation={3} style={{ borderRadius: "10px" }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: "#F94E09" }} sizes="large">
                        <MailOutlineIcon />
                      </Avatar>
                    }
                    title="Drop a line"
                    titleTypographyProps={{ fontSize: "0.98em" }}
                    subheader="Mail Us"
                    subheaderTypographyProps={{ fontSize: "0.75em" }}
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      next.job@yopmail.com
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      next.job@yopmail.com
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card elevation={3} style={{ borderRadius: "10px" }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: "#56ae57" }}>
                        <CallOutlinedIcon />
                      </Avatar>
                    }
                    title="24/7 Service"
                    subheader="Call Us"
                    titleTypographyProps={{ fontSize: "0.98em" }}
                    subheaderTypographyProps={{ fontSize: "0.75em" }}
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      +1 (123)456-7890
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      +1 (123)456-7890
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card elevation={3} style={{ borderRadius: "10px" }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: "#FCBB06" }}>
                        <MyLocationOutlinedIcon />
                      </Avatar>
                    }
                    title="Location"
                    subheader="Visit Us"
                    titleTypographyProps={{ fontSize: "0.98em" }}
                    subheaderTypographyProps={{ fontSize: "0.75em" }}
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      1135 1st Ave, New York,
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      NY 10065, USA
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid container xs={12} direction={"row"}>
            <Grid item xs={12} margin={5}>
              <Typography
                variant="h5"
                align="center"
                color="#003060"
                fontFamily="arial"
              >
                Send Your Message
              </Typography>
            </Grid>
            <Grid
              container
              spacing={2}
              direction={matchesMd ? "column-reverse" : "row"}
            >
              <Grid item xs={12} sm={8}>
                <Grid container spacing={2} direction="column">
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="outlined-basic"
                          label="Name"
                          variant="outlined"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          onBlur={() => {
                            if (!name) {
                              setError({ ...error ? error : {}, ...{ name: "Name is required" } });
                            } else {
                              setError({ ...error ? error : {}, ...{ name: "" } });
                            }
                          }}
                          error={error?.name ? true : false}
                          helperText={error?.name}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="outlined-basic"
                          label="Email"
                          variant="outlined"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onBlur={() => {
                            if (!email) {
                              setError({ ...error ? error : {}, ...{ email: "Email is required" } });
                            } else {
                              setError({ ...error ? error : {}, ...{ email: "" } });
                            }
                          }}
                          error={error?.email ? true : false}
                          helperText={error?.email}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={2} direction="row">
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="outlined-basic"
                          label="Mobile"
                          variant="outlined"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          onBlur={() => {
                            if (!mobile) {
                              setError({ ...error ? error : {}, ...{ mobile: "Mobile is required" } });
                            } else {
                              setError({ ...error ? error : {}, ...{ mobile: "" } });
                            }
                          }}
                          error={error?.mobile ? true : false}
                          helperText={error?.mobile}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="outlined-basic"
                          label="Subject"
                          variant="outlined"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          onBlur={() => {
                            if (!subject) {
                              setError({ ...error ? error : {}, ...{ subject: "Subject is required" } });
                            } else {
                              setError({ ...error ? error : {}, ...{ subject: "" } });
                            }
                          }}
                          error={error?.subject ? true : false}
                          helperText={error?.subject}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="outlined-multiline-static"
                      label="Send Message"
                      multiline
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onBlur={() => {
                        if (!message) {
                          setError({ ...error ? error : {}, ...{ message: "Message is required" } });
                        } else {
                          setError({ ...error ? error : {}, ...{ message: "" } });
                        }
                      }}
                      error={error?.message ? true : false}
                      helperText={error?.message}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      endIcon={
                        <SendSharpIcon sx={{ mr: 1, color: "#ffffff" }} />
                      }
                      sx={{
                        backgroundColor: "#2557A7",
                        borderRadius: "100px",
                      }}
                      variant="contained"
                      onClick={onSubmit}
                    >
                      <Typography color="#ffffff">Send</Typography>
                    </Button>

                    <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                      <CircularProgress color="inherit" />
                    </Backdrop>
                    <Snackbar
                      open={openSnackbar}
                      autoHideDuration={6000}
                      onClose={handleCloseSnackbar}
                    >
                      <Alert onClose={handleCloseSnackbar} severity="success" elevation={3}>
                        {responseMessage}
                      </Alert>
                    </Snackbar>
                  </Grid>
                </Grid>
              </Grid>
              {!matchesMd && (
                <Grid item xs={12} sm={4}>
                  <Image
                    alt="ConactImage"
                    src={contactPic}
                    layout="responsive"
                    style={
                      matchesMd
                        ? { display: "none" }
                        : { height: "100%", width: "100%" }
                    }
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
}
