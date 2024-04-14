import {
  Autocomplete,
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
import TLedgerDetails from "./components/tLedgerDetails";
import { Box } from "@mui/system";
import {
  IDate,
} from "../../transaction/invoice/interfaces";
import { errorMessage } from "../../../utils/messageBox/Messages";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getCurrentFinancialYear } from "../../../features/financialYearSlice";
import { IPurchaseMenu } from "../../../interfaces/purchaseOrder";
import {
  getAllLedgerOptions,
  getLedgerDetail,
  getLedgerDetails,
} from "../../../services/ledgerDetailApi";
import { getAllPurchase } from "../../../services/purchaseOrderApi";
import GridReportHeader from "../components/reportHeader";
import { ExcelBtn } from "../../../utils/buttons";
import { IsDateVerified } from "../../../utils/dateVerification";
import { IOnSubmit } from "../../../interfaces/event";
import { setDefaultDateAction } from "../../../features/defaultDateSlice";
import { IBranch } from "../../../interfaces/branch";
import { getAllBranch } from "../../../services/branchApi";
import handleRenderOption from "../../../utils/autoSuggestHighlight";
import{ILedger} from "../../../interfaces/posBiling";

interface ISelect {
  label: string;
  value: number;
}

const options = ['Details', 'Summery'];

const LedgerDetail = () => {
  const PrintComponent = () => {
    const dispatch = useAppDispatch();
    const defaultDate = useAppSelector((state) => state.defaultDate);
    let componentRef: any = useRef<HTMLDivElement>(null);

    const savePdf = () => {
      savePDF(componentRef.current, {
        scale: 0.6,
        paperSize: "A4",
        fileName: "LedgerDetail",
      });
    };

    const financialYear = useAppSelector((state) => state.financialYear);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { Name } = useAppSelector(getCurrentFinancialYear);
    const [ledgerOption, setLedgerOption] = useState<any[]>([]);
    const [ledgerDetails, setLedgerDetails] = useState<any[]>([]);
    const [ledgerValue, setLedgerValue] = useState<number>(0);
    const [branchValue, setBranchValue] = useState<number>(0);
    const [products, setProducts] = useState<IPurchaseMenu[]>([]);
    const [branchOption, setBranchOption] = useState<IBranch[]>([]);
    const [selectValue, setSelectValue] = useState<string | null>(options[0]);

    const [date, setDate] = useState<IDate>(
      defaultDate.EndDate === ""
        ? {
            StartDate: financialYear.NepaliStartDate,
            EndDate: financialYear.NepaliEndDate,
          }
        : defaultDate
    );
    useEffect(() => {
      const loadData = async () => {
        const res = await getAllLedgerOptions();
        setLedgerOption(
          res.map((data: ILedger) => ({
            value: data.Id,
            label: data.Name,
          }))
        );
        const productsRes = await getAllPurchase();
        setProducts(productsRes);
        const BranchRes: IBranch[] = await getAllBranch();
        setBranchOption(BranchRes);
      };
      loadData();
    }, []);
    
    const loadAllData = async () => {
      setIsLoading(true);
      if(branchValue > 0){
        const res = await getLedgerDetails(
          branchValue, 
          ledgerValue, 
          Name,
          date.StartDate, 
          date.EndDate);
        if(res.length > 0){
          setLedgerDetails(res);
          setIsLoading(false);
        }
        else{
          setIsLoading(false);
          errorMessage("No Data Available.");
        }
      }else{
        const res = await getLedgerDetail(
          ledgerValue, 
          Name,
          date.StartDate, 
          date.EndDate);
        
        if(res){
          setIsLoading(false);
          setLedgerDetails(res);
        }else{
          setIsLoading(false);
          errorMessage("No Data Available");
        }
        
      }
    };
    useEffect(() => {
      loadAllData();
    }, []);

    const loadDataByDate = (e: IOnSubmit) => {
      e.preventDefault();
      if (!IsDateVerified(date.StartDate, date.EndDate, financialYear)) {
        errorMessage("Invalid Date !!!");
        return;
      }
      loadAllData();
      dispatch(setDefaultDateAction(date));
    };

    const validate = ledgerDetails?.length > 0;
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
            >Ledger Detail</Typography>
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
                <ExcelBtn fileName="LedgerDetails" disable={!validate} />
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
            container
          >            
            <Grid item xs={6}>
              <Autocomplete
                sx={{ width: "100%", marginBottom: -2, }}
                options={ledgerOption}
                onChange={(e:any, v:ISelect) => setLedgerValue(v.value)}
                isOptionEqualToValue={(option:ISelect, value:ISelect) =>
                  option.label === value.label
                }
                getOptionLabel={option => option.label}
                disableClearable
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    size="small"
                    label="Ledger "
                    variant="outlined"
                    helperText="Select Ledger"
                    error={!ledgerValue}
                    required
                    fullWidth
                    margin="normal"
                  />
                )}
                renderOption={handleRenderOption}
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                sx={{ width: "100%", marginBottom: -2 }}
                options={
                  branchOption &&
                  branchOption.map((data) => {
                    return {
                      label: data.NameEnglish,
                      value: data.Id,
                    };
                  })
                }
                onChange={(e, v) => setBranchValue(v.value)}
                isOptionEqualToValue={(option, value) =>
                  option.label === value.label
                }
                disableClearable
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    size="small"
                    label="Branch "
                    variant="outlined"
                    helperText="Select Branch"
                    error={!branchValue}
                    fullWidth
                    margin="normal"
                  />
                )}
                renderOption={handleRenderOption}
              />
            </Grid>
            <Grid
              item
            xs={12}
            md={12}
            lg={4}
            xl={4}
            sx={{
              display: "flex",
              justifyContent: {
                xs: "center",
                lg: "flex-start",
              },
            }}>
              <Autocomplete
                value={selectValue}
                onChange={(event: any, newValue: string | null) => {
                  setSelectValue(newValue);
                }}
                id="ledger-type"
                options={options}
                sx={{ width: "100%", marginBottom: -2, }}
                renderInput={(params) =>
                  <TextField {...params}
                    label="Ledger View Type"
                    size="small"
                    margin="normal"
                    fullWidth
                  />
                }
              />
            </Grid>
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
              <TLedgerDetails
                ledgerTypes={selectValue}
                ledgerDetails={ledgerDetails}
                products={products}
                ledgerOption={ledgerOption}
                branchOption={branchOption}
                ledgerValue={ledgerValue}
                branchValue={branchValue}
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

export default LedgerDetail;
