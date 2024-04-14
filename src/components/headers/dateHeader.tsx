import { Avatar, Divider, Grid, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useAppSelector } from "../../app/hooks";
import { selectCompany } from "../../features/companySlice";
import { getCurrentFinancialYear } from "../../features/financialYearSlice";

const fontStyle = makeStyles({
  headerFont: {
    fontSize: "1.1rem",
    fontWeight: "bold",
  },
  otherFont: {
    fontSize: "0.9rem",
    marginTop: 1,
  },
});
interface IProps {
  headerName: string;
  date?: any;
}
const DateHeader = ({ headerName, date }: IProps) => {
  const CompanyData = useAppSelector(selectCompany);
  const { NepaliStartDate, NepaliEndDate } = useAppSelector(
    getCurrentFinancialYear
  );

  const classes = fontStyle();

  return (
    <>
      <Paper
        sx={{
          width: "100%",
          mx: "auto",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          display: "flex",
          justifyContent: "center",
          py: 1,
        }}
      >
        <Grid container>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Avatar
              alt="DCUBE Logo"
              src={
                CompanyData?.PhotoIdentity
                  ? 'data:image/png;base64,' + CompanyData.PhotoIdentity
                  : "/Assets/logo.png"
              }
              sx={{ width: 60, height: 60 }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p className={classes.headerFont}>
              {CompanyData && CompanyData.NameEnglish
                ? CompanyData.NameEnglish
                : "..."}
            </p>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p className={classes.otherFont}>{headerName}</p>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p className={classes.otherFont}>
              {date
                ? date.StartDate + " - " + date.EndDate
                : NepaliStartDate + " - " + NepaliEndDate}
            </p>
          </Grid>
        </Grid>
      </Paper>
      <Divider />
    </>
  );
};

export default DateHeader;
