"use client";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Link,
  Stack,
  TextField,
  Typography,
  Backdrop,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import AuthLayout from "../layout";
import React, { ReactElement } from "react";
import { axiosInstance } from "../../../../api";
import { message } from "antd";

function Page(): ReactElement {
  const router = useRouter();

  const [isHydrated, setIsHydrated] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [responseMessage, setResponseMessage] = React.useState<{
    message: string;
    type: "success" | "error";
  }>({
    message: "",
    type: "success",
  });
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      submit: null,
    },
    validateOnBlur: true,

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Must be a valid email")
        .max(255, "Email must be at most 255 characters")
        .required("Email is required"),
      firstName: Yup.string()
        .matches(
          /^[a-zA-Z ]+$/,
          "First name must contain only alphabets or spaces"
        )
        .max(40, "First name must be at most 40 characters")
        .required("First name is required"),
      lastName: Yup.string()
        .matches(
          /^[a-zA-Z ]+$/,
          "Last name must contain only alphabets or spaces"
        )
        .max(40, "Last name must be at most 40 characters")
        .required("Last name is required"),
      password: Yup.string()
        .max(255, "Password must be at most 255 characters")
        .required("Password is required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character"
        ),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), ""], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        if (values.password !== values.confirmPassword) {
          helpers.setErrors({ confirmPassword: "Passwords must match" });
          return;
        }
        axiosInstance
          .post("/pub/register", { ...values, submit: undefined })
          .then((res) => {
            setResponseMessage({
              message:
                "Account Created! Now Please Login to Add Your Information.",
              type: "success",
            });
            setOpenSnackbar(true);
            setIsLoading(false);
            router.push("/auth/login");
          })
          .catch((err) => {
            setResponseMessage({
              message: "Error while register user! Please try again.",
              type: "error",
            });
            setOpenSnackbar(true);
            setIsLoading(false);
          });
      } catch (err: any) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Head>
        <title>Register | Devias Kit</title>
      </Head>
      <Box
        sx={{
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
              <Typography variant="h4">Register</Typography>
              <Typography color="text.secondary" variant="body2">
                Already have an account? &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/login"
                  underline="hover"
                  variant="subtitle2"
                >
                  Log in
                </Link>
              </Typography>
            </Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
              {isHydrated && (
                <Stack spacing={3}>
                  <TextField
                    // id="firstName"
                    type="text"
                    error={
                      !!(formik.touched.firstName && formik.errors.firstName)
                    }
                    fullWidth
                    helperText={
                      formik.touched.firstName && formik.errors.firstName
                    }
                    label="First Name"
                    name="firstName"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.firstName}
                  />
                  <TextField
                    error={
                      !!(formik.touched.lastName && formik.errors.lastName)
                    }
                    fullWidth
                    helperText={
                      formik.touched.lastName && formik.errors.lastName
                    }
                    label="Last Name"
                    name="lastName"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.lastName}
                  />
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
                  <TextField
                    error={
                      !!(
                        formik.touched.confirmPassword &&
                        formik.errors.confirmPassword
                      )
                    }
                    fullWidth
                    helperText={
                      formik.touched.confirmPassword &&
                      formik.errors.confirmPassword
                    }
                    label="Confirm Password"
                    name="confirmPassword"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="password"
                    value={formik.values.confirmPassword}
                  />
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
                Register
              </Button>
            </form>
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
                severity={responseMessage.type}
                elevation={3}
              >
                {responseMessage.message}
              </Alert>
            </Snackbar>
          </div>
        </Box>
      </Box>
    </>
  );
}

Page.getLayout = (page: ReactElement) => <AuthLayout>{page}</AuthLayout>;

export default Page;
