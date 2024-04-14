import {
    Button,
    Grid,
    LinearProgress,
    Paper,
    TextField,
    Typography,
    ButtonGroup,
  } from "@mui/material";
  import { useEffect, useRef, useState } from "react";
  import ReactToPrint from "react-to-print";
  import { savePDF } from "@progress/kendo-react-pdf";
  import PrintIcon from "@mui/icons-material/Print";
  import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
  import { Box } from "@mui/system";
  import { errorMessage } from "../../../utils/messageBox/Messages";
  import { useAppDispatch, useAppSelector } from "../../../app/hooks";
  import GridReportHeader from "../components/reportHeader";
  import { ExcelBtn } from "../../../utils/buttons";
  import { IsDateVerified } from "../../../utils/dateVerification";
  import { IOnSubmit } from "../../../interfaces/event";
  import { setDefaultDateAction } from "../../../features/defaultDateSlice";  
import { getCurrentFinancialYear } from "../../../features/financialYearSlice";
import { IDate } from "../../transaction/invoice/interfaces";
import { getAllItemWiseProfit } from "../../../services/AllItemWiseProfitAPI";
import TableItemWise from "./components/TableItemWise";
  const allItemWiseProfit = () => {
    const PrintComponent = () => {
      const dispatch = useAppDispatch();
      const defaultDate = useAppSelector((state) => state.defaultDate);
      let componentRef: any = useRef<HTMLDivElement>(null);
  
      const savePdf = () => {
        savePDF(componentRef.current, {
          scale: 0.6,
          paperSize: "A4",
          fileName: "AllItemWiseProfit",
        });
      };
      const FinancialYear = useAppSelector(getCurrentFinancialYear);
      const [isLoading, setIsLoading] = useState<boolean>(false);      
      const [AllItemWiseProfits, setAllItemWiseProfits] = useState<any[]>([]);
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
        const res = await getAllItemWiseProfit(
          date.StartDate, 
          date.EndDate);
        if(res.length > 0){
          setAllItemWiseProfits(res);
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
      const validate = AllItemWiseProfits?.length > 0;  
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
              >Item's wise Profit</Typography>
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
                  <ExcelBtn fileName="Itemwiseprofit" disable={!validate} />
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
                <TableItemWise
                AllItemWiseProfits={AllItemWiseProfits}
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
  export default allItemWiseProfit;