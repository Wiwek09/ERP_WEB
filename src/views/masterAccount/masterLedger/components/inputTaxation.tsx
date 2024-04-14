import { Autocomplete, Grid, TextField } from "@mui/material";

const InputTaxation = ({ allData, setAllData }: any) => {
  return (
    <>
      <Grid container maxWidth="lg" spacing={2} sx={{ mx: "auto" }}>
        <Grid item xs={12} md={6}>
          <Autocomplete
            disablePortal
            options={[
              {
                label: "tax",
                value: "tax",
              },
            ]}
            isOptionEqualToValue={(option, value) =>
              option.label === value.label
            }
            disableClearable
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tax Classification Name *"
                variant="outlined"
                size="small"
                fullWidth
                helperText="Please choose tax calssification name"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            disablePortal
            options={[
              {
                label: "tax",
                value: "tax",
              },
            ]}
            isOptionEqualToValue={(option, value) =>
              option.label === value.label
            }
            disableClearable
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tax Classification Name *"
                variant="outlined"
                size="small"
                fullWidth
                helperText="Please choose tax calssification name"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            disablePortal
            options={[
              {
                label: "tax",
                value: "tax",
              },
            ]}
            isOptionEqualToValue={(option, value) =>
              option.label === value.label
            }
            disableClearable
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tax Rate *"
                variant="outlined"
                size="small"
                fullWidth
                helperText="Please choose tax rate"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            disablePortal
            options={[
              {
                label: "tax",
                value: "tax",
              },
            ]}
            isOptionEqualToValue={(option, value) =>
              option.label === value.label
            }
            disableClearable
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tax Classification Name *"
                variant="outlined"
                size="small"
                fullWidth
                helperText="Please choose nature of purchase"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            disablePortal
            options={[
              {
                label: "tax",
                value: "tax",
              },
            ]}
            isOptionEqualToValue={(option, value) =>
              option.label === value.label
            }
            disableClearable
            renderInput={(params) => (
              <TextField
                {...params}
                label="TDS deductee type*"
                variant="outlined"
                size="small"
                fullWidth
                helperText="Please choose tds deductee type"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            disablePortal
            options={[
              {
                label: "tds",
                value: "tds",
              },
            ]}
            isOptionEqualToValue={(option, value) =>
              option.label === value.label
            }
            disableClearable
            renderInput={(params) => (
              <TextField
                {...params}
                label="TDS Rate Name *"
                variant="outlined"
                size="small"
                fullWidth
                helperText="Please choose tds rate name"
              />
            )}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default InputTaxation;
