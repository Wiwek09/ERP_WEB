import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import { ICommonObj, IDate, ILedgerCalculation } from "../interfaces";
import { ISales } from "../../../../interfaces/invoice";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../app/hooks";

interface IProps {
  salesData: ISales[];
  productData: ICommonObj[];
  ledgerData: ICommonObj[];
  ledgerCalculationData: ILedgerCalculation[];
  date: IDate;
}

interface IGrandDetails {
  totalAmount: number;
  totalTaxable: number;
  totlaNonTaxable: number;
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
interface IOption {
  id: string;
  label: string;
}

const getFormatedNumber = (num: any): string => {
  let formatedNum = parseFloat(num).toFixed(2);
  return formatedNum;
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

const getSaleType = (saleType: string): string => {
  let saleTypeData = "";

  let endPosition = saleType.search("#") - 1;

  for (let index = 0; index < endPosition; index++) {
    saleTypeData += saleType[index];
  }
  return saleTypeData;
};

const tableHeader: string[] = [
  "Date",
  "Bill No.",
  "Customer name",
  "Sales type",
  "Amount",
  "Taxable",
  "Non-taxable",
  "Discount",
  "Tax",
  "Grand total",
  "File",
];

const ExcelTable = ({
  salesData,
  productData,
  ledgerData,
  ledgerCalculationData,
  date,
}: IProps) => {
  const companyName = useAppSelector((state) => state.company.data.NameEnglish);
  const [keys, setKeys] = useState<IGrandDetailsKey>({
    tax: 0,
    taxable: 0,
    nonTaxable: 0,
    discount: 0,
    sales: 0,
  });

  let totalAmount = 0;
  let totalTaxable = 0;
  let totlaNonTaxable = 0;
  let totalDiscount = 0;
  let totalTax = 0;
  let grandTotal = 0;

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
    amount =
      taxable +
      nonTaxable +
      (salesData ? salesData.Credit + salesData.Debit : 0);
    tax = taxData ? taxData.Credit + taxData.Debit : 0;
    discount = discountData ? discountData.Debit + discountData.Credit : 0;
    grand = amount + tax - discount;

    totalAmount += amount;
    totalTaxable += taxable;
    totlaNonTaxable += nonTaxable;
    totalTax += tax;
    totalDiscount += discount;
    grandTotal += grand;

    return {
      totalAmount: amount,
      totalTaxable: taxable,
      totlaNonTaxable: nonTaxable,
      totalDiscount: discount,
      totalTax: tax,
      grandTotal: grand,
    };
  };

  useEffect(() => {
    setAllKeys();
  }, [salesData, ledgerCalculationData]);

  return (
    <>
      <Paper sx={{ display: "none" }} id="printDownloadPDF">
        <TableContainer>
          <Table sx={{ minWidth: 800 }} stickyHeader id="downloadExcel">
            <TableHead>
              <TableRow>
                <TableCell
                  colSpan={11}
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
                  colSpan={11}
                  sx={{
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  Invoice
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={11}
                  sx={{
                    textAlign: "center",
                    fontSize: 15,
                  }}
                >
                  {`${date.StartDate} - ${date.EndDate}`}
                </TableCell>
              </TableRow>
              <TableRow>
                {tableHeader.map((data, index) => (
                  <TableCell key={index}>{data}</TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {salesData.map((data, index) => {
                const grandDetails = getGrandDetails(data);
                return (
                  <>
                    <TableRow key={index}>
                      <TableCell>
                        {data.AccountTransactionValues[0].NVDate}
                      </TableCell>
                      <TableCell>{getBillNo(data.Name)}</TableCell>
                      <TableCell>
                        {getLedgerName(data.SourceAccountTypeId, ledgerData)}
                      </TableCell>
                      <TableCell>{getSaleType(data.Name)}</TableCell>
                      <TableCell sx={{ textAlign: "end" }}>
                        {getFormatedNumber(grandDetails.totalAmount)}
                      </TableCell>
                      <TableCell sx={{ textAlign: "end" }}>
                        {getFormatedNumber(grandDetails.totalTaxable)}
                      </TableCell>
                      <TableCell sx={{ textAlign: "end" }}>
                        {getFormatedNumber(grandDetails.totlaNonTaxable)}
                      </TableCell>
                      <TableCell sx={{ textAlign: "end" }}>
                        {getFormatedNumber(grandDetails.totalDiscount)}
                      </TableCell>
                      <TableCell sx={{ textAlign: "end" }}>
                        {getFormatedNumber(grandDetails.totalTax)}
                      </TableCell>
                      <TableCell sx={{ textAlign: "end" }}>
                        {getFormatedNumber(grandDetails.grandTotal)}
                      </TableCell>
                      <TableCell>No file</TableCell>
                    </TableRow>

                    {data.SalesOrderDetails.length > 0 ? (
                      <TableRow>
                        <TableCell>SN.</TableCell>
                        <TableCell colSpan={3}>Item name</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Rate</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell colSpan={4}></TableCell>
                      </TableRow>
                    ) : (
                      ""
                    )}

                    {data.SalesOrderDetails.map((item, i) => {
                      return (
                        <TableRow key={`item-${i}`}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell colSpan={3}>
                            {getProductName(item.ItemId, productData)}
                          </TableCell>
                          <TableCell>{item.Qty}</TableCell>
                          <TableCell sx={{ textAlign: "end" }}>
                            {getFormatedNumber(item.UnitPrice)}
                          </TableCell>
                          <TableCell sx={{ textAlign: "end" }}>
                            {getFormatedNumber(item.Qty * item.UnitPrice)}
                          </TableCell>
                          <TableCell colSpan={4}></TableCell>
                        </TableRow>
                      );
                    })}
                  </>
                );
              })}
              <TableRow>
                <TableCell
                  colSpan={4}
                  sx={{ textAlign: "end", fontWeight: "bold" }}
                >
                  Total
                </TableCell>
                <TableCell sx={{ textAlign: "end", fontWeight: "bold" }}>
                  {totalAmount.toFixed(2)}
                </TableCell>
                <TableCell sx={{ textAlign: "end", fontWeight: "bold" }}>
                  {totalTaxable.toFixed(2)}
                </TableCell>
                <TableCell sx={{ textAlign: "end", fontWeight: "bold" }}>
                  {totlaNonTaxable.toFixed(2)}
                </TableCell>
                <TableCell sx={{ textAlign: "end", fontWeight: "bold" }}>
                  {totalDiscount.toFixed(2)}
                </TableCell>
                <TableCell sx={{ textAlign: "end", fontWeight: "bold" }}>
                  {totalTax.toFixed(2)}
                </TableCell>
                <TableCell sx={{ textAlign: "end", fontWeight: "bold" }}>
                  {grandTotal.toFixed(2)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default ExcelTable;
