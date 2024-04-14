import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { INavMenu } from "../../../interfaces/nav";
import StyledLink from "../../../utils/link/styledLink";
import { Divider, Typography } from "@mui/material";

const NavDrawer = (data: INavMenu) => {
  const { name, path, subItem } = data;
  const [open, setOpen] = useState<boolean>(false);

  const handleClick = () => {
    setOpen(!open);
  };
  if (subItem) {
    return (
      <>
        <ListItemButton onClick={handleClick} sx={{ py: 2 }}>
          <ListItemIcon sx={{ fontSize: "22px", color: "text.primary" }}>
            <data.icon />
          </ListItemIcon>
          <ListItemText
            disableTypography
            primary={
              <Typography
                color="text.primary"
                variant="body2"
                sx={{ fontSize: "15px" }}
              >
                {name}
              </Typography>
            }
          />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Divider />
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {subItem.map((nav, index) => (
              <StyledLink to={nav.path} key={index}>
                <ListItemButton sx={{ pl: 4, py: 2 }} key={nav.name}>
                  <ListItemIcon
                    sx={{ fontSize: "19px", color: "text.primary" }}
                  >
                    <nav.icon />
                  </ListItemIcon>
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "14px" }}
                    color="text.primary"
                  >
                    {nav.name}
                  </Typography>
                </ListItemButton>
              </StyledLink>
            ))}
          </List>
        </Collapse>
      </>
    );
  }
  return (
    <>
      <StyledLink to={path ? path : "#"}>
        <ListItemButton sx={{ py: 2 }}>
          <ListItemIcon sx={{ fontSize: "22px", color: "text.primary" }}>
            <data.icon />
          </ListItemIcon>
          <ListItemText
            disableTypography
            primary={
              <Typography
                variant="body2"
                sx={{
                  fontSize: "15px",
                  color: "text.primary",
                }}
              >
                {name}
              </Typography>
            }
          />
        </ListItemButton>
      </StyledLink>
      <Divider />
    </>
  );
};

export default NavDrawer;
