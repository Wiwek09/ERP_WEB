import {
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
import { getCurrentFinancialYear } from "../../../../features/financialYearSlice";
import { IBranch } from "../../../../interfaces/branch";
import { IAccountHolder } from "../../../../interfaces/purchaseOrder";
import { getAllBranch } from "../../../../services/branchApi";
import { getAllAccountHolder } from "../../../../services/purchaseOrderApi";
import { getAllOrderManagement } from "../../../../services/orderManagementApi";
import { IOrderManagement } from "../../../../interfaces/orderManagement";
import { IFinancialYear } from "../../../../interfaces/financialYear";

const ExcelOrderManagement = () => {
  const [accountHolder, setAccountHolder] = useState<IAccountHolder[]>([]);
  const [branchDetails, setBranchDetails] = useState<IBranch[]>([]);
  const FinancialYear: IFinancialYear = useAppSelector(getCurrentFinancialYear);
  const [allData, setAllData] = useState<any[]>([]);
  const companyName = useAppSelector((state) => state.company.data.NameEnglish);

  const getData = async () => {
    const response = await getAllOrderManagement(
      FinancialYear.StartDate,
      FinancialYear.EndDate,
      FinancialYear.Name
    );
    if (response) {
      setAllData(
        response.map((data: any) => ({
          ...data,
        }))
      );
    }
    const accountHolderRes = await getAllAccountHolder();
    setAccountHolder(accountHolderRes);

    const BranchRes: IBranch[] = await getAllBranch();
    setBranchDetails(BranchRes);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Paper sx={{ display: "none" }} id="printDownloadPDF">
        <TableContainer component={Paper}>
          <Table
            id="downloadExcel"
            stickyHeader
            aria-label="sticky table"
            sx={{ minWidth: 650 }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  colSpan={6}
                  sx={{
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  {companyName}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell
                  colSpan={6}
                  sx={{
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  Order Management
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={6}
                  sx={{
                    textAlign: "center",
                    fontSize: 15,
                  }}
                >
                  {`${FinancialYear?.StartDate.substring(
                    0,
                    10
                  )} - ${FinancialYear?.EndDate.substring(0, 10)}`}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center" className={"text-bold"}>
                  S.N
                </TableCell>
                <TableCell align="center" className={"text-bold"}>
                  Account
                </TableCell>
                <TableCell align="center" className={"text-bold"}>
                  Branch
                </TableCell>
                <TableCell align="center" className={"text-bold"}>
                  O. Date
                </TableCell>
                <TableCell align="center" className={"text-bold"}>
                  Expire date
                </TableCell>
                <TableCell align="center" className={"text-bold"}>
                  O. Message
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allData &&
                allData.map((data: IOrderManagement, index: number) => {
                  const getAccountHolder = accountHolder?.find(
                    (elm) => elm.Id === data.AccountId
                  );
                  const getBranch = branchDetails?.find(
                    (elm) => elm.Id === data.BranchId
                  );

                  return (
                    <>
                      <TableRow id={index + "main"}>
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell align="center">
                          {getAccountHolder ? getAccountHolder.Name : "...."}
                        </TableCell>
                        <TableCell align="center">
                          {getBranch ? getBranch.NameEnglish : "...."}
                        </TableCell>
                        <TableCell align="center">
                          {data.NepaliDate?.substring(0, 10)}
                        </TableCell>
                        <TableCell align="center">
                          {data.DueNepaliDate?.substring(0, 10)}
                        </TableCell>
                        <TableCell align="center">{data.Message}</TableCell>
                      </TableRow>
                    </>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default ExcelOrderManagement;
