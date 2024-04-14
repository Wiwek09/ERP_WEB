import {
  Avatar,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { IUser } from "../../../interfaces/user";
import { SaveButton } from "../../../utils/buttons";

interface IProps {
  userData: IUser;
  setUserData: any;
  confirmPassword: string;
  setConfirmPassword: any;
  onSubmit: any;
}

const UserForm = ({
  userData,
  setUserData,
  confirmPassword,
  setConfirmPassword,
  onSubmit,
}: IProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <>
      <Box
        sx={{
          minHeight: "92vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 1,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "1200px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Grid container>
            <Grid
              lg={6}
              md={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRight: "1px solid rgba(224, 224, 224, 1)",
                borderBottom: "1px solid rgba(224, 224, 224, 1)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 2,
                }}
              >
                <Typography variant="h4" sx={{ my: 2 }} color="primary.main">
                  Welcome to D. Cube I.T. Solution Pvt. Ltd.
                </Typography>
                <Typography variant="body2">
                  Start by adding superuser
                </Typography>
                <Avatar
                  src="/Assets/createUser.png"
                  variant="square"
                  sx={{
                    width: "80%",
                    height: "100%",
                    display: { xs: "none", md: "block" },
                  }}
                />
              </Box>
            </Grid>
            <Grid
              lg={6}
              md={6}
              xs={12}
              sx={{
                px: 2,
              }}
            >
              <Box
                component="form"
                autoComplete="off"
                onSubmit={onSubmit}
                sx={{
                  px: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Grid container spacing={2}>
                  <Grid xs={12} sx={{ px: 2, mt: 6 }}>
                    <Typography color="primary.main" variant="h6">
                      Superuser Details
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      name="FirstName"
                      type="string"
                      label="First Name"
                      value={userData.FirstName}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      helperText="Enter first name"
                      required
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      name="LastName"
                      type="string"
                      label="Last Name"
                      value={userData.LastName}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      helperText="Enter last name"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      name="Email"
                      type="email"
                      label="Email"
                      value={userData.Email}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      helperText="Enter email"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      name="UserName"
                      type="string"
                      label="UserName"
                      value={userData.UserName}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      helperText="Enter username"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      name="Password"
                      type={showPassword ? "text" : "password"}
                      label="password"
                      value={userData.Password}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          [e.target.name]: e.target.value,
                        })
                      }
                      helperText={
                        userData.Password === ""
                          ? "Enter password atlest 6 character"
                          : userData.Password.length < 6
                          ? "Password must be atlest 6 character"
                          : "Enter password"
                      }
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      type="password"
                      label="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      helperText="Enter confirm password"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      label="Show Password"
                      control={
                        <Checkbox
                          onChange={(e) => setShowPassword(!showPassword)}
                          sx={{
                            color: "primary.main",
                            "&.Mui-checked": { color: "primary.main" },
                          }}
                          size="small"
                          checked={showPassword}
                        />
                      }
                    />
                    <FormControlLabel
                      label="Active"
                      control={
                        <Checkbox
                          sx={{
                            color: "primary.main",
                            "&.Mui-checked": { color: "primary.main" },
                          }}
                          size="small"
                          checked={userData.IsActive}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              IsActive: !userData.IsActive,
                            })
                          }
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ textAlign: "start", my: 3 }}>
                    <SaveButton variant="contained" />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default UserForm;
