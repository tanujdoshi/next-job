import { ChartMetaDataType, RawJobType } from "./types";

export const convertRawDataToSalaryGraphStats = (
  rawData: RawJobType[],
  location?: {
    city?: string[];
    state?: string[];
    country?: string[];
  }
) => {
  let stats: { [key: string]: number } = {};
  rawData?.map((job) => {
    if (location && location.city && location.city.length > 0) {
      if (location.city.includes(job.location.city)) {
        stats[salaryRange(Number(job.salary))] =
          (stats[salaryRange(Number(job.salary))] || 0) + 1;
      }
    } else if (location && location.state && location.state.length > 0) {
      if (location.state.includes(job.location.state)) {
        stats[salaryRange(Number(job.salary))] =
          (stats[salaryRange(Number(job.salary))] || 0) + 1;
      }
    } else if (location && location.country && location.country.length > 0) {
      if (location.country.includes(job.location.country)) {
        stats[salaryRange(Number(job.salary))] =
          (stats[salaryRange(Number(job.salary))] || 0) + 1;
      }
    } else {
      stats[salaryRange(Number(job.salary))] =
        (stats[salaryRange(Number(job.salary))] || 0) + 1;
    }
  });
  return {
    labels: Object.keys(stats),
    data: Object.values(stats),
  };
};

const salaryRange = (salary: number): string => {
  if (salary < 40000) {
    return "0-40k";
  } else if (salary < 60000) {
    return "40k-60k";
  } else if (salary < 80000) {
    return "60k-80k";
  } else if (salary < 100000) {
    return "80k-100k";
  } else if (salary < 120000) {
    return "100k-120k";
  } else if (salary < 140000) {
    return "120k-140k";
  } else {
    return "140k+";
  }
};

export const convertRawDataToOpeningGraphStats = (
  rawData: RawJobType[],
  location?: {
    city?: string[];
    state?: string[];
    country?: string[];
  }
) => {
  let stats: { [key: string]: number } = {};
  rawData.map((job) => {
    if (location && location.city && location.city.length > 0) {
      if (location.city.includes(job.location.city)) {
        stats[job.jobTitle] = (stats[job.jobTitle] || 0) + 1;
      }
    } else if (location && location.state && location.state.length > 0) {
      if (location.state.includes(job.location.state)) {
        stats[job.jobTitle] = (stats[job.jobTitle] || 0) + 1;
      }
    } else if (location && location.country && location.country.length > 0) {
      if (location.country.includes(job.location.country)) {
        stats[job.jobTitle] = (stats[job.jobTitle] || 0) + 1;
      }
    } else {
      stats[job.jobTitle] = (stats[job.jobTitle] || 0) + 1;
    }
  });
  return {
    labels: Object.keys(stats),
    data: Object.values(stats),
  };
};

export const convertRawDataToSkillsGraphStats = (
  rawData: RawJobType[],
  location?: {
    city?: string[];
    state?: string[];
    country?: string[];
  }
) => {
  let stats: { [key: string]: number } = {};
  rawData.map((job) => {
    if (location && location.city && location.city.length > 0) {
      if (location.city.includes(job.location.city)) {
        job.skills.map((skill) => {
          stats[skill] = (stats[skill] || 0) + 1;
        });
      }
    } else if (location && location.state && location.state.length > 0) {
      if (location.state.includes(job.location.state)) {
        job.skills.map((skill) => {
          stats[skill] = (stats[skill] || 0) + 1;
        });
      }
    } else if (location && location.country && location.country.length > 0) {
      if (location.country.includes(job.location.country)) {
        job.skills.map((skill) => {
          stats[skill] = (stats[skill] || 0) + 1;
        });
      }
    } else {
      job.skills.map((skill) => {
        stats[skill] = (stats[skill] || 0) + 1;
      });
    }
  });
  return {
    labels: Object.keys(stats),
    data: Object.values(stats),
  };
};

export const getTilesData = (
  rawData: RawJobType[]
): {
  totalJobs: number;
  avgSalary: number;
  totalSkills: number;
} => {
  let skills: { [key: string]: number } = {};
  let count: number = 0;
  rawData.map((job) => {
    count += Number(job.salary);
    job.skills.map((skill) => {
      skills[skill] = (skills[skill] || 0) + 1;
    });
  });
  return {
    totalJobs: rawData.length,
    avgSalary: Math.round(count / rawData.length),
    totalSkills: Object.keys(skills).length,
  };
};
