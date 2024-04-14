import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useHistory } from "react-router";
import { LoginFailed, LoginSuccess } from "../../utils/messageBox/Messages";
import { Autocomplete, LinearProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { IUser, IUserLogin } from "../../interfaces/user";
import { getAllFinancialYearApi } from "../../services/financialYearApi";
import { IFinancialYear } from "../../interfaces/financialYear";
import { getCompanyApi } from "../../services/companyApi";
import { setCompanyAction } from "../../features/companySlice";
import { getAllUsers, verifyUser } from "../../services/userApi";
import { setUserAction } from "../../features/userSlice";
import { AxiosResponse } from "axios";
import {
  clearRememberUserAction,
  setRememberUserAction,
} from "../../features/userRememberSlice";
import { financialYearAction } from "../../features/financialYearSlice";
import CreateCompany from "../beforeLogin/company";
import AddFinancial from "../beforeLogin/financialYear/AddFinancial";
import AddUser from "./../beforeLogin/user/AddUser";

const Login = () => {
  const company = useAppSelector((state) => state.company.data);
  const loginedUserId = useAppSelector((state) => state.user.data.Id);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [userDetails, setUserDetails] = useState<IUser[]>([]);

  if (loginedUserId.length > 0) {
    history.push("/");
  }
  const [isAllDataLoaded, setIsAllDataLoaded] = useState<boolean>(true);
  const [financialYear, setFinancialYear] = useState<IFinancialYear[]>([]);

  const [loginData, setLoginData] = useState<IUserLogin>({
    UserName: "",
    Password: "",
    RememberMe: false,
    showPassword: false,
    financialYearValue: 0,
  });

  const getAllDetails = async () => {
    setIsAllDataLoaded(true);
    const response = await getAllUsers();
    if (response !== -1) {
      setUserDetails(response);
    }

    const response1 = await getAllFinancialYearApi();
    if (response1 !== -1) {
      setFinancialYear(response1);
    }

    const data = await getCompanyApi();
    if (data !== -1) {
      dispatch(setCompanyAction(data));
    }
    setIsAllDataLoaded(false);
  };

  useEffect(() => {
    getAllDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setAuthentication = async ({
    UserName,
    Password,
    financialYearValue,
    RememberMe,
  }: IUserLogin) => {
    try {
      const response: AxiosResponse<any, any> = await verifyUser({
        UserName: UserName,
        Password: Password,
      });
      dispatch(setUserAction(response.data));
      if (RememberMe) {
        dispatch(
          setRememberUserAction({
            UserName: UserName,
            Password: Password,
            RememberMe: RememberMe,
            financialYearValue: financialYearValue,
          })
        );
      }
      // Set Financial Year....
      const currentFinancialYear = financialYear.find(
        (data) => data.Id === loginData.financialYearValue
      );
      dispatch(
        financialYearAction({
          EndDate: currentFinancialYear ? currentFinancialYear.EndDate : "",
          Id: currentFinancialYear ? currentFinancialYear.Id : 0,
          Name: currentFinancialYear ? currentFinancialYear.Name : "",
          NepaliEndDate: currentFinancialYear
            ? currentFinancialYear.NepaliEndDate
            : "",
          NepaliStartDate: currentFinancialYear
            ? currentFinancialYear.NepaliStartDate
            : "",
          StartDate: currentFinancialYear ? currentFinancialYear.StartDate : "",
        })
      );

      history.push("/");
      return true;
    } catch {
      LoginFailed();
      dispatch(clearRememberUserAction());
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.clear();
    const response = await setAuthentication({ ...loginData });
    if (response === true) {
      LoginSuccess();
    }
  };

  if (isAllDataLoaded) {
    return <LinearProgress sx={{ marginTop: 3 }} />;
  } else if (company === undefined || company?.Id === 0) {
    return (
      <>
        <CreateCompany />
      </>
    );
  } else if (financialYear === undefined || financialYear?.length === 0) {
    return (
      <>
        <AddFinancial />
      </>
    );
  } else if (userDetails === undefined || userDetails?.length === 0) {
    return (
      <>
        <AddUser />
      </>
    );
  }
  return (
    <Container
      component="main"
      maxWidth="lg"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CssBaseline />
      <Box
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src={
            company?.PhotoIdentity
              ? "data:image/png;base64," + company.PhotoIdentity
              : "/Assets/logo.png"
          }
          style={{ width: "60px" }}
          alt="D"
        />

        <Typography variant="h4" sx={{ mt: 2 }}>
          {company.NameEnglish}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          autoComplete="off"
          sx={{ mt: 1 }}
        >
          <TextField
            size="small"
            margin="normal"
            required
            fullWidth
            label="Username"
            helperText="Enter Username"
            autoFocus
            value={loginData.UserName}
            onChange={(e) =>
              setLoginData({ ...loginData, UserName: e.target.value })
            }
            error={!loginData.UserName}
          />
          <TextField
            size="small"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            helperText="Enter Password"
            autoComplete="new-password"
            type={loginData.showPassword ? "text" : "password"}
            value={loginData.Password}
            error={!loginData.Password}
            onChange={(e) =>
              setLoginData({ ...loginData, Password: e.target.value })
            }
          />
          <Autocomplete
            options={
              financialYear &&
              financialYear.map((data) => {
                return {
                  label: `Financial Year - ${data.Name}`,
                  value: data.Id,
                };
              })
            }
            onChange={(e, v) =>
              setLoginData({ ...loginData, financialYearValue: v.value })
            }
            isOptionEqualToValue={(option, value) =>
              option.label === value.label
            }
            disableClearable
            renderInput={(params) => (
              <TextField
                {...params}
                label="Financial Year "
                variant="outlined"
                helperText="Select Financial Year"
                required
                size="small"
                error={!loginData.financialYearValue}
                fullWidth
                margin="normal"
              />
            )}
          />

          <FormControlLabel
            sx={{ mt: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={loginData.showPassword}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    showPassword: !loginData.showPassword,
                  })
                }
              />
            }
            label="Show Password"
          />
          <FormControlLabel
            sx={{ mt: 2 }}
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
            checked={loginData.RememberMe}
            onChange={() =>
              setLoginData({
                ...loginData,
                RememberMe: !loginData.RememberMe,
              })
            }
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
        <Typography sx={{ mt: 5, color: "grey" }}>
          © D. Cube I.T. Solution Pvt. Ltd, &nbsp;
          {"2014-" + new Date().getFullYear()}
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
