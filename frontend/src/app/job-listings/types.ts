export interface JobListingsSearchBarProps {
  searchValue: string;
  applySearch: (value: string) => void;
}

export interface JobListingsItemsProps {
  jobData: JobData[];
}

export interface JobFilterProps {
  checked: {
    fullTime: boolean;
    partTime: boolean;
    internship: boolean;
    contract: boolean;
  };
  setChecked: (value: any) => void;
  minFilterAmount: number;
  maxFilterAmount: number;
  maxFilterAmountError: boolean;
  minFilterAmountError: boolean;
  setMinFilterAmount: (value: number) => void;
  setMaxFilterAmount: (value: number) => void;
  setMinFilterAmountError: (value: boolean) => void;
  setMaxFilterAmountError: (value: boolean) => void;
  handleCheckChange: (value: FilterChangeEvent) => void;
}
export type FilterChangeEvent = React.ChangeEvent<HTMLInputElement>;

export interface JobData {
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
  employerEmail: string;
}
