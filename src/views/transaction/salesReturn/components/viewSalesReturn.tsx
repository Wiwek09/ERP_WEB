import { Button, Grid, IconButton, Paper, Tooltip } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { BiLeftArrowCircle } from "react-icons/bi";
import ReactToPrint from "react-to-print";
import { useHistory, useParams } from "react-router";
import { savePDF } from "@progress/kendo-react-pdf";
import PrintSalesReturn from "./tableSalesReturn";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { IParams } from "../../../../interfaces/params";
import { useAppSelector } from "../../../../app/hooks";
import { selectCompany } from "../../../../features/companySlice";
import { getSalesReturn } from "../../../../services/salesReturnApi";
import { getBillReturn } from "../../../../services/invoice";
import { errorMessage } from "../../../../utils/messageBox/Messages";

const PrintViewSalesReturn = () => {
  const PrintComponent = () => {
    let componentRef: any = useRef<HTMLDivElement>(null);
    const { id }: IParams = useParams();
    const company = useAppSelector(selectCompany);
    const [allData, setAllData] = useState<any>();
    const history = useHistory();

    useEffect(() => {
      const getDataHere = async () => {
        const res = await getSalesReturn(id);
        setAllData(res);
      };
      getDataHere();
    }, [id]);

    const savePdf = () => {
      savePDF(componentRef.current, {
        scale: 0.6,
        paperSize: "A4",
        fileName: "SalesReturn",
      });
    };
    const handleAfterPrint = () => {
      history.push(`/sales-return/view/${id}`);
    };
    const handleOnBeforeGetContent = async () => {
      // if (company.IRD_SYS === "Yes") {
      //   const responsess = await getBillReturn(id, allData?.UserName);
      // } else {
      //   errorMessage("Look at company IRDSYS.");
      // }
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
                onAfterPrint={handleAfterPrint}
                onBeforeGetContent={handleOnBeforeGetContent}
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

        <div
          ref={componentRef}
          style={{ padding: "15px", display: "flex", height: "100%" }}
        >
          <style type="text/css" media="print">
            {
              "\
                  @page {size: portrait;}\
                  "
            }
          </style>
          <PrintSalesReturn />
        </div>

        {/* <div ref={componentRef} style={{ marginTop:'40px', height: "100%" }}>
          <PrintSalesReturn />
        </div> */}
      </>
    );
  };

  return (
    <>
      <PrintComponent />
    </>
  );
};

export default PrintViewSalesReturn;
