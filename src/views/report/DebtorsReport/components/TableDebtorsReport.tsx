import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import DateHeader from "../../../../components/headers/dateHeader";

const TableCreditorsReport = ({
    AccountDebtorCreditor,
    DateChoose
  }: any) => {
    return (
      <>
        {AccountDebtorCreditor && AccountDebtorCreditor?.length > 0 ? (
          <TableContainer
            component={Paper}
            id="printDownloadPDF"
            sx={{ width: "100%", mx: "auto" }}
          >
            <DateHeader headerName="Debtor's Report" date={DateChoose} />            
            <Table id="downloadExcel">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }} align="left">
                  Party Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Opening Balance (Rs.)
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Debit (Rs.)
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Credit (Rs.) 
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Closing Balance (Rs.)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {AccountDebtorCreditor &&
                AccountDebtorCreditor.map((data: any, index: number) => {
                  return (
                    <>
                      <TableRow id={index + "main"}>
                        <TableCell align="left">
                          {data.LedgerName}
                        </TableCell>
                        <TableCell align="right">
                        {Math.abs(data.OpeningBalance).toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                        {Math.abs(data.Debit).toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                        {Math.abs(data.Credit).toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                        {Math.abs(data.ClosingBalance).toFixed(2)}
                        </TableCell>
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
export default TableCreditorsReport;