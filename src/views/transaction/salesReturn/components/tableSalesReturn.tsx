import { Grid, Paper, TableFooter, Typography } from "@mui/material";
import { Box } from "@mui/system";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { IParams } from "../../../../interfaces/params";
import { ISelectType } from "../../../../interfaces/autoComplete";
import {
  getAllAccountHolder,
  getAllPurchase,
} from "../../../../services/purchaseOrderApi";
import {
  IAccountHolder,
  IPurchaseMenu,
} from "../../../../interfaces/purchaseOrder";
import { LinearProgress } from "@mui/material";
import ViewHeader from "../../../transmis/components/viewHeader";
import { getSalesReturn } from "../../../../services/salesReturnApi";
import { ILedgerCalculation } from "../../invoice/interfaces";
import { getAllLedgerForCalculation } from "../../../../services/invoice";
import { selectCompany } from "../../../../features/companySlice";
import { useAppSelector } from "../../../../app/hooks";
import { getDecimalInWord } from "../../../../services/decimalToWordApi";
interface IGrandDetailsKey {
  taxable: number;
  nonTaxable: number;
  exerciseDuty: number;
  tax: number;
  discount: number;
  sales: number;
}
interface IGrandDetails {
  totalAmount: number;
  totalTaxable: number;
  totlaNonTaxable: number;
  totalDiscount: number;
  totalExerciseDuty: number;
  totalTax: number;
  grandTotal: number;
}
const initialGrandDetails: IGrandDetails = {
  totalAmount: 0,
  totalTaxable: 0,
  totlaNonTaxable: 0,
  totalDiscount: 0,
  totalExerciseDuty: 0,
  totalTax: 0,
  grandTotal: 0,
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

const PrintSalesReturn = () => {
  const company = useAppSelector(selectCompany);

  const [allData, setAllData] = useState<any>();
  const [accountHolder, setAccountHolder] = useState<ISelectType[]>([]);
  const [products, setProducts] = useState<ISelectType[]>([]);
  // const [isAllDataLoaded, setISAllDataLoaded] = useState<boolean>(false);
  const { id }: IParams = useParams();
  const history = useHistory();
  const [decimalInWords, setDecimalInWords] = useState<string | any>("");  
  const [keys, setKeys] = useState<IGrandDetailsKey>({
    exerciseDuty: 0,
    tax: 0,
    taxable: 0,
    nonTaxable: 0,
    discount: 0,
    sales: 0,
  });
  const [grandDetails, setGrandDetails] = useState<IGrandDetails>(initialGrandDetails);
  const setAllKeys = async () => {
    const ledgerCalculationData: ILedgerCalculation[] =
      await getAllLedgerForCalculation();

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
    const exerciseDutyData = ledgerCalculationData.find(
      (data) => data.Name === "Excise Duty");

    const salesData = ledgerCalculationData.find(
      (data) => data.Name === "Sales"
    );

    setKeys({
      nonTaxable: nonTaxableData ? nonTaxableData.Id : 0,
      taxable: taxableData ? taxableData.Id : 0,
      discount: discountData ? discountData.Id : 0,
      exerciseDuty: exerciseDutyData ? exerciseDutyData.Id : 0,
      tax: taxData ? taxData.Id : 0,
      sales: salesData ? salesData.Id : 0,
    });
  };


  const loadData = async () => {
    try {
      const res = await getSalesReturn(id);
      setAllData(res);
      const ressponse: IAccountHolder[] = await getAllAccountHolder();
      setAccountHolder(
        ressponse.map((item) => {
          return { label: item.Name, value: item.Id };
        })
      );
      const ress: IPurchaseMenu[] = await getAllPurchase();
      setProducts(
        ress.map((item) => {
          return { label: item.Name, value: item.Id };
        })
      );
    } catch (error) {
      history.push("/sales-return");
    }
  };
  
  useEffect(() => {
    setAllKeys();
    loadData();
  }, [id]);

  const getGrandDetails = () => {
    // const data = allData;
    let amount = 0;
    let taxable = 0;
    let nonTaxable = 0;
    let exerciseDuty = 0;
    let tax = 0;
    let discount = 0;
    let grand = 0;
    try {
      if (allData) {
        const nonTaxableData = allData.AccountTransactionValues.find(
          (allData: any) => allData.AccountId === keys.nonTaxable
        );
        const taxableData = allData.AccountTransactionValues.find(

          (allData: any) => allData.AccountId === keys.taxable
        );
        const exerciseDutyData = allData.AccountTransactionValues.find(
          (allData: any) => allData.AccountId === keys.exerciseDuty
        )
        const taxData = allData.AccountTransactionValues.find(
//keys.tax
          (allData: any) => allData.AccountId === 8
        );
        const discountData = allData.AccountTransactionValues.find(
          (allData: any) => allData.AccountId === keys.discount
        );
        const salesData = allData.AccountTransactionValues.find(
          (allData: any) => allData.AccountId === keys.sales
        );

        nonTaxable = nonTaxableData ? nonTaxableData.Credit + nonTaxableData.Debit : 0;
        taxable = taxableData ? taxableData.Credit + taxableData.Debit : 0;
        amount =
          taxable +
          nonTaxable +
          (salesData ? salesData.Credit + salesData.Debit : 0);
        exerciseDuty = exerciseDutyData ? exerciseDutyData.Credit + exerciseDutyData.Debit : 0;
        tax = taxData ? taxData.Credit + taxData.Debit : 0;
        discount = discountData ? discountData.Debit + discountData.Credit : 0;
        grand = amount + tax + exerciseDuty - discount;
        setGrandDetails({
          totalAmount: amount,
          totalTaxable: taxable,
          totlaNonTaxable: nonTaxable,
          totalDiscount: discount,
          totalExerciseDuty: exerciseDuty,
          totalTax: tax,
          grandTotal: grand,
        });

      }
    } catch {
      history.push("/sales-return");
    }
  };
  const decimalToWord = async (grand: number) => {
    const grandInWord = await getDecimalInWord(grand);
    setDecimalInWords(grandInWord);
  };
  useEffect(() => {
    getGrandDetails();
  }, [allData, accountHolder, keys, products]);

  const getFormatedNumber = (num: any): string => {
    let formatedNum = parseFloat(num).toFixed(2);
    return formatedNum;
  };
  
  const getAccountName = (id: any) => {
    for (let index = 0; index < accountHolder.length; index++) {
      if (accountHolder[index].value === id) {
        return accountHolder[index].label;
      }
    }
  };
  if (allData === null || products.length === 0 || accountHolder.length === 0) {
    return <LinearProgress sx={{ mt: 3 }}/>;
  }

  return (
    <>
    {company && company.PrinterType === "POS" ? (
    <div       style={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
      rowGap: "1rem",
      fontFamily: company?.BillHeaderFront || "monospace",
      fontSize: +company?.BillFrontSizeItem || 14,
      fontWeight: +company?.BillFrontWeight || 500,
    }}>
      <div>
      <ViewHeader name="Sales Return" />
      </div>

      <div           style={{
          color: "#000",
          letterSpacing: -1,
        }}>
<div             style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
          }}>
<div>
<p style={{ fontSize: 14 }}>
        Name :{" "}
        {getAccountName(allData.SourceAccountTypeId)}
            </p>
            <p style={{ textAlign: "center", marginBottom: "0.5rem", fontSize: 14 }}>
            Credit Note No. :{" "}
            {getBillNo(allData?.Name ? allData?.Name : "")}
            </p>                
</div>
<div style={{ textAlign: "right" }}> 
<p style={{ textAlign: "center", marginBottom: "0.5rem", fontSize: 14 }}>
              Date: {allData.Date && allData.AccountTransactionValues[0].NVDate.substring(0, 10)}
            </p>
            <p style={{ textAlign: "center", marginBottom: "0.5rem", fontSize: 14 }}>
            Ref. No. :  {allData?.ref_invoice_number}
            </p>
</div>
</div>
<div             style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            borderBottom: "1px dotted black",
            borderTop: "1px dotted black",
            fontSize: 14,
          }}>  
          <div style={{textAlign:"left", width:"3%"}} >SN</div><div style={{ textAlign: "left", width:"50%"}}>Name</div><div style={{ textAlign: "left" , width:"17%"}}>Qty./Unit</div><div style={{ textAlign: "right",  width:"15%"}}>Price</div><div style={{ textAlign: "right",  width:"15%" }}>Amount</div>
          </div>
      </div>
            {allData?.SalesOrderDetails?.map((elm: any, index: number) => {
              const productValue = products?.find(
                (obj) => obj.value === elm.ItemId
              );
              return (
                <>
                <tr                       style={{
                      marginTop: "1px",
                      color: "#000",
                      textAlign: "start",
                      display: "grid",
                      gridTemplateColumns: "2rem repeat(6, minmax(0, 1fr))",
                      width: "100%",
                      borderBottom: "1px dotted black",
                      fontSize: 14
                    }}
                    key={index}>
                      <td style={{ padding: 0.4 }}>{index + 1}</td>
                      <td
                      style={{
                        paddingRight : 0.1,
                        paddingLeft:0.1,
                        gridColumn: "2 / 5",
                      }}
                    >
                      {productValue?.label.slice(0,productValue?.label.indexOf("-"))}
                    </td>
                    <td
                      style={{
                        paddingRight : 0.2,
                        justifySelf: "left",
                      }}
                    >
                      {Math.abs(elm.Qty)}/{elm.UnitType}
                    </td>
                    <td
                      style={{
                        paddingRight : 0.4,
                        justifySelf: "right",
                      }}
                    >
                      {elm.UnitPrice.toFixed(0)}
                    </td>
                    <td
                      style={{
                        paddingLeft : 0.4,
                        justifySelf: "end",
                      }}
                    >
                       {Math.abs(elm.TotalAmount).toFixed(0)}
                    </td>                      
                </tr>
                </>
              );
            })}
