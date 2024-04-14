import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";

import { ISales } from "../../../../interfaces/invoice";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../app/hooks";
import {
  ICommonObj,
  SMonth,
  ILedgerCalculation,
} from "../../../transaction/invoice/interfaces";
import { makeStyles } from "@mui/styles";

interface IProps {
  ReportTypeBook: any;
  salesData: ISales[];
  productData: ICommonObj[];
  ledgerData: ICommonObj[];
  ledgerCalculationData: ILedgerCalculation[];
  month: SMonth;
}

interface IGrandDetails {
  totalAmount: number;
  totalTaxable: number;
  totalNonTaxable: number;
  totalDiscount: number;
  totalTax: number;
  grandTotal: number;
}
interface IGrandDetailsKey {
  taxable: number;
  nonTaxable: number;
  tax: number;
  discount: number;
  sales: number;
}
const useStyles = makeStyles({
  table: {
    "& .MuiTableCell-root": {
      borderLeft: "1px solid rgba(224, 224, 224, 1)",
      borderTop: "1px solid rgba(224, 224, 224, 1)",
    },
  },
});

const getFormatedNumber = (num: any): string => {
  let formatedNum = parseFloat(num).toFixed(2);
  return formatedNum;
};
const getCurrentTotalSalesAmount = (
  UnitPrice: any,
  Qty: number,
  TaxRate: number,
  Discount: number,
  DiscountType: string
): string => {
  let currentdiscountrate = 0;
  let currentdiscount = 0;

  if (DiscountType === null || DiscountType === "") {
    currentdiscount = Discount;
  }
  if (DiscountType === "Percent") {
    currentdiscountrate = Discount;
  }
  let NetSale = UnitPrice * Qty;

  if (currentdiscountrate > 0) {
    currentdiscount = (NetSale * currentdiscountrate) / 100;
  }
  if (DiscountType === "Fixed") {
    currentdiscount = Discount;
  }

  NetSale = NetSale - currentdiscount;

  let currentvat = (NetSale * TaxRate) / 100;
  let TotalSale = NetSale + currentvat;

  return TotalSale.toFixed(2);
};
const getCurrentTotalNonTaxableAmount = (
  UnitPrice: any,
  Qty: number,
  TaxRate: number,
  Discount: number,
  DiscountType: string
): string => {
  let currentdiscountrate = 0;
  let currentdiscount = 0;

  if (DiscountType === null || DiscountType === "") {
    currentdiscount = Discount;
  }
  if (DiscountType === "Percent") {
    currentdiscountrate = Discount;
  }
  let NetSale = UnitPrice * Qty;

  if (currentdiscountrate > 0) {
    currentdiscount = (NetSale * currentdiscountrate) / 100;
  }
  if (DiscountType === "Fixed") {
    currentdiscount = Discount;
  }

  NetSale = NetSale - currentdiscount;

  if (TaxRate != 0) {
    NetSale = 0;
  }

  let currentvat = (NetSale * TaxRate) / 100;
  let TotalSale = NetSale + currentvat;
  if (TotalSale === 0) {
    return " ";
  }
  return TotalSale.toFixed(2);
};

const getCurrentTotalSalesBeforeTaxAmount = (
  UnitPrice: any,
  Qty: number,
  TaxRate: number,
  Discount: number,
  DiscountType: string
): string => {
  let currentdiscountrate = 0;
  let currentdiscount = 0;

  if (DiscountType === null || DiscountType === "") {
    currentdiscount = Discount;
  }
  if (DiscountType === "Percent") {
    currentdiscountrate = Discount;
  }
  let NetSale = UnitPrice * Qty;

  if (currentdiscountrate > 0) {
    currentdiscount = (NetSale * currentdiscountrate) / 100;
  }
  if (DiscountType === "Fixed") {
    currentdiscount = Discount;
  }

  NetSale = NetSale - currentdiscount;
  if (TaxRate === 0) {
    NetSale = 0;
  }

  return NetSale.toFixed(2);
};
const getCurrentTotalSalesTaxAmount = (
  UnitPrice: any,
  Qty: number,
  TaxRate: number,
  Discount: number,
  DiscountType: string
): string => {
  let currentdiscountrate = 0;
  let currentdiscount = 0;

  if (DiscountType === null || DiscountType === "") {
    currentdiscount = Discount;
  }
  if (DiscountType === "Percent") {
    currentdiscountrate = Discount;
  }
  let NetSale = UnitPrice * Qty;

  if (currentdiscountrate > 0) {
    currentdiscount = (NetSale * currentdiscountrate) / 100;
  }
  if (DiscountType === "Fixed") {
    currentdiscount = Discount;
  }

  NetSale = NetSale - currentdiscount;

  let currentvat = (NetSale * TaxRate) / 100;
  return currentvat.toFixed(2);
};

