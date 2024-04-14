import { Button, Grid, Paper } from "@mui/material";

interface IProps {
  reset: () => void;
  payNow: () => void;
  paydis: boolean;
}

const PosBtnContainer = ({ reset, paydis, payNow }: IProps) => {
  return (
    <>
      <Paper sx={{ mt: 2, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Button fullWidth variant="outlined" color="error" onClick={reset}>
              Reset
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            {paydis === true ? (
              <Button fullWidth variant="outlined" disabled>
                Pay now
              </Button>
            ) : (
              <Button fullWidth variant="outlined" onClick={payNow}>
                Pay now
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default PosBtnContainer;
