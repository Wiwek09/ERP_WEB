import { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useAppSelector } from "../../../../app/hooks";
import { IProduct } from "../../../../interfaces/product";
import { IGetAllPurchase } from "../../../../interfaces/purchase";
import { ILedger } from "../../../../interfaces/posBiling";

import { makeStyles } from "@mui/styles";
import { SMonth } from "../../../transaction/invoice/interfaces";
interface IDateProps {
  StartDate: string;
  EndDate: string;
}
interface IProps {
  ReportTypeBook: any;
  allData: IGetAllPurchase[];
  products: IProduct[];
  month: SMonth;
  customers: ILedger[];
}

const useStyles = makeStyles({
  table: {
    "& .MuiTableCell-root": {
      borderLeft: "1px solid rgba(224, 224, 224, 1)",
      borderTop: "1px solid rgba(224, 224, 224, 1)",
    },
  },
});
const PurchaseReturnBookTable = ({ReportTypeBook, allData, products, customers, month }: IProps) => {
  const companyData = useAppSelector((state) => state.company.data);
  const financialYear = useAppSelector((state) => state.financialYear);
  const [total, setTotal] = useState({ debit: 0, credit: 0 });

  let totalTaxable = 0;
  let totalNonTaxable = 0;
  let totalDiscount = 0;
  let totalTax = 0;

  useEffect(() => {
    let debit = 0;
    let credit = 0;

    allData.forEach((element) => {
      element.AccountTransactionValues.forEach((account) => {
        debit += account.DebitAmount;
        credit += account.CreditAmount;
      });
    });
    setTotal({ debit: debit, credit: credit });
  }, [allData]);

  const getProductName = (id: number) => {
    const productDetails = products.find((obj) => obj.Id === id);
    return productDetails?.Name;
  };

  const getVoucherNo = (bill: string): string => {
    let billNo = "";

    let startPosition = bill.search("#");
    let endPosition = bill.search("]");

    for (let index = startPosition + 1; index < endPosition; index++) {
      billNo += bill[index];
    }
    return billNo;
  };

  const getCustomerName = (id: number) => {
    const customerName = customers.find((data) => data.Id === id);
    return customers ? customerName?.Name : "";
  };

  const getCustomerPan = (id: number) => {
    const customerName = customers.find((data) => data.Id === id);
    return customers ? customerName?.PanNo : "";
  };

  
  const classes = useStyles();
  
  const getTotal = (accountValue: any): number => {
    const grand = accountValue.AccountTransactionValues[0].Amount;
    return grand;
  };

  const getTaxablePurchase = (accountValue: any): number => {
    for (
      let index = 0;
      index < accountValue.AccountTransactionValues.length;
      index++
    ) {
      const element = accountValue.AccountTransactionValues[index];
      if (element.Name === "Taxable Purchase") {
        const taxable = parseFloat(element.DebitAmount + element.CreditAmount);
        totalTaxable += taxable;
        return taxable;
      }
    }
    return 0;
  };
  
  const getNonTaxablePurchase = (accountValue: any): number => {
    for (
      let index = 0;
      index < accountValue.AccountTransactionValues.length;
      index++
    ) {
      const element = accountValue.AccountTransactionValues[index];
      if (element.Name === "Non Taxable Purchase") {
        const nonTaxable = parseFloat(element.DebitAmount + element.CreditAmount);
        totalNonTaxable += nonTaxable;
        return nonTaxable;
      }
    }
    return 0;
  };

  const getPurchaseVat = (accountValue: any): number => {
    for (
      let index = 0;
      index < accountValue.AccountTransactionValues.length;
      index++
    ) {
      const element = accountValue.AccountTransactionValues[index];
      if (element.Name === "Vat 13%") {
        const tax = parseFloat(element.DebitAmount + element.CreditAmount);
        totalTax += tax;
        return tax;
      }
    }
    return 0;
  };
  
  const getDiscount = (accountValue: any): number => {
    for (
      let index = 0;
      index < accountValue.AccountTransactionValues.length;
      index++
    ) {
      const element = accountValue.AccountTransactionValues[index];
      if (element.Name === "Discount") {
        const discount = parseFloat(element.DebitAmount + element.CreditAmount);
        totalDiscount += discount;
        return discount;
      }
    }
    return 0;
  };

  return (
    <>
      <Paper>
        <TableContainer>
          <Table className={classes.table} stickyHeader id="downloadExcel">
            <TableHead>
              <TableRow>
                <TableCell
                  colSpan={16}
                  align="center"
                  sx={{ fontSize: "32px", fontWeight: "bold" }}
                >
                  खरिद फिर्ता खाता
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center" colSpan={16}>
                  (नियम २३ को उपनियम (१) को खण्ड (छ) संग सम्बन्धित ){" "}
                </TableCell>
              </TableRow>
              <TableRow></TableRow>
              <TableRow>
                <TableCell
                  colSpan={16}
                  align="center"
                  sx={{ fontWeight: "bold" }}
                >
                  {" "}
                  करदाता दर्ता नं (PAN): {companyData.Pan_Vat} &nbsp; &nbsp;
                  &nbsp; करदाताको नाम: {companyData.NameEnglish} &nbsp; &nbsp;
                  &nbsp; साल: {financialYear.Name} &nbsp; &nbsp; &nbsp; कर अवधि:{" "}
                  {month} &nbsp; &nbsp;
                  &nbsp; बिलहरुको संख्या: {allData.length}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell
                  colSpan={8}
                  align="center"
                  sx={{ fontWeight: "bold" }}
                  className="text-align-center"
                >
                  बीजक / प्रज्ञापनपत्र नम्बर
                </TableCell>
                <TableCell rowSpan={2} align="right">जम्मा फिर्ता मूल्य (रु)</TableCell>
                <TableCell rowSpan={2} align="right">
                कर छुट हुने वस्तु वा सेवाको फिर्ता मूल्य (रु)
                </TableCell>
                <TableCell colSpan={2}> करयोग्य फिर्ता (पूंजीगत बाहेक)</TableCell>
                <TableCell colSpan={2}>
                  {" "}
                  करयोग्य पैठारी फिर्ता (पूंजीगत बाहेक)
                </TableCell>
                <TableCell colSpan={2}>
                  {" "}
                  पूंजीगत करयोग्य फिर्ता {" "}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">मिति</TableCell>
                <TableCell align="center">बीजक नं. </TableCell>
                <TableCell align="center">प्रज्ञापनपत्र नं.</TableCell>
                <TableCell align="center">आपूर्तिकर्ताको नाम</TableCell>
                <TableCell align="center">
                  आपूर्तिकर्ताको स्थायी लेखा नम्बर{" "}
                </TableCell>
                <TableCell align="center">
                  खरिद/पैठारी गरिएका वस्तु वा सेवाको विवरण
                </TableCell>
                <TableCell align="center">
                  खरिद/पैठारी गरिएका वस्तु वा सेवाको परिमाण
                </TableCell>
                <TableCell align="center">वस्तु वा सेवाको एकाई</TableCell>
                <TableCell align="right">मूल्य (रु)</TableCell>
                <TableCell align="right">कर (रु)</TableCell>
                <TableCell align="right">मूल्य (रु)</TableCell>
                <TableCell align="right">कर (रु)</TableCell>
                <TableCell align="right"> मूल्य (रु)</TableCell>
                <TableCell align="right">कर (रु)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {ReportTypeBook === 'Details' ? (
        allData &&
        allData.map((data, index) => {
          return (
            <>
              {data?.AccountTransactionValues.map((value, ind) => {
                return (
                  <>
                    {ind === 0 && (
                      <>
                        <TableRow>
                          <TableCell align="center">
                            {data.VDate}
                          </TableCell>
                          <TableCell align="center">
                          {data.RefInvoiceNo}
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell align="center">
                            {getCustomerName(value.SourceAccountTypeId)}
                          </TableCell>{" "}
                          <TableCell align="center">
                            {getCustomerPan(value.SourceAccountTypeId)}
                          </TableCell>
                          <TableCell colSpan={3}></TableCell>
                          <TableCell align="right">
                            {(getTotal(data) - getDiscount(data)).toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            {(getNonTaxablePurchase(data)).toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            {(getTaxablePurchase(data).toFixed(2))}
                          </TableCell>
                          <TableCell align="right">
                            {(getPurchaseVat(data)).toFixed(2)}
                          </TableCell>
                          <TableCell align="right">0.00</TableCell>
                          <TableCell align="right">0.00</TableCell>
                          <TableCell align="right">0.00</TableCell>
                          <TableCell align="right">0.00</TableCell>{" "}
                        </TableRow>
                      </>
                    )}

                    {data?.PurchaseDetails.map((item, i) => {
                      return (
                        <>
                          {ind === 0 && (
                            <>
                              <TableRow>
                                <TableCell colSpan={5}></TableCell>
                                <TableCell>
                                  {getProductName(item.InventoryItemId)}
                                </TableCell>
                                <TableCell align="center">
                                  {Math.abs(item.Quantity)}
                                </TableCell>
                                <TableCell align="center">
                                  {item.UnitType}
                                </TableCell>
                                <TableCell colSpan={8}></TableCell>
                              </TableRow>
                            </>
                          )}
                        </>
                      );
                    })}
                  </>
                );
              })}
            </>
          );
        })
      ) : 
      allData &&
      allData.map((data, index) => {
        return (
          <>
            {data?.AccountTransactionValues.map((value, ind) => {
              return (
                <>
                  {ind === 0 && (
                    <>
                      <TableRow>
                        <TableCell align="center">
                          {data.VDate}
                        </TableCell>
                        <TableCell align="center">
                        {data.RefInvoiceNo}
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell align="center">
                          {getCustomerName(value.SourceAccountTypeId)}
                        </TableCell>{" "}
                        <TableCell align="center">
                          {getCustomerPan(value.SourceAccountTypeId)}
                        </TableCell>
                        <TableCell colSpan={3}></TableCell>
                        <TableCell align="right">
                          {(getTotal(data) - getDiscount(data)).toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          {(getNonTaxablePurchase(data)).toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          {(getTaxablePurchase(data).toFixed(2))}
                        </TableCell>
                        <TableCell align="right">
                          {(getPurchaseVat(data)).toFixed(2)}
                        </TableCell>
                        <TableCell align="right">0.00</TableCell>
                        <TableCell align="right">0.00</TableCell>
                        <TableCell align="right">0.00</TableCell>
                        <TableCell align="right">0.00</TableCell>{" "}
                      </TableRow>
                    </>
                  )}
                </>
              );
            })}
          </>
        );        
      })
      }              
              {allData &&
                allData.map((data, index) => {

                })}
                <TableRow>
                <TableCell
                  colSpan={8}
                  sx={{ textAlign: "end", fontWeight: "bold" }}
                >
                  Total
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {(total.credit - totalDiscount).toFixed(2)}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {totalNonTaxable.toFixed(2)}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {totalTaxable.toFixed(2)}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {totalTax.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default PurchaseReturnBookTable;
