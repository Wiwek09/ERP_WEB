import { Grid, Paper } from "@mui/material";
import { useState } from "react";
import LeftSide from "./components/leftSide";
import RightSide from "./components/rightSide";
import { useHistory } from "react-router";
import FormHeader from "../../../components/headers/formHeader";
import { editUser, getUserApi } from "../../../services/userApi";
import { selectUser } from "../../../features/userSlice";
import { useAppSelector } from "../../../app/hooks";
import { editMessage, errorMessage } from "../../../utils/messageBox/Messages";

const ChangePassword = () => {
  const UserDetail = useAppSelector(selectUser);

  const [input, setInput] = useState({
    CurrentPassword: "",
    NewPassword: "",
  });

  const history = useHistory();

  const [error, seterror] = useState(false);

  const updatePassword = async (e: any) => {
    e.preventDefault();

    if (UserDetail.Password !== input.CurrentPassword) {
      seterror(true);
      errorMessage("Current Password Invalid");
    } else {
      const id = UserDetail.Id;
      seterror(false);

      const res1 = await getUserApi(UserDetail.Id);
      let data = { ...res1 };
      data["Password"] = input.NewPassword;

      const res = await editUser(id, data);
      if (res) {
        setInput({
          CurrentPassword: "",
          NewPassword: "",
        });
        editMessage();
        history.push("/users");
      } else {
        errorMessage();
      }
    }
  };

  return (
    <>
      <FormHeader headerName="Change Password" />

      <Paper
        elevation={2}
        sx={{ my: 3, px: 3, py: 5 }}
        component="form"
        onSubmit={updatePassword}
      >
        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Grid
            item
            lg={3}
            md={6}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <LeftSide UserDetail={UserDetail} />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: { lg: 0, md: 0, xs: 3 },
            }}
          >
            <RightSide
              UserDetail={UserDetail}
              setInput={setInput}
              input={input}
              error={error}
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default ChangePassword;
