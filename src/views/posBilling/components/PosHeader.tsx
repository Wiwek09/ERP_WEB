import { Paper, Typography } from "@mui/material";

const PosHeader = () => {
  return (
    <Paper>
      <Typography sx={{ py: 2, px: 1, fontSize: 20, fontWeight: "bold" }}>
        POS billing
      </Typography>
    </Paper>
  );
};

export default PosHeader;
