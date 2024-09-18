"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { EmployerNavOptions, NavOptions, SeekerNavOptions } from "./constant";
import "./styles.css";
import { Alert, Snackbar } from "@mui/material";
import { UserContext } from "../(context)/UserContext";
import { MenuType } from "./types";
import { removeUserData } from "../(context)/LocatStorageManager";

const settings: { label: string; url?: string }[] = [
  { label: "Profile", url: "/my-profile" },
  { label: "Account" },
  { label: "Dashboard" },
  { label: "Logout" },
];

function ResponsiveAppBar() {
  const Router = useRouter();
  const { state, dispatch } = React.useContext(UserContext);
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);
  const navList: MenuType[] = [];
  if (state.loginType === "seeker") {
    navList.push(...SeekerNavOptions);
  } else if (state.loginType === "employer") {
    navList.push(...EmployerNavOptions);
  } else {
    navList.push(...NavOptions);
  }

  const [snackBarVisible, setSnackBarVisible] = React.useState(false);

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavClick = (route?: string) => {
    if (route === "/logout") {
      Router.push("/auth/login");
      dispatch({
        firstName: "",
        lastName: "",
        email: "",
        id: "",
        loginType: undefined,
      });
      removeUserData();
    } else route ? Router.push(route) : setSnackBarVisible(true);
    handleCloseNavMenu();
  };

  return (
    <AppBar position="sticky" sx={{ background: "white", color: "black" }}>
      <Container maxWidth="xl" style={{ maxWidth: "none" }}>
        {isHydrated && (
          <Toolbar disableGutters>
            <AdbIcon
              sx={{
                display: { xs: "none", md: "flex", fontSize: "32px" },
                mr: 1,
              }}
            />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
                fontSize: "1.5rem",
                "&:hover": {
                  color: "inherit",
                },
              }}
            >
              NEXT JOB
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {navList.map((page) => (
                  <MenuItem
                    key={page.label}
                    onClick={() => handleNavClick(page.route)}
                  >
                    <Typography textAlign="center">{page.label}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              NEXT JOB
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                flexDirection: "row-reverse",
              }}
            >
              {navList.map((page) => (
                <Button
                  className={page.className || "nav-link"}
                  key={page.label}
                  onClick={() => handleNavClick(page.route)}
                >
                  {page.label}
                </Button>
              ))}
            </Box>
          </Toolbar>
        )}
      </Container>
      <Snackbar
        open={snackBarVisible}
        autoHideDuration={6000}
        onClose={() => setSnackBarVisible(false)}
      >
        <Alert
          onClose={() => setSnackBarVisible(false)}
          sx={{ width: "100%" }}
          severity="info"
        >
          This feature is not available yet!
        </Alert>
      </Snackbar>
    </AppBar>
  );
}
export default ResponsiveAppBar;
