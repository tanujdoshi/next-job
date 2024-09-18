
"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Backdrop,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import {
  Formik,
  Field,
  Form,
  ErrorMessage,
  FormikErrors,
  FormikTouched,
  FieldArray,
  FieldArrayRenderProps,
} from "formik";
import React, { useContext } from "react";
import * as Yup from "yup";
import { axiosInstance, isAuthenticatedUser } from "../../../../api";
import { UserContext } from "@/app/(context)/UserContext";
import { useRouter } from "next/navigation";
import { setUserDataByName } from "@/app/(context)/LocatStorageManager";
import {
  SeekerFormType,
  SeekerFormTypeEducation,
  SeekerFormTypeExperience,
} from "@/app/my-profile/types";

interface FormType {
  email: string;
  phone: string;
  address1: string;
  address2: string;
  state: string;
  postalCode: string;
  educations: {
    school: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
  }[];
  experiences: {
    company: string;
    title: string;
    location: string;
    startDate: string;
    endDate?: string;
    details?: string;
  }[];
  resume: any | null;
}

const OnBoardingForm: React.FC = () => {
  const [isHydrated, setIsHydrated] = React.useState(false);
  const router = useRouter();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [responseMessage, setResponseMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { state, dispatch } = useContext(UserContext);

  React.useEffect(() => {
    setIsHydrated(true);
    isAuthenticatedUser();
  }, []);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const validationSchema: Yup.ObjectSchema<FormType> = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .min(10, "Phone number is too short")
      .max(12, "Phone number is too long")
      .matches(/^\d{10}$/, "Phone number must be number and 10 digits")

      .required("Phone number is required"),
    address1: Yup.string().required("Address line 1 is required"),
    address2: Yup.string().required("Address line 2 is required"),
    state: Yup.string().required("State is required"),
    postalCode: Yup.string().required("Postal code is required"),
    educations: Yup.array()
      .of(
        Yup.object().shape({
          school: Yup.string().required("School name is required"),
          degree: Yup.string().required("Degree is required"),
          fieldOfStudy: Yup.string().required("Field of study is required"),
          startDate: Yup.string().required("Start date is required"),
          endDate: Yup.string(),
        })
      )
      .required("At least one education item is required")
      .max(3, "You can add up to 3 educations"),
    experiences: Yup.array()
      .of(
        Yup.object().shape({
          company: Yup.string().required("Company name is required"),
          title: Yup.string().required("Job title is required"),
          location: Yup.string().required("Location is required"),
          startDate: Yup.string().required("Start date is required"),
          endDate: Yup.string(),
          details: Yup.string(),
        })
      )
      .required("At least one work experience item is required")
      .max(3, "You can add up to 3 work experiences"),
    resume: Yup.mixed()
      .required("A file is required")
      .test(
        "fileSize",
        "File too large",
        (value) => value && (value as File).size <= 1024 * 1024 // 1MB
      )
      .test(
        "fileFormat",
        "Unsupported Format",
        (value) => value && ["application/pdf"].includes((value as File).type) // only allow PDF format
      ),
  });

  const renderBasicDetails = (
    errors: FormikErrors<FormType>,
    touched: FormikTouched<FormType>
  ) => (
    <Grid container spacing={2}>
      <Grid xs={12} sm={6}>
        <Field
          name="email"
          as={TextField}
          label="Email"
          disabled
          fullWidth
          error={touched.email && !!errors.email}
          helperText={<ErrorMessage name="email" />}
        />
      </Grid>
      <Grid xs={12} sm={6}>
        <Field
          name="phone"
          as={TextField}
          label="Phone"
          fullWidth
          error={touched.phone && !!errors.phone}
          helperText={<ErrorMessage name="phone" />}
        />
      </Grid>
      <Grid xs={12} sm={6}>
        <Field
          name="address1"
          as={TextField}
          label="Address 1"
          fullWidth
          error={touched.address1 && !!errors.address1}
          helperText={<ErrorMessage name="address1" />}
        />
      </Grid>
      <Grid xs={12} sm={6}>
        <Field
          name="address2"
          as={TextField}
          label="Address 2"
          fullWidth
          error={touched.address2 && !!errors.address2}
          helperText={<ErrorMessage name="address2" />}
        />
      </Grid>
      <Grid xs={12} sm={6}>
        <Field
          name="state"
          as={TextField}
          label="State"
          fullWidth
          error={touched.state && !!errors.state}
          helperText={<ErrorMessage name="state" />}
        />
      </Grid>
      <Grid xs={12} sm={6}>
        <Field
          name="postalCode"
          as={TextField}
          label="Postal Code"
          fullWidth
          error={touched.postalCode && !!errors.postalCode}
          helperText={<ErrorMessage name="postalCode" />}
        />
      </Grid>
    </Grid>
  );

  const renderEducationComponent = (
    errors: FormikErrors<SeekerFormType>,
    touched: FormikTouched<SeekerFormType>,
    values: SeekerFormType
  ) => (
    <FieldArray name="educations">
      {(arrayHelpers: FieldArrayRenderProps) => (
        <>
          {values.educations.map((education, index) => (
            <div key={index}>
              <Grid container spacing={2}>
                <Grid xs>
                  <Typography variant="h6">{`Education ${index + 1
                    }`}</Typography>
                </Grid>
                <Grid xs textAlign={"right"}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => arrayHelpers.remove(index)}
                  >
                    Remove
                  </Button>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid xs={12} sm={6}>
                  <Field
                    name={`educations[${index}].school`}
                    as={TextField}
                    label="School"
                    fullWidth
                    error={
                      touched.educations &&
                      touched.educations[index]?.school &&
                      !!(errors.educations?.[index] as SeekerFormTypeEducation)
                        ?.school
                    }
                    helperText={
                      <ErrorMessage name={`educations[${index}].school`} />
                    }
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <Field
                    name={`educations[${index}].degree`}
                    as={TextField}
                    label="Degree"
                    fullWidth
                    error={
                      touched.educations &&
                      touched.educations[index]?.degree &&
                      !!(errors.educations?.[index] as SeekerFormTypeEducation)
                        ?.degree
                    }
                    helperText={
                      <ErrorMessage name={`educations[${index}].degree`} />
                    }
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <Field
                    name={`educations[${index}].fieldOfStudy`}
                    as={TextField}
                    label="Field of Study"
                    fullWidth
                    error={
                      touched.educations &&
                      touched.educations[index]?.fieldOfStudy &&
                      !!(errors.educations?.[index] as SeekerFormTypeEducation)
                        ?.fieldOfStudy
                    }
                    helperText={
                      <ErrorMessage
                        name={`educations[${index}].fieldOfStudy`}
                      />
                    }
                  />
                </Grid>
                <Grid xs={12} sm={3}>
                  <Field
                    name={`educations[${index}].startDate`}
                    as={TextField}
                    label="Start Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={
                      touched.educations &&
                      touched.educations[index]?.startDate &&
                      !!(errors.educations?.[index] as SeekerFormTypeEducation)
                        ?.startDate
                    }
                    helperText={
                      <ErrorMessage name={`educations[${index}].startDate`} />
                    }
                  />
                </Grid>
                <Grid xs={12} sm={3}>
                  <Field
                    name={`educations[${index}].endDate`}
                    as={TextField}
                    label="End Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={
                      touched.educations &&
                      touched.educations[index]?.endDate &&
                      !!(errors.educations?.[index] as SeekerFormTypeEducation)
                        ?.endDate
                    }
                    helperText={
                      <ErrorMessage name={`educations[${index}].endDate`} />
                    }
                  />
                </Grid>
              </Grid>
            </div>
          ))}
          <Grid xs={12} textAlign={"right"}>
            {values.educations.length < 3 && (
              <Button
                type="button"
                variant="contained"
                color="secondary"
                sx={{ mt: 2, py: 1 }}
                onClick={() =>
                  arrayHelpers.push({
                    school: "",
                    degree: "",
                    fieldOfStudy: "",
                    startDate: "",
                    endDate: "",
                  })
                }
              >
                Add Education
              </Button>
            )}
          </Grid>
        </>
      )}
    </FieldArray>
  );

  const renderExperienceComponent = (
    errors: FormikErrors<SeekerFormType>,
    touched: FormikTouched<SeekerFormType>,
    values: FormType
  ) => (
    <FieldArray name="experiences">
      {(arrayHelpers: FieldArrayRenderProps) => (
        <>
          {values.experiences.map((experience, index) => (
            <div key={index}>
              <Grid container spacing={2}>
                <Grid xs>
                  <Typography variant="h6">{`Experience ${index + 1
                    }`}</Typography>
                </Grid>
                <Grid xs textAlign={"right"}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => arrayHelpers.remove(index)}
                  >
                    Remove
                  </Button>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid xs={12} sm={6}>
                  <Field
                    name={`experiences[${index}].company`}
                    as={TextField}
                    label="Company"
                    fullWidth
                    error={
                      touched.experiences &&
                      touched.experiences[index]?.company &&
                      !!(errors.educations?.[index] as SeekerFormTypeExperience)
                        ?.company
                    }
                    helperText={
                      <ErrorMessage name={`experiences[${index}].company`} />
                    }
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <Field
                    name={`experiences[${index}].title`}
                    as={TextField}
                    label="Title"
                    fullWidth
                    error={
                      touched.experiences &&
                      touched.experiences[index]?.title &&
                      !!(errors.educations?.[index] as SeekerFormTypeExperience)
                        ?.title
                    }
                    helperText={
                      <ErrorMessage name={`experiences[${index}].title`} />
                    }
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <Field
                    name={`experiences[${index}].location`}
                    as={TextField}
                    label="Location"
                    fullWidth
                    error={
                      touched.experiences &&
                      touched.experiences[index]?.location &&
                      !!(errors.educations?.[index] as SeekerFormTypeExperience)
                        ?.location
                    }
                    helperText={
                      <ErrorMessage name={`experiences[${index}].location`} />
                    }
                  />
                </Grid>
                <Grid xs={12} sm={3}>
                  <Field
                    name={`experiences[${index}].startDate`}
                    as={TextField}
                    label="Start Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={
                      touched.experiences &&
                      touched.experiences[index]?.startDate &&
                      !!(errors.educations?.[index] as SeekerFormTypeExperience)
                        ?.startDate
                    }
                    helperText={
                      <ErrorMessage name={`experiences[${index}].startDate`} />
                    }
                  />
                </Grid>
                <Grid xs={12} sm={3}>
                  <Field
                    name={`experiences[${index}].endDate`}
                    as={TextField}
                    label="End Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={
                      touched.experiences &&
                      touched.experiences[index]?.endDate &&
                      !!(errors.educations?.[index] as SeekerFormTypeExperience)
                        ?.endDate
                    }
                    helperText={
                      <ErrorMessage name={`experiences[${index}].endDate`} />
                    }
                  />
                </Grid>
                <Grid xs={12}>
                  <Field
                    name={`experiences[${index}].details`}
                    as={TextField}
                    label="Details"
                    multiline
                    rows={4}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </div>
          ))}
          <Grid xs={12} textAlign={"right"}>
            {!values.experiences || values.experiences.length < 3 ? (
              <Button
                type="button"
                variant="contained"
                color="secondary"
                sx={{ mt: 2, py: 1 }}
                onClick={() =>
                  arrayHelpers.push({
                    company: "",
                    title: "",
                    location: "",
                    startDate: "",
                  })
                }
              >
                Add Experience
              </Button>
            ) : null}
          </Grid>
        </>
      )}
    </FieldArray>
  );

  const renderResumeComponent = (isSubmitting: boolean) => (
    <Grid container spacing={2}>
      <Grid xs={12}>
        <Field name="resume" component={FileUploadField} />
        <ErrorMessage style={{ color: "red" }} name="resume" component="div" />
      </Grid>
    </Grid>
  );

  const FileUploadField = ({ field, form, ...props }: any) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files?.[0];
      form.setFieldValue(field.name, file);
    };

    return (
      <input
        type="file"
        accept="application/pdf"
        onChange={handleChange}
        {...props}
      />
    );
  };

  return (
    <Formik
      initialValues={{
        email: state.email || "",
        phone: "",
        address1: "",
        address2: "",
        state: "",
        postalCode: "",
        educations: [
          {
            school: "",
            degree: "",
            fieldOfStudy: "",
            startDate: "",
            endDate: "",
          },
        ],
        experiences: [
          {
            company: "",
            title: "",
            location: "",
            startDate: "",
          },
        ],
        resume: null,
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("email", values.email);
        formData.append("phone", values.phone);
        formData.append("address1", values.address1);
        formData.append("address2", values.address2);
        formData.append("state", values.state);
        formData.append("postalCode", values.postalCode);
        values.resume && formData.append("resume", values.resume);
        formData.append("educations", JSON.stringify(values.educations));
        formData.append("experiences", JSON.stringify(values.experiences));
        formData.append("userId", state.id);
        axiosInstance
          .post("api/seeker", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            setResponseMessage("Account Information Added Successfully!");
            setOpenSnackbar(true);
            setIsLoading(false);
            dispatch({ ...state, loginType: "seeker" });
            setUserDataByName("loginType", "seeker");
            router.push("/dashboard");
          })
          .catch((err) => {
            setIsLoading(false);
            // console.log(err);
          });
      }}
    >
      {({ errors, touched, values, isSubmitting }) => (
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
                    <CardHeader title="Basic Information" />
                    <CardContent>
                      {renderBasicDetails(errors, touched)}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid xs={11} md={8}>
                  <Card>
                    <CardHeader title="Education" />
                    <CardContent>
                      {renderEducationComponent(errors, touched, values)}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid xs={11} md={8}>
                  <Card>
                    <CardHeader title="Experience" />
                    <CardContent>
                      {renderExperienceComponent(errors, touched, values)}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid xs={11} md={8}>
                  <Card>
                    <CardHeader title="Upload Resume" />
                    <CardContent>
                      {renderResumeComponent(isSubmitting)}
                    </CardContent>
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
              </>
            )}
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default OnBoardingForm;
