import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import DateHeader from "../../../../components/headers/dateHeader";

const TableCustomersReport = ({
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
<DateHeader headerName="Customer's Report" date={DateChoose} />            
            <Table id="downloadExcel">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }} align="left">
                  Party Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="left">
                  Mobile Number 
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="left">
                  Address
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Sales During Period 
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
                        <TableCell align="left">
                        {data.Phone}
                        </TableCell>
                        <TableCell align="left">
                        {data.Address}
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
export default TableCustomersReport;