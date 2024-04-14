import { Box, Button, ButtonGroup, Grid, LinearProgress, Paper, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import { savePDF } from "@progress/kendo-react-pdf";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { ExcelBtn } from "../../../utils/buttons";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getCurrentFinancialYear } from "../../../features/financialYearSlice";
import { IDate } from "../../transaction/invoice/interfaces";
import { getAccountDebtorCreditor } from "../../../services/AccountDebtorCreditor";
import { errorMessage } from "../../../utils/messageBox/Messages";
import GridReportHeader from "../components/reportHeader";
import TableCreditorsReport from "./components/TableDebtorsReport";
import { IOnSubmit } from "../../../interfaces/event";
import { IsDateVerified } from "../../../utils/dateVerification";
import { setDefaultDateAction } from "../../../features/defaultDateSlice";  

const DebtorsReport = () => {
  const PrintComponent = () => {
    const dispatch = useAppDispatch();
    const defaultDate = useAppSelector((state) => state.defaultDate);
    let componentRef: any = useRef<HTMLDivElement>(null);
    const [AccountDebtorCreditor, setAccountDebtorCreditor] = useState<any[]>([]);
    const savePdf = () => {
      savePDF(componentRef.current, {
        scale: 0.6,
        paperSize: "A4",
        fileName: "DebtorsReport",
      });
    };
    const FinancialYear = useAppSelector(getCurrentFinancialYear);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [date, setDate] = useState<IDate>(
      defaultDate.EndDate === ""
        ? {
            StartDate: FinancialYear.NepaliStartDate,
            EndDate: FinancialYear.NepaliEndDate,
          }
        : defaultDate
    );

    const loadAllData = async () => {
      setIsLoading(true);
      const res = await getAccountDebtorCreditor(
        date.StartDate, 
        date.EndDate, "18");
      if(res.length > 0){
        setAccountDebtorCreditor(res);
        setIsLoading(false);
      }
      else{
        setIsLoading(false);
        errorMessage("No Data Available.");
      }
    };
    useEffect(() => {
      loadAllData();
    }, []);
    const validate = AccountDebtorCreditor?.length > 0;  
    const loadDataByDate = (e: IOnSubmit) => {
      e.preventDefault();
      if (!IsDateVerified(date.StartDate, date.EndDate, FinancialYear)) {
        errorMessage("Invalid Date !!!");
        return;
      }
      loadAllData();
      dispatch(setDefaultDateAction(date));
    };      
    return (
      <>
        <Paper
          sx={{
            position: "sticky",
            top: 65,
            py: 1,
            mx: "auto",
            flexGrow: 1,
            borderRadius: 1,
            boxShadow: 3,
            zIndex: 3,
          }}
          component="form"
          onSubmit={loadDataByDate}
        >
          <Grid
            spacing={2}
            m={2}
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              px: 1,
              marginBottom: 2,
            }}
            container
          >
        
            <Typography variant="h6"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                px: 1,
              }}
            >Debtor's Report</Typography>
              <Box
                sx={{
                  display: "flex",
                  marginX: 2,
                  justifyContent: "flex-end"
                }}
                >
                  <ButtonGroup
                  sx={{marginX: 2}}
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
                <Button
                  disabled={!validate}
                  sx={{ marginLeft: 1 }}
                  size="small"
                  variant="contained"
                  color="error"
                  onClick={() => savePdf()}
                  startIcon={<PictureAsPdfIcon />}
                >
                  Pdf
                </Button>
                <ExcelBtn fileName="DebtorsReport" disable={!validate} />
                </ButtonGroup>
              </Box>
            
            </Grid>

          
            <Grid
            spacing={2}
            sx={{
              display: "flex",
              justifyContent: "center",
              px: 1,
              marginBottom: 1,
            }}
            container>
            <GridReportHeader
              dateChoose={date}
              setDateChoose={setDate}
              getDataInSearch={loadDataByDate}
            />

        </Grid>
        </Paper>
        <div ref={componentRef} style={{ padding: "5px" }}>
          {isLoading ? (
            <LinearProgress sx={{ marginTop: 3 }} />
          ) : (
              <TableCreditorsReport
              AccountDebtorCreditor={AccountDebtorCreditor}
              DateChoose={date}
              />
          )}
        </div>
      </>
    );
  }
  return (
    <>
      <PrintComponent />
    </>
  );
};

export default DebtorsReport;
