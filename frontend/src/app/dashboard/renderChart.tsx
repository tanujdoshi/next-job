"use client";

import BarChart from "../../../components/BarChart";
import DonutChart from "../../../components/DonutChart";
import LineChart from "../../../components/LineChart";
import PieChart from "../../../components/PieChart";
import { categories, data } from "./constants";
import { ApexOptionsModified } from "./types";

export default function RenderChart({
  options,
  displayStats,
}: {
  options: ApexOptionsModified;
  displayStats: {
    labels: string[];
    data: number[];
  };
}): JSX.Element {
  switch (options.chart?.type?.toLocaleLowerCase()) {
    case "line":
      return (
        <LineChart
          options={options}
          title="Count"
          labels={displayStats.labels}
          data={displayStats.data}
        />
      );
    case "bar":
      return (
        <BarChart
          options={options}
          title="Count"
          labels={displayStats.labels}
          data={displayStats.data}
        />
      );
    case "donut":
      return (
        <DonutChart
          options={options}
          title="Count"
          labels={displayStats.labels}
          data={displayStats.data}
        />
      );
    case "pie":
      return (
        <PieChart
          options={options}
          title="Count"
          labels={displayStats.labels}
          data={displayStats.data}
        />
      );
    default:
      return (
        <BarChart
          options={options}
          title="Count"
          labels={displayStats.labels}
          data={displayStats.data}
        />
      );
  }
}
