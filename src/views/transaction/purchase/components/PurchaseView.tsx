import PrintPdfPurchase from "./PrintPdfPurchase";
import { Button, Grid, IconButton, Paper, Tooltip } from "@mui/material";
import { useRef } from "react";
import { BiLeftArrowCircle } from "react-icons/bi";
import ReactToPrint from "react-to-print";
import { useHistory } from "react-router";
import { savePDF } from "@progress/kendo-react-pdf";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

const PurchaseView = () => {
  const PrintComponent = () => {
    let componentRef: any = useRef<HTMLDivElement>(null);
    const history = useHistory();

    const savePdf = () => {
      savePDF(componentRef.current, {
        scale: 0.6,
        paperSize: "A4",
        fileName: "purchase",
      });
    };
    return (
      <>
        <Paper
          sx={{
            mx: "auto",
            flexGrow: 1,
            py: 1,
            borderRadius: 1,
            boxShadow: 3,
          }}
        >
          <Grid
            spacing={2}
            sx={{
              display: "flex",
              alignItems: "center",
              px: { xs: 1, md: 2, lg: 3 },
            }}
            container
          >
            <Grid
              item
              xs={10}
              sx={{
                display: "flex",
                justifyContent: "flex-start",
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
            <Grid
              item
              xs={2}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Tooltip title="Go Back" followCursor={true}>
                <IconButton
                  sx={{ fontSize: "2.1rem" }}
                  color="primary"
                  onClick={() => history.goBack()}
                >
                  <BiLeftArrowCircle style={{ cursor: "pointer" }} />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Paper>

        <div ref={componentRef} style={{ padding: "3px" }}>
          <PrintPdfPurchase />
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

export default PurchaseView;
