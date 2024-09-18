
import { alpha, useTheme } from "@mui/material";
import { ApexOptionsModified } from "./types";

export const categories = [
  "Cybersecurity",
  "IT technician",
  "Support specialist",
  "Quality assurance tester",
  "Web developer",
  "IT security specialist",
  "Computer programmer",
  "Systems analyst",
  "Network engineer",
];
export const data = [10, 41, 35, 51, 49, 62, 69, 91, 148];

export const useChartOptions = (categories: string[]): ApexOptionsModified => {
  const theme = useTheme();
  return {
    chart: {
      type: "donut",
      background: "transparent",
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    colors: [
      theme.palette.primary.main,
      alpha(theme.palette.primary.main, 0.40),
    ],
    fill: {
      opacity: 1,
      type: "solid",
    },
    xaxis: { categories: categories },
    series: data,
    labels: categories,
    responsive: [
      {
        breakpoint: 1000,
        options: {
          chart: {
            width: 250,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };
};

export const useChartOption = (categories: string[]): ApexOptionsModified => {
  const theme = useTheme();

  return {
    chart: {
      type: "line",
      background: "transparent",
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    colors: [
      theme.palette.primary.main,
      alpha(theme.palette.primary.main, 0.25),
    ],
    fill: {
      opacity: 1,
      type: "solid",
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    legend: {
      show: false,
    },
    plotOptions: {
      bar: {
        columnWidth: "40px",
      },
    },
    stroke: {
      colors: ["transparent"],
      show: true,
      width: 2,
    },
    theme: {
      mode: theme.palette.mode,
    },
    labels: categories,
    xaxis: {
      axisBorder: {
        color: theme.palette.divider,
        show: true,
      },
      axisTicks: {
        color: theme.palette.divider,
        show: true,
      },
      categories: categories,
      labels: {
        offsetY: 5,
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: {
      labels: {
        offsetX: -10,
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
  };
};

export const GraphTypeOptions = ["Donut", "Bar", "Pie", "Line"];
