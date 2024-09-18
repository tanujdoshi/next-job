"use client";

import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Alert,
  Box,
  Button,
  Link,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Backdrop,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import AuthLayout from "../layout";
import React, { ReactElement, useContext } from "react";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import { axiosInstance } from "../../../../api";
import { UserContext } from "@/app/(context)/UserContext";
import { setUserData } from "@/app/(context)/LocatStorageManager";

interface LoginResponseType {
  token: string;
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  isSeeker: boolean;
  isEmployer: boolean;
  companyId?: string;
  companyName?: string;
  loginType?: "seeker" | "employer";
}

const LOGIN_ERROR_MESSAGE = "Invalid email or password";

function Page(): ReactElement {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [loginType, setLoginType] = React.useState("seeker");
  const userContext = useContext(UserContext);
  const [isLoginError, setIsLoginError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [responseMessage, setResponseMessage] = React.useState("");
  const { dispatch } = userContext;

  const handleLoginAndRedirect = (value: {
    loginType: string;
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    setIsLoginError(false);
    axiosInstance
      .post("/pub/login", { ...value, submit: undefined })
      .then((res) => {
        setResponseMessage("Login Successfully!");
        setOpenSnackbar(true);
        setIsLoading(false);
        const data: LoginResponseType = res.data.response;
        setUserData(data);
        dispatch(data);
        if (value.loginType === "seeker" && !data.isSeeker) {
          router.push("/onboard/seeker");
        } else if (value.loginType === "employer" && !data.isEmployer) {
          router.push("/onboard/employer");
        } else {
          router.push("/dashboard");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setIsLoginError(true);
      });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);
  const formik = useFormik({
    initialValues: {
      loginType: "seeker",
      email: "",
      password: "",
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Email is required"),
      password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        handleLoginAndRedirect(values);
      } catch (err: any) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  const handleLoginTypeStateHandler = (
    event: React.MouseEvent<HTMLElement>,
    newLoginType: string | null
  ) => {
    if (newLoginType !== null) {
      setLoginType(newLoginType);
      formik.setFieldValue("loginType", newLoginType);
    }
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Box
        sx={{
          backgroundColor: "background.paper",
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: "100px",
            width: "100%",
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Login</Typography>
            </Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
              {isHydrated && (
                <Stack spacing={3}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <ToggleButtonGroup
                      value={formik.values.loginType}
                      exclusive
                      onChange={handleLoginTypeStateHandler}
                      aria-label="login type"
                      size="large"
                    >
                      <ToggleButton
                        value="seeker"
                        aria-label="seeker"
                        sx={{ margin: "5px", marginRight: "10px" }}
                      >
                        <PersonIcon />
                        <Typography color="text.secondary" variant="body1">
                          Seeker
                        </Typography>
                      </ToggleButton>
                      <ToggleButton
                        value="employer"
                        aria-label="employer"
                        sx={{
                          margin: "5px",
                          marginLeft: "10px",
                          borderLeft:
                            "1px solid rgba(0, 0, 0, 0.12) !important",
                        }}
                      >
                        <BusinessIcon />
                        <Typography color="text.secondary" variant="body1">
                          Employer
                        </Typography>
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Box>
                  <TextField
                    error={!!(formik.touched.email && formik.errors.email)}
                    fullWidth
                    helperText={formik.touched.email && formik.errors.email}
                    label="Email Address"
                    name="email"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="email"
                    value={formik.values.email}
                  />
                  <TextField
                    error={
                      !!(formik.touched.password && formik.errors.password)
                    }
                    fullWidth
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                    label="Password"
                    name="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="password"
                    value={formik.values.password}
                  />

                  {isLoginError && (
                    <Alert severity="error">{LOGIN_ERROR_MESSAGE}</Alert>
                  )}
                </Stack>
              )}

              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
              >
                Login
              </Button>
              <Backdrop
                open={isLoading}
                sx={{
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                  color: "#fff",
                }}
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
                  severity="success"
                  elevation={3}
                >
                  {responseMessage}
                </Alert>
              </Snackbar>
              <Typography color="text.secondary" variant="body2">
                Don&apos;t have an account? &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/register"
                  underline="hover"
                  variant="subtitle2"
                >
                  Register
                </Link>
              </Typography>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
}

Page.getLayout = (page: ReactElement) => <AuthLayout>{page}</AuthLayout>;

export default Page;
