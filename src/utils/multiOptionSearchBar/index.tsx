import { Autocomplete, TextField, Grid } from "@mui/material";
import { useState } from "react";

const MultiOptionSearchBar = ({ searchOptions, searchData, setData }: any) => {
  const [searchOption, setSearchOption] = useState(searchOptions[0]);
  return (
    <Grid
      spacing={2}
      sx={{ display: "flex", alignItems: "center", px: 1 }}
      container
    >
      <Grid item xs={2}>
        <Autocomplete
          disablePortal
          disableClearable
          size="small"
          value={searchOption}
          onChange={(event: any, newValue: string | null) => {
            setSearchOption(newValue);
          }}
          id="search-options"
          options={searchOptions}
          renderInput={(params) => (
            <TextField {...params} label="Search Options" />
          )}
        />
      </Grid>
      <Grid item xs={10}>
        <TextField
          label="Search Text"
          name="Search Bar"
          size="small"
          fullWidth
          onChange={(e) => {
            const filteredData = searchData.filter((data: any) => {
              if (data[`${searchOption}`] === null) {
                data[`${searchOption}`] = "";
              }
              return data[`${searchOption}`]
                .toLowerCase()
                .includes(e.target.value.toLowerCase());
            });
            setData(filteredData);
          }}
        />
      </Grid>
    </Grid>
  );
};

export default MultiOptionSearchBar;
