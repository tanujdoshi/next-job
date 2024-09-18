"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Unstable_Grid2 as Grid,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import { categories, data, useChartOptions } from "./constants";
import { RegionSelect } from "./regionSelect";
import { ApexOptionsModified, GraphType, RawJobType } from "./types";
import RenderChart from "./renderChart";
import OverviewTile from "./overviewTile";
import { axiosInstance } from "../../../api";
import {
  convertRawDataToOpeningGraphStats,
  convertRawDataToSalaryGraphStats,
  convertRawDataToSkillsGraphStats,
  getTilesData,
} from "./utils";
import { Spin } from "antd";

export default function Dashboard() {
  const [options, setOptions] = useState<ApexOptionsModified>(
    useChartOptions(categories)
  );

  const chartTile = ["Salary", "Openings", "Skills"];
  const [activeTile, setActiveTile] = useState<number>(0);
  const [selectedPlace, setSelectedPlace] = useState<{
    country?: string[];
    state?: string[];
    city?: string[];
  }>({});

  const [jobDataArr, setJobDataArr] = useState<RawJobType[]>([]);
  const [displayStats, setDisplayStats] = useState<{
    labels: string[];
    data: number[];
  }>();

  const [tilesData, setTilesData] = useState<{
    totalJobs: number;
    avgSalary: number;
    totalSkills: number;
  }>({
    totalJobs: 0,
    avgSalary: 0,
    totalSkills: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/getJobs");
        setJobDataArr(response.data.jobs);
        setTilesData(getTilesData(response.data.jobs));
      } catch (error) {
        console.error("An error occurred while fetching job data: ", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    switch (activeTile) {
      case 0:
        setDisplayStats(
          convertRawDataToSalaryGraphStats(jobDataArr, selectedPlace)
        );
        break;
      case 1:
        setDisplayStats(
          convertRawDataToOpeningGraphStats(jobDataArr, selectedPlace)
        );
        break;
      case 2:
        setDisplayStats(
          convertRawDataToSkillsGraphStats(jobDataArr, selectedPlace)
        );
        break;
      default:
        setDisplayStats(convertRawDataToSalaryGraphStats(jobDataArr));

        break;
    }
  }, [jobDataArr, activeTile, options, selectedPlace]);

  const handleChange = (value: string | null) => {
    let newOptions = { ...options };
    newOptions.chart!.type = value as GraphType;
    setOptions(newOptions);
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={{ xs: 4, sm: 3, md: 10 }}>
            <Grid xs={12} sm>
              <OverviewTile
                active={activeTile === 0}
                title="Average Salary"
                value={"$ " + tilesData.avgSalary/1000 + "K"}
                onClick={() => setActiveTile(0)}
              />
            </Grid>
            <Grid xs={12} sm>
              <OverviewTile
                active={activeTile === 1}
                title="Openings"
                value={tilesData.totalJobs.toString()}
                onClick={() => setActiveTile(1)}
              />
            </Grid>
            <Grid xs={12} sm>
              <OverviewTile
                active={activeTile === 2}
                title="Skills"
                value={tilesData.totalSkills.toString()}
                onClick={() => setActiveTile(2)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={{ xs: 4, sm: 3, md: 10 }}>
            <Grid xs={12} lg={8}>
              <Card sx={{ height: "100%" }}>
                <CardHeader title={chartTile[activeTile]} />
                <CardContent>
                  {displayStats ? (
                    <RenderChart
                      options={options}
                      displayStats={displayStats}
                    />
                  ) : (
                    <Spin />
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={12} lg={4}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <RegionSelect
                    handleChange={handleChange}
                    selectedPlace={selectedPlace}
                    setSelectedPlace={setSelectedPlace}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
