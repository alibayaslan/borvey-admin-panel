import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import style from "./layout.module.scss";

import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import AppNavbar from "../containers/Dashboard/components/AppNavbar";
import Header from "../containers/Dashboard/components/Header";
import SideMenu from "../containers/Dashboard/components/SideMenu";
import AppTheme from "../containers/shared-theme/AppTheme";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "../containers/Dashboard/theme/customizations";

const UserMenuData = [
  {
    title: "İlanlar",
    path: "/ilanlarim",
    // icon: <MenuIcon type={"ilanlar"} />,
  },

  {
    title: "Teklifler",
    path: "/teklifler",
    // icon: <MenuIcon type={"ilanlar"} />,
  },
  {
    title: "Mesaj",
    path: "/mesaj",
    // icon: <MenuIcon type={"ilanlar"} />,
  },
  {
    title: "Ayarlar",
    path: "/profil",
    // icon: <MenuIcon type={"ilanlar"} />,
    subMenu: [
      {
        title: "Profil",
        path: "/profil",
      },
      {
        title: "Güvenlik ve Şifre",
        path: "/guvenlik",
      },
    ],
  },
];

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

const Layout = (props) => {
  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenu />
        <AppNavbar />
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            <Outlet />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
};

export default Layout;
