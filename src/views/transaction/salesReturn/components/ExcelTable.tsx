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
import { ISelectType } from "../../../../interfaces/autoComplete";
import { IAccountHolder } from "../../../../interfaces/purchaseOrder";
import {
  IProductSalesReturn,
  ISalesReturn,
} from "../../../../interfaces/salesReturn";
import { getAllAccountHolder } from "../../../../services/purchaseOrderApi";
import { getAllSalesReturn } from "../../../../services/salesReturnApi";

const ExcelSalesReturn = () => {
  const FinancialYear = useAppSelector(getCurrentFinancialYear);
  const companyName = useAppSelector((state) => state.company.data.NameEnglish);
  const [allData, setAllData] = useState<ISalesReturn[]>([]);
  const [accountHolder, setAccountHolder] = useState<ISelectType[]>([]);

  const getData = async () => {
    const response = await getAllSalesReturn(
      FinancialYear.NepaliStartDate,
      FinancialYear.NepaliEndDate
    );

    if (response) {
      setAllData(
        response.map((data: ISalesReturn) => ({
          ...data,
        }))
      );
    }

    const res: IAccountHolder[] = await getAllAccountHolder();
    setAccountHolder(
      res.map((item) => {
        return { label: item.Name, value: item.Id };
      })
    );
  };

  useEffect(() => {
    getData();
  }, []);
  const [crTotal, setCrTotal] = useState<number>(0);
  useEffect(() => {
    let crTotal = 0;
    allData.forEach((elm) => {
      elm.SalesOrderDetails.forEach((e: IProductSalesReturn) => {
        crTotal += e.TotalAmount;
      });
    });

    setCrTotal(crTotal);
  }, [allData]);

  const getBillNo = (bill: string): string => {
    let billNo = "";

    let startPosition = bill.search("#");
    let endPosition = bill.search("]");

    for (let index = startPosition + 1; index < endPosition; index++) {
      billNo += bill[index];
    }
    return billNo;
  };

  return (
    <>
      <Paper sx={{ display: "none" }} id="printDownloadPDF">
        <TableContainer component={Paper}>
          <Table
            stickyHeader
            aria-label="sticky table"
            sx={{ minWidth: 650 }}
            id="downloadExcel"
          >
            <TableHead>
              <TableRow>
                <TableCell
                  colSpan={8}
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
                  colSpan={8}
                  sx={{
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  Sales Return
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={8}
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
                  Date
                </TableCell>
                <TableCell align="center" className={"text-bold"}>
                  Bill No
                </TableCell>
                <TableCell align="center" className={"text-bold"}>
                  Customer Name
                </TableCell>
                <TableCell align="right" className={"text-bold text-right"}>
                  Amount
                </TableCell>
                <TableCell align="center" className={"text-bold"}>
                  Discount
                </TableCell>
                <TableCell align="center" className={"text-bold"}>
                  Grand Total
                </TableCell>
                <TableCell align="center" className={"text-bold"}>
                  Invoice No.
                </TableCell>
                <TableCell align="center" className={"text-bold"}>
                  File
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allData &&
                allData.map((data: ISalesReturn, index: number) => {
                  const accountHolderValue =
                    accountHolder &&
                    accountHolder.find(
                      (obj) => obj.value === data.SourceAccountTypeId
                    );
                  return (
                    <>
                      <TableRow id={index + "main"}>
                        <TableCell align="center" sx={{ fontWeight: "500" }}>
                          {data.AccountTransactionValues[0]?.NVDate}
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "500" }}>
                          {getBillNo(data?.Name)}
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "500" }}>
                          {accountHolderValue?.label}
                        </TableCell>

                        <TableCell
                          className={"text-right"}
                          align="right"
                          sx={{ fontWeight: "500" }}
                        >
                          {data.Amount.toFixed(2)}
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "500" }}>
                          {data.Discount.toFixed(2)}
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "500" }}>
                          {data.GrandAmount.toFixed(2)}
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "500" }}>
                          {data.ref_invoice_number}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ fontWeight: "500" }}
                        ></TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell
                          className={"text-bold text-right"}
                          align="right"
                          sx={{ fontWeight: "600" }}
                        >
                          Item Name
                        </TableCell>
                        <TableCell
                          className={"text-bold"}
                          align="center"
                          sx={{ fontWeight: "600" }}
                        >
                          Quantity
                        </TableCell>
                        <TableCell
                          className={"text-bold"}
                          align="center"
                          sx={{ fontWeight: "600" }}
                        >
                          Rate
                        </TableCell>
                        <TableCell
                          align="left"
                          sx={{ fontWeight: "600" }}
                        ></TableCell>
                        <TableCell
                          className={"text-bold text-right"}
                          align="right"
                          sx={{ fontWeight: "600" }}
                        >
                          Amount
                        </TableCell>
                        <TableCell
                          className={"text-bold"}
                          align="center"
                        ></TableCell>
                        <TableCell
                          className={"text-bold"}
                          align="center"
                        ></TableCell>
                        <TableCell
                          className={"text-bold"}
                          align="center"
                        ></TableCell>
                      </TableRow>

                      {data.SalesOrderDetails?.map((values, ind) => {
                        return (
                          <>
                            <TableRow id={ind + "val"}>
                              <TableCell align="right">
                                {values.ItemName}
                              </TableCell>
                              <TableCell align="center">
                                {values.Qty < 0 ? values.Qty * -1 : values.Qty}
                              </TableCell>

                              <TableCell align="center">
                                {values.UnitPrice}
                              </TableCell>
                              <TableCell align="center"></TableCell>
                              <TableCell align="right" className={"text-right"}>
                                {values.TotalAmount < 0
                                  ? Math.abs(values.TotalAmount).toFixed(2)
                                  : values.TotalAmount}
                              </TableCell>

                              <TableCell align="right"></TableCell>
                              <TableCell align="center"></TableCell>
                              <TableCell align="center"></TableCell>
                            </TableRow>
                          </>
                        );
                      })}
                    </>
                  );
                })}
              <TableRow>
                <TableCell
                  colSpan={1}
                  align="right"
                  className={"text-right"}
                  sx={{ fontWeight: "500", fontSize: "1.2rem" }}
                >
                  Total :
                </TableCell>
                <TableCell
                  colSpan={1}
                  align="right"
                  sx={{ fontWeight: "500", fontSize: "1.2rem" }}
                ></TableCell>
                <TableCell
                  colSpan={1}
                  align="right"
                  sx={{ fontWeight: "500", fontSize: "1.2rem" }}
                ></TableCell>

                <TableCell
                  colSpan={3}
                  align="right"
                  className={"text-right"}
                  sx={{ fontWeight: "500", fontSize: "1.2rem" }}
                >
                  {Math.abs(crTotal)}
                </TableCell>
                <TableCell
                  colSpan={1}
                  align="right"
                  sx={{ fontWeight: "500", fontSize: "1.2rem" }}
                ></TableCell>
                <TableCell
                  colSpan={1}
                  align="right"
                  sx={{ fontWeight: "500", fontSize: "1.2rem" }}
                ></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default ExcelSalesReturn;
