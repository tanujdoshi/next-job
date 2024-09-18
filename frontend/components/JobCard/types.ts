export type JobCard = {
    employerId: string;
    experience: string;
    id: string;
    jobDescription: string;
    jobStatus: string;
    jobTitle: string;
    jobType: string;
    location: {
        type: 'Point';
        coordinates: [number, number];
        placeId: string;
        placeName: string
    };
    noOfPositions: string;
    openDate: string;
    salary: string;
    skills: string[];
    jobCompany: string;
    employerEmail?: string
}