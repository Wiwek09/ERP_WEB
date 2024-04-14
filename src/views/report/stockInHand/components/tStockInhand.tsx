import {
  TableCell,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material";
import { useAppSelector } from "../../../../app/hooks";
import DateHeader from "../../../../components/headers/dateHeader";
import { selectCompany } from "../../../../features/companySlice";
import { getCurrentFinancialYear } from "../../../../features/financialYearSlice";

const TStockInhand = ({ allData }: any) => {
  const getCategories = allData
    ?.map((item: any) => item.CategoryName)
    ?.filter(
      (value: any, index: any, self: any) => self.indexOf(value) === index
    );

  const CompanyData = useAppSelector(selectCompany);
  const { NepaliEndDate } = useAppSelector(
    getCurrentFinancialYear
  );

  return (
    <>
      {allData?.length > 0 ? (
        <>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <DateHeader headerName="Stock In Hand" />
            <Table stickyHeader id="downloadExcel">
              <TableHead>
                <TableRow sx={{ display: "none" }}>
                  <TableCell colSpan={7} align="center">
                    {CompanyData?.NameEnglish}
                  </TableCell>
                </TableRow>
                <TableRow sx={{ display: "none" }}>
                  <TableCell colSpan={7} align="center">
                    Stock In Hand
                  </TableCell>
                </TableRow>
                <TableRow sx={{ display: "none" }}>
                  <TableCell colSpan={7} align="center">
                    Upto {`${NepaliEndDate}`}
                  </TableCell>
                </TableRow>
                <TableRow sx={{ bgcolor: "primary.tableHeader" }}>
                  <TableCell align="left">S.N</TableCell>
                  <TableCell align="left" colSpan={7}>
                    Category Name
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getCategories &&
                  getCategories?.map((elm: any, i: any) => {
                    const filterDataByCategory = allData?.filter(
                      (cat: any) => cat.CategoryName === elm
                    );
                    return (
                      <>
                        <TableRow sx={{ bgcolor: "primary.tableHeader" }}>
                          <TableCell align="left"  sx={{ fontWeight: "bold" }}>
                            {i + 1}
                          </TableCell>
                          <TableCell
                            align="left"
                            colSpan={7}
                            sx={{ fontWeight: "bold" }}
                          >
                            {elm}
                          </TableCell>
                        </TableRow>
                        {filterDataByCategory?.length > 0 && (
                          <TableRow>
                            <TableCell></TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Item Code
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Item Name
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Min Qty
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Qty
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Unit Type
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Rate (Rs.)
                            </TableCell>                            
                            <TableCell
                              sx={{ fontWeight: "bold" }}
                              align="right"
                            >
                              Amount
                            </TableCell>
                          </TableRow>
                        )}
                        {filterDataByCategory?.map((item: any) => {
                          return (
                            <>
                              <TableRow>
                                <TableCell align="left"></TableCell>
                                <TableCell align="left">
                                  {item.ItemCode}
                                </TableCell>
                                <TableCell align="left">{item.Name}</TableCell>
                                <TableCell align="left">{item.MinQty}</TableCell>
                                <TableCell align="left">{item.Qty}</TableCell>
                                <TableCell align="left">
                                  {item.UnitType}
                                </TableCell>
                                <TableCell align="left">
                                  {(item.Amount / item.Qty).toFixed(2)}
                                </TableCell>                                
                                <TableCell align="right">
                                  {item.Amount}
                                </TableCell>
                              </TableRow>
                            </>
                          );
                        })}
                      </>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        "No Data Found"
      )}
    </>
  );
};

export default TStockInhand;
