import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import DateHeader from "../../../../components/headers/dateHeader";

const TableItemWise = ({
  AllItemWiseProfits,
  DateChoose
  }: any) => {
    return (
      <>
        {AllItemWiseProfits?.length > 0 ? (
          <TableContainer
            component={Paper}
            id="printDownloadPDF"
            sx={{ width: "100%", mx: "auto" }}
          >
                      <DateHeader headerName="Item's wise Profit" date={DateChoose} />
            <Table id="downloadExcel">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }} align="left">
                  Item Code
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Item Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Opening Stock
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Purchase 
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Purchase return
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Sales
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Sales Return
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Closing Stock
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Profit
                  </TableCell>                  
                </TableRow>
              </TableHead>
              <TableBody>
              {AllItemWiseProfits &&
                AllItemWiseProfits.map((data: any, index: number) => {
                  return (
                    <>
                      <TableRow id={index + "main"}>
                        <TableCell align="left">
                          {data.Code}
                        </TableCell>
                        <TableCell align="left">
                          {data.Name}
                        </TableCell>
                        <TableCell align="right">
                        {Math.abs(data.OpeningStock).toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                        {Math.abs(data.Purchase).toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                        {Math.abs(data.PurchaseReturn).toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                        {Math.abs(data.Sales).toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                        {Math.abs(data.SalesReturn).toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                        {Math.abs(data.ClosingStock).toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                        {Math.abs(data.Profit).toFixed(2)}
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
export default TableItemWise;