const getLedgerName = (id: number, ledgerData: ICommonObj[]): string => {
  for (let index = 0; index < ledgerData.length; index++) {
    const element = ledgerData[index];
    if (element.id === id) {
      return element.name;
    }
  }
  return "Undifined";
};
const getPANNumber = (id: number, ledgerData: ICommonObj[]): string => {
  for (let index = 0; index < ledgerData.length; index++) {
    const element = ledgerData[index];
    if (element.id === id) {
      return element.panNo;
    }
  }
  return "Undefined";
};

const getProductName = (id: number, productData: ICommonObj[]): string => {
  for (let index = 0; index < productData.length; index++) {
    const element = productData[index];
    if (element.id === id) {
      return element.name;
    }
  }
  return "Undifined";
};

const getBillNo = (bill: string): string => {
  let billNo = "";
  let startPosition = bill.search("#");
  let endPosition = bill.search("]");
  for (let index = startPosition + 1; index < endPosition; index++) {
    billNo += bill[index];
  }
  return billNo;
};

// Calculation part
const TSalesBook = ({
  ReportTypeBook,
  salesData,
  productData,
  ledgerData,
  ledgerCalculationData,
  month,
}: IProps) => {
  const companyData = useAppSelector((state) => state.company.data);
  const financialYear = useAppSelector((state) => state.financialYear);
  const [keys, setKeys] = useState<IGrandDetailsKey>({
    tax: 0,
    taxable: 0,
    nonTaxable: 0,
    discount: 0,
    sales: 0,
  });

  let totalAmount = 0;
  let totalTaxable = 0;
  let totalNonTaxable = 0;
  let totalDiscount = 0;
  let totalTax = 0;
  let grandTotal = 0;

  const classes = useStyles();

  const setAllKeys = () => {
    const nonTaxableData = ledgerCalculationData.find(
      (data) => data.Name === "Non Taxable Sales"
    );

    const taxableData = ledgerCalculationData.find(
      (data) => data.Name === "Taxable Sales"
    );

    const discountData = ledgerCalculationData.find(
      (data) => data.Name === "Discount"
    );

    const taxData = ledgerCalculationData.find(
      (data) => data.Name === "Vat 13%"
    );

    const salesData = ledgerCalculationData.find(
      (data) => data.Name === "Sales"
    );

    setKeys({
      nonTaxable: nonTaxableData ? nonTaxableData.Id : 0,
      taxable: taxableData ? taxableData.Id : 0,
      discount: discountData ? discountData.Id : 0,
      tax: taxData ? taxData.Id : 0,
      sales: salesData ? salesData.Id : 0,
    });
  };

  const getGrandDetails = (data: ISales): IGrandDetails => {
    let amount = 0;
    let taxable = 0;
    let nonTaxable = 0;
    let tax = 0;
    let discount = 0;
    let grand = 0;

    const nonTaxableData = data.AccountTransactionValues.find(
      (data) => data.AccountId === keys.nonTaxable
    );
    const taxableData = data.AccountTransactionValues.find(
      (data) => data.AccountId === keys.taxable
    );
    const taxData = data.AccountTransactionValues.find(
      (data) => data.AccountId === keys.tax
    );

    const discountData = data.AccountTransactionValues.find(
      (data) => data.AccountId === keys.discount
    );

    const salesData = data.AccountTransactionValues.find(
      (data) => data.AccountId === keys.sales
    );

    nonTaxable = nonTaxableData ? nonTaxableData.Credit : 0;
    taxable = taxableData ? taxableData.Credit + taxableData.Debit : 0;
    tax = taxData ? taxData.Credit + taxData.Debit : 0;
    discount = discountData ? discountData.Debit + discountData.Credit : 0;
    grandTotal += taxable + nonTaxable + +tax;
    totalTaxable += taxable;
    totalNonTaxable += nonTaxable;
    totalTax += tax;
    totalDiscount += discount;
    totalAmount += taxable + nonTaxable + tax;

    return {
      totalAmount: totalAmount,
      totalTaxable: taxable,
      totalNonTaxable: nonTaxable,
      totalDiscount: discount,
      totalTax: tax,
      grandTotal: grandTotal,
    };
  };

  useEffect(() => {
    setAllKeys();
  }, [salesData, ledgerCalculationData]);

  return (
    <>
      {salesData?.length > 0 ? (
        <Paper id="printDownloadPDF" sx={{ marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader id="downloadExcel" className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell
                    colSpan={15}
                    align="center"
                    sx={{ fontSize: "20px", fontWeight: "bold" }}
                    className="text-align-center"
                  >
                    बिक्री खाता
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    align="center"
                    colSpan={16}
                    className="text-align-center"
                  >
                    (नियम २३ को उपनियम (१) को खण्ड (ज) संग सम्बन्धित )
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={15}
                    align="center"
                    sx={{ fontWeight: "500" }}
                    className="text-align-center"
                  >
                    करदाता दर्ता नं (PAN) : {companyData.Pan_Vat} &nbsp; &nbsp;
                    &nbsp; करदाताको नाम: {companyData.NameEnglish} &nbsp; &nbsp;
                    &nbsp; साल: {financialYear.Name} &nbsp; &nbsp; &nbsp; कर
                    अवधि: &nbsp;{month} - &nbsp; बिलहरुको संख्या:{" "}
                    {salesData.length}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    className="text-align-center"
                  >
                    बीजक
                  </TableCell>
                  <TableCell colSpan={2}></TableCell>
                  <TableCell
                    colSpan={2}
                    align="center"
                    className="text-align-center"
                  >
                    करयोग्य बिक्री
                  </TableCell>
                  <TableCell
                    colSpan={4}
                    align="center"
                    className="text-align-center"
                  >
                    निकासी
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    align="center"
                    sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
                    className="text-align-center"
                  >
                    मिति
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
                    align="center"
                    className="text-align-center"
                  >
                    बीजक नम्बर
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
                    align="center"
                    className="text-align-center"
                  >
                    खरिदकर्ताको नाम
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
                    align="right"
                    className="text-align-center"
                  >
                    खरिदकर्ताको स्थायी लेखा नम्बर
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
                    align="center"
                    className="text-align-center"
                  >
                    वस्तु वा सेवाको नाम
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
                    align="left"
                    className="text-align-center"
                  >
                    वस्तु वा सेवाको परिमाण
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
                    align="center"
                    className="text-align-center"
                  >
                    वस्तु वा सेवाको एकाई
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
                    align="right"
                    className="text-align-center"
                  >
                    जम्मा बिक्री / निकासी (रु)
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
                    align="center"
                    className="text-align-center"
                  >
                    स्थानीय कर छुटको बिक्री मूल्य (रु)
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
                    align="right"
                    className="text-align-center"
                  >
                    मूल्य (रु)
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
                    align="right"
                    className="text-align-center"
                  >
                    कर (रु)
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
                    align="right"
                    className="text-align-center"
                  >
                    निकासी गरेको वस्तु वा सेवाको मूल्य (रु)
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
                    align="right"
                    className="text-align-center"
                  >
                    निकासी गरेको देश
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
                    align="center"
                    className="text-align-center"
                  >
                    निकासी प्रज्ञापनपत्र नम्बर
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
                    align="center"
                    className="text-align-center"
                  >
                    निकासी प्रज्ञापनपत्र मिति
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ReportTypeBook === "Details" ? (
                  salesData?.map((elm: any, i: any) => {
                    const grandDetails = getGrandDetails(elm);
                    return (
                      <>
                        <TableRow key={i}>
                          <TableCell sx={{ fontSize: "0.7rem" }}>
                            {elm.AccountTransactionValues[0].NVDate}
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.7rem" }}>
                            {getBillNo(elm.Name)}
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.7rem" }}>
                            {getLedgerName(elm.SourceAccountTypeId, ledgerData)}
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.7rem" }}>
                            {getPANNumber(elm.SourceAccountTypeId, ledgerData)}
                          </TableCell>
                          <TableCell colSpan={3}></TableCell>
                          <TableCell
                            sx={{ textAlign: "end", fontSize: "0.7rem" }}
                          >
                            {getFormatedNumber(
                              grandDetails.totalNonTaxable +
                                grandDetails.totalTaxable +
                                grandDetails.totalTax
                            )}
                          </TableCell>
                          <TableCell
                            sx={{ textAlign: "end", fontSize: "0.7rem" }}
                          >
                            {getFormatedNumber(grandDetails.totalNonTaxable)}
                          </TableCell>
                          <TableCell
                            sx={{ textAlign: "end", fontSize: "0.7rem" }}
                          >
                            {getFormatedNumber(grandDetails.totalTaxable)}
                          </TableCell>
                          <TableCell
                            sx={{ textAlign: "end", fontSize: "0.7rem" }}
                          >
                            {getFormatedNumber(grandDetails.totalTax)}
                          </TableCell>
                          <TableCell
                            sx={{ textAlign: "end", fontSize: "0.7rem" }}
                          >
                            0.00
                          </TableCell>
                          <TableCell
                            sx={{ textAlign: "end", fontSize: "0.7rem" }}
                          >
                            --
                          </TableCell>
                          <TableCell
                            sx={{ textAlign: "end", fontSize: "0.7rem" }}
                          >
                            0
                          </TableCell>
                          <TableCell
                            sx={{ textAlign: "end", fontSize: "0.7rem" }}
                          >
                            -
                          </TableCell>
                        </TableRow>
                        {elm.SalesOrderDetails.map(
                          (elmSales: any, enJ: any) => {
                            return (
                              <TableRow key={`item-${enJ}`}>
                                <TableCell colSpan={4}></TableCell>
                                <TableCell sx={{ fontSize: "0.7rem" }}>
                                  {getProductName(elmSales.ItemId, productData)}
                                </TableCell>
                                <TableCell sx={{ fontSize: "0.7rem" }}>
                                  {elmSales.Qty}
                                </TableCell>
                                <TableCell
                                  sx={{ fontSize: "0.7rem", textAlign: "end" }}
                                >
                                  {elmSales.UnitType}
                                </TableCell>
                                <TableCell colSpan={8}></TableCell>
                              </TableRow>
                            );
                          }
                        )}
                      </>
                    );
                  })
                ) : ReportTypeBook === "Summery" ? (
                  salesData?.map((elm: any, i: any) => {
                    const grandDetails = getGrandDetails(elm);
                    return (
                      <>
                        <TableRow key={i}>
                          <TableCell sx={{ fontSize: "0.7rem" }}>
                            {elm.AccountTransactionValues[0].NVDate}
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.7rem" }}>
                            {getBillNo(elm.Name)}
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.7rem" }}>
                            {getLedgerName(elm.SourceAccountTypeId, ledgerData)}
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.7rem" }}>
                            {getPANNumber(elm.SourceAccountTypeId, ledgerData)}
                          </TableCell>
                          <TableCell colSpan={3}></TableCell>
                          <TableCell
                            sx={{ textAlign: "end", fontSize: "0.7rem" }}
                          >
                            {getFormatedNumber(
                              grandDetails.totalNonTaxable +
                                grandDetails.totalTaxable +
                                grandDetails.totalTax
                            )}
                          </TableCell>
                          <TableCell
                            sx={{ textAlign: "end", fontSize: "0.7rem" }}
                          >
                            {getFormatedNumber(grandDetails.totalNonTaxable)}
                          </TableCell>
                          <TableCell
                            sx={{ textAlign: "end", fontSize: "0.7rem" }}
                          >
                            {getFormatedNumber(grandDetails.totalTaxable)}
                          </TableCell>
                          <TableCell
                            sx={{ textAlign: "end", fontSize: "0.7rem" }}
                          >
                            {getFormatedNumber(grandDetails.totalTax)}
                          </TableCell>
                          <TableCell
                            sx={{ textAlign: "end", fontSize: "0.7rem" }}
                          >
                            0.00
                          </TableCell>
                          <TableCell
                            sx={{ textAlign: "end", fontSize: "0.7rem" }}
                          >
                            --
                          </TableCell>
                          <TableCell
                            sx={{ textAlign: "end", fontSize: "0.7rem" }}
                          >
                            0
                          </TableCell>
                          <TableCell
                            sx={{ textAlign: "end", fontSize: "0.7rem" }}
                          >
                            -
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })
                ) : ReportTypeBook === "IRDCBMS" ? (
                  salesData?.map((elm: any, i: any) => {
                    return (
                      <>
                        {elm.SalesOrderDetails.map(
                          (elmSales: any, enJ: any) => {
                            return (
                              <TableRow key={`item-${enJ}`}>
                                <TableCell>
                                  {elm.AccountTransactionValues[0].NVDate}
                                </TableCell>
                                <TableCell sx={{ fontSize: "0.7rem" }}>
                                  {getBillNo(elm.Name)}
                                </TableCell>
                                <TableCell sx={{ fontSize: "0.7rem" }}>
                                  {getLedgerName(
                                    elm.SourceAccountTypeId,
                                    ledgerData
                                  )}
                                </TableCell>
                                <TableCell sx={{ fontSize: "0.7rem" }}>
                                  {getPANNumber(
                                    elm.SourceAccountTypeId,
                                    ledgerData
                                  )}
                                </TableCell>
                                <TableCell sx={{ fontSize: "0.7rem" }}>
                                  {getProductName(elmSales.ItemId, productData)}
                                </TableCell>
                                <TableCell sx={{ fontSize: "0.7rem" }}>
                                  {elmSales.Qty}
                                </TableCell>
                                <TableCell
                                  sx={{ fontSize: "0.7rem", textAlign: "left" }}
                                >
                                  {elmSales.UnitType}
                                </TableCell>
                                <TableCell
                                  sx={{ fontSize: "0.7rem", textAlign: "end" }}
                                >
                                  {getCurrentTotalSalesAmount(
                                    elmSales.UnitPrice,
                                    elmSales.Qty,
                                    elmSales.TaxRate,
                                    elmSales.Discount,
                                    elmSales.DiscountType
                                  )}
                                </TableCell>
                                <TableCell
                                  sx={{ fontSize: "0.7rem", textAlign: "end" }}
                                >
                                  {getCurrentTotalNonTaxableAmount(
                                    elmSales.UnitPrice,
                                    elmSales.Qty,
                                    elmSales.TaxRate,
                                    elmSales.Discount,
                                    elmSales.DiscountType
                                  )}
                                </TableCell>
                                <TableCell
                                  sx={{ fontSize: "0.7rem", textAlign: "end" }}
                                >
                                  {getCurrentTotalSalesBeforeTaxAmount(
                                    elmSales.UnitPrice,
                                    elmSales.Qty,
                                    elmSales.TaxRate,
                                    elmSales.Discount,
                                    elmSales.DiscountType
                                  )}
                                </TableCell>
                                <TableCell
                                  sx={{ fontSize: "0.7rem", textAlign: "end" }}
                                >
                                  {getCurrentTotalSalesTaxAmount(
                                    elmSales.UnitPrice,
                                    elmSales.Qty,
                                    elmSales.TaxRate,
                                    elmSales.Discount,
                                    elmSales.DiscountType
                                  )}
                                </TableCell>
                                <TableCell
                                  sx={{ fontSize: "0.7rem", textAlign: "end" }}
                                ></TableCell>
                                <TableCell
                                  sx={{ fontSize: "0.7rem", textAlign: "end" }}
                                ></TableCell>
                                <TableCell
                                  sx={{ fontSize: "0.7rem", textAlign: "end" }}
                                ></TableCell>
                                <TableCell
                                  sx={{ fontSize: "0.7rem", textAlign: "end" }}
                                ></TableCell>
                              </TableRow>
                            );
                          }
                        )}
                      </>
                    );
                  })
                ) : (
                  <p>Sorry, For this.</p>
                )}
                <TableRow>
                  <TableCell
                    colSpan={7}
                    sx={{ textAlign: "end", fontWeight: "bold" }}
                  >
                    Total
                  </TableCell>
                  <TableCell sx={{ textAlign: "end", fontWeight: "bold" }}>
                    {totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ textAlign: "end", fontWeight: "bold" }}>
                    {totalNonTaxable.toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ textAlign: "end", fontWeight: "bold" }}>
                    {totalTaxable.toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ textAlign: "end", fontWeight: "bold" }}>
                    {totalTax.toFixed(2)}
                  </TableCell>
                  <TableCell colSpan={3}></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        "No Data Found"
      )}
    </>
  );
};

export default TSalesBook;
