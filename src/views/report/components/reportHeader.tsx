import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {
  Button,
  ButtonGroup,
  TextField,
  Typography,
} from "@mui/material";
import { BiSearch } from "react-icons/bi";
import { ISelectType } from "../../../interfaces/autoComplete";

interface ISmallTableHeader {
  dateChoose: any;
  setDateChoose: any;
  getDataInSearch: any;
}

const GridReportHeader = ({
  dateChoose,
  setDateChoose,
  getDataInSearch,
}: ISmallTableHeader) => {
  return (
    <>
      <Grid
        item
        xs={12}
        md={12}
        lg={3}
        xl={2}
        sx={{
          marginTop: 2,
          display: "flex",
          justifyContent: {
            xs: "center",
            lg: "flex-start",
          },
        }}
      >
        <TextField
          helperText="format: YYYY.MM.DD"
          label="Select From Date"
          required
          name="StartDate"
          size="small"
          inputProps={{
            pattern:
              "([1-9][0-9]{3}.((0[1-9])|(1[0-2])).((0[1-9])|(1[0-9])|(2[0-9])|(3[0-2])))",
          }}
          fullWidth
          value={dateChoose.StartDate ? dateChoose.StartDate : ""}
          onChange={(e) =>
            setDateChoose({
              ...dateChoose,
              [e.target.name]: e.target.value,
            })
          }
        />
      </Grid>
      <Grid
        item
        xs={12}
        md={12}
        lg={3}
        xl={2}
        sx={{
          marginTop: 2,
          display: "flex",
          justifyContent: {
            xs: "center",
            lg: "flex-start",
          },
        }}
      >
        <TextField
          helperText="format: YYYY.MM.DD"
          label="Select To Date"
          required
          name="EndDate"
          size="small"
          inputProps={{
            pattern:
              "([1-9][0-9]{3}.((0[1-9])|(1[0-2])).((0[1-9])|(1[0-9])|(2[0-9])|(3[0-2])))",
          }}
          fullWidth
          value={dateChoose.EndDate}
          onChange={(e) =>
            setDateChoose({
              ...dateChoose,
              [e.target.name]: e.target.value,
            })
          }
        />
      </Grid>

      <Grid item lg={1} md={6}>
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            justifyContent: {
              xs: "center",
            },
          }}
        >
          <Button
            type="submit"
            variant="contained"
            size="small"
            color="success"
            startIcon={<BiSearch />}
            onClick={getDataInSearch}
          >
            GO
          </Button>
          
        </Box>
      </Grid>
    </>
  );
};
export default GridReportHeader;
