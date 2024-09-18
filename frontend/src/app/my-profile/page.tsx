
"use client";
import { useContext, useEffect, useState } from "react";
import { axiosInstance } from "../../../api";
import { EmployerProps, SeekerProps } from "./types";
import SeekerForm from "./seeker";
import Employer from "./employer";
import { UserContext } from "../(context)/UserContext";

const MyProfile: React.FC = () => {
  const { state } = useContext(UserContext);

  const userType: "seeker" | "employer" | undefined = state.loginType;
  const userId = state.id;
  const [seekerData, setSeekerData] = useState<SeekerProps | null>(null);
  const [employerData, setEmployerData] = useState<EmployerProps | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    if (userType === "seeker") {
      const res = await axiosInstance.get(`/api/seeker/${userId}`);
      // console.log("seeker data ==> ", res.data);
      res.data?.seekers[0] != null && setSeekerData(res.data?.seekers[0]);
    } else if (userType === "employer") {
      const res = await axiosInstance.get(`/api/employerByUserId/${userId}`);
      // console.log("employer data ==> ", res.data);
      res.data.employers &&
        res.data?.employers[0] != null &&
        setEmployerData(res.data?.employers[0]);
    }
  };

  const renderForm = () => {
    return userType === "seeker"
      ? seekerData && <SeekerForm {...seekerData} />
      : employerData && <Employer {...employerData} />;
  };

  return <>{userType && renderForm()}</>;
};

export default MyProfile;
