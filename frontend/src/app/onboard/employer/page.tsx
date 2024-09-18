
"use client";

import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  TextField,
  Backdrop,
  Alert,
  Snackbar,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import {
  Formik,
  Field,
  Form,
  FormikErrors,
  ErrorMessage,
  FormikTouched,
} from "formik";
import React, { useContext } from "react";
import * as Yup from "yup";
import { axiosInstance, isAuthenticatedUser } from "../../../../api";
import { UserContext } from "@/app/(context)/UserContext";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { setUserDataByName } from "@/app/(context)/LocatStorageManager";
import axios from "axios";
import { isValidURL } from "../../../../utils";

interface FormType {
  jobTitle: string;
  phone: string;
  companyName: string;
  industry: string;
  foundedYear?: number;
  companySize: string;
  companyType: string;
  description: string;
  websiteURL?: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const initialValues: FormType = {
  jobTitle: "",
  phone: "",
  companyName: "",
  industry: "",
  companySize: "",
  companyType: "",
  description: "",
  websiteURL: "",
  streetAddress: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

const OnBoardingForm: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [companyLogoURL, setCompanyLogoURL] = React.useState("");
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [responseMessage, setResponseMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { state, dispatch } = useContext(UserContext);
  const router = useRouter();

  React.useEffect(() => {
    setIsHydrated(true);
    isAuthenticatedUser();
  }, []);
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const validationSchema: Yup.ObjectSchema<FormType> = Yup.object().shape({
    jobTitle: Yup.string().required("Job title is required"),
    phone: Yup.string()
      .min(10, "Phone number is too short")
      .max(15, "Phone number is too long")
      .required("Phone number is required"),
    companyName: Yup.string().required("Company name is required"),
    industry: Yup.string().required("Industry is required"),
    foundedYear: Yup.number()
      .min(1000, "Invalid year")
      .max(new Date().getFullYear(), "Invalid year")
      .required("Founded year is required"),
    companySize: Yup.string().required("Company size is required"),
    companyType: Yup.string().required("Company type is required"),
    description: Yup.string().required("Company description is required"),
    websiteURL: Yup.string()
      .test("valid-url", "Invalid URL", isValidURL)
      .required("Website URL is required"),
    streetAddress: Yup.string().required("Street address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    postalCode: Yup.string().required("Postal code is required"),
    country: Yup.string().required("Country is required"),
  });

  const renderBasicDetails = (
    errors: FormikErrors<FormType>,
    touched: FormikTouched<FormType>,
    values: FormType
  ) => (
    <Grid container spacing={2}>
      <Grid xs={12} md={6}>
        <Field
          as={TextField}
          fullWidth
          name="companyName"
          error={touched.companyName && !!errors.companyName}
          helperText={<ErrorMessage name="companyName" />}
          label="Company Name"
          onBlur={async () => {
            if (values.companyName.length > 3) {
              const response = await axios.get(
                "https://autocomplete.clearbit.com/v1/companies/suggest?query=" +
                values.companyName
              );

              setCompanyLogoURL(response?.data[0]?.logo || "");
            }
          }}
        />
      </Grid>
      <Grid xs={12} md={6}>
        <Field
          as={TextField}
          fullWidth
          name="industry"
          error={touched.industry && !!errors.industry}
          helperText={<ErrorMessage name="industry" />}
          label="Industry"
        />
      </Grid>
      <Grid xs={12} md={6}>
        <Field
          as={TextField}
          fullWidth
          name="foundedYear"
          error={touched.foundedYear && !!errors.foundedYear}
          helperText={<ErrorMessage name="foundedYear" />}
          label="Founded Year"
        />
      </Grid>
      <Grid xs={12} md={6}>
        <Field
          as={TextField}
          fullWidth
          name="companySize"
          error={touched.companySize && !!errors.companySize}
          helperText={<ErrorMessage name="companySize" />}
          label="Company Size"
        />
      </Grid>
      <Grid xs={12} md={6}>
        <Field
          as={TextField}
          fullWidth
          name="companyType"
          error={touched.companyType && !!errors.companyType}
          helperText={<ErrorMessage name="companyType" />}
          label="Company Type"
        />
      </Grid>
      <Grid xs={12} md={6}>
        <Field
          as={TextField}
          fullWidth
          name="websiteURL"
          error={touched.websiteURL && !!errors.websiteURL}
          helperText={<ErrorMessage name="websiteURL" />}
          label="Website URL"
        />
      </Grid>
      <Grid xs={12}>
        <Field
          as={TextField}
          fullWidth
          multiline
          rows={4}
          name="description"
          error={touched.description && !!errors.description}
          helperText={<ErrorMessage name="description" />}
          label="Description"
        />
      </Grid>
    </Grid>
  );

  const renderPersonalDetails = (
    errors: FormikErrors<FormType>,
    touched: FormikTouched<FormType>
  ) => (
    <Grid container spacing={2}>
      <Grid xs={12} md={6}>
        <Field
          as={TextField}
          fullWidth
          name="jobTitle"
          error={touched.jobTitle && !!errors.jobTitle}
          helperText={<ErrorMessage name="jobTitle" />}
          label="Job Title"
        />
      </Grid>
      <Grid xs={12} md={6}>
        <Field
          as={TextField}
          fullWidth
          name="phone"
          error={touched.phone && !!errors.phone}
          helperText={<ErrorMessage name="phone" />}
          label="Phone"
        />
      </Grid>
    </Grid>
  );

  const renderAddressDetails = (
    errors: FormikErrors<FormType>,
    touched: FormikTouched<FormType>
  ) => (
    <Grid container spacing={2}>
      <Grid xs={12}>
        <Field
          as={TextField}
          fullWidth
          name="streetAddress"
          error={touched.streetAddress && !!errors.streetAddress}
          helperText={<ErrorMessage name="streetAddress" />}
          label="Street Address"
        />
      </Grid>
      <Grid xs={12} md={6}>
        <Field
          as={TextField}
          fullWidth
          name="city"
          error={touched.city && !!errors.city}
          helperText={<ErrorMessage name="city" />}
          label="City"
        />
      </Grid>
      <Grid xs={12} md={6}>
        <Field
          as={TextField}
          fullWidth
          name="state"
          error={touched.state && !!errors.state}
          helperText={<ErrorMessage name="state" />}
          label="State"
        />
      </Grid>
      <Grid xs={12} md={6}>
        <Field
          as={TextField}
          fullWidth
          name="postalCode"
          error={touched.postalCode && !!errors.postalCode}
          helperText={<ErrorMessage name="postalCode" />}
          label="Postal Code"
        />
      </Grid>
      <Grid xs={12} md={6}>
        <Field
          as={TextField}
          fullWidth
          name="country"
          error={touched.country && !!errors.country}
          helperText={<ErrorMessage name="country" />}
          label="Country"
        />
      </Grid>
    </Grid>
  );

  const renderLogoComponent = () => (
    <Grid container spacing={2}>
      <Grid xs={12}>
        {companyLogoURL ? (
          <Avatar
            src={companyLogoURL}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
        ) : null}
      </Grid>
    </Grid>
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values: FormType) => {
        if (!companyLogoURL) {
          setOpen(true);
          return;
        }
        setIsLoading(true);
        const formData = new FormData();
        formData.append("jobTitle", values.jobTitle);
        formData.append("phone", values.phone);
        formData.append("companyName", values.companyName);
        formData.append("industry", values.industry);
        values.foundedYear &&
          formData.append("foundedYear", values.foundedYear.toString());
        formData.append("companySize", values.companySize);
        formData.append("companyType", values.companyType);
        formData.append("description", values.description);
        values.websiteURL && formData.append("websiteURL", values.websiteURL);
        formData.append("streetAddress", values.streetAddress);
        formData.append("city", values.city);
        formData.append("state", values.state);
        formData.append("postalCode", values.postalCode);
        formData.append("country", values.country);
        formData.append("companyLogo", companyLogoURL);
        formData.append("userId", state.id);

        axiosInstance
          .post("api/employer", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            setResponseMessage("Accouted Details Added Successfully!");
            setOpenSnackbar(true);
            setIsLoading(false);
            dispatch({
              ...state,
              loginType: "employer",
              companyName: values.companyName,
              companyLogo: companyLogoURL,
            });
            setUserDataByName("loginType", "employer");
            setUserDataByName("companyName", values.companyName);
            setUserDataByName("companyLogo", companyLogoURL);
            router.push("/dashboard");
          })
          .catch((err) => {
            // console.log("err=>", err);
            setIsLoading(false);
          });
      }}
      onErrors={(errors: FormikErrors<FormType>) => {
        // console.log(errors);
      }}
    >
      {({ errors, touched, values }) => (
        <Form>
          <Grid
            container
            justifyContent="center"
            sx={{ flex: "1 1 auto" }}
            spacing={1}
          >
            {!isHydrated ? (
              <CircularProgress />
            ) : (
              <>
                <Grid xs={11} md={8}>
                  <Card>
                    <CardHeader title="Employer Details" />
                    <CardContent>
                      {renderPersonalDetails(errors, touched)}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid xs={11} md={8}>
                  <Card>
                    <CardHeader title="Company Details" />
                    <CardContent>
                      {renderBasicDetails(errors, touched, values)}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid xs={11} md={8}>
                  <Card>
                    <CardHeader title="Company Address" />
                    <CardContent>
                      {renderAddressDetails(errors, touched)}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid xs={11} md={8}>
                  <Card>
                    <CardHeader title="Company Logo" />
                    <CardContent>{renderLogoComponent()}</CardContent>
                  </Card>
                </Grid>
                <Grid xs={11} md={8}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    // disabled={isSubmitting}
                    sx={{ mt: 2, py: 1, minWidth: 150 }}
                  >
                    Submit
                  </Button>
                  <Backdrop
                    open={isLoading}
                    sx={{
                      color: "#fff",
                      zIndex: (theme) => theme.zIndex.drawer + 1,
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
                </Grid>
                <Snackbar
                  open={open}
                  autoHideDuration={6000}
                  onClose={() => setOpen(false)}
                  message={"Please enter valid company name"}
                />
              </>
            )}
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default OnBoardingForm;
