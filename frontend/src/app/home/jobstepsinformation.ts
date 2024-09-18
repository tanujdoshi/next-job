
import {
  faUser,
  faMagnifyingGlass,
  faFile,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";
import { JobStepsInformationType } from "./types";

export const Jobstepsinformation:JobStepsInformationType[] = [
  {
    id: 1,
    title: "Create an account",
    iconName: faUser,
    iconColor: "#F94E09",
    backgroundColor: "#FFF9F7",
    description:
      "Sign up and unlock a world of job opportunities. Customize preferences, save searches, and get personalized recommendations",
  },
  {
    id: 2,
    title: "Search a Job",
    iconName: faMagnifyingGlass,
    iconColor: "#6837C2",
    backgroundColor: "#E9DCFE",
    description:
      "Explore thousands of job listings and find the perfect match. Filter by type, location, salary, and more to discover your ideal job",
  },
  {
    id: 3,
    title: "Upload CV/Resume",
    iconName: faFile,
    iconColor: "#3AC1BB",
    backgroundColor: "#F0FFFF",
    description:
      "Showcase your qualifications and experience. Increase visibility to employers searching our database for potential candidates",
  },
  {
    id: 4,
    title: "Get a Job",
    iconName: faBriefcase,
    iconColor: "#FCBB06",
    backgroundColor: "#FFF9DC",
    description:
      "Apply directly to job listings that align with your aspirations. Tailor your application and impress employers to secure your dream job",
  },
];