<div       style={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
      rowGap: "1rem"
    }}>
{grandDetails.totalAmount === 0 ? (
            ""
          ) : (
           
            <tr style={{
              marginTop: "1px",
              color: "#000",
              textAlign: "right",
              display: "grid",
              gridTemplateColumns: "2rem repeat(6, minmax(0, 1fr))",
              width: "100%", fontSize: 14
            }}>
              <td style={{ textAlign: "right"}}>
                GrossTotal:
              </td>
              <td style={{ textAlign: "right", padding: "0px 280px"}}>{getFormatedNumber(grandDetails.totalAmount)}</td>
            </tr>
          )} 
              {grandDetails.totalDiscount === 0 ? (
            ""
          ) : (
            <tr style={{
              marginTop: "1px",
              color: "#000",
              textAlign: "right",
              display: "grid",
              gridTemplateColumns: "2rem repeat(6, minmax(0, 1fr))",
              width: "100%", fontSize: 14
            }}>
              <td
                style={{
                  textAlign: "right",
                }}
              >
                Discount:
              </td>
              <td style={{ textAlign: "right", padding: "0px 280px" }}>{getFormatedNumber(grandDetails.totalDiscount)}</td>
            </tr>
          )}
          {grandDetails.totalExerciseDuty === 0 ? (
            ""
          ) : (
            <tr style={{
              marginTop: "1px",
              color: "#000",
              textAlign: "right",
              display: "grid",
              gridTemplateColumns: "2rem repeat(6, minmax(0, 1fr))",
              width: "100%", fontSize: 14
            }}>
              <td
                style={{
                  textAlign: "right",
                }}
              >
                ExerciseDuty:
              </td>
              <td style={{ textAlign: "right", padding: "0px 280px" }}>{getFormatedNumber(grandDetails.totalExerciseDuty)}</td>
            </tr>
          )}            
                {grandDetails.totalTaxable === 0 ? (
            ""
          ) : (
            <tr style={{
              marginTop: "1px",
              color: "#000",
              textAlign: "right",
              display: "grid",
              gridTemplateColumns: "2rem repeat(6, minmax(0, 1fr))",
              width: "100%", fontSize: 14
            }}>
              <td
                style={{
                  textAlign: "right",
                }}
              >
                Taxable:
              </td>
              <td style={{ textAlign: "right", padding: "0px 280px" }}>{getFormatedNumber(grandDetails.totalTaxable)}</td>
            </tr>
          )}                  
                {grandDetails.totlaNonTaxable === 0 ? (
            ""
          ) : (
            <tr style={{
              marginTop: "1px",
              color: "#000",
              textAlign: "right",
              display: "grid",
              gridTemplateColumns: "2rem repeat(6, minmax(0, 1fr))",
              width: "100%", fontSize: 14
            }}>
              <td
                style={{
                  textAlign: "right",
                }}
              >
                NonTaxable:
              </td>
              <td style={{ textAlign: "right", padding: "0px 280px" }}>{getFormatedNumber(grandDetails.totlaNonTaxable)}</td>
            </tr>
          )}
          {grandDetails.totalTax === 0 ? (
            ""
          ) : (
            <tr style={{
              marginTop: "1px",
              color: "#000",
              textAlign: "right",
              display: "grid",
              gridTemplateColumns: "2rem repeat(6, minmax(0, 1fr))",
              width: "100%", fontSize: 14
            }}>
              <td
                style={{
                  textAlign: "right",
                }}
              >
                VAT@13%:
              </td>
              <td style={{textAlign: "right",
                  padding: "0px 280px"}}>
                {getFormatedNumber(grandDetails.totalTax)}</td>
            </tr>
          )}
          <tr style={{
              marginTop: "1px",
              color: "#000",
              textAlign: "start",
              display: "grid",
              gridTemplateColumns: "2rem repeat(6, minmax(0, 1fr))",
              width: "100%",
              borderBottom: "1px dotted black", fontSize: 14                
            }}>
              <td
                style={{
                  textAlign: "right",
                }}
              >
                NetTotal:
              </td>                
            <td style={{textAlign: "right",
                  padding: "0px 280px"}}>
               {getFormatedNumber(grandDetails.grandTotal)}
            </td>
          </tr>
