import { Grid, Typography } from "@mui/material";

const RowHeaderSalesReturn = () => {
  return (
    <>
      <Grid
        spacing={1}
        container
        sx={{
          mt: 4,
          mx: "auto",
          p: 1,
          bgcolor: "primary.main",
          borderRadius: "8px",
          display: { md: "flex", xs: "none" },
        }}
      >
        <Grid sm={4} sx={{ marginRight: 1 }}>
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

export default RowHeaderSalesReturn;
