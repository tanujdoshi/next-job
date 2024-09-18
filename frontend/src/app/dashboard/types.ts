import { ApexOptions } from "apexcharts";

export interface ICountry {
  name: string;
  isoCode: string;
}

export interface IState extends ICountry {
  isoCountryCode: string;
}

export interface ICity {
  name: string;
  isoStateCode: string;
  isoCountryCode: string;
}

export interface ApexOptionsModified extends ApexOptions {
  chart: ApexChartCustom;
}

interface ApexChartCustom extends ApexChart {
  type: "line" | "bar" | "donut" | "pie" | undefined;
}

export interface RawJobType {
  id: string;
  jobTitle: string;
  jobDescription: string;
  skills: string[];
  jobStatus: string;
  noOfPositions: string;
  jobType: string;
  location: {
    type: string;
    coordinates: number[];
    placeId: string;
    placeName: string;
    city: string;
    state: string;
    country: string;
  };
  salary: string;
  experience: string;
  openDate: string;
  employerId: string;
  jobCompany: string;
  jobCompanyLogo: string;
}

export interface ChartMetaDataType {
  label: string;
  data: number;
}

export type GraphType = "line" | "bar" | "donut" | "pie";
