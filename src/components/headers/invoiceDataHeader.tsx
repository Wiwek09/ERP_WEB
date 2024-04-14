import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {
  Autocomplete,
  Button,
  ButtonGroup,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { BiSearch } from "react-icons/bi";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { getAllBranch } from "../../services/branchApi";
import { IBranch } from "../../interfaces/branch";
import { ISelectType } from "../../interfaces/autoComplete";
import { AddPageBtn, ExcelBtn, PDFBtn, PdfBtn } from "../../utils/buttons";
import { getNepaliDate } from "../../utils/nepaliDate";

interface ISmallTableHeader {
  branch?: number;
  // setBranch?: any;
  onClickHandler: (name: string, value: number | 0) => void;
  billNoChange: (value: string | "") => void;
  billNo: string;
  headerName?: string;
  pdf?: string;
  excel?: string;
  path?: string;
  print?: string;
  addDisable?: boolean;
  dateChoose: any;
  setDateChoose: any;
  getDataInSearch: any;
  fileName?: string;
  PDF?: string;
}

interface ISelect {
  label: string;
  value: number;
}
const GridInvoiceFormHeader = ({
  // setBranch,
  branch,
  onClickHandler,
  billNoChange,
  billNo,
  headerName,
  pdf,
  excel,
  path,
  addDisable,
  dateChoose,
  setDateChoose,
  getDataInSearch,
  fileName,
  PDF,
}: ISmallTableHeader) => {
  const [branchDetails, setBranchDetails] = useState<ISelectType[]>([]);
  const [bchDetails, setBchDetails] = useState<IBranch[]>([]);
  const companyID = useAppSelector((state) => state.company.data.Id);
  useEffect(() => {
    const getBranchData = async () => {
      const res: IBranch[] = await getAllBranch();
      setBchDetails([
        {
          Id: 0,
          NameEnglish: "All",
          NameNepali: "सब",
          CompanyId: companyID,
        },
        ...res,
      ]);
      setBranchDetails(
        bchDetails.map((item) => {
          return { label: item.NameEnglish, value: item.Id };
        })
      );
    };
    getBranchData();
  }, [branchDetails]);

  const branchValue =
    branchDetails && branchDetails.find((obj) => obj.value === branch);

  const setBillVale = (e: any) => {
    billNoChange(e.target.value);
  };
  return (
    <>
      <Paper
        sx={{
          position: "sticky",
          top: 60,
          mx: "auto",
          flexGrow: 1,
          p: 1,
          boxShadow: 2,
          zIndex: 3,
        }}
        component="form"
        onSubmit={getDataInSearch}
      >
        <Grid
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 1,
            marginBottom: 2,
          }}
          container
        >
          <Typography variant="h6" sx={{ fontWeight: "400" }}>
            {/* {headerName} */}
          </Typography>
        </Grid>
        <Grid
          spacing={2}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            px: 1,
            marginBottom: 1,
          }}
          container
        >
          <Grid
            item
            xs={12}
            md={12}
            lg={2}
            xl={2}
            sx={{
              display: "flex",
              justifyContent: {
                xs: "center",
                lg: "flex-start",
              },
            }}
          >
            <TextField
              helperText="format: YYYY.MM.DD"
              label="Select From Date"
              required
              name="StartDate"
              size="small"
              inputProps={{
                pattern:
                  "([1-9][0-9]{3}.((0[1-9])|(1[0-2])).((0[1-9])|(1[0-9])|(2[0-9])|(3[0-2])))",
              }}
              fullWidth
              value={dateChoose.StartDate ? dateChoose.StartDate : ""}
              onChange={(e) =>
                setDateChoose({
                  ...dateChoose,
                  [e.target.name]: e.target.value,
                })
              }
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={12}
            lg={2}
            xl={2}
            sx={{
              display: "flex",
              justifyContent: {
                xs: "center",
                lg: "flex-start",
              },
            }}
          >
            <TextField
              helperText="format: YYYY.MM.DD"
              label="Select To Date"
              required
              name="EndDate"
              size="small"
              inputProps={{
                pattern:
                  "([1-9][0-9]{3}.((0[1-9])|(1[0-2])).((0[1-9])|(1[0-9])|(2[0-9])|(3[0-2])))",
              }}
              fullWidth
              value={dateChoose.EndDate}
              // value={getNepaliDate()}
              onChange={(e) =>
                setDateChoose({
                  ...dateChoose,
                  [e.target.name]: e.target.value,
                })
              }
            />
          </Grid>
          {Number.isInteger(branch) ? (
            <Grid
              item
              xs={12}
              md={12}
              lg={2}
              xl={2}
              sx={{
                display: "flex",
                justifyContent: {
                  xs: "center",
                  lg: "flex-start",
                },
              }}
            >
              <Autocomplete
                fullWidth
                value={branchValue ? branchValue?.label : ""}
                isOptionEqualToValue={(option: any, value: ISelect) =>
                  option.value === value.value
                }
                // onChange={(e, v) => branchOnChange(e, v)}
                onChange={(e: any, v: ISelect | 0) => {
                  onClickHandler("branch", v && v.value);
                }}
                disablePortal
                options={branchDetails}
                disableClearable
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Branch"
                    variant="outlined"
                    size="small"
                    helperText="Select Branch"
                  />
                )}
              />
            </Grid>
          ) : (
            ""
          )}
          <Grid
            item
            xs={12}
            md={12}
            lg={2}
            xl={1}
            sx={{
              display: "flex",
              justifyContent: {
                xs: "center",
                lg: "flex-start",
              },
            }}
          >
            <TextField
              helperText="Bill no."
              label="Enter Bill No."
              name="Bill No"
              size="small"
              fullWidth
              value={billNo ? billNo : ""}
              onChange={(e) => {
                setBillVale(e);
              }}
            />
          </Grid>
          <Grid item lg={1} md={6} xl={2}>
            <Box
              sx={{
                display: "flex",
                justifyContent: {
                  xs: "center",
                },
              }}
            >
              <Button
                type="submit"
                variant="contained"
                size="small"
                color="success"
                startIcon={<BiSearch />}
              >
                GO
              </Button>
            </Box>
          </Grid>
          <Grid item lg={12} xl={3}>
            <Box
              sx={{
                display: "flex",
                marginX: 2,
                justifyContent: {
                  xs: "center",
                },
              }}
            >
              <ButtonGroup
                orientation="horizontal"
                aria-label="horizontal outlined button group"
              >
                {addDisable ? "" : <AddPageBtn path={path} />}
                {pdf && <PdfBtn />}
                {excel && <ExcelBtn fileName={fileName} />}
                {PDF && <PDFBtn />}
              </ButtonGroup>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      <br />
    </>
  );
};
export default GridInvoiceFormHeader;
