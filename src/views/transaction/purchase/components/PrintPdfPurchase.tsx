import {
  Grid,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { IParams } from "../../../../interfaces/params";
import { IProduct } from "../../../../interfaces/product";
import {
  IAccount,
  IAutoComplete,
  IPurchase,
} from "../../../../interfaces/purchase";
import {
  getAllAccount,
  getAllLedger,
  getAllProducts,
  getPurchase,
} from "../../../../services/purchaseApi";
import { errorMessage } from "../../../../utils/messageBox/Messages";
import ViewHeader from "../../../transmis/components/viewHeader";
import { ISelectedProduct } from "../../invoice/interfaces";

interface IGrandDetails {
  taxable: number;
  nonTaxable: number;
  TotalAmount: number;
  discount: number;
  exercise: number;
  vat: number;
  grandTotal: number;
}

interface ITransactionValues {
  name: string;
  value: number;
}

const initialGrandDetails = {
  taxable: 0,
  nonTaxable: 0,
  TotalAmount: 0,
  discount: 0,
  exercise: 0,
  vat: 0,
  grandTotal: 0,
};

const PrintPdfPurchase = () => {
  const { id }: IParams = useParams();
  const history = useHistory();
  const [purchaseData, setPurchaseData] = useState<IPurchase>();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [customer, setCustomer] = useState<IAutoComplete[]>([]);
  const [grandDetails, setGrandDetails] =
    useState<IGrandDetails>(initialGrandDetails);

  const [transactionValues, setTransactionValue] = useState<
    ITransactionValues[]
  >([]);

  const [areAllDataLoaded, setAreAllDataLoaded] = useState<boolean>(false);

  const setData = async () => {
    try {
      const accountData = await getAllAccount();
      const response: IPurchase = await getPurchase(id);
      setPurchaseData(response);
      const productsData = await getAllProducts();
      setProducts(productsData);
      const customerData = await getAllLedger();
      setCustomer(
        customerData.map((data: any) => {
          return { id: data.Id, label: data.Name };
        })
      );
      setAreAllDataLoaded(true);

      const accountResponse: IAccount[] = await getAllAccount();
      const discountId = 3;
      const vatId = 8;
      const taxablePurchaeData = accountResponse.find(
        (data) => data.Name === "Taxable Purchase"
      );
      const nonTaxablePurchaseData = accountResponse.find(
        (data) => data.Name === "Non Taxable Purchase"
      );

      const taxablePurchaseId = taxablePurchaeData
        ? taxablePurchaeData.Id
        : null;
      const nonTaxablePurchaseId = nonTaxablePurchaseData
        ? nonTaxablePurchaseData.Id
        : null;

      const filterTransactionData = response.AccountTransactionValues.filter(
        (data) => {
          if (data.AccountId !== response.SourceAccountTypeId) {
            if (
              data.AccountId !== discountId &&
              data.AccountId !== vatId &&
              data.AccountId !== taxablePurchaseId &&
              data.AccountId !== nonTaxablePurchaseId &&
              data.AccountId !== response.SourceAccountTypeId
            ) {
              return data;
            }
          }
        }
      );
      setTransactionValue(
        filterTransactionData.map((data) => {
          const accountDt = accountData.find(
            (accountDt: any) => accountDt.Id === data.AccountId
          );
          return {
            name: accountDt ? accountDt.Name : "",
            value: data.Debit + data.Credit,
          };
        })
      );

      let transactionValueTotal = 0;
      filterTransactionData.forEach((element) => {
        transactionValueTotal += element.Debit + element.Credit;
      });

      const taxableAmountData = response.AccountTransactionValues.find(
        (data) => data.AccountId === taxablePurchaseId
      );
      const nonTaxableAmountData = response.AccountTransactionValues.find(
        (data) => data.AccountId === nonTaxablePurchaseId
      );
      const discountAmountData = response.AccountTransactionValues.find(
        (data) => data.AccountId === discountId
      );
      const vatAmountData = response.AccountTransactionValues.find(
        (data) => data.AccountId === vatId
      );

      const taxableAmount = taxableAmountData
        ? taxableAmountData.Debit + taxableAmountData.Credit
        : 0;
      const nonTaxableAmount = nonTaxableAmountData
        ? nonTaxableAmountData.Credit + nonTaxableAmountData.Debit
        : 0;
      const discountAmount = discountAmountData
        ? discountAmountData.Debit + discountAmountData.Credit
        : 0;
      const vatAmount = vatAmountData
        ? vatAmountData.Credit + vatAmountData.Debit
        : 0;

      setGrandDetails({
        ...grandDetails,
        discount: discountAmount,
        vat: vatAmount,
        taxable: taxableAmount,
        nonTaxable: nonTaxableAmount,
        TotalAmount: taxableAmount + nonTaxableAmount,
        grandTotal:
          taxableAmount +
          nonTaxableAmount +
          vatAmount +
          transactionValueTotal ,
      });
    } catch {
      errorMessage("Invalid purchase id.");
      history.push("/purchase");
    }
  };

  useEffect(() => {
    setData();
  }, [id]);

  const getProductName = (id: number): string => {
    const productDetails = products.find((data) => data.Id === id);
    return productDetails ? productDetails.Name : "";
  };
  const getPurchaseRate = (purchaserate: number, afterexciseamount : number, discount : number): number => {
    let CurrentRate = 0;
    let aftrexcise = Number(purchaserate) + Number(afterexciseamount);  
    CurrentRate = aftrexcise  - Number(discount) ;
    return CurrentRate ? CurrentRate : 0;
  }; 

  const getCustomerName = (id: number | any) => {
    if (id) {
      const customerData = customer.find((data) => data.id === id);
      return customerData ? customerData.label : "";
    }
    return "";
  };

  if (!areAllDataLoaded) {
    return <LinearProgress sx={{ mt: 3 }} />;
  }

  return (
    <>
      <Box sx={{ mt: 3, width: "80%", mx: "auto" }}>
        <ViewHeader name="Purchase Voucher" />

        <Grid container>
          <Grid item xs={6}>
            <Box>
              <Typography sx={{ fontWeight: "500", fontSize: 14 }}>
                Customer name:
                <Typography
                  display="inline"
                  sx={{ fontWeight: "500", marginLeft: 1, fontSize: 14 }}
                >
                  {getCustomerName(
                    purchaseData && purchaseData.SourceAccountTypeId
                  )}
                </Typography>
              </Typography>
              <Typography sx={{ fontWeight: "500", mt: 1, fontSize: 15 }}>
                Invoice no:
                <Typography
                  display="inline"
                  sx={{ marginLeft: 1, fontSize: 14 }}
                >
                  {purchaseData && purchaseData.ref_invoice_number}
                </Typography>
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sx={{ display: "flex", justifyContent: "end" }}>
            <Box>
              <Typography sx={{ fontWeight: "500", fontSize: 15 }}>
                Date:
                <Typography
                  display="inline"
                  sx={{ marginLeft: 1, fontSize: 14 }}
                >
                  {purchaseData &&
                    purchaseData.AccountTransactionValues[0].NVDate}
                </Typography>
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SN.</TableCell>
                <TableCell>Item name</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell sx={{ textAlign: "right" }}>Rate (Rs.) </TableCell>
                <TableCell sx={{ textAlign: "right" }}>Amount (Rs.)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchaseData &&
                purchaseData.PurchaseDetails.map((data, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        {getProductName(data.InventoryItemId)}
                      </TableCell>
                      <TableCell>{data.Quantity}</TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                      {getPurchaseRate(data.PurchaseRate, data.ExciseDuty, data.Discount).toFixed(2)}
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        {(data.Quantity * getPurchaseRate(data.PurchaseRate, data.ExciseDuty, data.Discount)).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  );
                })}

              <TableRow>
                <TableCell colSpan={4}></TableCell>
                <TableCell sx={{ fontWeight: "500", textAlign: "right" }}>
                  Total:{" "}
                  <Typography sx={{ display: "inline" }}>
                    {grandDetails.TotalAmount.toFixed(2)}
                  </Typography>
                </TableCell>
              </TableRow>

              {grandDetails.discount === 0 ? (
                ""
              ) : (
                <TableRow>
                  <TableCell colSpan={4}></TableCell>
                  <TableCell sx={{ fontWeight: "500", textAlign: "right" }}>
                    Discount:{" "}
                    <Typography sx={{ display: "inline" }}>
                      {grandDetails.discount.toFixed(2)}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {grandDetails.taxable === 0 ? (
                ""
              ) : (
                <TableRow>
                  <TableCell colSpan={4}></TableCell>
                  <TableCell sx={{ fontWeight: "500", textAlign: "right" }}>
                    Taxable:{" "}
                    <Typography sx={{ display: "inline" }}>
                      {grandDetails.taxable.toFixed(2)}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {grandDetails.nonTaxable === 0 ? (
                ""
              ) : (
                <TableRow>
                  <TableCell colSpan={4}></TableCell>
                  <TableCell sx={{ fontWeight: "500", textAlign: "right" }}>
                    Non-taxable:{" "}
                    <Typography sx={{ display: "inline" }}>
                      {grandDetails.nonTaxable.toFixed(2)}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {grandDetails.vat === 0 ? (
                ""
              ) : (
                <TableRow>
                  <TableCell colSpan={4}></TableCell>
                  <TableCell sx={{ fontWeight: "500", textAlign: "right" }}>
                    Vat:{" "}
                    <Typography sx={{ display: "inline" }}>
                      {grandDetails.vat.toFixed(2)}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {transactionValues.map((data, index) => {
                if (data.name == "Excise Duty") {
                  return (
                    <TableRow key={index}>
                      <TableCell colSpan={4}></TableCell>
                      <TableCell sx={{ fontWeight: "500", textAlign: "right" }}>
                        {`${data.name}: `}
                        <Typography sx={{ display: "inline" }}>
                          {data.value.toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                }
              })}

              <TableRow>
                <TableCell colSpan={4}></TableCell>
                <TableCell sx={{ fontWeight: "500", textAlign: "right" }}>
                  GrandTotal:{" "}
                  <Typography sx={{ display: "inline" }}>
                    {grandDetails.grandTotal.toFixed(2)}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box>
          <Box sx={{ display: "flex", justifyContent: "end", mt: 8 }}>
            <Box>
              <Typography sx={{ display: "block" }}>
                .........................................................
              </Typography>
              <Typography
                textAlign="center"
                sx={{ display: "block", fontWeight: "bold" }}
              >
                Signed By
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default PrintPdfPurchase;
