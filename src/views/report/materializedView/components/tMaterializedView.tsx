import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Box } from "@mui/system";
import { useAppSelector } from "../../../../app/hooks";
import DateHeader from "../../../../components/headers/dateHeader";
import { selectCompany } from "../../../../features/companySlice";

const TMaterializedView = ({ allData, dateChoose, dateValue }: any) => {
  const CompanyData = useAppSelector(selectCompany);
  return (
    <>
      {allData?.length > 0 ? (
        <TableContainer component={Paper} id="printDownloadPDF">
          <DateHeader
            headerName={`Materialized View of ${dateValue}`}
            date={dateChoose}
          />
          <Table stickyHeader aria-label="sticky table" id="downloadExcel">
            <TableHead>
              <TableRow sx={{ display: "none" }}>
                <TableCell colSpan={20} align="center">
                  {CompanyData?.NameEnglish}
                </TableCell>
              </TableRow>
              <TableRow sx={{ display: "none" }}>
                <TableCell colSpan={20} align="center">
                  Materialized View of {dateValue}
                </TableCell>
              </TableRow>
              <TableRow sx={{ display: "none" }}>
                <TableCell colSpan={20} align="center">
                  {`${dateChoose.StartDate} - ${dateChoose.EndDate}`}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={20}>
                  Invoice
                  <Box sx={{ float: "right" }}>
                    <h4>
                      No. of Bills: {allData.length > 0 ? allData.length : "0"}
                    </h4>
                  </Box>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">Fiscal Year</TableCell>
                <TableCell align="left">Bill No</TableCell>
                <TableCell align="left">Customer Name</TableCell>
                <TableCell align="left">Customer Pan</TableCell>
                <TableCell align="left">Date</TableCell>
                <TableCell align="left">Amount</TableCell>
                <TableCell align="left">Discount</TableCell>
                <TableCell align="left">Taxable Amount</TableCell>
                <TableCell align="left">Tax Amount</TableCell>
                <TableCell align="left">Total Amount</TableCell>
                <TableCell align="left">Sync with IRD</TableCell>
                <TableCell align="left">Is Bill Printed</TableCell>
                <TableCell align="left">Is Bill Active</TableCell>
                <TableCell align="left">Printed Time</TableCell>
                <TableCell align="left">Entered By</TableCell>
                <TableCell align="left">Printed By</TableCell>
                <TableCell align="left">Is RealTime</TableCell>
                <TableCell align="left">Payment Method</TableCell>
                <TableCell align="left">VAT Refund Amount</TableCell>
                <TableCell align="left">TransactionId</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allData &&
                allData.map((data: any, index: number) => {
                  return (
                    <>
                      <TableRow id={index + "main"}>
                        <TableCell align="left">{data.Fiscal_Year}</TableCell>
                        <TableCell align="left">{data.Bill_no}</TableCell>
                        <TableCell align="left">{data.Customer_name}</TableCell>
                        <TableCell align="left">{data.Customer_Pan}</TableCell>
                        <TableCell align="left">{data.Bill_Date}</TableCell>
                        <TableCell align="left">{data.Amount}</TableCell>
                        <TableCell align="left">{data.Discount}</TableCell>
                        <TableCell align="left">
                          {data.Taxable_Amount}
                        </TableCell>
                        <TableCell align="left">{data.Tax_Amount}</TableCell>
                        <TableCell align="left">{data.Total_Amount}</TableCell>
                        <TableCell align="left">{data.Sync_with_IRD}</TableCell>
                        <TableCell align="left">
                          {data.IS_Bill_Printed ? "true" : "false"}
                        </TableCell>
                        <TableCell align="left">
                          {data.Is_Bill_Active ? "true" : "false"}
                        </TableCell>
                        <TableCell align="left">{data.Printed_Time}</TableCell>
                        <TableCell align="left">{data.Entered_By}</TableCell>
                        <TableCell align="left">{data.Printed_by}</TableCell>
                        <TableCell align="left">
                          {data.Is_realtime ? "true" : "false"}
                        </TableCell>
                        <TableCell align="left">
                          {data.Payment_Method}
                        </TableCell>
                        <TableCell align="left">
                          {data.VAT_Refund_Amount}
                        </TableCell>
                        <TableCell align="left">{data.TransactionId}</TableCell>
                      </TableRow>
                    </>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        "No Data Found"
      )}
    </>
  );
};

export default TMaterializedView;
