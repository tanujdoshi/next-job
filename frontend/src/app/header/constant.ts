import { MenuType } from "./types";

export const NavOptions: MenuType[] = [
  {
    label: "Login",
    className: "nav-link-login",
    route: "/auth/login",
  },
  {
    label: "Sign Up",
    className: "nav-link-sign-up",
    route: "/auth/register",
  },
  {
    label: "Contact Us",
    route: "/contact-us",
  },
  {
    label: "FAQs",
    route: "/faq",
  },
];

export const EmployerNavOptions: MenuType[] = [
  {
    label: "Logout",
    className: "nav-link-sign-up",
    route: "/logout",
  },
  {
    label: "Contact Us",
    route: "/contact-us",
  },
  {
    label: "FAQs",
    route: "/faq",
  },
  {
    label: "Jobs",
    route: "/job-information",
  },
  {
    label: "Create Job",
    route: "/job-posting",
  },
  {
    label: "My Profile",
    route: "/my-profile",
  },
  {
    label: "Dashboard",
    route: "/dashboard",
  },
];

export const SeekerNavOptions: MenuType[] = [
  {
    label: "Logout",
    className: "nav-link-sign-up",
    route: "/logout",
  },
  {
    label: "Contact Us",
    route: "/contact-us",
  },
  {
    label: "FAQs",
    route: "/faq",
  },
  {
    label: "Companies",
    route: "/CompaniesList",
  },
  {
    label: "Job by Location",
    route: "/home/jobRadius",
  },
  {
    label: "Jobs",
    route: "/job-listings",
  },
  {
    label: "My Profile",
    route: "/my-profile",
  },
  {
    label: "Dashboard",
    route: "/dashboard",
  },
];
