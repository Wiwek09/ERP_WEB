import { Checkbox, FormControlLabel, Grid, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { DeleteDialog } from "../../../../components/dialogBox";
import { IUser } from "../../../../interfaces/user";
import { deleteUser, getAllUsers } from "../../../../services/userApi";
import {
  CloseButton,
  DeleteButton,
  SaveButton,
  UpdateButton,
} from "../../../../utils/buttons";
import InputField from "../../../../utils/customTextField";
import {
  deleteMessage,
  errorMessage,
} from "../../../../utils/messageBox/Messages";

interface IProps {
  id: string;
  onSubmit: (e: any) => void;
  userData: IUser;
  setUserData: any;
  confirmPassword: string;
  setConfirmPassword: any;
}

const InputFormUser = ({
  id,
  onSubmit,
  userData,
  setUserData,
  confirmPassword,
  setConfirmPassword,
}: IProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState(false);
  const history = useHistory();

  const deleteUserConfirm = async () => {
    const res = await deleteUser(id);
    if (res === 1) {
      setOpenDialog(false);
      deleteMessage();
      history.push("/users");
      return;
    } else {
      errorMessage();
      setOpenDialog(false);
    }
  };

  return (
    <>
      <Paper
        component="form"
        autoComplete="off"
        method="post"
        onSubmit={onSubmit}
        sx={{
          py: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid container maxWidth="lg" spacing={4}>
          <Grid item xs={12} md={6}>
            <InputField
              name="FirstName"
              type="string"
              label="First Name"
              value={userData.FirstName}
              onChange={(e) =>
                setUserData({ ...userData, [e.target.name]: e.target.value })
              }
              helperText="Enter first name"
              required
              autoFocus
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputField
              name="LastName"
              type="string"
              label="Last Name"
              value={userData.LastName}
              onChange={(e) =>
                setUserData({ ...userData, [e.target.name]: e.target.value })
              }
              helperText="Enter last name"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputField
              name="Email"
              type="email"
              label="Email"
              value={userData.Email}
              onChange={(e) =>
                setUserData({ ...userData, [e.target.name]: e.target.value })
              }
              helperText="Enter email"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputField
              name="UserName"
              type="string"
              label="UserName"
              value={userData.UserName}
              onChange={(e) =>
                setUserData({ ...userData, [e.target.name]: e.target.value })
              }
              helperText="Enter username"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputField
              name="Password"
              type={showPassword ? "text" : "password"}
              label="password"
              value={userData.Password}
              onChange={(e) =>
                setUserData({ ...userData, [e.target.name]: e.target.value })
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
            <InputField
              type="password"
              label="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              helperText="Enter confirm password"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
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
          <Grid item xs={12} sx={{ textAlign: "end", my: 3 }}>
            {id === "add" ? (
              <SaveButton variant="outlined" />
            ) : (
              <>
                <UpdateButton variant="outlined" />
                <DeleteButton
                  variant="outlined"
                  onClick={(e) => setOpenDialog(true)}
                />
              </>
            )}

            <CloseButton variant="outlined" />
          </Grid>
        </Grid>
        <DeleteDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          name={`${userData.FirstName} ${userData.LastName}`}
          deleteData={deleteUserConfirm}
        />
      </Paper>
    </>
  );
};

export default InputFormUser;
