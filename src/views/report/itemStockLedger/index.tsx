import {
  Autocomplete,
  Button,
  Grid,
  LinearProgress,
  Paper,
  TextField,
  Typography,
  ButtonGroup
} from "@mui/material";
import { savePDF } from "@progress/kendo-react-pdf";
import { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import { useAppSelector } from "../../../app/hooks";
import { getCurrentFinancialYear } from "../../../features/financialYearSlice";
import { IProduct } from "../../../interfaces/posBiling";
import { getAllProducts } from "../../../services/posBilling";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Box } from "@mui/system";
import TItemStockLedger from "./components/tItemStockLedger";
import { ISelectType } from "./../../../interfaces/autoComplete";
import { getAllItemStockLedger } from "../../../services/itemStockLedgerApi";
import { ExcelBtn } from "../../../utils/buttons";

export interface IItemStockLedger {
  Id: number;
  BillNumber: number | null;
  PartyName: string;
  TDate: string;
  QtyIn: number;
  QtyOut: number;
  QtyBalance: number;
  UnitType: string;
  Rate: number;
  Amount: number;
}
const ItemStockLedger = () => {
  const PrintComponent = () => {
    let componentRef: any = useRef<HTMLDivElement>(null);

    const savePdf = () => {
      savePDF(componentRef.current, {
        scale: 0.6,
        paperSize: "A4",
        fileName: "ItemStockLedger",
      });
    };
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { Name } = useAppSelector(getCurrentFinancialYear);
    const [itemSelected, setItemSelected] = useState<number>(0);
    const [allData, setAllData] = useState<IItemStockLedger[]>([]);
    const [products, setProducts] = useState<ISelectType[]>([]);

    useEffect(() => {
      const loadData = async () => {
        const productsData = await getAllProducts();
        setProducts(
          productsData?.map((elm: IProduct) => {
            return {
              value: elm.ItemId,
              label: elm.Name,
            };
          })
        );
      };
      loadData();
    }, []);

    useEffect(() => {
      const loadAllData = async () => {
        setIsLoading(true);
        const res = await getAllItemStockLedger(itemSelected, Name);
        setAllData(res);
        setIsLoading(false);
      };
      loadAllData();
    }, [itemSelected]);

    const getItemName = products?.find((elm) => elm.value === itemSelected);

    const validate = allData?.length > 0;

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
        >
          
          <Typography variant="h6" 
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 1,
              marginBottom: 2,
            }}
          >Item Stock Ledger</Typography>
      

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
            
          <Grid item lg={12} xl={4}>
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
              <ExcelBtn fileName="ItemStockLedger" disable={!validate} />
              </ButtonGroup>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ m:2 }}
            >
              <Autocomplete
                sx={{ width: "100%" }}
                disablePortal
                options={products}
                onChange={(e, v) => setItemSelected(v.value)}
                isOptionEqualToValue={(option, value) =>
                  option.label === value.label
                }
                disableClearable
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    size="small"
                    label="Item Name"
                    variant="outlined"
                    helperText="Select Item"
                    error={!itemSelected}
                    required
                    fullWidth
                  />
                )}
              />
          </Box>
          <Box sx={{textAlign: "center", fontWeight: "bold"}}>
            {allData.length === 0 ?
              "" :
            "No. of Bills: " + allData.length}
          </Box>
        </Paper>
        <div ref={componentRef} style={{ padding: "5px" }}>
          {isLoading ? (
            <LinearProgress sx={{ marginTop: 3 }} />
          ) : (
            <TItemStockLedger allData={allData} name={getItemName?.label} />
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

export default ItemStockLedger;
