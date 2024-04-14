import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";

import { useAppSelector } from "../../../../app/hooks";

import { getCurrentFinancialYear } from "../../../../features/financialYearSlice";
import { IBranch } from "../../../../interfaces/branch";
import {
  IAccountHolder,
  IPurchaseMenu,
  IPurchaseOrderAllData,
} from "../../../../interfaces/purchaseOrder";
import { getAllBranch } from "../../../../services/branchApi";
import {
  getAllAccountHolder,
  getAllPurchase,
  getAllPurchaseOrder,
} from "../../../../services/purchaseOrderApi";

const ExcelPurchaseOrder = () => {
  const [accountHolder, setAccountHolder] = useState<IAccountHolder[]>([]);
  const [branchDetails, setBranchDetails] = useState<IBranch[]>([]);
  const [products, setProducts] = useState<IPurchaseMenu[]>([]);
  const companyName = useAppSelector((state) => state.company.data.NameEnglish);
  const FinancialYear = useAppSelector(getCurrentFinancialYear);
  const [allData, setAllData] = useState<IPurchaseOrderAllData[]>([]);

  const getData = async () => {
    const response = await getAllPurchaseOrder(
      FinancialYear.StartDate,
      FinancialYear.EndDate,
      FinancialYear.Name
    );
    if (response) {
      setAllData(
        response.map((data: IPurchaseOrderAllData) => ({
          ...data,
        }))
      );
    }
    const accountHolderRes = await getAllAccountHolder();
    setAccountHolder(accountHolderRes);

    const productsRes = await getAllPurchase();
    setProducts(productsRes);

    const BranchRes: IBranch[] = await getAllBranch();
    setBranchDetails(BranchRes);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Box sx={{ display: "none" }} id="printDownloadPDF">
        <TableContainer component={Paper}>
          <Table id="downloadExcel" stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell
                  colSpan={5}
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
                  colSpan={5}
                  sx={{
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  Purchase Order
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={5}
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
                <TableCell align="left" className={"text-bold"}>
                  S.N
                </TableCell>
                <TableCell colSpan={1} align="center" className={"text-bold"}>
                  Account
                </TableCell>
                <TableCell align="center" className={"text-bold"}>
                  Branch
                </TableCell>
                <TableCell align="center" className={"text-bold"}>
                  Message
                </TableCell>
                <TableCell align="center" className={"text-bold"}>
                  Expiry date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allData &&
                allData.map((data: IPurchaseOrderAllData, index: number) => {
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
                        <TableCell align="center">{data.Message}</TableCell>
                        <TableCell align="center">
                          {data.ExpiredNepaliDate &&
                            data.ExpiredNepaliDate.substring(0, 10)}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell
                          align="right"
                          sx={{ fontWeight: "500" }}
                          className={"text-bold text-right"}
                        >
                          S.N
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ fontWeight: "500" }}
                          className={"text-bold"}
                        >
                          Item name
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ fontWeight: "500" }}
                          className={"text-bold"}
                        >
                          Quantity
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ fontWeight: "500" }}
                          className={"text-bold text-right"}
                        >
                          Rate
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ fontWeight: "500" }}
                          className={"text-bold text-right"}
                        >
                          Amount
                        </TableCell>
                      </TableRow>

                      {data.PurchaseOrderDetails.map((value, ind) => {
                        const getProductName = products?.find(
                          (elm) => elm.Id === value.ItemId
                        );
                        return (
                          <>
                            <TableRow id={ind + "val"}>
                              <TableCell align="right" className={"text-right"}>
                                {ind + 1}
                              </TableCell>
                              <TableCell align="center">
                                {getProductName ? getProductName.Name : "...."}
                              </TableCell>
                              <TableCell align="center">{value.Qty}</TableCell>
                              <TableCell align="right" className={"text-right"}>
                                {value.UnitPrice}
                              </TableCell>
                              <TableCell align="right" className={"text-right"}>
                                {value.TotalAmount}
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
      </Box>
    </>
  );
};

export default ExcelPurchaseOrder;
