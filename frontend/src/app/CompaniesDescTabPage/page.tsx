
"use client";
import { Container, Typography } from "@mui/material";
import * as React from "react";
import "./styles.css";
import { Grid } from "@mui/material";
interface CompanyData {
  companyId: string;
  website: string;
  hq: string;
  orgSize: string;
  type: string;
  industry: string;
  revenue: string;
}

export default function CompaniesDescTabPage(props: any) {
  const {
    companyId,
    website,
    hq,
    orgSize,
    type,
    industry,
    foundedYear,
    description,
  } = props;

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2} textAlign={"center"}>
        <Grid item xs={12} md={12} lg={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ minWidth: 200, fontWeight: "bold" }}
              >
                Website:{" "}
              </Typography>
              <Typography
                variant="subtitle1"
                gutterBottom
                className="valueAlign"
              >
                <a href={website} target="_blank" rel="noreferrer">
                  {" "}
                  {website}{" "}
                </a>
                {/* {website}  */}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ minWidth: 200, fontWeight: "bold" }}
              >
                Headquarters:{" "}
              </Typography>
              <Typography
                variant="subtitle1"
                gutterBottom
                className="valueAlign"
              >
                {" "}
                {hq}{" "}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ minWidth: 200, fontWeight: "bold" }}
              >
                Org Size:{" "}
              </Typography>
              <Typography
                variant="subtitle1"
                gutterBottom
                className="valueAlign"
              >
                {" "}
                {orgSize}{" "}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ minWidth: 200, fontWeight: "bold" }}
              >
                Founded:{" "}
              </Typography>
              <Typography
                variant="subtitle1"
                gutterBottom
                className="valueAlign"
              >
                {" "}
                {foundedYear}{" "}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ minWidth: 200, fontWeight: "bold" }}
              >
                Type:{" "}
              </Typography>
              <Typography
                variant="subtitle1"
                gutterBottom
                className="valueAlign"
              >
                {" "}
                {type}{" "}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ minWidth: 200, fontWeight: "bold" }}
              >
                Industry:{" "}
              </Typography>
              <Typography
                variant="subtitle1"
                gutterBottom
                className="valueAlign"
              >
                {" "}
                {industry}{" "}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ minWidth: 200, fontWeight: "bold" }}
              >
                Revenue:{" "}
              </Typography>
              <Typography
                variant="subtitle1"
                gutterBottom
                className="valueAlign"
              >
                {" "}
                {foundedYear}{" "}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Typography variant="h5" gutterBottom>
            Overview:{" "}
          </Typography>
          <div className="overview-desc-grid">{description}</div>
        </Grid>
      </Grid>
    </Container>
  );
}
