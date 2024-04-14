import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../app/hooks";
import { getCurrentFinancialYear } from "../../../../features/financialYearSlice";
import { getDebtorsAgeingReport } from "../../../../services/DebtorsAgeingReportAPI";
import { LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import DateHeader from "../../../../components/headers/dateHeader";

const TableAgeingReport = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [allData, setAllData] = useState<any[]>([]);
    const { Name, NepaliStartDate, NepaliEndDate } = useAppSelector(
      getCurrentFinancialYear
    );
    const [dateChoose] = useState({
      StartDate: NepaliStartDate,
      EndDate: NepaliEndDate,
    });
  
    useEffect(() => {
      setIsLoading(true);
      const loAdData = async () => {
        const res: any = await getDebtorsAgeingReport(Name);
        setAllData(res);
        setIsLoading(false);
      };
      loAdData();
    }, []);
    return (
        <>
          {!isLoading ? (
            <TableContainer component={Paper} sx={{ mt: 2 }} id="printDownloadPDF">
              <DateHeader headerName="Debtor's Ageing Report" date={dateChoose} />
              <Table stickyHeader aria-label="sticky table" id="downloadExcel">
                <TableHead>
                 <TableRow>
                    <TableCell colSpan={3} align="left" sx={{ fontWeight: "bold" }}>
                    Party Name
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Amount (Rs.)
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Less 30 Days (Rs.) 
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                     Less 90 Days (Rs.) 
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                     Less 180 Days (Rs.) 
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                     Gtr 180 Days (Rs.) 
                    </TableCell>                                        
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allData &&
                    allData.map((data: any, index: number) => {
                      return (
                        <>
                          <TableRow id={index + "main"}>
                            <TableCell colSpan={3} align="left">
                              {data.Name}
                            </TableCell>
                            <TableCell align="right">
                              {Math.abs(data.Total).toFixed(2)}
                            </TableCell>
                            <TableCell align="right">
                            {Math.abs(data.Day30).toFixed(2)}
                            </TableCell>
                            <TableCell align="right">
                            {Math.abs(data.Day90).toFixed(2)}
                            </TableCell>
                            <TableCell align="right">
                            {Math.abs(data.Day180Less).toFixed(2)}
                            </TableCell>
                            <TableCell align="right">
                            {Math.abs(data.Day180More).toFixed(2)}
                            </TableCell>                            
                          </TableRow>
                        </>
                      );
                    })}
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      align="center"
                      sx={{ fontWeight: "bold" }}
                    >
                      Total(Rs.)
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      {/* {totalDebit?.toFixed(2)} */}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      {/* {totalCredit?.toFixed(2)} */}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <LinearProgress sx={{ marginTop: 3 }} />
          )}
        </>
      );  
};
export default TableAgeingReport;
