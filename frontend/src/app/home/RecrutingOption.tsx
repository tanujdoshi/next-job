"use client";
import {
  Box,
  Grid,
  Button,
  useMediaQuery,
  useTheme,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";

const RecruitingOption = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();

  return (
    <Box
      bgcolor="#F0F4FC"
      style={{
        margin: "3%",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid container style={{ maxWidth: "94%", padding: "10px 0px" }}>
        <Grid
          item
          xs={12}
          md={6}
          lg={7}
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5" style={{ marginBottom: "15px" }}>
            Recruiting?
          </Typography>
          <Typography variant="body1" style={{ marginBottom: "20px" }}>
            Advertise your jobs to millions of monthly users and search 15.8
            million CVs in our database.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            style={{ padding: "10px 20px", maxWidth: "200px" }}
            onClick={() => {
              router.push("/job-information");
            }}
          >
            Start Recruiting
          </Button>
        </Grid>
        {!matches && (
          <Grid item md={6} lg={5} style={{ height: "100%" }}>
            <img
              src="/Recruiting.jpg"
              alt="Recruiting"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default RecruitingOption;
