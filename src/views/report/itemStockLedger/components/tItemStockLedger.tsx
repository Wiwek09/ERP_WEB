import { Paper } from "@mui/material";
import { getCurrentFinancialYear } from "../../../../features/financialYearSlice";
import { useAppSelector } from "../../../../app/hooks";
import { TableContainer } from "@mui/material";
import { Table } from "@mui/material";
import { TableHead } from "@mui/material";
import { TableRow } from "@mui/material";
import { TableCell } from "@mui/material";
import { TableBody } from "@mui/material";
import DateHeader from "../../../../components/headers/dateHeader";
import { makeStyles } from "@mui/styles";
import { IItemStockLedger } from "./../index";
import { selectCompany } from "../../../../features/companySlice";

const useStyles = makeStyles({
  table: {
    "& .MuiTableCell-root": {
      borderLeft: "1px solid rgba(224, 224, 224, 1)",
      borderTop: "1px solid rgba(224, 224, 224, 1)",
    },
  },
});
const getBillNo = (bill: string): string => {
  let billNo = "";

  let startPosition = bill.search("#");
  let endPosition = bill.search("]");

  for (let index = startPosition + 1; index < endPosition; index++) {
    billNo += bill[index];
  }
  return billNo;
};
const TItemStockLedger = ({ allData, name }: any) => {
  const classes = useStyles();
  const CompanyData = useAppSelector(selectCompany);
  const { NepaliStartDate, NepaliEndDate } = useAppSelector(
    getCurrentFinancialYear
  );
  const renum = /^[0-9\b]+$/;
  return (
    <>
      {allData?.length > 0 ? (
        <>
          <Paper id="printDownloadPDF">
            <DateHeader headerName={`${name} Details`} />
            <TableContainer>
              <Table stickyHeader id="downloadExcel" className={classes.table}>
                <TableHead>
                  <TableRow sx={{ display: "none" }}>
                    <TableCell colSpan={8} align="center">
                      {CompanyData?.NameEnglish}
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ display: "none" }}>
                    <TableCell colSpan={8} align="center">
                      {name} Details
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ display: "none" }}>
                    <TableCell colSpan={8} align="center">
                      {`${NepaliStartDate} - ${NepaliEndDate}`}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3}></TableCell>
                    <TableCell colSpan={4} align="center">
                      QTY
                    </TableCell>
                    <TableCell colSpan={2}></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Particular</TableCell>
                    <TableCell>Bill No.</TableCell>
                    <TableCell>In</TableCell>
                    <TableCell>Out</TableCell>
                    <TableCell>Balance</TableCell>
                    <TableCell>UnitType</TableCell>
                    <TableCell align="right">Rate(Rs.)</TableCell>
                    <TableCell align="right">Amount(Rs.)</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {allData?.map((item: IItemStockLedger) => (
                    <>
                      <TableRow>
                        <TableCell>{item.TDate}</TableCell>
                        <TableCell>{item.PartyName}</TableCell>
                        <TableCell>
                          {!isNaN(+String(item.BillNumber)) === true
                            ? item.BillNumber
                            : parseInt(getBillNo(String(item.BillNumber)))}
                        </TableCell>
                        <TableCell>{item.QtyIn}</TableCell>
                        <TableCell>{item.QtyOut}</TableCell>
                        <TableCell>{item.QtyBalance}</TableCell>
                        <TableCell>{item.UnitType}</TableCell>
                        <TableCell align="right">
                          {item?.Rate.toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          {item?.Amount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      ) : (
        "No Data Found"
      )}
    </>
  );
};

export default TItemStockLedger;
