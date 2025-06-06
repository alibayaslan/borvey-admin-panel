import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import ErrorIcon from "@mui/icons-material/Error";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { useLocation } from "react-router-dom";

const mainListItems = [
  { text: "Anasayfa", icon: <HomeRoundedIcon />, path: "/" },
  { text: "Kullanıcılar", icon: <PeopleRoundedIcon />, path: "/users" },
  { text: "İlanlar", icon: <FileCopyIcon />, path: "/posts" },
  { text: "Teklifler", icon: <LocalOfferIcon />, path: "/offers" },
  { text: "İletişim", icon: <AlternateEmailIcon />, path: "/contact" },
  { text: "Bildiriler", icon: <ErrorIcon />, path: "/errors" },
  { text: "Site Ayarları", icon: <SettingsRoundedIcon />, path: "/settings" },
];

const secondaryListItems = [
  { text: "Settings", icon: <SettingsRoundedIcon /> },
  { text: "About", icon: <InfoRoundedIcon /> },
  { text: "Feedback", icon: <HelpRoundedIcon /> },
];

export default function MenuContent() {
  const location = useLocation();

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              href={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </Stack>
  );
}
