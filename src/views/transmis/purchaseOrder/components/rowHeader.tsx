import { Grid, Typography } from "@mui/material";

const RowHeader = () => {
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
          display: { md: "flex", xs: "none" },
        }}
      >
        <Grid sm={5} sx={{ px: 1 }}>
          <Typography sx={{ color: "#f4f4f4" }}>Products</Typography>
        </Grid>
        <Grid sm={2} sx={{ px: 2 }}>
          <Typography sx={{ color: "#f4f4f4" }}>Quantity</Typography>
        </Grid>
        <Grid sm={2} sx={{ px: 2 }}>
          <Typography sx={{ color: "#f4f4f4" }}>Price</Typography>
        </Grid>
        <Grid sm={2} sx={{ px: 2 }}>
          <Typography sx={{ color: "#f4f4f4" }}>Amount</Typography>
        </Grid>
        <Grid sm={1} sx={{ px: 2 }}>
          <Typography sx={{ color: "#f4f4f4" }}>Action</Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default RowHeader;
