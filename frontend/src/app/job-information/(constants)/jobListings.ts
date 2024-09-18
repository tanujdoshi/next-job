export interface JobInformation {
  id: string;
  jobTitle: string;
  jobDescription: string;
  skills: string[];
  jobStatus: string;
  noOfPositions: string;
  jobType: string;
  location: JobLocation;
  salary: string;
  experience: string;
  openDate: string;
  employerId: string;
  jobCompany: string;
  jobCompanyLogo: string;
}
export interface JobLocation {
  type: string;
  coordinates: number[];
  placeId: string;
  placeName: string;
  city: string;
  state: string;
  country: string;
}