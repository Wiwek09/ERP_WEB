import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../app/hooks";
import { getCurrentFinancialYear } from "../../../../features/financialYearSlice";
import { getDebtorsAgeingReport } from "../../../../services/DebtorsAgeingReportAPI";
import { LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import DateHeader from "../../../../components/headers/dateHeader";
import { getStockAgeingReport } from "../../../../services/StockAgeingReportAPI";

const TableStockAgeingReport = () => {
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
        const res: any = await getStockAgeingReport(Name);
        setAllData(res);
        setIsLoading(false);
      };
      loAdData();
    }, []);
    return (
        <>
          {!isLoading ? (
            <TableContainer component={Paper} sx={{ mt: 2 }} id="printDownloadPDF">
              <DateHeader headerName="Stock Ageing Report" date={dateChoose} />
              <Table stickyHeader aria-label="sticky table" id="downloadExcel">
                <TableHead>
                 <TableRow>
                    <TableCell colSpan={3} align="left" sx={{ fontWeight: "bold" }}>
                    Product Code
                    </TableCell>
                    <TableCell align="left" sx={{ fontWeight: "bold" }}>
                    Product Name
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Total Qty
                    </TableCell>                    
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Less 30 Days Qty 
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                     Less 90 Days Qty 
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                     Less 180 Days Qty 
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                     Gtr 180 Days Qty 
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
                              {data.Code}
                            </TableCell>
                            <TableCell align="left">
                              {data.Name}
                            </TableCell>
                            <TableCell align="right">
                            {data.Qty}
                            </TableCell>                            
                            <TableCell align="right">
                            {data.Day30}
                            </TableCell>
                            <TableCell align="right">
                            {data.Day90}
                            </TableCell>
                            <TableCell align="right">
                            {data.Day180Less}
                            </TableCell>
                            <TableCell align="right">
                            {data.Day180More}
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <LinearProgress sx={{ marginTop: 3 }} />
          )}
        </>
      );  
};
export default TableStockAgeingReport;
