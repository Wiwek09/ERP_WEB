import {
  Container,
  TableContainer,
  Table,
  TableHead,
  Paper,
  TableBody,
  LinearProgress,
  TableFooter,
  Grid,
  Typography,
  TableRow,
  TableCell,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { IProduct, ISales } from "../../../../interfaces/invoice";
import { IParams } from "../../../../interfaces/params";
import {
  getAllCustomers,
  getAllLedgerForCalculation,
  getAllProducts,
  getSalesData,
} from "../../../../services/invoice";
import { getDecimalInWord } from "../../../../services/decimalToWordApi";
import { errorMessage } from "../../../../utils/messageBox/Messages";
import { ILedger, ILedgerCalculation } from "../interfaces";
import ViewHeaderInvoice from "./ViewHeaderInvoice";
import { useAppSelector } from "../../../../app/hooks";
import { selectCompany } from "../../../../features/companySlice";
import { getCompanyApi } from "../../../../services/companyApi";
import { ICompany } from "../../../../interfaces/company";
import { Widgets } from "@mui/icons-material";

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
interface Iprops {
  salesData: ISales[];
}
const getSaleType = (bill: string | any): string => {
  let SaleType = "";
  if (bill) {
    let endPosition = bill.search("#");
    for (let index = 0; index < endPosition - 1; index++) {
      SaleType += bill[index];
    }
  }
  return SaleType;
};
const getInvoiceNo = (bill: string | any): string => {
  let billNo = "";
  if (bill) {
    let startPosition = bill.search("#");
    let endPosition = bill.search("]");

    for (let index = startPosition + 1; index < endPosition; index++) {
      billNo += bill[index];
    }
    return billNo;
  }
  return "";
};
const getFormatedNumber = (num: any): string => {
  let formatedNum = parseFloat(num).toFixed(2);
  return formatedNum;
};

const PrintPdfInvoice = () => {
  const history = useHistory();
  const { id }: IParams = useParams();
  const [salesDetails, setSalesDetails] = useState<ISales>();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [ledgers, setLedgers] = useState<ILedger[]>([]);
  const [decimalInWords, setDecimalInWords] = useState<string | any>("");
  const company = useAppSelector(selectCompany);
  const [keys, setKeys] = useState<IGrandDetailsKey>({
    exerciseDuty: 0,
    tax: 0,
    taxable: 0,
    nonTaxable: 0,
    discount: 0,
    sales: 0,
  });

  const [grandDetails, setGrandDetails] =
    useState<IGrandDetails>(initialGrandDetails);

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
      (data) => data.Name === "Excise Duty"
    );

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

  const setData = async () => {
    try {
      const ledgersData = await getAllCustomers();
      setLedgers(ledgersData);
      const response = await getSalesData(id);
      setSalesDetails(response);
      const productsData: IProduct[] = await getAllProducts();
      setProducts(productsData);
    } catch {
      errorMessage("Invalid invoice id.");
      history.push("/invoice");
    }
  };

  useEffect(() => {
    setAllKeys();
    setData();
  }, [id]);

  const getGrandDetails = () => {
    const data = salesDetails;
    let amount = 0;
    let taxable = 0;
    let taxableDiscount = 0;
    let nonTaxable = 0;
    let nonTaxableDiscount = 0;
    let exerciseDuty = 0;
    let tax = 0;
    let discount = 0;
    let grand = 0;

    try {
      if (data) {
        const nonTaxableData = data.AccountTransactionValues.find(
          (data) => data.AccountId === keys.nonTaxable
        );
        const taxableData = data.AccountTransactionValues.find(
          (data) => data.AccountId === keys.taxable
        );
        const exerciseDutyData = data.AccountTransactionValues.find(
          (data) => data.AccountId === keys.exerciseDuty
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

        salesDetails.SalesOrderDetails.map((data, index) => {
          if (data.TaxRate === 0) {
            nonTaxableDiscount += data.Discount;
          } else {
            taxableDiscount += data.Discount;
          }
        });

        nonTaxable = nonTaxableData ? nonTaxableData.Credit : 0;
        taxable = taxableData ? taxableData.Credit + taxableData.Debit : 0;
        discount = discountData ? discountData.Debit + discountData.Credit : 0;
        amount = taxable + nonTaxable + discount;
        exerciseDuty = exerciseDutyData
          ? exerciseDutyData.Credit + exerciseDutyData.Debit
          : 0;
        tax = taxData ? taxData.Credit + taxData.Debit : 0;
        grand = taxable + nonTaxable + tax + exerciseDuty;

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
      history.push("/invoice");
    }
  };

  useEffect(() => {
    getGrandDetails();
  }, [salesDetails, products, keys, ledgers]);

  const decimalToWord = async (grand: number) => {
    //Conversion of decimal value to word is accomplished here
    const grandInWord = await getDecimalInWord(grand);
    setDecimalInWords(grandInWord);
  };

  useEffect(() => {
    decimalToWord(grandDetails.grandTotal);
  }, [decimalInWords, grandDetails.grandTotal]);

  const getProductName = (id: number | any) => {
    if (id === null) {
      return "";
    }
    const productData = products.find((data) => data.Id === id);
    return productData ? productData.Name : "";
  };
  const CurrentRow = (iRow: number) => {
    return iRow + 1;
  };
  const getCustomerName = (id: number | any) => {
    if (id === null) {
      return "";
    }
    const customerData: any = ledgers.find((data) => data.Id === id);
    return customerData ? customerData.Name : "";
  };
  const getCustomerPhone = (id: number | any) => {
    if (id === null) {
      return "";
    }
    const customerData: any = ledgers.find((data) => data.Id === id);
    return customerData ? customerData.Telephone : "";
  };
  const getCustomerAddress = (id: number | any) => {
    if (id === null) {
      return "";
    }
    const customerData: any = ledgers.find((data) => data.Id === id);
    return customerData ? customerData.Address : "";
  };

  const getCustomerPan = (id: number | any): string[] => {
    if (id === null) {
      return [];
    }
    const customerData: any = ledgers.find((data) => data.Id === id);
    if (customerData) {
      if (customerData.PanNo === null) {
        return [];
      }
      let pan: string[] = [];
      for (let index = 0; index < customerData.PanNo.length; index++) {
        const element = customerData.PanNo[index];
        pan.push(element);
      }
      return pan;
    }
    return [];
  };

  if (salesDetails === null || products.length === 0 || ledgers.length === 0) {
    return <LinearProgress sx={{ mt: 3 }} />;
  }
  let noOfPages: number;
  if (salesDetails && +company.FirstPageRow !== 0) {
    noOfPages = Math.round(
      salesDetails.SalesOrderDetails.length / +company.FirstPageRow+1
    );
  }
  let noofRow : number;
  noofRow = 1;
  if (salesDetails && +company.FirstPageRow !== 0) {
    noofRow = Math.round(company.FirstPageRow - salesDetails.SalesOrderDetails.length);
    noofRow = noofRow-3; 
  }  

  return (
    <>
    {company && company.PrinterType === "POS" ? (
    <div
    style={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
      rowGap: "1rem",
      marginLeft:"-10px",
      marginRight:".10px",
      fontFamily: company?.BillHeaderFront || "monospace",
      fontSize: +company?.BillFrontSizeItem || 14,
      fontWeight: +company?.BillFrontWeight || 500,
    }}
  >
    <div>
      <ViewHeaderInvoice
        name="Invoice"
        copy={salesDetails && salesDetails.Print_Copy}
      />
      <div
        style={{
          color: "#000",
          letterSpacing: -1,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div>
            <p>
              Name:{" "}
              {getCustomerName(
                salesDetails && salesDetails.SourceAccountTypeId
              )}
            </p>
            <p>
              Address:{" "}
              {getCustomerAddress(
                salesDetails && salesDetails.SourceAccountTypeId
              )}
            </p>
            <p>
              Phone:{" "}
              {getCustomerPhone(
                salesDetails && salesDetails.SourceAccountTypeId
              )}
            </p>
            <div style={{ display: "flex" }}>
              VAT/PAN:{" "}
              {getCustomerPan(
                salesDetails && salesDetails.SourceAccountTypeId
              ).map((data, index) => {
                return <p key={index}>{data}</p>;
              })}
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <p style={{ textAlign: "center", marginBottom: "0.5rem" }}>
              Date: {salesDetails && salesDetails.Date}
            </p>
            <p>
              Miti:{" "}
              {salesDetails &&
                salesDetails.AccountTransactionValues[0].NVDate}
            </p>
            <p>
              Bill No:{" "}
              {getInvoiceNo(
                salesDetails && salesDetails.AccountTransactionValues[0].Name
              )}
            </p>
            <p>
              Sales Type:{" "}
              {getSaleType(
                salesDetails && salesDetails.AccountTransactionValues[0].Name
              )}
            </p>
            {salesDetails && salesDetails.Print_Copy > 1 ? (
              <p>Copy of Orginal : {salesDetails.Print_Copy - 1}</p>
            ) : (
              " "
            )}
          </div>
        </div>
      </div>
    </div>

    {salesDetails && salesDetails.SalesOrderDetails.length ? (
      <div
        style={{
          borderTop: "1px dotted black",
          color: "#000",
          textAlign: "left",
          width: "100%",
        }}
      >
        <div>
          <tr
            style={{
              textAlign: "left",
              display: "grid",
              gridTemplateColumns: "1rem repeat(5, minmax(0, .5fr))",
              width: "100%",
              borderBottom: "1px dotted black",
            }}
          >
            <td style={{ padding: 0.1 }}>SN</td>
            <td
              style={{
                padding: 0.1,
                gridColumn: "2 / 4",
              }}
            >
              Name
            </td>
            <td
              style={{
                padding: 0.1,
                justifySelf: "center",
              }}
            >
              Qty
            </td>
            <td
              style={{
                padding: 0.1,
                justifySelf: "center",
              }}
            >
              Rate
            </td>
            <td
              style={{
                padding: 0.1,
                justifySelf: "end",
              }}
            >
              Amount
            </td>
          </tr>
        </div>

        <div>
          {salesDetails &&
            salesDetails.SalesOrderDetails.map((data: any, index: number) => {
              return (
                <>
                  <tr
                    style={{
                      marginTop: "4px",
                      color: "#000",
                      textAlign: "start",
                      display: "grid",
                      gridTemplateColumns: "1rem repeat(5, minmax(0, .5fr))",
                      width: "100%",
                      borderBottom: "1px dotted black",
                    }}
                    key={index}
                  >
                    <td style={{ padding: 0.4 }}>{index + 1}</td>
                    <td
                      style={{
                        padding: 0.1,
                        gridColumn: "2 / 4",
                      }}
                    >
                      {getProductName(data.ItemId).slice(
                        0,
                        getProductName(data.ItemId).indexOf("-")
                      )}
                    </td>
                    <td
                      style={{
                        padding: 0.1,
                        justifySelf: "center",
                      }}
                    >
                      {data.Qty} {data.UnitType}
                    </td>
                    <td
                      style={{
                        padding: 0.1,
                        justifySelf: "center",
                      }}
                    >
                      {data.UnitPrice.toFixed(2)}
                    </td>
                    <td
                      style={{
                        padding: 0.1,
                        justifySelf: "end",
                      }}
                    >
                      {getFormatedNumber(data.UnitPrice * data.Qty)}
                    </td>
                  </tr>
                  {(index + 1) % company.FirstPageRow === 0 ? (
                    <>
                      <div style={{ textAlign: "center", marginTop: "1rem" }}>
                        ---Continue Next Page---
                      </div>
                      <div className="pagebreak"></div>
                      <div
                        style={{ textAlign: "center", marginBottom: "1rem" }}
                      >
                        ----Page {(index + 1) / company.FirstPageRow + 1} of{" "}
                        {noOfPages}----
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </>
              );
            })}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          {grandDetails.totalAmount === 0 ? (
            ""
          ) : (
            <tr>
              <td style={{ textAlign: "right", padding: "0px 16px" }}>
                Gross Total:
              </td>
              <td>{getFormatedNumber(grandDetails.totalAmount)}</td>
            </tr>
          )}
          {grandDetails.totalDiscount === 0 ? (
            ""
          ) : (
            <tr>
              <td
                style={{
                  textAlign: "right",
                  padding: "0px 16px",
                }}
              >
                Discount:
              </td>
              <td>{getFormatedNumber(grandDetails.totalDiscount)}</td>
            </tr>
          )}
          {grandDetails.totalTaxable === 0 ? (
            ""
          ) : (
            <tr>
              <td
                style={{
                  textAlign: "right",
                  padding: "0px 16px",
                }}
              >
                Taxable:
              </td>
              <td>{getFormatedNumber(grandDetails.totalTaxable)}</td>
            </tr>
          )}

          {grandDetails.totlaNonTaxable === 0 ? (
            ""
          ) : (
            <tr>
              <td
                style={{
                  textAlign: "right",
                  padding: "0px 16px",
                }}
              >
                Non-taxable:
              </td>
              <td>{getFormatedNumber(grandDetails.totlaNonTaxable)}</td>
            </tr>
          )}
          {grandDetails.totalExerciseDuty === 0 ? (
            ""
          ) : (
            <tr>
              <td
                style={{
                  textAlign: "right",
                  padding: "0px 16px",
                }}
              >
                Exercise Duty:
              </td>
              <td>{getFormatedNumber(grandDetails.totalExerciseDuty)}</td>
            </tr>
          )}
          {grandDetails.totalTax === 0 ? (
            ""
          ) : (
            <tr>
              <td
                style={{
                  textAlign: "right",
                  padding: "0px 16px",
                }}
              >
                VAT @ 13%:
              </td>
              <td>{getFormatedNumber(grandDetails.totalTax)}</td>
            </tr>
          )}
          <tr>
            <td
              style={{
                textAlign: "right",
                padding: "0px 16px",
              }}
            >
              <p>Net Total:</p>
            </td>
            <td style={{}}>
              <p>{getFormatedNumber(grandDetails.grandTotal)}</p>
            </td>
          </tr>
          <div
            style={{
              alignSelf: "flex-start",
              borderTop: "1px dashed black",
              width: "100%",
            }}
          >
            <div>
              <td
                style={{
                  textAlign: "left",
                  wordBreak: "break-all",
                }}
              >
                <strong> In Words: </strong>
                <span>{decimalInWords}</span>
              </td>
            </div>
            {salesDetails?.Description ? (
              <tr>
                <td
                  style={{
                    textAlign: "left",
                  }}
                >
                  <strong> Remarks: </strong> {salesDetails?.Description}{" "}
                </td>
              </tr>
            ) : null}
            <tr>
              <td
                style={{
                  textAlign: "left",
                  padding: "0px 16px",
                }}
              >
                Challan No: {salesDetails?.ChallanNo}
              </td>
              <td
                style={{
                  textAlign: "left",
                  padding: "0px 16px",
                }}
              >
                Vehicle No: {salesDetails?.VehicleNo}
              </td>
            </tr>
          </div>
        </div>
      </div>
    ) : null}

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        height: "20%",
        color: "#000",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            flexDirection: "column",
          }}
        >
          <p
            style={{
              textAlign: "center",
              visibility: "hidden",
            }}
          >
            {salesDetails?.UserName ? salesDetails?.UserName : "-------"}
          </p>
          <p style={{ display: "block", fontStyle: "Bold" }}>Received By</p>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            flexDirection: "column",
          }}
        >
          <p
            style={{
              fontStyle: "Bold",
            }}
          >
            {salesDetails?.UserName ? salesDetails?.UserName : "-------"}
          </p>
          <p style={{ display: "block", fontStyle: "Bold" }}>Prepared By</p>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            flexDirection: "column",
          }}
        >
          <p style={{ visibility: "hidden" }}>{salesDetails?.UserName}</p>
          <p style={{ display: "block", fontStyle: "Bold" }}>
            Authorized By
            <p style={{ marginLeft: 1 }}></p>
          </p>
        </div>
      </div>
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        color: "#000",
      }}
    >
      <p style={{ fontWeight: "bold" }}>{company.Description}</p>
    </div>
  </div>
) : (
<div>
<Box sx={{ mt: 0, width: "100%", mx: 'auto', height: "100%"}}>
      <div style={{height: '430px'}}>
        <ViewHeaderInvoice
          name="Invoice"
          copy={salesDetails && salesDetails.Print_Copy}
        />
        <Grid container >
          <Grid item xs={6}>
            <Box>
              <Typography sx={{ fontWeight: "800", fontSize: 20 }}>
                Name:
                <Typography
                  display="inline"
                  sx={{ fontWeight: 800, marginLeft: 1, fontSize: 20 }}
                >
                  {getCustomerName(
                    salesDetails && salesDetails.SourceAccountTypeId
                  )}
                </Typography>
              </Typography>
              <Typography sx={{ fontWeight: "800", mt: 1, fontSize: 20 }}>
                Address:
                <Typography
                  display="inline"
                  sx={{ fontWeight: "800", marginLeft: 1, fontSize: 20 }}
                >
                  {getCustomerAddress(
                    salesDetails && salesDetails.SourceAccountTypeId
                  )}
                </Typography>
              </Typography>
              <Typography sx={{ fontWeight: "800", mt: 1, fontSize: 20 }}>
                Phone:
                <Typography
                  display="inline"
                  sx={{ fontWeight: "800", marginLeft: 1, fontSize: 20 }}
                >
                  {getCustomerPhone(
                    salesDetails && salesDetails.SourceAccountTypeId
                  )}
                </Typography>
              </Typography>              
              <Typography sx={{ fontWeight: "800", fontSize: 20, mt: 1 }}>
                VAT/PAN:
                {getCustomerPan(
                  salesDetails && salesDetails.SourceAccountTypeId
                ).map((data, index) => {
                  return (
                    <Typography
                      key={index}
                      display="inline"
                      sx={{
                        border: 1,
                        fontWeight: 800,
                        marginLeft: "3px",
                        fontSize: 20,
                        px: 1,
                      }}
                    >
                      {data}
                    </Typography>
                  );
                })}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sx={{ display: "flex", justifyContent: "end" }}>
            <Box>
              <Typography sx={{ fontWeight: "800", fontSize: 20 }}>
                Miti:
                <Typography
                  display="inline"
                  sx={{
                    fontWeight: "800",
                    marginLeft: 1,
                    fontSize: "20px",
                  }}
                >
                  {salesDetails &&
                    salesDetails.AccountTransactionValues[0].NVDate}
                </Typography>
              </Typography>
              <Typography sx={{ fontWeight: "800", fontSize: 20 }}>
                Date:
                <Typography
                  display="inline"
                  sx={{
                    fontWeight: "800",
                    marginLeft: 1,
                    fontSize: "20px",
                  }}
                >
                  {salesDetails &&
                    salesDetails.Date}
                </Typography>
              </Typography>              
              <Typography sx={{ fontWeight: "800", fontStyle:'Bold', fontSize: 20, mt: 1 }}>
                Invoice No:
                <Typography
                  display="inline"
                  sx={{ fontWeight: "800", marginLeft: 1, fontSize: 20 }}
                >
                  {getInvoiceNo(
                    salesDetails && salesDetails.AccountTransactionValues[0].Name
                  )}
                </Typography>
              </Typography>
              <Typography sx={{ fontWeight: "800", fontSize: 20, mt: 1 }}>
                Sales Type :
                  {getSaleType(
                    salesDetails && salesDetails.AccountTransactionValues[0].Name
                  )}
              </Typography>
              {salesDetails && salesDetails.Print_Copy > 1 ?
                (<Typography
                  textAlign="center"
                  sx={{ fontWeight: "800", fontStyle:'Bold', fontSize: 20, mt: 1 }}
                >
                  Copy of Orginal :  {salesDetails.Print_Copy - 1}
                </Typography>
                ) : (
                  " "
                )
              }
            </Box>
          </Grid>
        </Grid>
      </div>
      {/* <Grid item xs={12}>
      <TableContainer component={Paper} sx={{height: 'calc(100% - 20%)'}}>
        <Table sx={{width: '100%', height: '100%', border:"2px solid black"}}>
          <TableBody>
          <TableRow sx={{height: 20, backgroundColor: '#FFFFFF'}}>
            <TableCell sx={{border:"1px solid black", padding: "0px 5px",  fontWeight: "bold", width: '5%', fontSize: 20}}>SN.</TableCell>
            <TableCell sx={{border:"1px solid black", padding: "0px 5px", fontWeight: "bold", width: '42%', fontSize: 20}}>Item name</TableCell>
            <TableCell sx={{border:"1px solid black", padding: "0px 5px", fontWeight: "bold", width: '10%', fontSize: 20}}>Qty</TableCell>
            <TableCell sx={{border:"1px solid black", padding: "0px 5px", fontWeight: "bold", width: '8%', fontSize: 20}}>Unit</TableCell>
            <TableCell sx={{border:"1px solid black", padding: "0px 5px", fontWeight: "bold", textAlign: "right", width: '15%', fontSize: 20}}>Rate (Rs)</TableCell>
            <TableCell sx={{border:"1px solid black", padding: "0px 5px", fontWeight: "bold", textAlign: "right",  width: '20%', fontSize: 20}}>
              Amount (Rs.)
            </TableCell>
          </TableRow>

            {salesDetails &&
              salesDetails.SalesOrderDetails.map((data, index) => {
                return (
                  <><TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }} key={index}>
                    <TableCell sx={{ border: "1px solid black", padding: "0px 15px", fontWeight: "900", textAlign: "left", fontSize: '16px' }}>{index + 1}</TableCell>
                    <TableCell sx={{ border: "1px solid black", padding: "0px 15px", fontWeight: "900", textAlign: "left", fontSize: '16px' }}>{getProductName(data.ItemId)}</TableCell>
                    <TableCell sx={{ border: "1px solid black", padding: "0px 15px", fontWeight: "900", textAlign: "right", fontSize: '16px' }}>{data.Qty}</TableCell>
                    <TableCell sx={{ border: "1px solid black", padding: "0px 15px", fontWeight: "900", textAlign: "right", fontSize: '16px' }}>{data.UnitType}</TableCell>
                    <TableCell sx={{ border: "1px solid black", padding: "0px 15px", fontWeight: "900", textAlign: "right", fontSize: '16px' }}>{data.UnitPrice.toFixed(2)}</TableCell>
                    <TableCell sx={{ border: "1px solid black", padding: "0px 15px", fontWeight: "900", textAlign: "right", fontSize: '16px' }}>{(data.UnitPrice * data.Qty).toFixed(2)}</TableCell>
                  </TableRow>
                  <div style={{ width: "10px", textAlign:"right" }}>
                      {(index + 1) % company.FirstPageRow === 0 ? (
                        <>
                        <TableRow>
                          <TableCell colSpan={6} width={"100%"}>
                            NextPage
                          </TableCell>
                        </TableRow>
                        <TableRow className="pagebreak">
                          <TableCell colSpan={6}>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={6} width={"100%"}>
                            Page{(index + 1)/ company.FirstPageRow + 1}of{""}{noOfPages}
                          </TableCell>
                        </TableRow>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                    </>
                );
              })
            }
              {grandDetails.totalAmount === 0 ? (
                ""
              ) : (
                <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                  <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 20, textAlign: "right", padding: "0px 16px" }} colSpan={5}>Gross Total:</TableCell>
                  <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 20, textAlign: "right", padding: "0px 16px" }}>
                    {grandDetails.totalAmount.toFixed(2)}
                  </TableCell>
                </TableRow>
              )}
                {grandDetails.totalDiscount === 0 ? (
                  <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                    <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 20, textAlign: "right", padding: "0px 16px" }} colSpan={5}>Discount:</TableCell>
                    <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 20, textAlign: "right", padding: "0px 16px" }}>
                      0.00
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                    <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 20, textAlign: "right", padding: "0px 16px" }} colSpan={5}>Discount:</TableCell>
                    <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 20, textAlign: "right", padding: "0px 16px" }}>
                      {grandDetails.totalDiscount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}
                {grandDetails.totalTaxable === 0 ? (
                  ""
                ) : (
                  <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                    <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 20, textAlign: "right", padding: "0px 16px" }} colSpan={5}>Taxable:</TableCell>
                    <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 20, textAlign: "right", padding: "0px 16px" }}>
                      {grandDetails.totalTaxable.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}
                {grandDetails.totalExerciseDuty === 0 ? (
                  <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                    <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 20, textAlign: "right", padding: "0px 16px" }} colSpan={5}>Non-Taxable:</TableCell>
                    <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 20, textAlign: "right", padding: "0px 16px" }}>
                      {grandDetails.totlaNonTaxable.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                    <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 20, textAlign: "right", padding: "0px 16px" }} colSpan={5}>Non-taxable:</TableCell>
                    <TableCell sx={{ border:"1px solid black", fontWeight: 900, fontSize: 20, textAlign: "right", padding: "0px 16px" }}>
                      {grandDetails.totlaNonTaxable.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}
                {grandDetails.totalExerciseDuty === 0 ? (
                  ""
                ) : (
                  <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                    <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 20, textAlign: "right", padding: "0px 16px" }} colSpan={5}>Exercise Duty:</TableCell>
                    <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 20, textAlign: "right", padding: "0px 16px" }}>
                      {grandDetails.totalExerciseDuty.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}
                {grandDetails.totalTax === 0 ? (
                  ""
                ) : (
                  <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                    <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 20, textAlign: "right", padding: "0px 16px" }} colSpan={5}>Vat @ 13%:</TableCell>
                    <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 20, textAlign: "right", padding: "0px 16px" }}>
                      {grandDetails.totalTax.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}
                <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                  <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 20, textAlign: "right", padding: "0px 16px" }} colSpan={5}><h3>Net Total:</h3></TableCell>
                  <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 20, textAlign: "right", padding: "0px 16px" }}>
                    <h3>{grandDetails.grandTotal.toFixed(2)}</h3>
                  </TableCell>
                </TableRow>
                <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                  <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 20, textAlign: "left", padding: "0px 16px" }} colSpan={6}><strong>In Words:</strong> {decimalInWords}</TableCell>
                </TableRow>
                { salesDetails &&
              salesDetails.SalesOrderDetails ?
              <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
              <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 20, textAlign: "left", padding: "0px 16px" }} colSpan={6}><strong>Remarks:</strong> {salesDetails.Description}</TableCell>
            </TableRow> 
          :
          ""
              }                
                { salesDetails &&
              salesDetails.SalesOrderDetails ?
              <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 20, textAlign: "left", padding: "0px 16px" }} colSpan={3}>Challan No: {salesDetails.ChallanNo}</TableCell>
              <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 20, textAlign: "left", padding: "0px 16px" }} colSpan={3}>Vehicle No: {salesDetails.VehicleNo}</TableCell>
            </TableRow>
          :
          ""
              }
          </TableBody>
        </Table>
      </TableContainer>

      </Grid> */}

      {salesDetails && salesDetails.SalesOrderDetails.length < company.FirstPageRow ? (
      <><div style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "1rem",
                  marginLeft: "-10px",
                  marginRight: ".10px",
                }}>
                <TableContainer component={Paper} sx={{ height: 'calc(100% - 400px - 20%)' }}>
                    <Table sx={{ height: '100%', border: "2px solid black" }}>
                      <TableHead sx={{ border: "1px solid black" }}>
                        <TableRow sx={{ height: 20, backgroundColor: '#FFFFFF' }}>
                          <TableCell sx={{ border: "1px solid black", padding: "0px 5px", fontWeight: "bold", width: '5%', fontSize: 22 }}>SN.</TableCell>
                          <TableCell sx={{ border: "1px solid black", padding: "0px 5px", fontWeight: "bold", width: '42%', fontSize: 22 }}>Item name</TableCell>
                          <TableCell sx={{ border: "1px solid black", padding: "0px 5px", fontWeight: "bold", width: '10%', fontSize: 22 }}>Qty</TableCell>
                          <TableCell sx={{ border: "1px solid black", padding: "0px 5px", fontWeight: "bold", width: '8%', fontSize: 22 }}>Unit</TableCell>
                          <TableCell sx={{ border: "1px solid black", padding: "0px 5px", fontWeight: "bold", textAlign: "right", width: '15%', fontSize: 22 }}>Rate (Rs)</TableCell>
                          <TableCell sx={{ border: "1px solid black", padding: "0px 5px", fontWeight: "bold", textAlign: "right", width: '20%', fontSize: 22 }}>
                            Amount (Rs.)
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {salesDetails &&
                          salesDetails.SalesOrderDetails.map((data: any, index: number) => {
                            return (
                              <>
                                <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }} key={index}>
                                  <TableCell sx={{ border: "1px solid black", padding: "0px 15px",  textAlign: "left", fontWeight: "bold", fontSize: 22 }}>{index + 1}</TableCell>
                                  <TableCell sx={{ border: "1px solid black", padding: "0px 15px",  textAlign: "left", fontWeight: "bold", fontSize: 22 }}>{getProductName(data.ItemId)}</TableCell>
                                  <TableCell sx={{ border: "1px solid black", padding: "0px 15px",  textAlign: "right", fontWeight: "bold", fontSize: 22 }}>{data.Qty}</TableCell>
                                  <TableCell sx={{ border: "1px solid black", padding: "0px 15px",  textAlign: "right", fontWeight: "bold", fontSize: 22 }}>{data.UnitType}</TableCell>
                                  <TableCell sx={{ border: "1px solid black", padding: "0px 15px",  textAlign: "right", fontWeight: "bold", fontSize: 22 }}>{data.UnitPrice.toFixed(2)}</TableCell>
                                  <TableCell sx={{ border: "1px solid black", padding: "0px 15px",  textAlign: "right", fontWeight: "bold", fontSize: 22 }}>{(data.UnitPrice * data.Qty).toFixed(2)}</TableCell>
                                </TableRow>
                              </>
                            );
                          })}
                      </TableBody>
                      <TableFooter>
                        {[...Array(noofRow)].map((x, i) => 
                        <TableRow>
                          <TableCell sx={{ borderLeft: "1px solid black", borderRight: "1px solid black", backgroundColor: '#FFFFFF', alignItems: "stretch" }} />
                          <TableCell sx={{ borderLeft: "1px solid black", borderRight: "1px solid black", backgroundColor: '#FFFFFF', alignItems: "stretch" }} />
                          <TableCell sx={{ borderLeft: "1px solid black", borderRight: "1px solid black", backgroundColor: '#FFFFFF', alignItems: "stretch" }} />
                          <TableCell sx={{ borderLeft: "1px solid black", borderRight: "1px solid black", backgroundColor: '#FFFFFF', alignItems: "stretch" }} />
                          <TableCell sx={{ borderLeft: "1px solid black", borderRight: "1px solid black", backgroundColor: '#FFFFFF', alignItems: "stretch" }} />
                          <TableCell sx={{ borderLeft: "1px solid black", borderRight: "1px solid black", backgroundColor: '#FFFFFF', alignItems: "stretch" }} />
                        </TableRow>
                        )}
                        <TableRow>
                          <TableCell sx={{ border: "1px solid black", backgroundColor: '#FFFFFF', alignItems: "stretch" }} />
                          <TableCell sx={{ border: "1px solid black", backgroundColor: '#FFFFFF', alignItems: "stretch" }} />
                          <TableCell sx={{ border: "1px solid black", backgroundColor: '#FFFFFF', alignItems: "stretch" }} />
                          <TableCell sx={{ border: "1px solid black", backgroundColor: '#FFFFFF', alignItems: "stretch" }} />
                          <TableCell sx={{ border: "1px solid black", backgroundColor: '#FFFFFF', alignItems: "stretch" }} />
                          <TableCell sx={{ border: "1px solid black", backgroundColor: '#FFFFFF', alignItems: "stretch" }} />
                        </TableRow>
                        {grandDetails.totalAmount === 0 ? (
                          ""
                        ) : (
                          <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                            <TableCell sx={{ borderTop: "1px solid black", border: "1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }} colSpan={5}>Gross Total:</TableCell>
                            <TableCell sx={{ borderTop: "1px solid black", border: "1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }}>
                              {grandDetails.totalAmount.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        )}
                        {grandDetails.totalDiscount === 0 ? (
                          <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                            <TableCell sx={{ border: "1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }} colSpan={5}>Discount:</TableCell>
                            <TableCell sx={{ border: "1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }}>
                              0.00
                            </TableCell>
                          </TableRow>
                        ) : (
                          <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                            <TableCell sx={{ border: "1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }} colSpan={5}>Discount:</TableCell>
                            <TableCell sx={{ border: "1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }}>
                              {grandDetails.totalDiscount.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        )}
                        {grandDetails.totalTaxable === 0 ? (
                          ""
                        ) : (
                          <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                            <TableCell sx={{ border: "1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }} colSpan={5}>Taxable:</TableCell>
                            <TableCell sx={{ border: "1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }}>
                              {grandDetails.totalTaxable.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        )}

                        {grandDetails.totalExerciseDuty === 0 ? (
                          <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                            <TableCell sx={{ border: "1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }} colSpan={5}>Non-taxable:</TableCell>
                            <TableCell sx={{ border: "1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }}>
                              {grandDetails.totlaNonTaxable.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ) : (
                          <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                            <TableCell sx={{ border: "1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }} colSpan={5}>Non-taxable:</TableCell>
                            <TableCell sx={{ border: "1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }}>
                              {grandDetails.totlaNonTaxable.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        )}
                        {grandDetails.totalExerciseDuty === 0 ? (
                          ""
                        ) : (
                          <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                            <TableCell sx={{ border: "1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }} colSpan={5}>Exercise Duty:</TableCell>
                            <TableCell sx={{ border: "1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }}>
                              {grandDetails.totalExerciseDuty.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        )}
                        {grandDetails.totalTax === 0 ? (
                          ""
                        ) : (
                          <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                            <TableCell sx={{ border: "1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }} colSpan={5}>VAT @ 13%:</TableCell>
                            <TableCell sx={{ border: "1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }}>
                              {grandDetails.totalTax.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        )}
                        <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                          <TableCell sx={{ border: "1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }} colSpan={5}><h3>Net Total:</h3></TableCell>
                          <TableCell sx={{ border: "1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }}>
                            <h3>{grandDetails.grandTotal.toFixed(2)}</h3>
                          </TableCell>
                        </TableRow>
                        <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                          <TableCell sx={{ border: "1px solid black", fontWeight: "900", fontSize: 22, textAlign: "left", padding: "0px 16px" }} colSpan={6}><strong> In Words: </strong>{decimalInWords}</TableCell>
                        </TableRow>
                        <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                          <TableCell sx={{ border: "1px solid black", fontWeight: "900", fontSize: 22, textAlign: "left", padding: "0px 16px" }} colSpan={6}><strong> Remarks: </strong> {salesDetails?.Description} </TableCell>
                        </TableRow>
                        <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                          <TableCell sx={{ border: "1px solid black", fontWeight: "900", fontSize: 22, textAlign: "left", padding: "0px 16px" }} colSpan={3}>Challan No: {salesDetails?.ChallanNo}</TableCell>
                          <TableCell sx={{ border: "1px solid black", fontWeight: "900", fontSize: 22, textAlign: "left", padding: "0px 16px" }} colSpan={3}>Vehicle No: {salesDetails?.VehicleNo}</TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </TableContainer>

                </div>
                  </>
      
      ) : (
        <TableContainer component={Paper} sx={{ padding: 0 }}>
        <Table sx={{width: '100%', height: '100%', border:"2px solid black"}}>
          <TableBody>
          <TableRow sx={{height: 20, backgroundColor: '#FFFFFF'}}>
            <TableCell sx={{border:"1px solid black", padding: "0px 5px",  fontWeight: "bold", width: '5%', fontSize: 22}}>SN.</TableCell>
            <TableCell sx={{border:"1px solid black", padding: "0px 5px", fontWeight: "bold", width: '42%', fontSize: 22}}>Item name</TableCell>
            <TableCell sx={{border:"1px solid black", padding: "0px 5px", fontWeight: "bold", width: '10%', fontSize: 22}}>Qty</TableCell>
            <TableCell sx={{border:"1px solid black", padding: "0px 5px", fontWeight: "bold", width: '8%', fontSize: 22}}>Unit</TableCell>
            <TableCell sx={{border:"1px solid black", padding: "0px 5px", fontWeight: "bold", textAlign: "right", width: '15%', fontSize: 22}}>Rate (Rs)</TableCell>
            <TableCell sx={{border:"1px solid black", padding: "0px 5px", fontWeight: "bold", textAlign: "right",  width: '20%', fontSize: 22}}>
              Amount (Rs.)
            </TableCell>
          </TableRow>

            {salesDetails &&
              salesDetails.SalesOrderDetails.map((data, index) => {
                return (
                  <>
                  <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }} key={index}>
                    <TableCell sx={{ border: "1px solid black", padding: "0px 15px",  textAlign: "left", fontWeight: "bold", fontSize: 22 }}>{index + 1}</TableCell>
                    <TableCell sx={{ border: "1px solid black", padding: "0px 15px",  textAlign: "left", fontWeight: "bold", fontSize: 22 }}>{getProductName(data.ItemId)}</TableCell>
                    <TableCell sx={{ border: "1px solid black", padding: "0px 15px",  textAlign: "right", fontWeight: "bold", fontSize: 22 }}>{data.Qty}</TableCell>
                    <TableCell sx={{ border: "1px solid black", padding: "0px 15px",  textAlign: "right", fontWeight: "bold", fontSize: 22 }}>{data.UnitType}</TableCell>
                    <TableCell sx={{ border: "1px solid black", padding: "0px 15px",  textAlign: "right", fontWeight: "bold", fontSize: 22 }}>{data.UnitPrice.toFixed(2)}</TableCell>
                    <TableCell sx={{ border: "1px solid black", padding: "0px 15px",  textAlign: "right", fontWeight: "bold", fontSize: 22 }}>{(data.UnitPrice * data.Qty).toFixed(2)}</TableCell>
                  </TableRow>
                  <div style={{ width: "10px", textAlign:"right" }}>
                      {(index + 1) % company.FirstPageRow === 0 ? (
                        <>
                        <TableRow>
                          <TableCell colSpan={6} width={"100%"}>
                            NextPage
                          </TableCell>
                        </TableRow>
                        <TableRow className="pagebreak">
                          <TableCell colSpan={6}>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={6} width={"100%"}>
                            Page{(index + 1)/ company.FirstPageRow + 1}of{""}{noOfPages}
                          </TableCell>
                        </TableRow>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                    </>
                );
              })
            }
              {grandDetails.totalAmount === 0 ? (
                ""
              ) : (
                <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                  <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }} colSpan={5}>Gross Total:</TableCell>
                  <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }}>
                    {grandDetails.totalAmount.toFixed(2)}
                  </TableCell>
                </TableRow>
              )}
                {grandDetails.totalDiscount === 0 ? (
                  <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                    <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }} colSpan={5}>Discount:</TableCell>
                    <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }}>
                      0.00
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                    <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }} colSpan={5}>Discount:</TableCell>
                    <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }}>
                      {grandDetails.totalDiscount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}
                {grandDetails.totalTaxable === 0 ? (
                  ""
                ) : (
                  <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                    <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }} colSpan={5}>Taxable:</TableCell>
                    <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }}>
                      {grandDetails.totalTaxable.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}
                {grandDetails.totalExerciseDuty === 0 ? (
                  <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                    <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }} colSpan={5}>Non-Taxable:</TableCell>
                    <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }}>
                      {grandDetails.totlaNonTaxable.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                    <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }} colSpan={5}>Non-taxable:</TableCell>
                    <TableCell sx={{ border:"1px solid black", fontWeight: 900, fontSize: 22, textAlign: "right", padding: "0px 16px" }}>
                      {grandDetails.totlaNonTaxable.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}
                {grandDetails.totalExerciseDuty === 0 ? (
                  ""
                ) : (
                  <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                    <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }} colSpan={5}>Exercise Duty:</TableCell>
                    <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }}>
                      {grandDetails.totalExerciseDuty.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}
                {grandDetails.totalTax === 0 ? (
                  ""
                ) : (
                  <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                    <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }} colSpan={5}>Vat @ 13%:</TableCell>
                    <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }}>
                      {grandDetails.totalTax.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}
                <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                  <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }} colSpan={5}><h3>Net Total:</h3></TableCell>
                  <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 22, textAlign: "right", padding: "0px 16px" }}>
                    <h3>{grandDetails.grandTotal.toFixed(2)}</h3>
                  </TableCell>
                </TableRow>
                <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                  <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 22, textAlign: "left", padding: "0px 16px" }} colSpan={6}><strong>In Words:</strong> {decimalInWords}</TableCell>
                </TableRow>
                { salesDetails &&
              salesDetails.SalesOrderDetails ?
              <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
              <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 22, textAlign: "left", padding: "0px 16px" }} colSpan={6}><strong>Remarks:</strong> {salesDetails.Description}</TableCell>
            </TableRow> 
          :
          ""
              }                
                { salesDetails &&
              salesDetails.SalesOrderDetails ?
              <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 22, textAlign: "left", padding: "0px 16px" }} colSpan={3}>Challan No: {salesDetails.ChallanNo}</TableCell>
              <TableCell sx={{ border:"1px solid black", fontWeight: "900", fontSize: 22, textAlign: "left", padding: "0px 16px" }} colSpan={3}>Vehicle No: {salesDetails.VehicleNo}</TableCell>
            </TableRow>
          :
          ""
              }
          </TableBody>
        </Table>
      </TableContainer>
)}
      <Grid container sx={{display: "flex", justifyContent: "end", height: '20%',}} >
          <Grid item xs={4} sx={{ display: "flex", justifyContent: "center"}}>
            <Box sx={{
              height: '100%',
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              flexDirection: "column"}}>
              <Typography
                textAlign="center" variant="h6"
                sx={{ fontWeight: 'bold', textAlign: "center", visibility:"hidden"}}
              >
                {salesDetails?.UserName}
              </Typography>
              <Typography sx={{ display: "block" }}>
                ....................................................
              </Typography>
              <Typography
                textAlign="center" variant="h6"
                sx={{ display: "block", fontWeight: "500", fontStyle:'Bold' }}
              >
                Received By
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4} sx={{ display: "flex", justifyContent: "center"}}>
            <Box sx={{
              height: '100%',
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              flexDirection: "column"}}>
              <Typography
                textAlign="center" variant="h6"
                sx={{ display: "block", fontWeight: "500", fontStyle:'Bold'}}
              >
                {salesDetails?.UserName}
              </Typography>
              <Typography sx={{ display: "block" }}>
              ....................................................
              </Typography>
              <Typography
                textAlign="center" variant="h6"
                sx={{ display: "block", fontWeight: "500", fontStyle:'Bold'}}
              >
                Prepared By
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4} sx={{ display: "flex", justifyContent: "center"}}>
            <Box sx={{
              height: '100%',
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              flexDirection: "column"}}>
              <Typography
                textAlign="center" variant="h6"
                sx={{ fontWeight: 'bold',visibility:"hidden" }}
              >
                {salesDetails?.UserName}
              </Typography>
              <Typography textAlign="center" sx={{ display: "block" }}>
              ....................................................
              </Typography>
              <Typography
              textAlign="center" variant="h6"
              sx={{ display: "block", fontWeight: "500", fontStyle:'Bold'}}
              >
                Authorized By
                <Typography
                  display="inline"
                  sx={{ fontWeight: 'bold', marginLeft: 1}}
              >
                
                </Typography>
              </Typography>
            </Box>                                    
          </Grid>
          <Box
        sx={{
          p: 1,
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Typography sx={{ fontWeight: "900"}} variant="h5">{company.Description}</Typography>
      </Box>
      </Grid>
    </Box>  
</div>
)};
    
    </>
  );
};

export default PrintPdfInvoice;
