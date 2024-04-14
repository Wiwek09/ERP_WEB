import { Button, Grid, Paper, Typography } from "@mui/material";
import { useRef } from "react";
import ReactToPrint from "react-to-print";
import PrintIcon from "@mui/icons-material/Print";
import { savePDF } from "@progress/kendo-react-pdf";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import BalanceSheetTable from "./components/bTable";

const BalanceSheet = () => {
  const PrintComponent = () => {
    let componentRef: any = useRef<HTMLDivElement>(null);

    const savePdf = () => {
      savePDF(componentRef.current, {
        scale: 0.6,
        paperSize: "A4",
        fileName: "BalanceSheet",
      });
    };

    return (
      <>
        <Paper
          sx={{
            py: 1,
            mx: "auto",
            flexGrow: 1,
            borderRadius: 1,
            boxShadow: 3,
          }}
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
              md={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: { md: "flex-start", xs: "center" },
              }}
            >
              <Typography variant="h6">Balance Sheet</Typography>
            </Grid>
            <Grid
              item
              lg={7}
              md={6}
              xs={12}
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
                sx={{ mx: 2 }}
                size="small"
                variant="contained"
                color="error"
                onClick={() => savePdf()}
                startIcon={<PictureAsPdfIcon />}
              >
                Pdf
              </Button>
            </Grid>
          </Grid>
        </Paper>
        <div ref={componentRef} style={{ padding: "3px" }}>
          <BalanceSheetTable />
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

export default BalanceSheet;
