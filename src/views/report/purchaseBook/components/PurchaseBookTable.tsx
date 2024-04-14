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
import { SMonth } from "../../../transaction/invoice/interfaces";
import { makeStyles } from "@mui/styles";
interface IProps {
  ReportTypeBook: any;
  allData: IGetAllPurchase[];
  products: IProduct[];
  customers: ILedger[];
  month: SMonth;
}

const useStyles = makeStyles({
  table: {
    "& .MuiTableCell-root": {
      borderLeft: "1px solid rgba(224, 224, 224, 1)",
      borderTop: "1px solid rgba(224, 224, 224, 1)",
    },
  },
});
const PurchaseBookTable = ({
  ReportTypeBook,
  allData,
  products,
  customers,
  month,
}: IProps) => {
  const companyData = useAppSelector((state) => state.company.data);
  const financialYear = useAppSelector((state) => state.financialYear);
  const [total, setTotal] = useState({ debit: 0, credit: 0 });

  let totalTaxable = 0;
  let totalNonTaxable = 0;
  let totalDiscount = 0;
  let totalTax = 0;
  let totaltaxableImportExcludingCapital = 0;
  let totaltaxImportExcludingCapital = 0;
  let totaltaxableImportIncludeCapital = 0;
  let totaltaxImportIncludeCapital = 0;

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
    const productDetails = products.find((obj) => obj.Id == id);
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

  const getCurrentTotalPurchaseAmount = (
    UnitPrice: any,
    Qty: number,
    TaxRate: number,
    Discount: number
  ): string => {
    let NetSale = UnitPrice * Qty;

    NetSale = NetSale - Discount;

    let currentvat = (NetSale * TaxRate) / 100;
    let TotalSale = NetSale + currentvat;
    return TotalSale.toFixed(2);
  };

  const getCurrentTotalNonTaxableAmount = (
    UnitPrice: any,
    Qty: number,
    TaxRate: number,
    Discount: number
  ): string => {
    let NetSale = UnitPrice * Qty;

    NetSale = NetSale - Discount;

    let currentvat = (NetSale * TaxRate) / 100;

    let TotalSale = NetSale + currentvat;

    if (TaxRate != 0) {
      return "";
    }
    totalNonTaxable += TotalSale;
    return TotalSale.toFixed(2);
  };
  const getItemTaxablePurchase = (
    UnitPrice: any,
    Qty: number,
    TaxRate: number,
    Discount: number,
    PurchaseType: string,
    accountValue: any
  ): string => {
    for (
      let index = 0;
      index < accountValue.AccountTransactionValues.length;
      index++
    ) {
      let startPosition = PurchaseType.search("Purchase Import");
      if (startPosition != 0) {
        const element = accountValue.AccountTransactionValues[index];
        if (element.Name === "Taxable Purchase") {
          let NetSale = UnitPrice * Qty;

          NetSale = NetSale - Discount;

          let TotalSale = NetSale;
          if (TaxRate === 0) {
            TotalSale = 0;
          }
          totalTaxable += TotalSale;
          return TotalSale.toFixed(2);
        }
      }
    }
    return " ";
  };
  const getItemVATPurchase = (
    UnitPrice: any,
    Qty: number,
    TaxRate: number,
    Discount: number,
    PurchaseType: string,
    accountValue: any
  ): string => {
    for (
      let index = 0;
      index < accountValue.AccountTransactionValues.length;
      index++
    ) {
      let startPosition = PurchaseType.search("Purchase Import");
      if (startPosition != 0) {
        const element = accountValue.AccountTransactionValues[index];
        if (element.Name === "Taxable Purchase") {
          let NetSale = UnitPrice * Qty;

          NetSale = NetSale - Discount;

          let TotalVAT = (NetSale * TaxRate) / 100;
          if (TaxRate === 0) {
            TotalVAT = 0;
          }
          totalTax += TotalVAT;
          return TotalVAT.toFixed(2);
        }
      }
    }
    return " ";
  };
  //getItemVATImportPurchase
  const getItemVATImportPurchase = (
    UnitPrice: any,
    Qty: number,
    TaxRate: number,
    Discount: number,
    PurchaseType: string,
    accountValue: any
  ): string => {
    for (
      let index = 0;
      index < accountValue.AccountTransactionValues.length;
      index++
    ) {
      let startPosition = PurchaseType.search("Purchase Import");
      if (startPosition == 0) {
        const element = accountValue.AccountTransactionValues[index];
        if (element.Name === "Taxable Purchase") {
          let NetSale = UnitPrice * Qty;

          NetSale = NetSale - Discount;

          let TotalVAT = (NetSale * TaxRate) / 100;
          if (TaxRate === 0) {
            TotalVAT = 0;
          }
          totaltaxImportExcludingCapital += TotalVAT;

          return TotalVAT.toFixed(2);
        }
      }
    }
    return " ";
  };
  const getItemTaxableImportPurchase = (
    UnitPrice: any,
    Qty: number,
    TaxRate: number,
    Discount: number,
    PurchaseType: string,
    accountValue: any
  ): string => {
    for (
      let index = 0;
      index < accountValue.AccountTransactionValues.length;
      index++
    ) {
      let startPosition = PurchaseType.search("Purchase Import");
      if (startPosition == 0) {
        const element = accountValue.AccountTransactionValues[index];
        if (element.Name === "Taxable Purchase") {
          let NetSale = UnitPrice * Qty;

          NetSale = NetSale - Discount;

          let TotalSale = NetSale;
          if (TaxRate === 0) {
            TotalSale = 0;
          }
          totaltaxableImportExcludingCapital += TotalSale;
          return TotalSale.toFixed(2);
        }
      }
    }
    return " ";
  };

  //getItemTaxableCapitalPurchase
  const getItemVATCapitalPurchase = (
    UnitPrice: any,
    Qty: number,
    TaxRate: number,
    Discount: number,
    PurchaseType: string,
    accountValue: any
  ): string => {
    for (
      let index = 0;
      index < accountValue.AccountTransactionValues.length;
      index++
    ) {
      let startPosition = PurchaseType.search("Purchases Capital");
      if (startPosition == 0) {
        const element = accountValue.AccountTransactionValues[index];
        if (element.Name === "Taxable Purchase") {
          let NetSale = UnitPrice * Qty;

          NetSale = NetSale - Discount;

          let TotalVAT = (NetSale * TaxRate) / 100;
          if (TaxRate === 0) {
            TotalVAT = 0;
          }

          totaltaxImportIncludeCapital += TotalVAT;

          return TotalVAT.toFixed(2);
        }
      }
    }
    return " ";
  };
  const getItemTaxableCapitalPurchase = (
    UnitPrice: any,
    Qty: number,
    TaxRate: number,
    Discount: number,
    PurchaseType: string,
    accountValue: any
  ): string => {
    for (
      let index = 0;
      index < accountValue.AccountTransactionValues.length;
      index++
    ) {
      let startPosition = PurchaseType.search("Purchases Capital");
      if (startPosition == 0) {
        const element = accountValue.AccountTransactionValues[index];
        if (element.Name === "Taxable Purchase") {
          let NetSale = UnitPrice * Qty;

          NetSale = NetSale - Discount;

          let TotalSale = NetSale;
          if (TaxRate === 0) {
            TotalSale = 0;
          }

          totaltaxableImportIncludeCapital += TotalSale;

          return TotalSale.toFixed(2);
        }
      }
    }
    return " ";
  };

  const getInvoiceNo = (
    PurchaseType: string,
    CurrentInvoice: string
  ): string => {
    let InvoiceNo = "";
    if (PurchaseType != null) {
      let startPosition = PurchaseType.search("Purchase Import");
      if (startPosition == -1) {
        InvoiceNo = CurrentInvoice;
      } else {
        InvoiceNo = "";
      }
    }
    return InvoiceNo;
  };
  const getPragpatraNo = (
    PurchaseType: string,
    CurrentInvoice: string
  ): string => {
    let InvoiceNo = "";

    if (PurchaseType != null) {
      let startPosition = PurchaseType.indexOf("Purchase Import");
      if (startPosition == -1) {
        InvoiceNo = "";
      } else {
        InvoiceNo = CurrentInvoice;
      }
    }
    return InvoiceNo;
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

  const getTaxablePurchase = (
    PurchaseType: string,
    accountValue: any
  ): number => {
    for (
      let index = 0;
      index < accountValue.AccountTransactionValues.length;
      index++
    ) {
      let startPosition = PurchaseType.search("Purchase Import");
      if (startPosition != 0) {
        const element = accountValue.AccountTransactionValues[index];
        if (element.Name === "Taxable Purchase") {
          const taxable = parseFloat(
            element.DebitAmount + element.CreditAmount
          );
          totalTaxable += taxable;
          return taxable;
        }
      }
    }
    return 0;
  };

  const gettaxableImportExcludingCapital = (
    PurchaseType: string,
    accountValue: any
  ): number => {
    for (
      let index = 0;
      index < accountValue.AccountTransactionValues.length;
      index++
    ) {
      let startPosition = PurchaseType.search("Purchase Import");
      if (startPosition == 0) {
        const element = accountValue.AccountTransactionValues[index];
        if (element.Name === "Taxable Purchase") {
          const taxable = parseFloat(
            element.DebitAmount + element.CreditAmount
          );
          totaltaxableImportExcludingCapital += taxable;
          return taxable;
        }
      }
    }
    return 0;
  };
  const gettaxableImportIncludeCapital = (
    PurchaseType: string,
    accountValue: any
  ): number => {
    for (
      let index = 0;
      index < accountValue.AccountTransactionValues.length;
      index++
    ) {
      let startPosition = PurchaseType.search("Purchases Capital");
      if (startPosition == 0) {
        const element = accountValue.AccountTransactionValues[index];
        if (element.Name === "Taxable Purchase") {
          const taxable = parseFloat(
            element.DebitAmount + element.CreditAmount
          );
          totaltaxableImportIncludeCapital += taxable;
          return taxable;
        }
      }
    }
    return 0;
  };

  const getNonTaxablePurchase = (
    PurchaseType: string,
    accountValue: any
  ): number => {
    for (
      let index = 0;
      index < accountValue.AccountTransactionValues.length;
      index++
    ) {
      const element = accountValue.AccountTransactionValues[index];
      if (element.Name === "Non Taxable Purchase") {
        const nonTaxable = parseFloat(
          element.DebitAmount + element.CreditAmount
        );
        totalNonTaxable += nonTaxable;
        return nonTaxable;
      }
    }
    return 0;
  };

  const getPurchaseVat = (PurchaseType: string, accountValue: any): number => {
    for (
      let index = 0;
      index < accountValue.AccountTransactionValues.length;
      index++
    ) {
      let startPosition = PurchaseType.search("Purchase Import");
      if (startPosition != 0) {
        const element = accountValue.AccountTransactionValues[index];
        if (element.Name === "Vat 13%") {
          const tax = parseFloat(element.DebitAmount + element.CreditAmount);
          totalTax += tax;
          return tax;
        }
      }
    }
    return 0;
  };

  const getPurchaseVatImportExcludingCapital = (
    PurchaseType: string,
    accountValue: any
  ): number => {
    for (
      let index = 0;
      index < accountValue.AccountTransactionValues.length;
      index++
    ) {
      let startPosition = PurchaseType.search("Purchase Import");
      if (startPosition == 0) {
        const element = accountValue.AccountTransactionValues[index];
        if (element.Name === "Vat 13%") {
          const tax = parseFloat(element.DebitAmount + element.CreditAmount);
          totaltaxImportExcludingCapital += tax;
          return tax;
        }
      }
    }
    return 0;
  };
  const getPurchaseVatImportIncludeCapital = (
    PurchaseType: string,
    accountValue: any
  ): number => {
    for (
      let index = 0;
      index < accountValue.AccountTransactionValues.length;
      index++
    ) {
      let startPosition = PurchaseType.search("Purchases Capital");
      if (startPosition == 0) {
        const element = accountValue.AccountTransactionValues[index];
        if (element.Name === "Vat 13%") {
          const tax = parseFloat(element.DebitAmount + element.CreditAmount);
          totaltaxImportIncludeCapital += tax;
          return tax;
        }
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
            {ReportTypeBook === "Details2080" &&
            <TableContainer>
            <Table className={classes.table} stickyHeader id="downloadExcel">
            <TableHead>
                          <TableRow>
                            <TableCell
                              colSpan={14}
                              align="center"
                              sx={{ fontSize: "32px", fontWeight: "bold" }}
                            >
                              खरिद खाता
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center" colSpan={14}>
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
                              {month} &nbsp; &nbsp; &nbsp; बिलहरुको संख्या: {allData.length}
                            </TableCell>
                          </TableRow>
            
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              align="center"
                              sx={{ fontWeight: "bold" }}
                              className="text-align-center"
                            >
                              बीजक / प्रज्ञापनपत्र नम्बर
                            </TableCell>
                            <TableCell rowSpan={2} align="right">
                              जम्मा खरिद मूल्य (रु)
                            </TableCell>
                            <TableCell rowSpan={2} align="right">
                              कर छुट हुने वस्तु वा सेवाको खरिद / पैठारी मूल्य (रु)
                            </TableCell>
                            <TableCell colSpan={2}> करयोग्य खरिद (पूंजीगत बाहेक)</TableCell>
                            <TableCell colSpan={2}>
                              {" "}
                              करयोग्य पैठारी (पूंजीगत बाहेक)
                            </TableCell>
                            <TableCell colSpan={2}>
                              {" "}
                              पूंजीगत करयोग्य खरिद / पैठारी{" "}
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
                        {allData?.map((elm: any, i: any) => (
                              <>
                                    {elm?.AccountTransactionValues.map(
                                      (value: any, ind: any) => {
                                        return (
                                          <>
                                            {ind === 0 && (
                                              <>
                                                <TableRow>
                                                  <TableCell align="center">
                                                    {elm.VDate}
                                                  </TableCell>
                                                  <TableCell align="center">
                                                    {getInvoiceNo(
                                                      elm.VType,
                                                      elm.RefInvoiceNo
                                                    )}
                                                  </TableCell>
                                                  <TableCell>
                                                    {getPragpatraNo(
                                                      elm.VType,
                                                      elm.RefInvoiceNo
                                                    )}
                                                  </TableCell>
                                                  <TableCell align="center">
                                                    {getCustomerName(
                                                      value.SourceAccountTypeId
                                                    )}
                                                  </TableCell>{" "}
                                                  <TableCell align="center">
                                                    {getCustomerPan(
                                                      value.SourceAccountTypeId
                                                    )}
                                                  </TableCell>
                                                  <TableCell align="right">
                                                    {elm.PurchaseDetails[0].UnitType}
                                                  </TableCell>
                                                  <TableCell align="right">
                                                    {(
                                                      getTotal(elm) - getDiscount(elm)
                                                    ).toFixed(2)}
                                                  </TableCell>
                                                  <TableCell align="right">
                                                    {getNonTaxablePurchase(
                                                      elm.VType,
                                                      elm
                                                    ).toFixed(2)}
                                                  </TableCell>
                                                  <TableCell align="right">
                                                    {getTaxablePurchase(
                                                      elm.VType,
                                                      elm
                                                    ).toFixed(2)}
                                                  </TableCell>
                                                  <TableCell align="right">
                                                    {getPurchaseVat(elm.VType, elm).toFixed(
                                                      2
                                                    )}
                                                  </TableCell>
                                                  <TableCell align="right">
                                                    {gettaxableImportExcludingCapital(
                                                      elm.VType,
                                                      elm
                                                    )}
                                                  </TableCell>
                                                  <TableCell align="right">
                                                    {getPurchaseVatImportExcludingCapital(
                                                      elm.VType,
                                                      elm
                                                    )}
                                                  </TableCell>
                                                  <TableCell align="right">
                                                    {gettaxableImportIncludeCapital(
                                                      elm.VType,
                                                      elm
                                                    )}
                                                  </TableCell>
                                                  <TableCell align="right">
                                                    {getPurchaseVatImportIncludeCapital(
                                                      elm.VType,
                                                      elm
                                                    )}
                                                  </TableCell>
                                                </TableRow>
                                              </>
                                            )}
                                          </>
                                        );
                                      }
                                    )}                  
                              </>
                              
                            ))}              
                            
                        <TableRow>
                            <TableCell
                              colSpan={6}
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
                            <TableCell sx={{ fontWeight: "bold" }}>
                              {totaltaxableImportExcludingCapital.toFixed(2)}
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              {totaltaxImportExcludingCapital.toFixed(2)}
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              {totaltaxableImportIncludeCapital.toFixed(2)}
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              {totaltaxImportIncludeCapital.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
            </Table>
            </TableContainer>
      }
            {ReportTypeBook === "IRDCBMS2080" &&
            <TableContainer>
            <Table className={classes.table} stickyHeader id="downloadExcel">
            <TableHead>
                          <TableRow>
                            <TableCell
                              colSpan={14}
                              align="center"
                              sx={{ fontSize: "32px", fontWeight: "bold" }}
                            >
                              खरिद खाता
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="center" colSpan={14}>
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
                              {month} &nbsp; &nbsp; &nbsp; बिलहरुको संख्या: {allData.length}
                            </TableCell>
                          </TableRow>
            
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              align="center"
                              sx={{ fontWeight: "bold" }}
                              className="text-align-center"
                            >
                              बीजक / प्रज्ञापनपत्र नम्बर
                            </TableCell>
                            <TableCell rowSpan={2} align="right">
                              जम्मा खरिद मूल्य (रु)
                            </TableCell>
                            <TableCell rowSpan={2} align="right">
                              कर छुट हुने वस्तु वा सेवाको खरिद / पैठारी मूल्य (रु)
                            </TableCell>
                            <TableCell colSpan={2}> करयोग्य खरिद (पूंजीगत बाहेक)</TableCell>
                            <TableCell colSpan={2}>
                              {" "}
                              करयोग्य पैठारी (पूंजीगत बाहेक)
                            </TableCell>
                            <TableCell colSpan={2}>
                              {" "}
                              पूंजीगत करयोग्य खरिद / पैठारी{" "}
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
                        {allData?.map((elm: any, i: any) => (
                              <>
                        {elm?.AccountTransactionValues.map(
                          (value: any, ind: any) => {
                            return (
                              <>
                                {elm?.PurchaseDetails.map(
                                  (item: any, i: any) => {
                                    return (
                                      <>
                                        {ind === 0 && (
                                          <>
                                            <TableRow>
                                              <TableCell align="center">
                                                {elm.VDate}
                                              </TableCell>
                                              <TableCell align="center">
                                                {getInvoiceNo(
                                                  elm.VType,
                                                  elm.RefInvoiceNo
                                                )}
                                              </TableCell>
                                              <TableCell>
                                                {getPragpatraNo(
                                                  elm.VType,
                                                  elm.RefInvoiceNo
                                                )}
                                              </TableCell>
                                              <TableCell align="center">
                                                {getCustomerName(
                                                  value.SourceAccountTypeId
                                                )}
                                              </TableCell>{" "}
                                              <TableCell align="center">
                                                {getCustomerPan(
                                                  value.SourceAccountTypeId
                                                )}
                                              </TableCell>
                                              <TableCell align="left">
                                                {item.UnitType}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.7rem",
                                                  textAlign: "end",
                                                }}
                                              >
                                                {getCurrentTotalPurchaseAmount(
                                                  item.PurchaseRate,
                                                  item.Quantity,
                                                  item.TaxRate,
                                                  item.Discount
                                                )}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.7rem",
                                                  textAlign: "end",
                                                }}
                                              >
                                                {getCurrentTotalNonTaxableAmount(
                                                  item.PurchaseRate,
                                                  item.Quantity,
                                                  item.TaxRate,
                                                  item.Discount
                                                )}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.7rem",
                                                  textAlign: "end",
                                                }}
                                              >
                                                {getItemTaxablePurchase(
                                                  item.PurchaseRate,
                                                  item.Quantity,
                                                  item.TaxRate,
                                                  item.Discount,
                                                  elm.VType,
                                                  elm
                                                )}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.7rem",
                                                  textAlign: "end",
                                                }}
                                              >
                                                {getItemVATPurchase(
                                                  item.PurchaseRate,
                                                  item.Quantity,
                                                  item.TaxRate,
                                                  item.Discount,
                                                  elm.VType,
                                                  elm
                                                )}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.7rem",
                                                  textAlign: "end",
                                                }}
                                              >
                                                {getItemTaxableImportPurchase(
                                                  item.PurchaseRate,
                                                  item.Quantity,
                                                  item.TaxRate,
                                                  item.Discount,
                                                  elm.VType,
                                                  elm
                                                )}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.7rem",
                                                  textAlign: "end",
                                                }}
                                              >
                                                {getItemVATImportPurchase(
                                                  item.PurchaseRate,
                                                  item.Quantity,
                                                  item.TaxRate,
                                                  item.Discount,
                                                  elm.VType,
                                                  elm
                                                )}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.7rem",
                                                  textAlign: "end",
                                                }}
                                              >
                                                {getItemTaxableCapitalPurchase(
                                                  item.PurchaseRate,
                                                  item.Quantity,
                                                  item.TaxRate,
                                                  item.Discount,
                                                  elm.VType,
                                                  elm
                                                )}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.7rem",
                                                  textAlign: "end",
                                                }}
                                              >
                                                {getItemVATCapitalPurchase(
                                                  item.PurchaseRate,
                                                  item.Quantity,
                                                  item.TaxRate,
                                                  item.Discount,
                                                  elm.VType,
                                                  elm
                                                )}
                                              </TableCell>
                                            </TableRow>
                                          </>
                                        )}
                                      </>
                                    );
                                  }
                                )}
                              </>
                            );
                          }
                        )}
                              </>
                            ))}              
                            
                        <TableRow>
                            <TableCell
                              colSpan={6}
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
                            <TableCell sx={{ fontWeight: "bold" }}>
                              {totaltaxableImportExcludingCapital.toFixed(2)}
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              {totaltaxImportExcludingCapital.toFixed(2)}
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              {totaltaxableImportIncludeCapital.toFixed(2)}
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              {totaltaxImportIncludeCapital.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
            </Table>
            </TableContainer>
      }
            {ReportTypeBook === "Details" &&
            <TableContainer>
<Table className={classes.table} stickyHeader id="downloadExcel">
<TableHead>
              <TableRow>
                <TableCell
                  colSpan={16}
                  align="center"
                  sx={{ fontSize: "32px", fontWeight: "bold" }}
                >
                  खरिद खाता
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
                  {month} &nbsp; &nbsp; &nbsp; बिलहरुको संख्या: {allData.length}
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
                <TableCell rowSpan={2} align="right">
                  जम्मा खरिद मूल्य (रु)
                </TableCell>
                <TableCell rowSpan={2} align="right">
                  कर छुट हुने वस्तु वा सेवाको खरिद / पैठारी मूल्य (रु)
                </TableCell>
                <TableCell colSpan={2}> करयोग्य खरिद (पूंजीगत बाहेक)</TableCell>
                <TableCell colSpan={2}>
                  {" "}
                  करयोग्य पैठारी (पूंजीगत बाहेक)
                </TableCell>
                <TableCell colSpan={2}>
                  {" "}
                  पूंजीगत करयोग्य खरिद / पैठारी{" "}
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
            {allData?.map((elm: any, i: any) => (
                  <>
                        {elm?.AccountTransactionValues.map(
                          (value: any, ind: any) => {
                            return (
                              <>
                                {ind === 0 && (
                                  <>
                                    <TableRow>
                                      <TableCell align="center">
                                        {elm.VDate}
                                      </TableCell>
                                      <TableCell align="center">
                                        {getInvoiceNo(
                                          elm.VType,
                                          elm.RefInvoiceNo
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        {getPragpatraNo(
                                          elm.VType,
                                          elm.RefInvoiceNo
                                        )}
                                      </TableCell>
                                      <TableCell align="center">
                                        {getCustomerName(
                                          value.SourceAccountTypeId
                                        )}
                                      </TableCell>{" "}
                                      <TableCell align="center">
                                        {getCustomerPan(
                                          value.SourceAccountTypeId
                                        )}
                                      </TableCell>
                                      <TableCell colSpan={3}></TableCell>
                                      <TableCell align="right">
                                        {(
                                          getTotal(elm) - getDiscount(elm)
                                        ).toFixed(2)}
                                      </TableCell>
                                      <TableCell align="right">
                                        {getNonTaxablePurchase(
                                          elm.VType,
                                          elm
                                        ).toFixed(2)}
                                      </TableCell>
                                      <TableCell align="right">
                                        {getTaxablePurchase(
                                          elm.VType,
                                          elm
                                        ).toFixed(2)}
                                      </TableCell>
                                      <TableCell align="right">
                                        {getPurchaseVat(elm.VType, elm).toFixed(
                                          2
                                        )}
                                      </TableCell>
                                      <TableCell align="right">
                                        {gettaxableImportExcludingCapital(
                                          elm.VType,
                                          elm
                                        )}
                                      </TableCell>
                                      <TableCell align="right">
                                        {getPurchaseVatImportExcludingCapital(
                                          elm.VType,
                                          elm
                                        )}
                                      </TableCell>
                                      <TableCell align="right">
                                        {gettaxableImportIncludeCapital(
                                          elm.VType,
                                          elm
                                        )}
                                      </TableCell>
                                      <TableCell align="right">
                                        {getPurchaseVatImportIncludeCapital(
                                          elm.VType,
                                          elm
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  </>
                                )}

                                {elm?.PurchaseDetails.map(
                                  (item: any, i: any) => {
                                    return (
                                      <>
                                        {ind === 0 && (
                                          <>
                                            <TableRow>
                                              <TableCell
                                                colSpan={5}
                                              ></TableCell>
                                              <TableCell>
                                                {getProductName(
                                                  item.InventoryItemId
                                                )}
                                              </TableCell>
                                              <TableCell align="center">
                                                {item.Quantity}
                                              </TableCell>
                                              <TableCell align="center">
                                                {item.UnitType}
                                              </TableCell>
                                              <TableCell
                                                colSpan={8}
                                              ></TableCell>
                                            </TableRow>
                                          </>
                                        )}
                                      </>
                                    );
                                  }
                                )}
                              </>
                            );
                          }
                        )}                  
                  </>
                  
                ))}              
                
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
                <TableCell sx={{ fontWeight: "bold" }}>
                  {totaltaxableImportExcludingCapital.toFixed(2)}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {totaltaxImportExcludingCapital.toFixed(2)}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {totaltaxableImportIncludeCapital.toFixed(2)}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {totaltaxImportIncludeCapital.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
</Table>
</TableContainer>
      }
            {ReportTypeBook === "Summery" &&
            <TableContainer>
            <Table className={classes.table} stickyHeader id="downloadExcel">
            <TableHead>
                          <TableRow>
                            <TableCell
                              colSpan={16}
                              align="center"
                              sx={{ fontSize: "32px", fontWeight: "bold" }}
                            >
                              खरिद खाता
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
                              {month} &nbsp; &nbsp; &nbsp; बिलहरुको संख्या: {allData.length}
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
                            <TableCell rowSpan={2} align="right">
                              जम्मा खरिद मूल्य (रु)
                            </TableCell>
                            <TableCell rowSpan={2} align="right">
                              कर छुट हुने वस्तु वा सेवाको खरिद / पैठारी मूल्य (रु)
                            </TableCell>
                            <TableCell colSpan={2}> करयोग्य खरिद (पूंजीगत बाहेक)</TableCell>
                            <TableCell colSpan={2}>
                              {" "}
                              करयोग्य पैठारी (पूंजीगत बाहेक)
                            </TableCell>
                            <TableCell colSpan={2}>
                              {" "}
                              पूंजीगत करयोग्य खरिद / पैठारी{" "}
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
                        {allData?.map((elm: any, i: any) => (
                              <>
                        {elm?.AccountTransactionValues.map(
                          (value: any, ind: any) => {
                            return (
                              <>
                                {ind === 0 && (
                                  <>
                                    <TableRow>
                                      <TableCell align="center">
                                        {elm.VDate}
                                      </TableCell>
                                      <TableCell align="center">
                                        {getInvoiceNo(
                                          elm.VType,
                                          elm.RefInvoiceNo
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        {getPragpatraNo(
                                          elm.VType,
                                          elm.RefInvoiceNo
                                        )}
                                      </TableCell>
                                      <TableCell align="center">
                                        {getCustomerName(
                                          value.SourceAccountTypeId
                                        )}
                                      </TableCell>{" "}
                                      <TableCell align="center">
                                        {getCustomerPan(
                                          value.SourceAccountTypeId
                                        )}
                                      </TableCell>
                                      <TableCell colSpan={3}></TableCell>
                                      <TableCell align="right">
                                        {(
                                          getTotal(elm) - getDiscount(elm)
                                        ).toFixed(2)}
                                      </TableCell>
                                      <TableCell align="right">
                                        {getNonTaxablePurchase(
                                          elm.VType,
                                          elm
                                        ).toFixed(2)}
                                      </TableCell>
                                      <TableCell align="right">
                                        {getTaxablePurchase(
                                          elm.VType,
                                          elm
                                        ).toFixed(2)}
                                      </TableCell>
                                      <TableCell align="right">
                                        {getPurchaseVat(elm.VType, elm).toFixed(
                                          2
                                        )}
                                      </TableCell>
                                      <TableCell align="right">
                                        {gettaxableImportExcludingCapital(
                                          elm.VType,
                                          elm
                                        )}
                                      </TableCell>
                                      <TableCell align="right">
                                        {getPurchaseVatImportExcludingCapital(
                                          elm.VType,
                                          elm
                                        )}
                                      </TableCell>
                                      <TableCell align="right">
                                        {gettaxableImportIncludeCapital(
                                          elm.VType,
                                          elm
                                        )}
                                      </TableCell>
                                      <TableCell align="right">
                                        {getPurchaseVatImportIncludeCapital(
                                          elm.VType,
                                          elm
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  </>
                                )}
                              </>
                            );
                          }
                        )}
                              </>
                              
                            ))}              
                            
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
                            <TableCell sx={{ fontWeight: "bold" }}>
                              {totaltaxableImportExcludingCapital.toFixed(2)}
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              {totaltaxImportExcludingCapital.toFixed(2)}
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              {totaltaxableImportIncludeCapital.toFixed(2)}
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              {totaltaxImportIncludeCapital.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
            </Table>
            </TableContainer>
      }
            {ReportTypeBook === "IRDCBMS" &&
            <TableContainer>
            <Table className={classes.table} stickyHeader id="downloadExcel">
            <TableHead>
                          <TableRow>
                            <TableCell
                              colSpan={16}
                              align="center"
                              sx={{ fontSize: "32px", fontWeight: "bold" }}
                            >
                              खरिद खाता
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
                              {month} &nbsp; &nbsp; &nbsp; बिलहरुको संख्या: {allData.length}
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
                            <TableCell rowSpan={2} align="right">
                              जम्मा खरिद मूल्य (रु)
                            </TableCell>
                            <TableCell rowSpan={2} align="right">
                              कर छुट हुने वस्तु वा सेवाको खरिद / पैठारी मूल्य (रु)
                            </TableCell>
                            <TableCell colSpan={2}> करयोग्य खरिद (पूंजीगत बाहेक)</TableCell>
                            <TableCell colSpan={2}>
                              {" "}
                              करयोग्य पैठारी (पूंजीगत बाहेक)
                            </TableCell>
                            <TableCell colSpan={2}>
                              {" "}
                              पूंजीगत करयोग्य खरिद / पैठारी{" "}
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
                        {allData?.map((elm: any, i: any) => (
                              <>
                        {elm?.AccountTransactionValues.map(
                          (value: any, ind: any) => {
                            return (
                              <>
                                {elm?.PurchaseDetails.map(
                                  (item: any, i: any) => {
                                    return (
                                      <>
                                        {ind === 0 && (
                                          <>
                                            <TableRow>
                                              <TableCell align="center">
                                                {elm.VDate}
                                              </TableCell>
                                              <TableCell align="center">
                                                {getInvoiceNo(
                                                  elm.VType,
                                                  elm.RefInvoiceNo
                                                )}
                                              </TableCell>
                                              <TableCell>
                                                {getPragpatraNo(
                                                  elm.VType,
                                                  elm.RefInvoiceNo
                                                )}
                                              </TableCell>
                                              <TableCell align="center">
                                                {getCustomerName(
                                                  value.SourceAccountTypeId
                                                )}
                                              </TableCell>{" "}
                                              <TableCell align="center">
                                                {getCustomerPan(
                                                  value.SourceAccountTypeId
                                                )}
                                              </TableCell>
                                              <TableCell>
                                                {getProductName(
                                                  item.InventoryItemId
                                                )}
                                              </TableCell>
                                              <TableCell align="center">
                                                {item.Quantity}
                                              </TableCell>
                                              <TableCell align="left">
                                                {item.UnitType}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.7rem",
                                                  textAlign: "end",
                                                }}
                                              >
                                                {getCurrentTotalPurchaseAmount(
                                                  item.PurchaseRate,
                                                  item.Quantity,
                                                  item.TaxRate,
                                                  item.Discount
                                                )}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.7rem",
                                                  textAlign: "end",
                                                }}
                                              >
                                                {getCurrentTotalNonTaxableAmount(
                                                  item.PurchaseRate,
                                                  item.Quantity,
                                                  item.TaxRate,
                                                  item.Discount
                                                )}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.7rem",
                                                  textAlign: "end",
                                                }}
                                              >
                                                {getItemTaxablePurchase(
                                                  item.PurchaseRate,
                                                  item.Quantity,
                                                  item.TaxRate,
                                                  item.Discount,
                                                  elm.VType,
                                                  elm
                                                )}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.7rem",
                                                  textAlign: "end",
                                                }}
                                              >
                                                {getItemVATPurchase(
                                                  item.PurchaseRate,
                                                  item.Quantity,
                                                  item.TaxRate,
                                                  item.Discount,
                                                  elm.VType,
                                                  elm
                                                )}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.7rem",
                                                  textAlign: "end",
                                                }}
                                              >
                                                {getItemTaxableImportPurchase(
                                                  item.PurchaseRate,
                                                  item.Quantity,
                                                  item.TaxRate,
                                                  item.Discount,
                                                  elm.VType,
                                                  elm
                                                )}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.7rem",
                                                  textAlign: "end",
                                                }}
                                              >
                                                {getItemVATImportPurchase(
                                                  item.PurchaseRate,
                                                  item.Quantity,
                                                  item.TaxRate,
                                                  item.Discount,
                                                  elm.VType,
                                                  elm
                                                )}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.7rem",
                                                  textAlign: "end",
                                                }}
                                              >
                                                {getItemTaxableCapitalPurchase(
                                                  item.PurchaseRate,
                                                  item.Quantity,
                                                  item.TaxRate,
                                                  item.Discount,
                                                  elm.VType,
                                                  elm
                                                )}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.7rem",
                                                  textAlign: "end",
                                                }}
                                              >
                                                {getItemVATCapitalPurchase(
                                                  item.PurchaseRate,
                                                  item.Quantity,
                                                  item.TaxRate,
                                                  item.Discount,
                                                  elm.VType,
                                                  elm
                                                )}
                                              </TableCell>
                                            </TableRow>
                                          </>
                                        )}
                                      </>
                                    );
                                  }
                                )}
                              </>
                            );
                          }
                        )}
                              </>                              
                            ))}              
                            
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
                            <TableCell sx={{ fontWeight: "bold" }}>
                              {totaltaxableImportExcludingCapital.toFixed(2)}
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              {totaltaxImportExcludingCapital.toFixed(2)}
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              {totaltaxableImportIncludeCapital.toFixed(2)}
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              {totaltaxImportIncludeCapital.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
            </Table>
            </TableContainer>
      }      
        {/* <TableContainer>
          <Table className={classes.table} stickyHeader id="downloadExcel">
            <TableHead>
              <TableRow>
                <TableCell
                  colSpan={16}
                  align="center"
                  sx={{ fontSize: "32px", fontWeight: "bold" }}
                >
                  खरिद खाता
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
                  {month} &nbsp; &nbsp; &nbsp; बिलहरुको संख्या: {allData.length}
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
                <TableCell rowSpan={2} align="right">
                  जम्मा खरिद मूल्य (रु)
                </TableCell>
                <TableCell rowSpan={2} align="right">
                  कर छुट हुने वस्तु वा सेवाको खरिद / पैठारी मूल्य (रु)
                </TableCell>
                <TableCell colSpan={2}> करयोग्य खरिद (पूंजीगत बाहेक)</TableCell>
                <TableCell colSpan={2}>
                  {" "}
                  करयोग्य पैठारी (पूंजीगत बाहेक)
                </TableCell>
                <TableCell colSpan={2}>
                  {" "}
                  पूंजीगत करयोग्य खरिद / पैठारी{" "}
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
              {ReportTypeBook === "Details"
                ?
                allData &&
                  allData?.map((elm: any, i: any) => {
                    return (
                      <>
                        {elm?.AccountTransactionValues.map(
                          (value: any, ind: any) => {
                            return (
                              <>
                                {ind === 0 && (
                                  <>
                                    <TableRow>
                                      <TableCell align="center">
                                        {elm.VDate}
                                      </TableCell>
                                      <TableCell align="center">
                                        {getInvoiceNo(
                                          elm.VType,
                                          elm.RefInvoiceNo
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        {getPragpatraNo(
                                          elm.VType,
                                          elm.RefInvoiceNo
                                        )}
                                      </TableCell>
                                      <TableCell align="center">
                                        {getCustomerName(
                                          value.SourceAccountTypeId
                                        )}
                                      </TableCell>{" "}
                                      <TableCell align="center">
                                        {getCustomerPan(
                                          value.SourceAccountTypeId
                                        )}
                                      </TableCell>
                                      <TableCell colSpan={3}></TableCell>
                                      <TableCell align="right">
                                        {(
                                          getTotal(elm) - getDiscount(elm)
                                        ).toFixed(2)}
                                      </TableCell>
                                      <TableCell align="right">
                                        {getNonTaxablePurchase(
                                          elm.VType,
                                          elm
                                        ).toFixed(2)}
                                      </TableCell>
                                      <TableCell align="right">
                                        {getTaxablePurchase(
                                          elm.VType,
                                          elm
                                        ).toFixed(2)}
                                      </TableCell>
                                      <TableCell align="right">
                                        {getPurchaseVat(elm.VType, elm).toFixed(
                                          2
                                        )}
                                      </TableCell>
                                      <TableCell align="right">
                                        {gettaxableImportExcludingCapital(
                                          elm.VType,
                                          elm
                                        )}
                                      </TableCell>
                                      <TableCell align="right">
                                        {getPurchaseVatImportExcludingCapital(
                                          elm.VType,
                                          elm
                                        )}
                                      </TableCell>
                                      <TableCell align="right">
                                        {gettaxableImportIncludeCapital(
                                          elm.VType,
                                          elm
                                        )}
                                      </TableCell>
                                      <TableCell align="right">
                                        {getPurchaseVatImportIncludeCapital(
                                          elm.VType,
                                          elm
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  </>
                                )}

                                {elm?.PurchaseDetails.map(
                                  (item: any, i: any) => {
                                    return (
                                      <>
                                        {ind === 0 && (
                                          <>
                                            <TableRow>
                                              <TableCell
                                                colSpan={5}
                                              ></TableCell>
                                              <TableCell>
                                                {getProductName(
                                                  item.InventoryItemId
                                                )}
                                              </TableCell>
                                              <TableCell align="center">
                                                {item.Quantity}
                                              </TableCell>
                                              <TableCell align="center">
                                                {item.UnitType}
                                              </TableCell>
                                              <TableCell
                                                colSpan={8}
                                              ></TableCell>
                                            </TableRow>
                                          </>
                                        )}
                                      </>
                                    );
                                  }
                                )}
                              </>
                            );
                          }
                        )}
                      </>
                    );
                  })
                : ReportTypeBook === "Summery"
                ? allData &&
                  allData?.map((elm: any, i: any) => {
                    return (
                      <>
                        {elm?.AccountTransactionValues.map(
                          (value: any, ind: any) => {
                            return (
                              <>
                                {ind === 0 && (
                                  <>
                                    <TableRow>
                                      <TableCell align="center">
                                        {elm.VDate}
                                      </TableCell>
                                      <TableCell align="center">
                                        {getInvoiceNo(
                                          elm.VType,
                                          elm.RefInvoiceNo
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        {getPragpatraNo(
                                          elm.VType,
                                          elm.RefInvoiceNo
                                        )}
                                      </TableCell>
                                      <TableCell align="center">
                                        {getCustomerName(
                                          value.SourceAccountTypeId
                                        )}
                                      </TableCell>{" "}
                                      <TableCell align="center">
                                        {getCustomerPan(
                                          value.SourceAccountTypeId
                                        )}
                                      </TableCell>
                                      <TableCell colSpan={3}></TableCell>
                                      <TableCell align="right">
                                        {(
                                          getTotal(elm) - getDiscount(elm)
                                        ).toFixed(2)}
                                      </TableCell>
                                      <TableCell align="right">
                                        {getNonTaxablePurchase(
                                          elm.VType,
                                          elm
                                        ).toFixed(2)}
                                      </TableCell>
                                      <TableCell align="right">
                                        {getTaxablePurchase(
                                          elm.VType,
                                          elm
                                        ).toFixed(2)}
                                      </TableCell>
                                      <TableCell align="right">
                                        {getPurchaseVat(elm.VType, elm).toFixed(
                                          2
                                        )}
                                      </TableCell>
                                      <TableCell align="right">
                                        {gettaxableImportExcludingCapital(
                                          elm.VType,
                                          elm
                                        )}
                                      </TableCell>
                                      <TableCell align="right">
                                        {getPurchaseVatImportExcludingCapital(
                                          elm.VType,
                                          elm
                                        )}
                                      </TableCell>
                                      <TableCell align="right">
                                        {gettaxableImportIncludeCapital(
                                          elm.VType,
                                          elm
                                        )}
                                      </TableCell>
                                      <TableCell align="right">
                                        {getPurchaseVatImportIncludeCapital(
                                          elm.VType,
                                          elm
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  </>
                                )}
                              </>
                            );
                          }
                        )}
                      </>
                    );
                  })
                : ReportTypeBook === "IRDCBMS"
                ? allData &&
                  allData?.map((elm: any, i: any) => {
                    return (
                      <>
                        {elm?.AccountTransactionValues.map(
                          (value: any, ind: any) => {
                            return (
                              <>
                                {elm?.PurchaseDetails.map(
                                  (item: any, i: any) => {
                                    return (
                                      <>
                                        {ind === 0 && (
                                          <>
                                            <TableRow>
                                              <TableCell align="center">
                                                {elm.VDate}
                                              </TableCell>
                                              <TableCell align="center">
                                                {getInvoiceNo(
                                                  elm.VType,
                                                  elm.RefInvoiceNo
                                                )}
                                              </TableCell>
                                              <TableCell>
                                                {getPragpatraNo(
                                                  elm.VType,
                                                  elm.RefInvoiceNo
                                                )}
                                              </TableCell>
                                              <TableCell align="center">
                                                {getCustomerName(
                                                  value.SourceAccountTypeId
                                                )}
                                              </TableCell>{" "}
                                              <TableCell align="center">
                                                {getCustomerPan(
                                                  value.SourceAccountTypeId
                                                )}
                                              </TableCell>
                                              <TableCell>
                                                {getProductName(
                                                  item.InventoryItemId
                                                )}
                                              </TableCell>
                                              <TableCell align="center">
                                                {item.Quantity}
                                              </TableCell>
                                              <TableCell align="left">
                                                {item.UnitType}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.7rem",
                                                  textAlign: "end",
                                                }}
                                              >
                                                {getCurrentTotalPurchaseAmount(
                                                  item.PurchaseRate,
                                                  item.Quantity,
                                                  item.TaxRate,
                                                  item.Discount
                                                )}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.7rem",
                                                  textAlign: "end",
                                                }}
                                              >
                                                {getCurrentTotalNonTaxableAmount(
                                                  item.PurchaseRate,
                                                  item.Quantity,
                                                  item.TaxRate,
                                                  item.Discount
                                                )}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.7rem",
                                                  textAlign: "end",
                                                }}
                                              >
                                                {getItemTaxablePurchase(
                                                  item.PurchaseRate,
                                                  item.Quantity,
                                                  item.TaxRate,
                                                  item.Discount,
                                                  elm.VType,
                                                  elm
                                                )}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.7rem",
                                                  textAlign: "end",
                                                }}
                                              >
                                                {getItemVATPurchase(
                                                  item.PurchaseRate,
                                                  item.Quantity,
                                                  item.TaxRate,
                                                  item.Discount,
                                                  elm.VType,
                                                  elm
                                                )}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.7rem",
                                                  textAlign: "end",
                                                }}
                                              >
                                                {getItemTaxableImportPurchase(
                                                  item.PurchaseRate,
                                                  item.Quantity,
                                                  item.TaxRate,
                                                  item.Discount,
                                                  elm.VType,
                                                  elm
                                                )}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.7rem",
                                                  textAlign: "end",
                                                }}
                                              >
                                                {getItemVATImportPurchase(
                                                  item.PurchaseRate,
                                                  item.Quantity,
                                                  item.TaxRate,
                                                  item.Discount,
                                                  elm.VType,
                                                  elm
                                                )}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.7rem",
                                                  textAlign: "end",
                                                }}
                                              >
                                                {getItemTaxableCapitalPurchase(
                                                  item.PurchaseRate,
                                                  item.Quantity,
                                                  item.TaxRate,
                                                  item.Discount,
                                                  elm.VType,
                                                  elm
                                                )}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.7rem",
                                                  textAlign: "end",
                                                }}
                                              >
                                                {getItemVATCapitalPurchase(
                                                  item.PurchaseRate,
                                                  item.Quantity,
                                                  item.TaxRate,
                                                  item.Discount,
                                                  elm.VType,
                                                  elm
                                                )}
                                              </TableCell>
                                            </TableRow>
                                          </>
                                        )}
                                      </>
                                    );
                                  }
                                )}
                              </>
                            );
                          }
                        )}
                      </>
                    );
                  })
                : "Nothing "}
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
                <TableCell sx={{ fontWeight: "bold" }}>
                  {totaltaxableImportExcludingCapital.toFixed(2)}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {totaltaxImportExcludingCapital.toFixed(2)}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {totaltaxableImportIncludeCapital.toFixed(2)}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {totaltaxImportIncludeCapital.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer> */}
      </Paper>
    </>
  );
};

export default PurchaseBookTable;
