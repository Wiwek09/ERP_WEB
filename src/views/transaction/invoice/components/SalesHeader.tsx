import { Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { useHistory } from "react-router";
import { IOnSubmit } from "../../../../interfaces/event";

interface IProps {
  startDate: string | null;
  endDate: string | null;
  filterOnClick: (e: IOnSubmit) => void;
  updateDateData: (name: string, value: string) => void;
}

const SalesHeader = ({
  startDate,
  endDate,
  filterOnClick,
  updateDateData,
}: IProps) => {
  const history = useHistory();

  const openAddPage = () => {
    history.push("/invoice/add");
  };

  return (
    <>
      <Paper sx={{ padding: 2 }} component="form" onSubmit={filterOnClick}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={2}>
            <Typography
              sx={{
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              Sales
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="From date"
              size="small"
              fullWidth={true}
              value={startDate}
              required
              onChange={(e) => updateDateData("startDate", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="To date"
              size="small"
              fullWidth={true}
              value={endDate}
              required
              onChange={(e) => updateDateData("endDate", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button type="submit" variant="outlined">
              Go
            </Button>
            <Button
              type="button"
              variant="outlined"
              sx={{ marginLeft: 3 }}
              onClick={openAddPage}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default SalesHeader;
