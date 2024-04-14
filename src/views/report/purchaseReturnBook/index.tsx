import {
  Button,
  Grid,
  LinearProgress,
  Paper,
  Typography,
  ButtonGroup,
  Autocomplete,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { savePDF } from "@progress/kendo-react-pdf";
import { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import { ExcelBtn } from "../../../utils/buttons";
import GridReportHeader from "../components/reportHeader";
import PrintIcon from "@mui/icons-material/Print";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { setDefaultDateAction } from "../../../features/defaultDateSlice";
import { getCurrentFinancialYear } from "../../../features/financialYearSlice";
import { IGetAllPurchase } from "../../../interfaces/purchase";
import { IProduct } from "../../../interfaces/product";
import { getAllProducts } from "../../../services/purchaseApi";
import { getAllPurchaseReturnBook } from "../../../services/purchaseReturnApi";
import { errorMessage } from "../../../utils/messageBox/Messages";
import { IsDateVerified } from "../../../utils/dateVerification";
import PurchaseReturnBookTable from "./components/PurchaseReturnBookTable";
import { getAllCustomers } from "../../../services/invoice";
import { ILedger } from "../../../interfaces/posBiling";
import DateSelection from "../components/dateSelection";
interface IDateProps {
  StartDate: string;
  EndDate: string;
}
interface ISelect {
  label: string;
  value: number;
}

const options = ["Details", "Summery"];
const PurchaseBookGrid = () => {
  const PrintComponent = () => {
    const dispatch = useAppDispatch();
    const defaultDate = useAppSelector((state) => state.defaultDate);
    let componentRef: any = useRef<HTMLDivElement>(null);
    const [dateValue, setDateValue] = useState<any>("");
    const savePdf = () => {
      savePDF(componentRef.current, {
        scale: 0.6,
        paperSize: "A4",
        fileName: "PurchaseReturnBook",
      });
    };

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const FinancialYear = useAppSelector(getCurrentFinancialYear);
    const [purchaseReturns, setPurchaseReturns] = useState<IGetAllPurchase[]>(
      []
    );
    const [dateChoose, setDateChoose] = useState<IDateProps>(
      defaultDate.EndDate === ""
        ? {
            StartDate: FinancialYear.NepaliStartDate,
            EndDate: FinancialYear.NepaliEndDate,
          }
        : defaultDate
    );
    const [areAllDataLoaded, setAreAllDataLoaded] = useState(false);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [customers, setCustomers] = useState<ILedger[]>([]);
    const { Name, NepaliStartDate, NepaliEndDate } = useAppSelector(
      getCurrentFinancialYear
    );
    const [selectValue, setSelectValue] = useState<any>(options[0]);

    const getPurchaseReturnData = async () => {
      try {
        const purchaseReturnData: IGetAllPurchase[] =
          await getAllPurchaseReturnBook(dateValue, Name);
        setPurchaseReturns(purchaseReturnData);
        const productData: IProduct[] = await getAllProducts();
        setProducts(productData);
        const customers = await getAllCustomers();
        setCustomers(customers);
        setAreAllDataLoaded(true);
      } catch {
        errorMessage("Something went wrong. Please try again later.");
      }
    };

    const getDataInSearch = (e: any) => {
      e.preventDefault();
      if (
        !IsDateVerified(dateChoose.StartDate, dateChoose.EndDate, FinancialYear)
      ) {
        errorMessage("Invalid Date !!!");
        return;
      }
      getPurchaseReturnData();
      dispatch(setDefaultDateAction(dateChoose));
    };

    useEffect(() => {
      getPurchaseReturnData();
    }, [dateValue]);

    const dateOnChange = (v: any) => {
      setDateValue(v.value);
    };
    return (
      <>
        <Paper
          sx={{
            position: "sticky",
            top: 60,
            py: 1,
            mx: "auto",
            flexGrow: 1,
            borderRadius: 1,
            boxShadow: 3,
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
            <Typography variant="h6">Purchase Return Book</Typography>
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
              xs={6}
              md={6}
              lg={6}
              xl={6}
              sx={{
                display: "flex",
                justifyContent: {
                  xs: "center",
                  lg: "flex-start",
                },
              }}
            >
              <DateSelection
                dateOnChange={dateOnChange}
                dateValues={dateValue}
              />
            </Grid>
            <Grid
              item
              xs={5}
              md={5}
              lg={5}
              xl={5}
              sx={{
                display: "flex",
                justifyContent: {
                  xs: "center",
                  lg: "flex-start",
                },
              }}
            >
              <Autocomplete
                value={selectValue}
                onChange={(event: any, newValue: string | null) => {
                  setSelectValue(newValue);
                }}
                id="Book type"
                options={options}
                sx={{ width: "100%", marginBottom: -2 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Book View-type"
                    size="small"
                    margin="normal"
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item lg={12} xl={4}>
              <Box
                sx={{
                  marginTop: 2,
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
                  <ExcelBtn fileName="PurchaseReturnBook" />
                </ButtonGroup>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <div ref={componentRef} style={{ padding: "5px" }}>
          {areAllDataLoaded === false ? (
            <LinearProgress sx={{ marginTop: 3 }} />
          ) : (
            <PurchaseReturnBookTable
              allData={purchaseReturns}
              products={products}
              customers={customers}
              month={dateValue}
              ReportTypeBook={selectValue}
            />
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

export default PurchaseBookGrid;
