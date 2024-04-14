import { Paper } from "@mui/material";
import { useState } from "react";
import { getCurrentFinancialYear } from "../../../../features/financialYearSlice";
import { useAppSelector } from "../../../../app/hooks";
import { TableContainer } from "@mui/material";
import { Table } from "@mui/material";
import { TableHead } from "@mui/material";
import { TableRow } from "@mui/material";
import { TableCell } from "@mui/material";
import { TableBody } from "@mui/material";
import DateHeader from "../../../../components/headers/dateHeader";
import { selectCompany } from "../../../../features/companySlice";

const TLedgerDetails = ({
  ledgerTypes,
  ledgerDetails,
  products,
  ledgerOption,
  branchOption,
  ledgerValue,
  branchValue,
}: any) => {
  const FinancialYear = useAppSelector(getCurrentFinancialYear);
  const CompanyData = useAppSelector(selectCompany);
  const [dateChoose, setDateChoose] = useState({
    StartDate: FinancialYear.NepaliStartDate,
    EndDate: FinancialYear.NepaliEndDate,
  });

  const totalDebit = ledgerDetails?.reduce((pre: any, nvalue: any) => {
    return pre + nvalue.Debit;
  }, 0);
  const totalCredit = ledgerDetails?.reduce((pre: any, nvalue: any) => {
    return pre + nvalue.Credit;
  }, 0);

  const getCustomerName = ledgerOption?.find(
    (elm: any) => elm.value === ledgerValue
  );
  const getBranchName = branchOption?.find(
    (elm: any) => elm.Id === branchValue
  );
  const getPurchaseRate = (purchaserate: number, afterexciseamount : number, discount : number): number => {
    let CurrentRate = 0;
    let aftrexcise = Number(purchaserate) + Number(afterexciseamount);  
    CurrentRate = aftrexcise  - Number(discount) ;
    return CurrentRate ? CurrentRate : 0;
  }; 

  return (
    <>
      {ledgerDetails?.length > 0 ? (
        <TableContainer
          component={Paper}
          id="printDownloadPDF"
          sx={{ width: "100%", mx: "auto" }}
        >
          <DateHeader
            headerName={`${getCustomerName?.label} A/c Details`}
            date={dateChoose}
          />
          <Table id="downloadExcel">
            <TableHead>
              <TableRow sx={{ display: "none" }}>
                <TableCell colSpan={8} align="center">
                  {CompanyData?.NameEnglish}
                </TableCell>
              </TableRow>
              <TableRow sx={{ display: "none" }}>
                <TableCell colSpan={8} align="center">
                  `${getCustomerName?.Name} A/c Details`
                </TableCell>
              </TableRow>
              <TableRow sx={{ display: "none" }}>
                <TableCell colSpan={8} align="center">
                  {`${dateChoose.StartDate} - ${dateChoose.EndDate}`}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }} align="left">
                  Date
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Particulars
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Voucher Type
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Voucher No.
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Debit(Rs.)
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Credit(Rs.)
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Balance
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Dr/Cr
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ledgerTypes === "Details" ?
                ledgerDetails?.map((elm: any, i: any) => {
                return (
                  <>
                    <TableRow>
                      <TableCell align="left">{elm.VDate}</TableCell>
                      <TableCell align="center">{elm.Particular}</TableCell>
                      <TableCell align="center">{elm.VType}</TableCell>
                      <TableCell align="center">{elm.VNumber}</TableCell>
                      <TableCell align="right">
                        {elm.Debit > 0 ? elm.Debit.toFixed(2) : ""}
                      </TableCell>
                      <TableCell align="right">
                        {elm.Credit > 0 ? elm.Credit.toFixed(2) : ""}
                      </TableCell>
                      <TableCell align="right">
                        {elm.Balance ? Math.abs(elm.Balance).toFixed(2) : ""}
                      </TableCell>
                      <TableCell align="center">
                        {elm.Balance > 0 ? "Dr" : "Cr"}
                      </TableCell>
                    </TableRow>
                    {elm.ledgerviews?.length > 0 && (
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell colSpan={3} sx={{ fontWeight: "bold" }} align="right">
                          Name
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }} align="center">Debit</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }} align="center">Credit</TableCell>
                      </TableRow>
                    )}
                    {elm.ledgerviews?.map((lv: any) => {
                      return (
                        <>
                          <TableRow>
                            <TableCell></TableCell>
                            <TableCell align="right" colSpan={3}>
                              {lv?.Name}
                            </TableCell>
                          <TableCell align="right">
                            {lv.Debit > 0 ? lv.Debit.toFixed(2) : ""}
                          </TableCell>
                          <TableCell align="right">
                            {lv.Credit > 0 ? lv.Credit.toFixed(2) : ""}
                          </TableCell>
                          </TableRow>
                        </>
                      );
                    })}                    
                    {elm.SalesOrderDetails?.length > 0 && (
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell sx={{ fontWeight: "bold" }} align="center">
                          Product Name
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }} align="center">
                          Qty
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }} align="center">
                          Unit Type
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }} align="right">
                          Price
                        </TableCell>
                        <TableCell
                          sx={{ fontSize: "0.8rem", fontWeight: "bold" }}
                          align="right"
                        >
                          Amount
                        </TableCell>
                        <TableCell colSpan={2}></TableCell>
                      </TableRow>
                    )}
                    {elm.SalesOrderDetails?.map((elmSales: any) => {
                      return (
                        <>
                          <TableRow>
                            <TableCell></TableCell>
                            <TableCell align="center">
                              {elmSales?.ItemName}
                            </TableCell>
                            <TableCell align="center">
                              {elmSales?.Qty ? Math.abs(elmSales.Qty) : 0}
                            </TableCell>
                            <TableCell align="center">
                              {elmSales?.UnitType}
                            </TableCell>
                            <TableCell align="right">
                              {elmSales?.UnitPrice
                                ? Math.abs(elmSales.UnitPrice).toFixed(2)
                                : ""}
                            </TableCell>
                            <TableCell align="right">
                              {elmSales?.TotalAmount
                                ? Math.abs(elmSales.TotalAmount).toFixed(2)
                                : ""}
                            </TableCell>
                            <TableCell colSpan={2}></TableCell>
                          </TableRow>
                        </>
                      );
                    })}
                    {elm.PurchaseDetails?.length > 0 && (
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell sx={{ fontWeight: "bold" }} align="center">
                          Product Name
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }} align="center">
                          Qty
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }} align="center">
                          Unit Type
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }} align="right">
                          Price
                        </TableCell>
                        <TableCell
                          sx={{ fontSize: "0.8rem", fontWeight: "bold" }}
                          align="right"
                        >
                          Amount
                        </TableCell>
                        <TableCell colSpan={2}></TableCell>
                      </TableRow>
                    )}
                    {elm.PurchaseDetails?.map((elmPurchase: any) => {
                      const getProductName = products?.find(
                        (elm: any) => elm.Id === elmPurchase.InventoryItemId
                      );
                      return (
                        <>
                          <TableRow>
                            <TableCell></TableCell>
                            <TableCell align="center">
                              {getProductName ? getProductName.Name : "...."}
                            </TableCell>
                            <TableCell align="center">
                              {Math.abs(elmPurchase?.Quantity)}
                            </TableCell>
                            <TableCell align="center">
                              {elmPurchase?.UnitType}
                            </TableCell>
                            <TableCell align="right">
                            {getPurchaseRate(elmPurchase.PurchaseRate, elmPurchase.ExciseDuty, elmPurchase.Discount).toFixed(2)}
                            </TableCell>
                            <TableCell align="right">
                            {(Math.abs(elmPurchase.Quantity)  * getPurchaseRate(elmPurchase.PurchaseRate, elmPurchase.ExciseDuty, elmPurchase.Discount)).toFixed(2)}
                            </TableCell>
                            <TableCell colSpan={2}></TableCell>
                          </TableRow>
                        </>
                      );
                    })}
                  </>
                );
                }) :
                ledgerDetails?.map((elm: any, i: any) => {
                return (
                  <>
                    <TableRow>
                      <TableCell align="left">{elm.VDate}</TableCell>
                      <TableCell align="center">{elm.Particular}</TableCell>
                      <TableCell align="center">{elm.VType}</TableCell>
                      <TableCell align="center">{elm.VNumber}</TableCell>
                      <TableCell align="right">
                        {elm.Debit > 0 ? elm.Debit.toFixed(2) : ""}
                      </TableCell>
                      <TableCell align="right">
                        {elm.Credit > 0 ? elm.Credit.toFixed(2) : ""}
                      </TableCell>
                      <TableCell align="right">
                        {elm.Balance ? Math.abs(elm.Balance).toFixed(2) : ""}
                      </TableCell>
                      <TableCell align="center">
                        {elm.Balance > 0 ? "Dr" : "Cr"}
                      </TableCell>
                    </TableRow>
                    </>
                );
                })
            }
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="center"
                  sx={{ fontWeight: "bold" }}
                >
                  Total(Rs.)
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  {ledgerDetails[0]?.Balance > 0
                    ? Math.abs(totalDebit).toFixed(2)
                    : totalDebit}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  {ledgerDetails[0]?.Balance < 0
                    ? Math.abs(totalCredit).toFixed(2)
                    : totalCredit}
                </TableCell>
                <TableCell colSpan={2}></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        "No Data Found"
      )}
    </>
  );
};

export default TLedgerDetails;
