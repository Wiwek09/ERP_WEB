import { Autocomplete, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { ISelectType } from "../../../interfaces/autoComplete";
import { getMonthApi } from "../../../services/materializeViewApi";

interface IMonth {
  Id: number;
  Name: string;
}

const DateSelection = ({ dateOnChange, dateValues }: any) => {
  const [dateValue, setDateValue] = useState<ISelectType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    const loadData = async () => {
      const res: IMonth[] = await getMonthApi();
      setDateValue(
        res.map((item) => {
          return { label: item.Name, value: item.Name };
        })
      );
    };
    loadData();
  }, []);
  return (
    <>
      <Grid
            item
            xs={12}
            md={12}
            lg={12}
            xl={12}
            sx={{
              display: "flex",
              justifyContent: {
                xs: "center",
                lg: "flex-start",
              },
            }}
          >
          <Autocomplete
            sx={{ width: "100%" }}
            disablePortal
            options={dateValue}
            onChange={(e, v) => dateOnChange(v)}
            disableClearable
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Month"
                variant="outlined"
                size="small"
                required
                error={!dateValues}
                fullWidth
                helperText="Please Choose Month"
              />
            )}
          />
        </Grid>
    </>
  );
};

export default DateSelection;
