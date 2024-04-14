import { Autocomplete, Button, Grid, LinearProgress, Paper, TextField, Typography } from "@mui/material";
import { savePDF } from "@progress/kendo-react-pdf";
import { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import { useAppSelector } from "../../../app/hooks";
import { getCurrentFinancialYear } from "../../../features/financialYearSlice";
import { getAllStockInHands } from "../../../services/stockInHandsApi";
import TStockInhand from "./components/tStockInhand";
import { ExcelBtn } from "../../../utils/buttons";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Box from "@mui/material/Box";
import { BiSearch } from "react-icons/bi";
import { IOnSubmit } from "../../../interfaces/event";
import { errorMessage } from "../../../utils/messageBox/Messages";
import { IsDateVerified } from "../../../utils/dateVerification";
import {
  ICommonObj,
  IDate,
  ILedgerCalculation,
} from "../../transaction/invoice/interfaces";
import { setDefaultDateAction } from "../../../features/defaultDateSlice";
import { useDispatch } from "react-redux";

const options = ['All', 'out of stock'];

const StockInHand = () => {
  const PrintComponent = () => {
    const dispatch = useDispatch();
    const financialYear = useAppSelector((state) => state.financialYear);
    const defaultDate = useAppSelector((state) => state.defaultDate);
    const [date, setDate] = useState<IDate | any >(
      defaultDate.EndDate === ""
        ? {
            StartDate: financialYear.NepaliStartDate,
            EndDate: financialYear.NepaliEndDate,
          }
        : defaultDate
    );    
    const { Name } = useAppSelector(getCurrentFinancialYear);
    const [allData, setAllData] = useState<any[]>([]);
    const [isAllDataLoaded, setIsAllDataLoaded] = useState<boolean>(false);
    let componentRef: any = useRef<HTMLDivElement>(null);
    const [svalue, setValue] = useState<string | null>(options[0]);
    const savePdf = () => {
      savePDF(componentRef.current, {
        scale: 0.6,
        paperSize: "A4",
        fileName: "StockInHand",
      });
    };
    const loadData = async () => {
      const res = await getAllStockInHands(date.EndDate, Name);
      setAllData(res);
      setIsAllDataLoaded(true);
    };
    useEffect(() => {
      loadData();
    }, []);

    const filterData = allData?.filter(
      (qty: any) => qty.IsLowQty === true
    );
    const loadDataByDate = (e: IOnSubmit) => {
      e.preventDefault();
      if (!IsDateVerified(date.StartDate, date.EndDate, financialYear)) {
        errorMessage("Invalid Date !!!");
        return;
      }      
      loadData();
      dispatch(setDefaultDateAction(date));
    };

    return (
      <>
        <Paper
          sx={{
            position: 'sticky',
            top: 65,
            py: 1,
            mx: "auto",
            flexGrow: 1,
            borderRadius: 1,
            boxShadow: 3,
            zIndex:3
          }}
          component="form"
          onSubmit={loadDataByDate}          
        >
          <Grid
            spacing={2}
            sx={{
              display: "flex",
              alignItems: "center",
              px: 1,
            }}
            container
          >
            <Grid
              item
              lg={3}
              md={3}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: { md: "flex-start", xs: "center" },
              }}
            >
              <Typography variant="h6">Stock In Hand</Typography>
            </Grid>
            <Grid item lg={2} md={2} xs={6}>
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
          value={date.EndDate}
          onChange={(e) =>
            setDate({
              ...date,
              [e.target.name]: e.target.value,
            })
          }          
        />
            </Grid>
            <Grid item lg={1} md={6}>
        <Box
          sx={{
            marginTop: 2,
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
            <Grid
              item
              lg={3}
              md={3}
              xs={3}
              sx={{
                display: "flex",
                justifyContent: { md: "flex-start", xs: "center" },
              }}
            >
              <Autocomplete
                value={svalue}
                onChange={(event: any, newValue: string | null) => {
                  setValue(newValue);
                }}
                id="stock report"
                options={options}
                sx={{
                  width: 300,
                }}
                renderInput={(params) => 
                  <TextField
                    {...params}
                    label="Choose stock type"
                  />
                }
              />
            </Grid>
            <Grid
              item
              lg={3}
              md={3}
              xs={3}
              sx={{
                display: "flex",
                justifyContent: {
                  lg: "flex-start",
                  xs: "center",
                  md: "flex-start",
                },
              }}
            >
              <ReactToPrint
                trigger={() => (
                  <Button
                    size="small"
                    variant="contained"
                    color="info"
                    startIcon={<PrintIcon />}
                  >
                    Print
                  </Button>
                )}
                content={() => componentRef.current}
              />
              <Button
                sx={{ marginLeft: 1 }}
                size="small"
                variant="contained"
                color="error"
                onClick={() => savePdf()}
                startIcon={<PictureAsPdfIcon />}
              >
                Pdf
              </Button>
              <ExcelBtn fileName="StockInHand" />
            </Grid>
          </Grid>
        </Paper>

        <div ref={componentRef} style={{ padding: "5px" }}>
          {!isAllDataLoaded ? (
            <LinearProgress sx={{ marginTop: 2 }} />
          ) : (
            <TStockInhand allData={svalue === "All" ? allData : filterData} />
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <PrintComponent />
    </>
  );
};

export default StockInHand;
