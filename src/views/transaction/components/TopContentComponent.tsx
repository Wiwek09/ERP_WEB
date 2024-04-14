import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Autocomplete, IconButton, TextField, Tooltip } from "@mui/material";
import { BiLeftArrowCircle } from "react-icons/bi";
import { useHistory } from "react-router";
import InputField from "../../../utils/customTextField";
import { getAllBranch } from "../../../services/branchApi";
import { IBranch } from "../../../interfaces/branch";
import handleRenderOption from "../../../utils/autoSuggestHighlight";

interface IProps {
  headerName: string;
  voucherType: string;
  NVDate: string;
  setNVDate: any;
  values: number | 0;
  onClickHandler: (name: string, value: number | 0) => void;
}

interface ISelect {
  label: string;
  value: number;
}

const TopContent = ({
  headerName,
  voucherType,
  NVDate,
  setNVDate,
  values,
  onClickHandler,
}: IProps) => {
  const history = useHistory();

  const [branchList, setBranchList] = useState<any>([]);
  const getBranchList = async () => {
    const response = await getAllBranch();
    if (response) {
      setBranchList(
        response.map((item: IBranch) => ({
          label: item.NameEnglish,
          value: item.Id,
        }))
      );
    }
  };

  const selectedBranch = branchList.find(
    (obj: ISelect) => obj.value === values
  );

  useEffect(() => {
    getBranchList();
  }, []);

  const Item = styled(Box)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  return (
    <>
      <Grid
        spacing={2}
        sx={{
          display: "flex",
          alignItems: "center",
          px: { xs: 1, md: 2, lg: 3 },
        }}
        container
      >
        <Grid
          item
          xs={10}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <Item
            sx={{
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "secondary",
            }}
          >
            {headerName}
          </Item>
        </Grid>
        <Grid
          item
          xs={2}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Item
            sx={{
              fontSize: "2.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Tooltip title="Go Back" followCursor={true}>
              <IconButton sx={{ fontSize: "2.1rem" }} color="primary">
                <BiLeftArrowCircle
                  style={{ cursor: "pointer" }}
                  onClick={() => history.goBack()}
                />
              </IconButton>
            </Tooltip>
          </Item>
        </Grid>
      </Grid>
      <Grid
        spacing={2}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 1, md: 2, lg: 3 },
        }}
        container
      >
        <Grid
          item
          xs={8}
          md={3}
          sx={{
            display: "flex",
          }}
        >
          <InputField
            value={voucherType && voucherType}
            name="voucherType"
            label="Voucher Type"
            disabled
          />
        </Grid>
        <Grid
          item
          xs={8}
          md={3}
          sx={{
            display: "flex",
          }}
        >
          <Autocomplete
            size="small"
            fullWidth
            disablePortal
            options={branchList ? branchList : []}
            // value={selectedBranch ? selectedBranch.label : null}
            value={
               selectedBranch ? selectedBranch.label : ""}
            onChange={(e: any, v: ISelect | 0) => {
              onClickHandler("branch", v && v.value);
            }}
            isOptionEqualToValue={(option:ISelect, value:ISelect) =>
              option.value === value.value
            }
            disableClearable
            renderInput={(params) => (
              <TextField
                {...params}
                name="Branch"
                label="Branch"
                variant="outlined"
                required
              />
            )}
            renderOption={handleRenderOption}
          />
        </Grid>
        <Grid
          item
          xs={8}
          md={3}
          sx={{
            display: "flex",
          }}
        >
          <InputField
            helperText="format: YYYY.MM.DD"
            placeholder="YYYY.MM.DD"
            name="Date"
            label="Date"
            value={NVDate ? NVDate : ""}
            inputProps={{
              pattern:
                "([1-9][0-9]{3}.((0[1-9])|(1[0-2])).((0[1-9])|(1[0-9])|(2[0-9])|(3[0-2])))",
            }}
            onChange={(e) => setNVDate(e.target.value)}
            required
          />
        </Grid>
      </Grid>
    </>
  );
};

export default TopContent;
