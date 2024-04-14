import { Grid, TextField,FormControlLabel,Checkbox } from "@mui/material";

const InputAddress = ({ allData, setAllData }: any) => {
  const inputHandler = (e: any) => {
    setAllData({
      ...allData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Grid container maxWidth="lg" spacing={2} sx={{ mx: "auto" }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            size="small"
            helperText="Please enter address"
            name="Address"
            label="Address"
            autoFocus
            value={allData.Address ? allData.Address : ""}
            onChange={inputHandler}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            size="small"
            helperText="Please enter district"
            name="District"
            label="District"
            value={allData.District ? allData.District : ""}
            onChange={inputHandler}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            size="small"
            helperText="Please enter city"
            name="City"
            label="City"
            value={allData.City ? allData.City : ""}
            onChange={inputHandler}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            size="small"
            helperText="Please enter street"
            name="Street"
            label="Street"
            value={allData.Street ? allData.Street : ""}
            onChange={inputHandler}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            size="small"
            helperText="Please enter pan no"
            name="PanNo"
            label="PanNo"
            value={allData.PanNo ? allData.PanNo : ""}
            onChange={inputHandler}
          />
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.IsVAT}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    IsVAT: !allData.IsVAT,
                  })
                }
              />
            }
            label="VAT"
          />
        </Grid>
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <FormControlLabel
            sx={{ px: 2 }}
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={allData.IsExcise}
                onChange={(e) =>
                  setAllData({
                    ...allData,
                    IsExcise: !allData.IsExcise,
                  })
                }
              />
            }
            label="Excise"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            size="small"
            helperText="Please enter telephone"
            type="tel"
            name="Telephone"
            label="Telephone"
            value={allData.Telephone ? allData.Telephone : ""}
            onChange={inputHandler}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            size="small"
            helperText="Please enter email"
            type="email"
            name="Email"
            label="Email"
            value={allData.Email ? allData.Email : ""}
            onChange={inputHandler}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default InputAddress;
