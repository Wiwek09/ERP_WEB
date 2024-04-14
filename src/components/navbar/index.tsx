import React, { useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useHistory } from "react-router";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import AccountCirle from "@mui/icons-material/AccountCircle";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import NestedList from "./components/sideNavMenu";
import StyledLink from "../../utils/link/styledLink";
import { changeTheme } from "../../features/themeSlice";
import { clearUserAction } from "../../features/userSlice";
import { clearRememberUserAction } from "../../features/userRememberSlice";
import { BiLogInCircle } from "react-icons/bi";
import { Avatar, Divider } from "@mui/material";
import { getCurrentFinancialYear } from "../../features/financialYearSlice";
import logo from "../../dcube.jpg";
const drawerWidth = 265;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

interface IProps {
  children: React.ReactNode;
}

const NavDrawer = ({ children }: IProps) => {
  const theme = useTheme();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(true);
  const currentTheme = useAppSelector((state) => state.theme.value);
  const userName = useAppSelector((state) => state.user.data.UserName);
  const companyName = useAppSelector((state) => state.company.data);
  const { Name } = useAppSelector(getCurrentFinancialYear);

  var width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  useEffect(() => {
    if (width < 1248) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const logout = (): void => {
    dispatch(clearUserAction());
    dispatch(clearRememberUserAction());
    history.push("/login");
  };

  // window.onresize = function () {
  //   if (window.innerWidth < 1248) {
  //     setOpen(false);
  //   } else {
  //     setOpen(true);
  //   }
  // };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <StyledLink to="/">
              <Avatar
                alt="Remy Sharp"
                src={
                  companyName?.PhotoIdentity
                    ? 'data:image/png;base64,' + companyName?.PhotoIdentity
                    : "/Assets/logo.png"
                }
                sx={{
                  width: 30,
                  height: 30,
                  mx: 1,
                  display: { md: "inline-block", xs: "none" },
                }}
              />
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  fontWeight: "400",
                  color: "text.light",
                  display: { md: "inline-block", xs: "none" },
                }}
              >
                {companyName?.NameEnglish}
              </Typography>
            </StyledLink>
            <Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "400",
                  color: "text.light",
                  display: { md: "inline-block", xs: "none" },
                }}
              >
                Financial Year : {Name}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <IconButton color="inherit" edge="start">
                  <AccountCirle />
                </IconButton>
                <Typography variant="subtitle1" component="div">
                  {userName}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  marginX: "30px",
                }}
                onClick={logout}
              >
                <IconButton color="inherit" edge="start">
                  <BiLogInCircle />
                </IconButton>
                <Typography variant="subtitle1" component="div">
                  Log Out
                </Typography>
              </Box>
              <Typography>
                {currentTheme === "dark" ? (
                  <IconButton
                    sx={{ ml: 1 }}
                    color="inherit"
                    onClick={() => dispatch(changeTheme("light"))}
                  >
                    <Brightness7Icon />
                  </IconButton>
                ) : (
                  <IconButton
                    sx={{ ml: 1 }}
                    color="inherit"
                    onClick={() => dispatch(changeTheme("dark"))}
                  >
                    <Brightness4Icon />
                  </IconButton>
                )}
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          border: "none",

          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Avatar
            alt="Remy Sharp"
            // src={
            //   companyName?.PhotoIdentity
            //     ? companyName?.PhotoIdentity
            //     : "/Assets/Logo.png"
            // }
            src = {logo}
            sx={{
              width: 50,
              height: 50,
              mx: 1,
              margin: "auto",
              display: { md: "inline-block", xs: "none" },
            }}
          />
          {/* <Typography variant="h6" sx={{ fontWeight: "500", margin: "auto" }}>
            Dashboardss
          </Typography> */}
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <NestedList />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
};

export default NavDrawer;
