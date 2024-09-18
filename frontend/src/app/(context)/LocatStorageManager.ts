interface UserMeteData {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  companyId?: string;
  companyName?: string;
  loginType?: "seeker" | "employer";
  companyLogo?: string;
}

interface UserState extends UserMeteData {
  token: string;
}

export const setUserData = (data: UserState) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("firstName", data.firstName);
  localStorage.setItem("lastName", data.lastName);
  localStorage.setItem("email", data.email);
  localStorage.setItem("id", data.id);
  localStorage.setItem("companyId", data.companyId || "");
  localStorage.setItem("companyName", data.companyName || "");
  localStorage.setItem("loginType", data.loginType || "");
  localStorage.setItem("companyLogo", data.companyLogo || "");
};

export const getUserDataByName = (
  key:
    | "token"
    | "firstName"
    | "lastName"
    | "email"
    | "id"
    | "companyId"
    | "companyName"
    | "loginType"
    | "companyLogo"
) => {
  return localStorage.getItem(key);
};

export const setUserDataByName = (
  key:
    | "token"
    | "firstName"
    | "lastName"
    | "email"
    | "id"
    | "companyId"
    | "companyName"
    | "loginType"
    | "companyLogo", value: string
) => {
  return localStorage.setItem(key, value);
};

export const getUserDataFromLocal = (): UserMeteData => {
  if (typeof window === "undefined")
    return {
      firstName: "",
      lastName: "",
      email: "",
      id: "",
    };

  const user: UserMeteData = {
    firstName: localStorage.getItem("firstName") || "",
    lastName: localStorage.getItem("lastName") || "",
    email: localStorage.getItem("email") || "",
    id: localStorage.getItem("id") || "",
    companyId: localStorage.getItem("companyId") || "",
    companyName: localStorage.getItem("companyName") || "",
    companyLogo: localStorage.getItem("companyLogo") || "",
  };
  const loginType = localStorage.getItem("loginType");
  if (loginType) {
    if (loginType === "seeker") user.loginType = "seeker";
    else if (loginType === "employer") user.loginType = "employer";
  }

  return user;
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const removeUserData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("firstName");
  localStorage.removeItem("lastName");
  localStorage.removeItem("email");
  localStorage.removeItem("id");
  localStorage.removeItem("companyId");
  localStorage.removeItem("companyName");
  localStorage.removeItem("companyLogo");
  localStorage.removeItem("loginType");
};
