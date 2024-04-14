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
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../app/hooks";
import DateHeader from "../../../../components/headers/dateHeader";
import { getCurrentFinancialYear } from "../../../../features/financialYearSlice";
import { getBalanceSheetAPI } from "../../../../services/balanceSheetApi";

const BalanceSheetTable = () => {
  const [allData, setAllData] = useState<any[]>([]);
  const { Name, NepaliStartDate, NepaliEndDate } = useAppSelector(
    getCurrentFinancialYear
  );
  const [dateChoose, setDateChoose] = useState({
    StartDate: NepaliStartDate,
    EndDate: NepaliEndDate,
  });

  useEffect(() => {
    const loAdData = async () => {
      const res = await getBalanceSheetAPI(Name);
      setAllData(res[0]);
    };
    loAdData();
  }, []);
  const { Asset, Lability }: any = allData;

  const totalAsset =
    Asset &&
    Asset.reduce(function (a: any, b: any) {
      return a + b.Amount;
    }, 0);
  const totalLibility =
    Lability &&
    Lability.reduce(function (a: any, b: any) {
      return a + b.Amount;
    }, 0);

  return (
    <>
      {allData ? (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <DateHeader headerName="Balance Sheet" date={dateChoose} />
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell width="50%" align="left">
                  Liabilities
                </TableCell>
                <TableCell width="50%" align="left">
                  Assets
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell
                  align="left"
                  sx={{ display: "flex", alignItems: "start", height: "100%" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    {Lability
                      ? Lability.map((data: any) => {
                          return (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                p: 1,
                              }}
                            >
                              <Typography variant="body2">
                                {data.Name}
                              </Typography>
                              <Typography variant="body2">
                                {data?.Amount.toFixed(2)}
                              </Typography>
                            </Box>
                          );
                        })
                      : "...Loading"}
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {Asset
                      ? Asset.map((data: any) => {
                          return (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                p: 1,
                              }}
                            >
                              <Typography variant="body2">
                                {data.Name}
                              </Typography>
                              <Typography variant="body2">
                                {data?.Amount.toFixed(2)}
                              </Typography>
                            </Box>
                          );
                        })
                      : "...Loading"}
                  </Box>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      p: 1,
                    }}
                  >
                    <Typography sx={{ fontWeight: "500" }}>
                      Liabilities Total :
                    </Typography>
                    <Typography sx={{ fontWeight: "500" }}>
                      {totalLibility?.toFixed(2)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      p: 1,
                    }}
                  >
                    <Typography sx={{ fontWeight: "500" }}>
                      Assets Total :
                    </Typography>
                    <Typography sx={{ fontWeight: "500" }}>
                      {totalAsset?.toFixed(2)}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No Data Found</Typography>
      )}
    </>
  );
};

export default BalanceSheetTable;
