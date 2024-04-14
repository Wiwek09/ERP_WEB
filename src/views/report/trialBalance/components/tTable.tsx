import {
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../app/hooks";
import DateHeader from "../../../../components/headers/dateHeader";
import { selectCompany } from "../../../../features/companySlice";
import { getCurrentFinancialYear } from "../../../../features/financialYearSlice";
import { getAllTrialBalance } from "../../../../services/trialBalanceApi";

const TrialBalanceTable = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allData, setAllData] = useState<any[]>([]);
  const { Name, NepaliStartDate, NepaliEndDate } = useAppSelector(
    getCurrentFinancialYear
  );
  const CompanyData = useAppSelector(selectCompany);
  const [dateChoose, setDateChoose] = useState({
    StartDate: NepaliStartDate,
    EndDate: NepaliEndDate,
  });

  useEffect(() => {
    setIsLoading(true);
    const loAdData = async () => {
      const res: any = await getAllTrialBalance(Name);
      setAllData(res);
      setIsLoading(false);
    };
    loAdData();
  }, []);

  const totalDebit =
    allData &&
    allData.reduce(function (a: any, b: any) {
      return a + b.Debit;
    }, 0);
  const totalCredit =
    allData &&
    allData.reduce(function (a: any, b: any) {
      return a + b.Credit;
    }, 0);

  return (
    <>
      {!isLoading ? (
        <TableContainer component={Paper} sx={{ mt: 2 }} id="printDownloadPDF">
          <DateHeader headerName="Trial Balance" date={dateChoose} />
          <Table stickyHeader aria-label="sticky table" id="downloadExcel">
            <TableHead>
              <TableRow sx={{ display: "none" }}>
                <TableCell colSpan={5} align="center">
                  {CompanyData?.NameEnglish}
                </TableCell>
              </TableRow>
              <TableRow sx={{ display: "none" }}>
                <TableCell colSpan={5} align="center">
                  Trial Balance
                </TableCell>
              </TableRow>
              <TableRow sx={{ display: "none" }}>
                <TableCell colSpan={5} align="center">
                  {`${NepaliStartDate} - ${NepaliEndDate}`}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} align="left" sx={{ fontWeight: "bold" }}>
                  Name
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Debit(Rs)
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Credit(Rs)
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
                          {data?.Debit > 0 ? data?.Debit.toFixed(2) : ""}
                        </TableCell>
                        <TableCell align="right">
                          {data?.Credit > 0 ? data?.Credit.toFixed(2) : ""}
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
                  {totalDebit?.toFixed(2)}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  {totalCredit?.toFixed(2)}
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

export default TrialBalanceTable;