</div>              
  </div>
    ) : (
      <Box sx={{ mt: 0, width: "100%", mx: 'auto', height: "100%"}}>
        <div>
          <ViewHeader name="Sales Return" />
          <Grid container >
            <Grid item xs={6}>
              <Box>
                <Typography sx={{ fontWeight: "500", fontSize: 10 }}>
                  Account holder :
                  <Typography
                    display="inline"
                    sx={{ fontWeight: 500, marginLeft: 1, fontSize: 10 }}
                  >
                    {getAccountName(allData.SourceAccountTypeId)}
                  </Typography>
                </Typography>
                <Typography sx={{ fontWeight: "500", mt: 1, fontSize: 10 }}>
                  Credit Note No. :
                  <Typography
                    display="inline"
                    sx={{ fontWeight: "500", marginLeft: 1, fontSize: 10 }}
                  >
                    {getBillNo(allData?.Name ? allData?.Name : "")}
                  </Typography>
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sx={{ display: "flex", justifyContent: "end" }}>
              <Box>
                <Typography sx={{ fontWeight: "500", fontSize: 10 }}>
                  Date:
                  <Typography
                    display="inline"
                    sx={{
                      marginLeft: 1,
                      fontSize: "14px",
                    }}
                  >
                    {allData.Date && allData.AccountTransactionValues[0].NVDate.substring(0, 10)}
                  </Typography>
                </Typography>
                <Typography sx={{ fontWeight: "500", mt: 1, fontSize: 10 }}>
                  Ref. No. :
                  <Typography
                    display="inline"
                    sx={{ fontWeight: "500", marginLeft: 1, fontSize: 10 }}
                  >{allData?.ref_invoice_number}
                  </Typography>
                </Typography>                
              </Box>
            </Grid>
          </Grid>
        </div>
        <TableContainer component={Paper}>
          <Table sx={{height: '100%', border:"1px solid black"}}>
            <TableHead>
              <TableRow>
                <TableCell align="left">S.N</TableCell>
                <TableCell colSpan={3} align="center">
                  Product/Service
                </TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="right">Unit Price(Rs.)</TableCell>
                <TableCell align="right">Amount (Rs.)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allData?.SalesOrderDetails?.map((elm: any, i: number) => {
                const productValue = products?.find(
                  (obj) => obj.value === elm.ItemId
                );
                return (
                  <>
                    <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }} key={i}>
                      <TableCell align="left" sx={{ padding: "0px 16px" }}>{i + 1}</TableCell>
                      <TableCell colSpan={3} align="left" sx={{ padding: "0px 16px" }}>
                        {productValue?.label}
                      </TableCell>
                      <TableCell align="center" sx={{ padding: "0px 16px" }}>{Math.abs(elm.Qty)} {(elm.UnitType)}</TableCell>
                      <TableCell align="right" sx={{ padding: "0px 16px" }}>
                        {elm.UnitPrice.toFixed(2)}
                      </TableCell>
                      <TableCell align="right" sx={{ padding: "0px 16px" }}>
                        {Math.abs(elm.TotalAmount.toFixed(2))}
                      </TableCell>
                    </TableRow>
                  </>
                );
              })}
                <>
                  {grandDetails.totalTaxable === 0 ? (
                    ""
                  ) : (
                    <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                      <TableCell sx={{ fontWeight: "500", textAlign: "right", padding: "0px 16px" }} colSpan={6}>Taxable:</TableCell>
                      <TableCell sx={{ fontWeight: 500, textAlign: "right", padding: "0px 16px" }}>
                        {grandDetails.totalTaxable.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  )}
                  {grandDetails.totlaNonTaxable === 0 ? (
                    ""
                  ) : (
                    <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                      <TableCell sx={{ fontWeight: "500", textAlign: "right", padding: "0px 16px" }} colSpan={6}>Non Taxable:</TableCell>
                      <TableCell sx={{ fontWeight: 500, textAlign: "right", padding: "0px 16px" }}>
                        {grandDetails.totlaNonTaxable.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  )}
                  {grandDetails.totalDiscount === 0 ? (
                    ""
                  ) : (
                    <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                      <TableCell sx={{ fontWeight: "500", textAlign: "right", padding: "0px 16px" }} colSpan={6}>Discount:</TableCell>
                      <TableCell sx={{ fontWeight: "500", textAlign: "right", padding: "0px 16px" }}>
                        {grandDetails.totalDiscount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  )}
                  {grandDetails.totalExerciseDuty === 0 ? (
                    ""
                  ) : (
                    <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                      <TableCell sx={{ fontWeight: "500", textAlign: "right", padding: "0px 16px" }} colSpan={6}>Exercise Duty:</TableCell>
                      <TableCell sx={{ fontWeight: "500", textAlign: "right", padding: "0px 16px" }}>
                        {grandDetails.totalExerciseDuty.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  )}
                  {grandDetails.totalTax === 0 ? (
                    ""
                  ) : (
                    <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                      <TableCell sx={{ fontWeight: "500", textAlign: "right", padding: "0px 16px" }} colSpan={6}>Vat:</TableCell>
                      <TableCell sx={{ fontWeight: "500", textAlign: "right", padding: "0px 16px" }}>
                        {grandDetails.totalTax.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                    <TableCell sx={{ fontWeight: "500", textAlign: "right", padding: "0px 16px" }} colSpan={6}>Grand Total:</TableCell>
                    <TableCell sx={{ fontWeight: "500", textAlign: "right", padding: "0px 16px" }}>
                      {grandDetails.grandTotal.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </>
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            // height: '10%'
          }}
        >
          <Box sx={{
            height: '100%',
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            flexDirection: "column"
          }}>
            <Typography variant="body2" sx={{ display: "block", fontWeight: "bold", fontSize: 10 }}>
              Description :
              <Typography variant="body2" display="inline" sx={{ marginLeft: 1 }}>
                {allData?.Description}
              </Typography>
            </Typography>
            
          </Box>
        </Box>
      </Box>
    )}
    </>
  );
};

export default PrintSalesReturn;
