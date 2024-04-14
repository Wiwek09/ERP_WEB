import { Box, Grid, Paper, TextField, Typography } from "@mui/material";
import { version } from "process";
import React, { useState } from "react";
import { IGrandDetails } from "../interface";

interface IProps {
  amount: IGrandDetails;
  setPayAmt: any;
  payAmt: any;
}
const GetReturnBox = ({ amount, setPayAmt, payAmt }: IProps) => {
  return (
    <>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Box sx={{ display: "inline-block", width: "100%" }}>
          <Grid container spacing={2}>
            <Grid item xs={6}></Grid>
            <Grid item xs={6}>
              <TextField
                label="Pay Amount"
                variant="outlined"
                fullWidth
                size="small"
                type="number"
                InputProps={{ inputProps: { min: "" } }}
                value={payAmt}
                onChange={(e) => setPayAmt(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>
                Refund Amount:
              </Typography>
            </Grid>
            <Grid item xs={6}>
              {Number(payAmt) === 0 ? (
                <Typography
                  sx={{ fontSize: 16, fontWeight: "bold", textAlign: "end" }}
                >
                  Rs. {Math.abs(Number(payAmt))}
                </Typography>
              ) : Number(amount.total) - Number(payAmt) < 0 ? (
                <Typography
                  sx={{ fontSize: 16, fontWeight: "bold", textAlign: "end" }}
                >
                  Rs.{" "}
                  {(
                    Number(payAmt) -
                    Number(amount.amount + amount.tax - amount.discount)
                  ).toFixed(2)}
                </Typography>
              ) : (
                <Typography
                  sx={{ fontSize: 16, fontWeight: "bold", textAlign: "end" }}
                >
                  Rs.{" "}
                  {(
                    Number(payAmt) -
                    Number(amount.amount + amount.tax - amount.discount)
                  ).toFixed(2)}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </>
  );
};

export default GetReturnBox;
