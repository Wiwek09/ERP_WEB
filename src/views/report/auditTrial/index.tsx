import { Button, Grid, LinearProgress, Paper } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useRef, useState } from 'react'
import ReactToPrint from 'react-to-print';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setDefaultDateAction } from '../../../features/defaultDateSlice';
import { ISales } from '../../../interfaces/invoice';
import { getAllCustomers, getAllLedgerForCalculation, getAllSales } from '../../../services/invoice';
import { IsDateVerified } from '../../../utils/dateVerification';
import { errorMessage } from '../../../utils/messageBox/Messages';
import { ICommonObj, ILedgerCalculation } from '../../transaction/invoice/interfaces';
import GridReportHeader from '../components/reportHeader';
import AuditTable from './components/AuditTable';
import PrintIcon from "@mui/icons-material/Print";
interface IDateProps {
  StartDate: string;
  EndDate: string;
}
const AuditTrial = () => {
  const PrintComponent = () => {
    const dispatch = useAppDispatch();
    const financialYear = useAppSelector((state) => state.financialYear);
    const [sales, setSales] = useState<ISales[]>([]);
    const [ledgers, setLedgers] = useState<ICommonObj[]>([]);
    const [allLedgerData, setAllLedgerData] = useState<ILedgerCalculation[]>([]);
    const [isAllDataLoaded, setISAllDataLoaded] = useState<boolean>(false);
    const defaultDate = useAppSelector((state) => state.defaultDate);
    let componentRef: any = useRef<HTMLDivElement>(null);
    const [dateChoose, setDateChoose] = useState<IDateProps>(
      defaultDate.EndDate === ""
        ? {
            StartDate: financialYear.NepaliStartDate,
            EndDate: financialYear.NepaliEndDate,
          }
        : defaultDate
    );

    const setAllData = async () => {
        const ledgersData = await getAllCustomers(); 
        const salesData: ISales[] = await getAllSales(
          dateChoose.StartDate,
          dateChoose.EndDate
        );
        const setNVDate  = salesData.map((obj, i) => ({
          ...obj, NVDate: salesData[i].AccountTransactionValues[0].NVDate 
        }));
        if(salesData.length > 0){
            setSales(setNVDate);       
        }else{
          errorMessage(`No data between ${dateChoose.StartDate} - ${dateChoose.EndDate}`);
        }
        
        const ledgerCalculationData: ILedgerCalculation[] =
        await getAllLedgerForCalculation();

        setLedgers(        
            ledgersData.map((data: any) => {
            return { id: data.Id, name: data.Name };
            })
        );
        setAllLedgerData(ledgerCalculationData);
        setISAllDataLoaded(true);
    }

    useEffect(() => {
        setAllData();
    }, []);
    if (!isAllDataLoaded) {
        return <LinearProgress />;
    }
    const getDataInSearch = (e: any) => {
      e.preventDefault();
      if (
        !IsDateVerified(dateChoose.StartDate, dateChoose.EndDate, financialYear)
      ) {
        errorMessage("Invalid Date !!!");
        return;
      }
      setAllData();
      dispatch(setDefaultDateAction(dateChoose));
    };
    return (
      <>
        <Paper
          sx={{
            position:"sticky",
            top: 60,
            py: 1,
            mx: "auto",
            flexGrow: 1,
            borderRadius: 1,
            boxShadow: 3,
            zIndex: 3
          }}
          component="form"
          onSubmit={getDataInSearch}
        >
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
            <GridReportHeader
              dateChoose={dateChoose}
              setDateChoose={setDateChoose}
              getDataInSearch={getDataInSearch}
            />
            
            <Grid item lg={4} xl={4}>
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
              </Box>
            </Grid>
          </Grid>
        </Paper>
        <div ref={componentRef} style={{ padding: "5px" }}>
          <AuditTable
            salesData={sales}
            ledgerData={ledgers}
            ledgerCalculationData={allLedgerData}
            date={dateChoose}
          />
        </div>
      </>
    )
  }
  return (
    <>
      <PrintComponent/>
    </>
  )
}
export default AuditTrial;
