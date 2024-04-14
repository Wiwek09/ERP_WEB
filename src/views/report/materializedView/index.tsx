import {
  Button,
  Grid,
  LinearProgress,
  Paper,
  Typography,
  ButtonGroup,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import { useAppSelector } from "../../../app/hooks";
import { getCurrentFinancialYear } from "../../../features/financialYearSlice";
import { getMaterializedData } from "../../../services/materializeViewApi";
import DateSelection from "../components/dateSelection";
import TMaterializedView from "./components/tMaterializedView";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { savePDF } from "@progress/kendo-react-pdf";
import { Box } from "@mui/system";
import { ExcelBtn } from "../../../utils/buttons";

const MaterializedView = () => {
  const PrintComponent = () => {
    let componentRef: any = useRef<HTMLDivElement>(null);

    const savePdf = () => {
      savePDF(componentRef.current, {
        scale: 0.6,
        paperSize: "A4",
        fileName: "MaterializedView",
      });
    };
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [allData, setAllData] = useState<any[]>([]);
    const [dateValue, setDateValue] = useState<any>("");
    const { Name, NepaliStartDate, NepaliEndDate } = useAppSelector(
      getCurrentFinancialYear
    );
    const [dateChoose, setDateChoose] = useState({
      StartDate: NepaliStartDate,
      EndDate: NepaliEndDate,
    });

    useEffect(() => {
      setIsLoading(true);
      const loAdData = async () => {
        const res = await getMaterializedData(dateValue, Name);
        setAllData(res);
        setIsLoading(false);
      };
      loAdData();
    }, [dateValue]);

    const dateOnChange = (v: any) => {
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
            <Typography variant="h6">Materialized View</Typography>
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
            <DateSelection dateOnChange={dateOnChange} dateValues={dateValue} />
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
                    sx={{ mx: 2 }}
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => savePdf()}
                    startIcon={<PictureAsPdfIcon />}
                  >
                    Pdf
                  </Button>
                  <ExcelBtn fileName="Materialized View" disable={!validate} />
                </ButtonGroup>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <div ref={componentRef} style={{ padding: "5px" }}>
          {isLoading ? (
            <LinearProgress sx={{ marginTop: 3 }} />
          ) : (
            <TMaterializedView
              allData={allData}
              dateChoose={dateChoose}
              dateValue={dateValue}
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

export default MaterializedView;
