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
import { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import TSalesBook from "./components/tSalesBook";
import PrintIcon from "@mui/icons-material/Print";
import { Box } from "@mui/system";
import {
  ICommonObj,
  IDate,
  ILedgerCalculation,
} from "../../transaction/invoice/interfaces";
import { ISales } from "../../../interfaces/invoice";
import {
  getAllCustomers,
  getAllLedgerForCalculation,
  getAllProducts,
  getAllSaleBook,
} from "../../../services/invoice";
import DateSelection from "../components/dateSelection";
import { getCurrentFinancialYear } from "../../../features/financialYearSlice";
import { ExcelBtn } from "../../../utils/buttons";

interface ISelect {
  label: string;
  value: number;
}

const options = ["Details", "Summery", "IRDCBMS"];

const SalesBook = () => {
  const PrintComponent = () => {
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const defaultDate = useAppSelector((state) => state.defaultDate);
    let componentRef: any = useRef<HTMLDivElement>(null);
    const [dateValue, setDateValue] = useState<any>("");
    const financialYear = useAppSelector((state) => state.financialYear);
    const [sales, setSales] = useState<ISales[]>([]);
    const [selectValue, setSelectValue] = useState<any>(options[0]);

    const [products, setProducts] = useState<ICommonObj[]>([]);
    const [ledgers, setLedgers] = useState<ICommonObj[]>([]);
    const { Name, NepaliStartDate, NepaliEndDate } = useAppSelector(
      getCurrentFinancialYear
    );
    const [date, setDate] = useState<IDate>(
      defaultDate.EndDate === ""
        ? {
            StartDate: financialYear.NepaliStartDate,
            EndDate: financialYear.NepaliEndDate,
          }
        : defaultDate
    );
    const [allLedgerData, setAllLedgerData] = useState<ILedgerCalculation[]>(
      []
    );
    const [isAllDataLoaded, setISAllDataLoaded] = useState<boolean>(false);
    const setAllData = async () => {
      const ledgersData = await getAllCustomers();
      const productsData = await getAllProducts();
      const salesData: ISales[] = await getAllSaleBook(dateValue, Name);
      setSales(salesData);

      const ledgerCalculationData: ILedgerCalculation[] =
        await getAllLedgerForCalculation();

      setLedgers(
        ledgersData.map((data: any) => {
          return { id: data.Id, name: data.Name, panNo: data.PanNo };
        })
      );

      setProducts(
        productsData.map((data: any) => {
          return { id: data.Id, name: data.Name };
        })
      );

      setAllLedgerData(ledgerCalculationData);
      setISAllDataLoaded(true);
    };

    useEffect(() => {
      setIsLoading(true);
      setAllData();
      setIsLoading(false);
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
            mx: "auto",
            flexGrow: 1,
            p: 1,
            boxShadow: 2,
            zIndex: 3,
          }}
          component="form"
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
              Sales Book
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

                  <ExcelBtn fileName="SalesBook" />
                </ButtonGroup>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <div ref={componentRef} style={{ padding: "5px" }}>
          {!isAllDataLoaded ? (
            <LinearProgress sx={{ marginTop: 3 }} />
          ) : (
            <TSalesBook
              salesData={sales}
              productData={products}
              ledgerData={ledgers}
              ledgerCalculationData={allLedgerData}
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

export default SalesBook;
