import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useState, useEffect } from "react";
import { useAppSelector } from "../../../../app/hooks";
import { ISalesReturn } from "../../../../interfaces/salesReturn";
import { ILedgerCalculation, SMonth } from "../../../transaction/invoice/interfaces";
import { AHSelectType } from "../AHSelectedType";
import { Console } from "console";

interface IProps {
  ReportTypeBook: any;
  allData: ISalesReturn[];
  accountHolder: AHSelectType[];
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

// (obj: any) => obj.value === data.SourceAccountTypeId
const getLedgerName = (id: number, accountH: AHSelectType[]): string => {
  for (let index = 0; index < accountH.length; index++) {
    const element = accountH[index];
    if (element.value === id) {
      return element.label;
    }
  }
  return "Undifined";
};

const getPANNumber = (id: number, accountH: AHSelectType[]): string => {
  for (let index = 0; index < accountH.length; index++) {
    const element = accountH[index];
    if (element.value === id) {
      return element.panNo;
    }
  }
  return "Undefined";
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
const getCurrentTotalSalesAmount = (UnitPrice : any, Qty : number, TaxRate : number, Discount : number, DiscountType : string) : string =>
{
  let currentdiscountrate = 0;
  let currentdiscount = 0;

  if(DiscountType === null || DiscountType === "")
  {
    currentdiscount = Discount;
  }
  if(DiscountType ===  "Percent")
  {
    currentdiscountrate = Discount;
  }
  let NetSale = UnitPrice * Qty;


  if(currentdiscountrate > 0)
  {
    currentdiscount = NetSale * currentdiscountrate /100; 
  }
  if(DiscountType ===  "Fixed")
  {
    currentdiscount = Discount;
  }

  NetSale = NetSale - currentdiscount;

  let currentvat = NetSale * TaxRate / 100;
  let TotalSale = NetSale + currentvat;
  
  return TotalSale.toFixed(2);
};
const getCurrentTotalNonTaxableAmount = (UnitPrice : any, Qty : number, TaxRate : number, Discount : number, DiscountType : string) : string =>
{
  let currentdiscountrate = 0;
  let currentdiscount = 0;

  if(DiscountType === null || DiscountType === "")
  {
    currentdiscount = Discount;
  }
  if(DiscountType ===  "Percent")
  {
    currentdiscountrate = Discount;
  }
  let NetSale = UnitPrice * Qty;


  if(currentdiscountrate > 0)
  {
    currentdiscount = NetSale * currentdiscountrate /100; 
  }
  if(DiscountType ===  "Fixed")
  {
    currentdiscount = Discount;
  }

  NetSale = NetSale - currentdiscount;

  if(TaxRate != 0)
  {
    NetSale=0;
  }

  let currentvat = NetSale * TaxRate / 100;
  let TotalSale = NetSale + currentvat;
  return TotalSale.toFixed(2);
};
const getCurrentTotalSalesBeforeTaxAmount = (UnitPrice : any, Qty : number, TaxRate : number, Discount : number, DiscountType : string) : string =>
{
  let currentdiscountrate = 0;
  let currentdiscount = 0;

  if(DiscountType === null || DiscountType === "")
  {
    currentdiscount = Discount;
  }
  if(DiscountType ===  "Percent")
  {
    currentdiscountrate = Discount;
  }
  let NetSale = UnitPrice * Qty;


  if(currentdiscountrate > 0)
  {
    currentdiscount = NetSale * currentdiscountrate /100; 
  }
  if(DiscountType ===  "Fixed")
  {
    currentdiscount = Discount;
  }

  NetSale = NetSale - currentdiscount;
  if(TaxRate === 0)
  {
    NetSale=0;
  }

  return NetSale.toFixed(2);
};
const getCurrentTotalSalesTaxAmount = (UnitPrice : any, Qty : number, TaxRate : number,  Discount : number, DiscountType : string) : string =>
{
  let currentdiscountrate = 0;
  let currentdiscount = 0;

  if(DiscountType === null || DiscountType === "")
  {
    currentdiscount = Discount;
  }
  if(DiscountType ===  "Percent")
  {
    currentdiscountrate = Discount;
  }
  let NetSale = UnitPrice * Qty;


  if(currentdiscountrate > 0)
  {
    currentdiscount = NetSale * currentdiscountrate /100; 
  }
  if(DiscountType ===  "Fixed")
  {
    currentdiscount = Discount;
  }

  NetSale = NetSale - currentdiscount;

  let currentvat = NetSale * TaxRate / 100;
  return currentvat.toFixed(2);
};
const TSalesReturnBook = ({
  ReportTypeBook,
  allData,
  accountHolder,
  ledgerCalculationData,
  month
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

  const getGrandDetails = (data: ISalesReturn): IGrandDetails => {
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
    grandTotal +=(taxable +
      nonTaxable + + tax - discount);
    totalTaxable += taxable;
    totalNonTaxable += nonTaxable;
    totalTax += tax;
    totalDiscount += discount;
    totalAmount+=      (taxable +
    nonTaxable + tax - discount);    

    return {
      totalAmount: amount,
      totalTaxable: taxable,
      totalNonTaxable: nonTaxable,
      totalDiscount: discount,
      totalTax: tax,
      grandTotal: grandTotal,
    };
  };

  useEffect(() => {
    setAllKeys();
  }, [allData, ledgerCalculationData]);



  return (
    <>
      {allData?.length > 0 ? (
        <Paper>
          <TableContainer component={Paper}>
            <Table stickyHeader id="downloadExcel" className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell
                    colSpan={11}
                    align="center"
                    sx={{ fontSize: "20px", fontWeight: "bold" }}
                  >
                    बिक्री फिर्ता खाता
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center" colSpan={11}>
                    (नियम २३ को उपनियम (१) को खण्ड (ज) संग सम्बन्धित )
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={11}
                    align="center"
                    sx={{ fontWeight: "500" }}
                  >
                    करदाता दर्ता नं (PAN) : {companyData.Pan_Vat} &nbsp; &nbsp;
                    &nbsp; करदाताको नाम: {companyData.NameEnglish} &nbsp; &nbsp;
                    &nbsp; साल: {financialYear.Name} &nbsp; &nbsp; &nbsp; कर
                    अवधि: &nbsp;{month} - &nbsp; बिलहरुको संख्या: {allData.length}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    बीजक
                  </TableCell>
                  <TableCell colSpan={2}></TableCell>
                  <TableCell colSpan={2} align="center">
                    करयोग्य फिर्ता
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    align="center"
                    sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
                  >
                    मिति
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
                    align="center"
                  >
                    बीजक नम्बर
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
                    align="center"
                  >
                    खरिदकर्ताको नाम
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
                    align="right"
                  >
                    खरिदकर्ताको स्थायी लेखा नम्बर
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
                    align="center"
                  >
                    वस्तु वा सेवाको नाम
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
                    align="left"
                  >
                    वस्तु वा सेवाको परिमाण
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
                    align="center"
                  >
                    वस्तु वा सेवाको एकाई
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
                    align="right"
                  >
                    जम्मा फिर्ता (रु)
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
                    align="right"
                  >
                    स्थानीय कर छुटको फिर्ता मूल्य (रु)
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
                    align="right"
                  >
                    मूल्य (रु)
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
                    align="right"
                  >
                    कर (रु)
                  </TableCell>
                  
                </TableRow>
              </TableHead>
              <TableBody>

            { ReportTypeBook === 'Details'
      ? 
      (
        allData && allData?.map((elm: any, i: any) => {
         const grandDetails = getGrandDetails(elm);
         const accountHolderValue =
           accountHolder &&
           accountHolder.find(
             (obj: any) => obj.value === elm.SourceAccountTypeId
           );
           return (
             <>
               <TableRow key={i}>
               <TableCell align="center">
                 {elm.AccountTransactionValues[0]?.NVDate}
               </TableCell>
               <TableCell align="center">
                 {elm.ref_invoice_number}
               </TableCell>
               <TableCell align="center">
                 {accountHolderValue?.label}
               </TableCell>
               <TableCell align="center">
                 {accountHolderValue?.panNo}
                 </TableCell>
               <TableCell colSpan={3}></TableCell>
               <TableCell align="right">
                 {grandDetails.grandTotal.toFixed(2)}
               </TableCell>
               <TableCell align="right">
               {grandDetails.totalNonTaxable.toFixed(2)}
               </TableCell>
               <TableCell align="right">
                 {grandDetails.totalTaxable.toFixed(2)}
               </TableCell>
               <TableCell align="right">
                 {grandDetails.totalTax.toFixed(2)}
               </TableCell>
               </TableRow>
               {elm?.SalesOrderDetails?.map((elmSales: any, enJ : any) => {
                 return (
                   <>
                     <TableRow id={enJ + "val"}>
                       <TableCell colSpan={4}></TableCell>
                       <TableCell>{elmSales.ItemName}</TableCell>
                       <TableCell align="center">
                         {Math.abs(elmSales?.Qty)}
                       </TableCell>
                       <TableCell align="center">
                         {elmSales?.UnitType}
                       </TableCell>
                       <TableCell colSpan={7}></TableCell>
                     </TableRow>
                   </>
                 );
               })}
             </>
           );
        }
        )) 
      : ( ReportTypeBook === 'Summery'
        ? 
        allData && allData?.map((elm: any, i: any) => {
          const grandDetails = getGrandDetails(elm);
          const accountHolderValue =
          accountHolder &&
          accountHolder.find(
            (obj: any) => obj.value === elm.SourceAccountTypeId
          );            
          return (
            <>
              <TableRow id={i + "main"}>
              <TableCell align="center">
                {elm.AccountTransactionValues[0]?.NVDate}
              </TableCell>
              <TableCell align="center">
                {elm.ref_invoice_number}
              </TableCell>
              <TableCell align="center">
                {accountHolderValue?.label}
              </TableCell>
              <TableCell align="center">
                {accountHolderValue?.panNo}
                </TableCell>
              <TableCell colSpan={3}></TableCell>
              <TableCell align="right">
                {grandDetails.grandTotal.toFixed(2)}
              </TableCell>
              <TableCell align="right">
              {grandDetails.totalNonTaxable.toFixed(2)}
              </TableCell>
              <TableCell align="right">
                {grandDetails.totalTaxable.toFixed(2)}
              </TableCell>
              <TableCell align="right">
                {grandDetails.totalTax.toFixed(2)}
              </TableCell>
              </TableRow>              
            </>
          );
        })

        : (ReportTypeBook === 'IRDCBMS'
          ? 
          allData && allData?.map((elm: any, i: any) => {
            const grandDetails = getGrandDetails(elm);
            const accountHolderValue =
              accountHolder &&
              accountHolder.find(
                (obj: any) => obj.value === elm.SourceAccountTypeId
              );
              return (
                <>
                  {elm?.SalesOrderDetails?.map((elmSales: any, enJ : any) => {
                    return (
                      <>
                        <TableRow id={enJ + "val"}>
                        <TableCell align="center">
                    {elm.AccountTransactionValues[0]?.NVDate}
                  </TableCell>
                  <TableCell align="center">
                    {elm.ref_invoice_number}
                  </TableCell>
                  <TableCell align="center">
                    {accountHolderValue?.label}
                  </TableCell>
                  <TableCell align="center">
                    {accountHolderValue?.panNo}
                    </TableCell>
                          <TableCell>{elmSales.ItemName}</TableCell>
                          <TableCell align="center">
                            {Math.abs(elmSales?.Qty)}
                          </TableCell>
                          <TableCell align="center">
                            {elmSales?.UnitType}
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.7rem", textAlign: "end" }}>
                          {getCurrentTotalSalesAmount(elmSales.UnitPrice, Math.abs(elmSales?.Qty), elmSales.TaxRate, elmSales.Discount, elmSales.DiscountType)}
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.7rem", textAlign: "end" }}>
                          {getCurrentTotalNonTaxableAmount(elmSales.UnitPrice, Math.abs(elmSales?.Qty), elmSales.TaxRate, elmSales.Discount, elmSales.DiscountType)}
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.7rem", textAlign: "end" }}>
                          {getCurrentTotalSalesBeforeTaxAmount(elmSales.UnitPrice, Math.abs(elmSales?.Qty), elmSales.TaxRate, elmSales.Discount, elmSales.DiscountType)}
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.7rem", textAlign: "end" }}>
                          {getCurrentTotalSalesTaxAmount(elmSales.UnitPrice, Math.abs(elmSales?.Qty), elmSales.TaxRate, elmSales.Discount, elmSales.DiscountType)}
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })}
                </>
              );
           })
          : "Nothing "
        )
      )
      }
                <TableRow>
                  <TableCell
                    colSpan={7}
                    sx={{ textAlign: "end", fontWeight: "bold" }}
                  >
                    Total
                  </TableCell>
                  <TableCell sx={{ textAlign: "end", fontWeight: "bold" }}>
                    {grandTotal.toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ textAlign: "end", fontWeight: "bold" }}>
                    {totalDiscount.toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ textAlign: "end", fontWeight: "bold" }}>
                    {totalTaxable.toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ textAlign: "end", fontWeight: "bold" }}>
                    {totalTax.toFixed(2)}
                  </TableCell>
              </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        "No Date Found"
      )}
    </>
  );
};
export default TSalesReturnBook;
