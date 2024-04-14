import { Grid, Typography } from "@mui/material";

const RowHeaderPurchaseReturn = () => {
  return (
    <>
      <Grid
        container
        sx={{
          mt: 4,
          mx: "auto",
          p: 1,
          bgcolor: "primary.main",
          borderRadius: "8px",
        }}
      >
        <Grid sm={4}>
          <Typography sx={{ color: "#f4f4f4" }}>Products/Services</Typography>
        </Grid>
        <Grid sm={2}>
          <Typography sx={{ color: "#f4f4f4" }}>Quantity</Typography>
        </Grid>
        <Grid sm={2}>
          <Typography sx={{ color: "#f4f4f4" }}>Price</Typography>
        </Grid>

        <Grid sm={2}>
          <Typography sx={{ color: "#f4f4f4" }}>Amount</Typography>
        </Grid>
        <Grid sm={1}>
          <Typography sx={{ color: "#f4f4f4" }}>Action</Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default RowHeaderPurchaseReturn;
