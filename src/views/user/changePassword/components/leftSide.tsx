import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { BiUserCircle } from "react-icons/bi";
import { AiOutlineMail } from "react-icons/ai";
import { Box } from "@mui/system";

const useStyles = makeStyles({
  text: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    padding: 0,
    margin: 0,
    marginBottom: "25px",
  },
  grid: {
    display: "flex",
    alignItems: "center",
  },
  span: {
    fontSize: "1rem",
    fontWeight: "bold",
  },
  gap: {
    margin: "0 20px 20px 0",
  },
});

const LeftSide = ({ UserDetail }: any) => {
  const classes = useStyles();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          // bgcolor: "primary.main",
          width: "100%",
        }}
      >
        <Typography className={classes.text}>User Details</Typography>
        <Typography className={classes.gap}>
          <span className={classes.span}>
            <BiUserCircle /> &nbsp; Name :
          </span>
          &nbsp;
          {UserDetail.FirstName + " " + UserDetail.LastName}
        </Typography>
        <Typography className={classes.gap}>
          <span className={classes.span}>
            {" "}
            <AiOutlineMail /> &nbsp; Email :&nbsp;
          </span>

          {UserDetail.Email}
        </Typography>
        <Typography className={classes.gap}>
          <span className={classes.span}>
            <AiOutlineMail /> &nbsp; Username :&nbsp;
          </span>

          {UserDetail.UserName}
        </Typography>
      </Box>
    </>
  );
};

export default LeftSide;
