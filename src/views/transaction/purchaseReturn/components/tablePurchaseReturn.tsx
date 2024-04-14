import { Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { LinearProgress } from "@mui/material";
import { ISelectType } from "../../../../interfaces/autoComplete";
import { IParams } from "../../../../interfaces/params";
import { getPurchaseReturn } from "../../../../services/purchaseReturnApi";
import {
  IAccountHolder,
  IPurchaseMenu,
} from "../../../../interfaces/purchaseOrder";
import {
  getAllAccountHolder,
  getAllPurchase,
} from "../../../../services/purchaseOrderApi";
import ViewHeader from "../../../transmis/components/viewHeader";
import { ILedgerCalculation } from "../../invoice/interfaces";
import { getAllLedgerForCalculation } from "../../../../services/invoice";

interface IGrandDetailsKey {
  taxable: number;
  nonTaxable: number;
  exerciseDuty: number;
  tax: number;
  discount: number;
  // sales: number;
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
const PrintPurchaseReturn = () => {
  const [allData, setAllData] = useState<any>();
  const [accountHolder, setAccountHolder] = useState<ISelectType[]>([]);
  const [products, setProducts] = useState<ISelectType[]>([]);
  const { id }: IParams = useParams();
  const history = useHistory();
  const [keys, setKeys] = useState<IGrandDetailsKey>({
    exerciseDuty: 0,
    tax: 0,
    taxable: 0,
    nonTaxable: 0,
    discount: 0,
    // sales: 0,
  });
  const [grandDetails, setGrandDetails] =
    useState<IGrandDetails>(initialGrandDetails);

  const setAllKeys = async () => {
    const ledgerCalculationData: ILedgerCalculation[] =
      await getAllLedgerForCalculation();
    const nonTaxableData = ledgerCalculationData.find(
      (data) => data.Name === "Non Taxable Purchase"
    );
    const taxableData = ledgerCalculationData.find(
      (data) => data.Name === "Taxable Purchase"
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

    // const salesData = ledgerCalculationData.find(
    //   (data) => data.Name === "Sales"
    // );

    setKeys({
      nonTaxable: nonTaxableData ? nonTaxableData.Id : 0,
      taxable: taxableData ? taxableData.Id : 0,
      discount: discountData ? discountData.Id : 0,
      exerciseDuty: exerciseDutyData ? exerciseDutyData.Id : 0,
      tax: taxData ? taxData.Id : 0,
      // sales: salesData ? salesData.Id : 0,
    });
  };

  const loadData = async () => {
    try {
      const res = await getPurchaseReturn(id);
      setAllData(res);
      const response: IAccountHolder[] = await getAllAccountHolder();
      setAccountHolder(
        response.map((item) => {
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
      history.push("/purchase-return");
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
        );
        const taxData = allData.AccountTransactionValues.find(
          (allData: any) => allData.AccountId === keys.tax
        );
        const discountData = allData.AccountTransactionValues.find(
          (allData: any) => allData.AccountId === keys.discount
        );
        // const salesData = allData.AccountTransactionValues.find(
        //   (allData: any) => allData.AccountId === keys.sales
        // );

        nonTaxable = nonTaxableData ? nonTaxableData.Credit : 0;
        taxable = taxableData ? taxableData.Credit + taxableData.Debit : 0;
        amount = taxable + nonTaxable;
        exerciseDuty = exerciseDutyData
          ? exerciseDutyData.Credit + exerciseDutyData.Debit
          : 0;
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
      history.push("/purchase-return");
    }
  };
  useEffect(() => {
    getGrandDetails();
  }, [allData, accountHolder, keys, products]);

  const getAccountName = (id: any) => {
    for (let index = 0; index < accountHolder.length; index++) {
      if (accountHolder[index].value === id) {
        return accountHolder[index].label;
      }
    }
  };

  // const total = allData?.PurchaseDetails?.reduce((a: any, b: any) => {
  //   return a + b.PurchaseAmount;
  // }, 0);

  if (allData === null || products.length === 0 || accountHolder.length === 0) {
    return <LinearProgress sx={{ mt: 3 }} />;
  }

  return (
    <>
      <Box
        sx={{
          mx: "auto",
          width: "90%",
          height: "100%",
        }}
      >
        <div style={{ height: "250px" }}>
          <ViewHeader name="Purchase Return" />
          <Box
            sx={{
              mt: 3,
              px: 5,
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              mx: "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  mt: 1,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Account holder :
                </Typography>
                <Typography variant="body2">
                  &nbsp;{getAccountName(allData.SourceAccountTypeId)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  mt: 1,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Debit Note No. :
                </Typography>
                <Typography variant="body2">
                  &nbsp;{getBillNo(allData?.Name ? allData?.Name : "")}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  mt: 1,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Date :
                </Typography>
                <Typography variant="body2">
                  &nbsp;
                  {allData.Date &&
                    allData.AccountTransactionValues[0].NVDate.substring(0, 10)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </div>
        <TableContainer
          component={Paper}
          sx={{ height: "calc(100% - 250px - 10%)" }}
        >
          {/* <Table stickyHeader aria-label="sticky table"> */}
          <Table sx={{ height: "100%" }}>
            <TableHead>
              <TableRow component="th">
                <TableCell align="left">S.N</TableCell>
                <TableCell colSpan={3} align="center">
                  Product/Service
                </TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="right">Unit Price(Rs.)</TableCell>
                <TableCell align="right">Total(Rs.)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allData?.PurchaseDetails?.map((elm: any, i: number) => {
                const productValue = products?.find(
                  (obj) => obj.value === elm.InventoryItemId
                );
                return (
                  <>
                    <TableRow
                      component="th"
                      sx={{ height: 30, backgroundColor: "#FFFFFF" }}
                      key={i}
                    >
                      <TableCell align="left" sx={{ padding: "0px 16px" }}>
                        {i + 1}
                      </TableCell>
                      <TableCell
                        colSpan={3}
                        align="center"
                        sx={{ padding: "0px 16px" }}
                      >
                        {productValue?.label}
                      </TableCell>
                      <TableCell align="center" sx={{ padding: "0px 16px" }}>
                        {Math.abs(elm.Quantity)}
                      </TableCell>
                      <TableCell align="right" sx={{ padding: "0px 16px" }}>
                        {elm.PurchaseRate.toFixed(2)}
                      </TableCell>
                      <TableCell align="right" sx={{ padding: "0px 16px" }}>
                        {Math.abs(elm.PurchaseAmount.toFixed(2))}
                      </TableCell>
                    </TableRow>
                  </>
                );
              })}
              {allData && allData.PurchaseDetails.length > 20 ? (
                <>
                  {grandDetails.totalTaxable === 0 ? (
                    ""
                  ) : (
                    <TableRow sx={{ height: 30, backgroundColor: "#FFFFFF" }}>
                      <TableCell
                        sx={{
                          fontWeight: "500",
                          textAlign: "right",
                          padding: "0px 16px",
                        }}
                        colSpan={6}
                      >
                        Taxable:
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          textAlign: "right",
                          padding: "0px 16px",
                        }}
                      >
                        {grandDetails.totalTaxable.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  )}
                  {grandDetails.totalExerciseDuty === 0 ? (
                    <TableRow sx={{ height: 30, backgroundColor: "#FFFFFF" }}>
                      <TableCell
                        sx={{
                          fontWeight: "500",
                          textAlign: "right",
                          padding: "0px 16px",
                        }}
                        colSpan={6}
                      >
                        Sub total:
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          textAlign: "right",
                          padding: "0px 16px",
                        }}
                      >
                        {grandDetails.totlaNonTaxable.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow sx={{ height: 30, backgroundColor: "#FFFFFF" }}>
                      <TableCell
                        sx={{
                          fontWeight: "500",
                          textAlign: "right",
                          padding: "0px 16px",
                        }}
                        colSpan={6}
                      >
                        Non-taxable:
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          textAlign: "right",
                          padding: "0px 16px",
                        }}
                      >
                        {grandDetails.totlaNonTaxable.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  )}
                  {grandDetails.totalDiscount === 0 ? (
                    ""
                  ) : (
                    <TableRow sx={{ height: 30, backgroundColor: "#FFFFFF" }}>
                      <TableCell
                        sx={{
                          fontWeight: "500",
                          textAlign: "right",
                          padding: "0px 16px",
                        }}
                        colSpan={6}
                      >
                        Discount:
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "500",
                          textAlign: "right",
                          padding: "0px 16px",
                        }}
                      >
                        {grandDetails.totalDiscount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  )}
                  {grandDetails.totalExerciseDuty === 0 ? (
                    ""
                  ) : (
                    <TableRow sx={{ height: 30, backgroundColor: "#FFFFFF" }}>
                      <TableCell
                        sx={{
                          fontWeight: "500",
                          textAlign: "right",
                          padding: "0px 16px",
                        }}
                        colSpan={6}
                      >
                        Exercise Duty:
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "500",
                          textAlign: "right",
                          padding: "0px 16px",
                        }}
                      >
                        {grandDetails.totalExerciseDuty.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  )}
                  {grandDetails.totalTax === 0 ? (
                    ""
                  ) : (
                    <TableRow sx={{ height: 30, backgroundColor: "#FFFFFF" }}>
                      <TableCell
                        sx={{
                          fontWeight: "500",
                          textAlign: "right",
                          padding: "0px 16px",
                        }}
                        colSpan={6}
                      >
                        Vat:
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "500",
                          textAlign: "right",
                          padding: "0px 16px",
                        }}
                      >
                        {grandDetails.totalTax.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow sx={{ height: 30, backgroundColor: "#FFFFFF" }}>
                    <TableCell
                      sx={{
                        fontWeight: "500",
                        textAlign: "right",
                        padding: "0px 16px",
                      }}
                      colSpan={6}
                    >
                      Grand Total:
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "500",
                        textAlign: "right",
                        padding: "0px 16px",
                      }}
                    >
                      {grandDetails.grandTotal.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  {/* <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                      <TableCell sx={{ fontWeight: "500", textAlign: "left", padding: "0px 16px" }} colSpan={7}>In Words: {decimalInWords}</TableCell>
                    </TableRow> */}
                </>
              ) : (
                <TableRow>
                  <TableCell
                    sx={{ backgroundColor: "#FFFFFF", alignItems: "stretch" }}
                    rowSpan={0}
                  />
                  <TableCell
                    colSpan={3}
                    sx={{ backgroundColor: "#FFFFFF", alignItems: "stretch" }}
                    rowSpan={0}
                  />
                  <TableCell
                    sx={{ backgroundColor: "#FFFFFF", alignItems: "stretch" }}
                    rowSpan={0}
                  />
                  <TableCell
                    sx={{ backgroundColor: "#FFFFFF", alignItems: "stretch" }}
                    rowSpan={0}
                  />
                  <TableCell
                    sx={{ backgroundColor: "#FFFFFF", alignItems: "stretch" }}
                    rowSpan={0}
                  />
                </TableRow>
              )}
            </TableBody>
            {allData && allData.PurchaseDetails.length > 20 ? (
              ""
            ) : (
              <TableFooter>
                {grandDetails.totalTaxable === 0 ? (
                  ""
                ) : (
                  <TableRow sx={{ height: 30, backgroundColor: "#FFFFFF" }}>
                    <TableCell
                      sx={{
                        fontWeight: "500",
                        textAlign: "right",
                        padding: "0px 16px",
                      }}
                      colSpan={6}
                    >
                      Taxable:
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        textAlign: "right",
                        padding: "0px 16px",
                      }}
                    >
                      {grandDetails.totalTaxable.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}

                {grandDetails.totalExerciseDuty === 0 ? (
                  <TableRow sx={{ height: 30, backgroundColor: "#FFFFFF" }}>
                    <TableCell
                      sx={{
                        fontWeight: "500",
                        textAlign: "right",
                        padding: "0px 16px",
                      }}
                      colSpan={6}
                    >
                      Sub total:
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        textAlign: "right",
                        padding: "0px 16px",
                      }}
                    >
                      {grandDetails.totlaNonTaxable.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow sx={{ height: 30, backgroundColor: "#FFFFFF" }}>
                    <TableCell
                      sx={{
                        fontWeight: "500",
                        textAlign: "right",
                        padding: "0px 16px",
                      }}
                      colSpan={6}
                    >
                      Non-taxable:
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        textAlign: "right",
                        padding: "0px 16px",
                      }}
                    >
                      {grandDetails.totlaNonTaxable.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}
                {grandDetails.totalDiscount === 0 ? (
                  ""
                ) : (
                  <TableRow sx={{ height: 30, backgroundColor: "#FFFFFF" }}>
                    <TableCell
                      sx={{
                        fontWeight: "500",
                        textAlign: "right",
                        padding: "0px 16px",
                      }}
                      colSpan={6}
                    >
                      Discount:
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "500",
                        textAlign: "right",
                        padding: "0px 16px",
                      }}
                    >
                      {grandDetails.totalDiscount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}
                {grandDetails.totalExerciseDuty === 0 ? (
                  ""
                ) : (
                  <TableRow sx={{ height: 30, backgroundColor: "#FFFFFF" }}>
                    <TableCell
                      sx={{
                        fontWeight: "500",
                        textAlign: "right",
                        padding: "0px 16px",
                      }}
                      colSpan={6}
                    >
                      Exercise Duty:
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "500",
                        textAlign: "right",
                        padding: "0px 16px",
                      }}
                    >
                      {grandDetails.totalExerciseDuty.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}
                {grandDetails.totalTax === 0 ? (
                  ""
                ) : (
                  <TableRow sx={{ height: 30, backgroundColor: "#FFFFFF" }}>
                    <TableCell
                      sx={{
                        fontWeight: "500",
                        textAlign: "right",
                        padding: "0px 16px",
                      }}
                      colSpan={6}
                    >
                      Vat:
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "500",
                        textAlign: "right",
                        padding: "0px 16px",
                      }}
                    >
                      {grandDetails.totalTax.toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}
                <TableRow sx={{ height: 30, backgroundColor: "#FFFFFF" }}>
                  <TableCell
                    sx={{
                      fontWeight: "500",
                      textAlign: "right",
                      padding: "0px 16px",
                    }}
                    colSpan={6}
                  >
                    Grand Total:
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "500",
                      textAlign: "right",
                      padding: "0px 16px",
                    }}
                  >
                    {grandDetails.grandTotal.toFixed(2)}
                  </TableCell>
                </TableRow>
                {/* <TableRow sx={{ height: 30, backgroundColor: '#FFFFFF' }}>
                    <TableCell sx={{ fontWeight: "500", textAlign: "left", padding: "0px 16px" }} colSpan={7}>In Words: {decimalInWords}</TableCell>
                  </TableRow> */}
              </TableFooter>
            )}
          </Table>
        </TableContainer>
        {/* <Box
          sx={{
            mt: 3,
            px: 5,
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          
        </Box> */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            height: "10%",
          }}
        >
          <Box
            sx={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="body2"
              sx={{ display: "block", fontWeight: "bold" }}
            >
              Description :
              <Typography
                variant="body2"
                display="inline"
                sx={{ marginLeft: 1 }}
              >
                {allData?.Description}
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default PrintPurchaseReturn;
