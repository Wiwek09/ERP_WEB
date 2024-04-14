import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../app/hooks";
import DateHeader from "../../../../components/headers/dateHeader";
import { selectCompany } from "../../../../features/companySlice";
import { getCurrentFinancialYear } from "../../../../features/financialYearSlice";
import { getProfitAndLossAPI } from "../../../../services/profitAndLossApi";

const ProfitAndLossTable = () => {
  const [allData, setAllData] = useState<any[]>([]);
  const { Name, NepaliStartDate, NepaliEndDate } = useAppSelector(
    getCurrentFinancialYear
  );
  const [dateChoose, setDateChoose] = useState({
    StartDate: NepaliStartDate,
    EndDate: NepaliEndDate,
  });
  const CompanyData = useAppSelector(selectCompany);

  useEffect(() => {
    const loAdData = async () => {
      const res = await getProfitAndLossAPI(Name);
      setAllData(res);
    };
    loAdData();
  }, []);
  return (
    <>
      {allData ? (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <DateHeader headerName="Profit And Loss" date={dateChoose} />
          <Table stickyHeader aria-label="sticky table" id="downloadExcel">
            <TableHead>
              <TableRow sx={{ display: "none" }}>
                <TableCell colSpan={2} align="center">
                  {CompanyData?.NameEnglish}
                </TableCell>
              </TableRow>
              <TableRow sx={{ display: "none" }}>
                <TableCell colSpan={2} align="center">
                  Profit And Loss
                </TableCell>
              </TableRow>
              <TableRow sx={{ display: "none" }}>
                <TableCell colSpan={2} align="center">
                  {`${dateChoose.StartDate} - ${dateChoose.EndDate}`}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">Particular</TableCell>
                <TableCell align="right">Amount(Rs)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allData &&
                allData.map((data: any, index: number) => {
                  return (
                    <>
                      <TableRow id={index + "main"}>
                        <TableCell
                          align="left"
                          sx={{
                            fontWeight:
                              data.Name === "Expenses" ||
                              data.Name === "Income" ||
                              data.Name === "Total" ||
                              data.Name === "Income" ||
                              data.Name === "Net Profit / Loss"
                                ? "500"
                                : "400",
                          }}
                        >
                          {data.Name}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            fontWeight:
                              data.Name === "Expenses" ||
                              data.Name === "Income" ||
                              data.Name === "Total" ||
                              data.Name === "Income" ||
                              data.Name === "Net Profit / Loss"
                                ? "500"
                                : "400",
                          }}
                        >
                          {data.Name === "Expenses" || data.Name === "Income"
                            ? ""
                            : data?.Amount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No Data Found</Typography>
      )}
    </>
  );
};

export default ProfitAndLossTable;
