import { Grid, TextField, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { IOnChange } from "../../../../interfaces/event";
import { CloseButton, UpdateButton } from "../../../../utils/buttons";

const useStyles = makeStyles({
  text: {
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  grid: {
    display: "flex",
    alignItems: "center",
  },
  rightFloat: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});

const RightSide = ({ input, setInput, error }: any) => {
  const classes = useStyles();

  const inputHandler = (e: any) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Grid container spacing={3} className={classes.rightFloat}>
        <Grid item xs={12}>
          <Typography className={classes.text}>Change Password</Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={12}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <TextField
            size="small"
            fullWidth
            required
            autoFocus
            type="password"
            error={!input.CurrentPassword}
            helperText={
              input.CurrentPassword === ""
                ? "Enter passwword"
                : error
                ? "Invalid Password"
                : "Enter old password"
            }
            name="CurrentPassword"
            label="Current Password"
            placeholder="Current Password"
            value={input.CurrentPassword}
            onChange={(e: IOnChange) => inputHandler(e)}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={12}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <TextField
            size="small"
            fullWidth
            required
            type="password"
            error={!input.NewPassword || input.NewPassword.length < 6}
            helperText={
              input.NewPassword === ""
                ? "Enter new password"
                : input.NewPassword.length < 6
                ? "Password must be 6 characters"
                : "Verified"
            }
            name="NewPassword"
            label="New Password"
            placeholder="New Password"
            value={input.NewPassword}
            onChange={(e) => inputHandler(e)}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <UpdateButton
            variant="outlined"
            sx={{ px: 1, my: { lg: 1, md: 1 } }}
          />
          <CloseButton variant="outlined" />
        </Grid>
      </Grid>
    </>
  );
};

export default RightSide;
