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
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { setDefaultDateAction } from "../../../features/defaultDateSlice";
import { getCurrentFinancialYear } from "../../../features/financialYearSlice";
import PrintIcon from "@mui/icons-material/Print";
import { Box } from "@mui/system";
import { ISalesReturn } from "../../../interfaces/salesReturn";
import { IAccountHolder } from "../../../interfaces/purchaseOrder";
import { ISelectType } from "../../../interfaces/autoComplete";
import { getAllSalesReturn } from "../../../services/salesReturnApi";
import {
  getAllCustomers,
  getAllLedgerForCalculation,
} from "../../../services/invoice";
import { errorMessage } from "../../../utils/messageBox/Messages";
import { IsDateVerified } from "../../../utils/dateVerification";
import { getAllAccountHolder } from "../../../services/purchaseOrderApi";
import { ExcelBtn } from "../../../utils/buttons";
import TSalesReturnBook from "./components/tSalesReturnBook";
import {
  ICommonObj,
  ILedgerCalculation,
} from "../../transaction/invoice/interfaces";
import DateSelection from "../components/dateSelection";
import { AHSelectType } from "./AHSelectedType";
interface IDateProps {
  StartDate: string;
  EndDate: string;
}

interface ISelect {
  label: string;
  value: number;
}

const options = ["Details", "Summery", "IRDCBMS"];

const SalesReturnBook = () => {
  const PrintComponent = () => {
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const defaultDate = useAppSelector((state) => state.defaultDate);
    let componentRef: any = useRef<HTMLDivElement>(null);

    const FinancialYear = useAppSelector(getCurrentFinancialYear);
    const [accountHolder, setAccountHolder] = useState<AHSelectType[]>([]);
    const [allData, setAllData] = useState<ISalesReturn[]>([]);
    const [ledgers, setLedgers] = useState<ICommonObj[]>([]);
    const [allLedgerData, setAllLedgerData] = useState<ILedgerCalculation[]>(
      []
    );
    const [isAllDataLoaded, setIsAllDataLoaded] = useState<boolean>(false);
    const [dateValue, setDateValue] = useState<any>("");
    const [dateChoose, setDateChoose] = useState<IDateProps>(
      defaultDate.EndDate === ""
        ? {
            StartDate: FinancialYear.NepaliStartDate,
            EndDate: FinancialYear.NepaliEndDate,
          }
        : defaultDate
    );
    const { Name, NepaliStartDate, NepaliEndDate } = useAppSelector(
      getCurrentFinancialYear
    );
    const [selectValue, setSelectValue] = useState<any>(options[0]);

    const getData = async () => {
      const ledgersData = await getAllCustomers();
      setLedgers(
        ledgersData.map((data: any) => {
          return { id: data.Id, name: data.Name };
        })
      );

      const response: ISalesReturn[] = await getAllSalesReturn(dateValue, Name);
      if (response) {
        setAllData(response);
      }

      const ledgerCalculationData: ILedgerCalculation[] =
        await getAllLedgerForCalculation();

      const res: IAccountHolder[] = await getAllAccountHolder();

      setAccountHolder(
        res.map((item) => {
          return { label: item.Name, value: item.Id, panNo: item.PanNo };
        })
      );
      setAllLedgerData(ledgerCalculationData);
      setIsAllDataLoaded(true);
    };

    const getDataInSearch = async (e: any) => {
      e.preventDefault();
      if (
        !IsDateVerified(dateChoose.StartDate, dateChoose.EndDate, FinancialYear)
      ) {
        errorMessage("Invalid Date !!!");
        return;
      }

      const response = await getAllSalesReturn(dateValue, Name);

      console.log("Hello Yagya Nath Sales Return Index", response);

      if (response) {
        setAllData(response);
      }

      setIsAllDataLoaded(true);
      dispatch(setDefaultDateAction(dateChoose));
    };

    useEffect(() => {
      setIsLoading(true);
      getData();
      setIsLoading(false);
    }, [dateValue]);

    const dateOnChange = (v: any) => {
      console.log("Hello Yagya Nath Sales Return Index", v);
      setDateValue(v.value);
    };

    const validate = allData?.length > 0;

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
            <Typography variant="h6">Sales Return Book</Typography>
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
                        disabled={!validate}
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
                  <ExcelBtn fileName="SalesReturnBook" disable={!validate} />
                </ButtonGroup>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <div ref={componentRef} style={{ padding: "5px" }}>
          {!isAllDataLoaded ? (
            <LinearProgress sx={{ marginTop: 2 }} />
          ) : (
            <TSalesReturnBook
              allData={allData}
              accountHolder={accountHolder}
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

export default SalesReturnBook;
