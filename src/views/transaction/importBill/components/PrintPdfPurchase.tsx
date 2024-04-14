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
import{IAdditionalProductCost,IImportBillDetail} from "../../../../interfaces/importBill"
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
import{getAllBranch} from "../../../../services/branchApi";
import {getAllWarehouseData} from "../../../../services/warehouseApi";
import {getAllDepartments} from "../../../../services/departmentApi";
import { errorMessage } from "../../../../utils/messageBox/Messages";
import ViewHeader from "../../../transmis/components/viewHeader";
import { IBranch } from "../../../../interfaces/branch";
import { IWarehouse } from "../../../../interfaces/warehouse";
import { IDepartment } from "../../../../interfaces/department";

interface IGrandDetails {
  taxable: number;
  nonTaxable: number;
  TotalAmount: number;
  discount: number;
  exercise: number;
  vat: number;
  grandTotal: number;
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

interface IImportBillView {
  ExciseDuty: number;
  ExcriseDutyAmount: number;
  AfterVatAmount:number;
  AdditionalProductCost: IAdditionalProductCost[];
  AdditionalLocalProductCost: IAdditionalProductCost[];
  VATAmount: number;
  TotalPurchaseValue: number;
  AfterImportDuty: number;
  Quantity:number;
}

const PrintPdfPurchase = () => {
  const { id }: IParams = useParams();
  const history = useHistory();
  const [purchaseData, setPurchaseData] = useState<IPurchase>();
  const [branch, setBranch] = useState<IBranch[]>([]);
  const [warehouse, setWarehouse] = useState<IWarehouse[]>([]);
  const [department, setDepartment] = useState<IDepartment[]>([])
  const [products, setProducts] = useState<IProduct[]>([]);
  const [customer, setCustomer] = useState<IAutoComplete[]>([]);
  const [grandDetails, setGrandDetails] =
    useState<IGrandDetails>(initialGrandDetails);


    const [additionalPurchaseDtl, setAdditionalPurchaseDtl] =
    useState<IImportBillView[]>([
      {
        ExciseDuty: 0,
        ExcriseDutyAmount: 0,
        AfterVatAmount: 0,
        AdditionalProductCost: [],
        AdditionalLocalProductCost: [],
        VATAmount: 0,
        TotalPurchaseValue: 0,
        AfterImportDuty: 0,
        Quantity: 0,
      }
    ]);


  // const additionalPurchaseDtl : IImportBillView[] = [];


  // const [transactionValues, setTransactionValue] = useState<
  //   ITransactionValues[]
  // >([]);

  const [areAllDataLoaded, setAreAllDataLoaded] = useState<boolean>(false);

  const setData = async () => {
    try {
      // const accountData = await getAllAccount();
      const response: IPurchase = await getPurchase(id);
      // console.log("Response: ",response)
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

      const branchDetails = await getAllBranch()
      setBranch(branchDetails);

      const warehouseDetails = await getAllWarehouseData()
      setWarehouse(warehouseDetails);

      const departmentDetails = await getAllDepartments()
      setDepartment(departmentDetails);

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

      // finding currency exchange rate\

      // const currencyExchangeRate = response.PurchaseDetails

      // setTransactionValue(
      //   filterTransactionData.map((data) => {
      //     const accountDt = accountData.find(
      //       (accountDt: any) => accountDt.Id === data.AccountId
      //     );
      //     return {
      //       name: accountDt ? accountDt.Name : "",
      //       value: data.Debit + data.Credit,
      //     };
      //   })
      // );
   
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
      //CHANGES
      const purchaseTotal = 0;
      response.PurchaseDetails.map((data, index) => {
        return data.PurchaseAmount
      });
      // setGrandDetails({
      //   ...grandDetails,
      //   discount: discountAmount,
      //   vat: vatAmount,
      //   taxable: taxableAmount,
      //   nonTaxable: nonTaxableAmount,
      //   TotalAmount: taxableAmount + nonTaxableAmount + discountAmount,
      //   grandTotal: response.Amount,
      // });
      setGrandDetails({
        ...grandDetails,
        discount: discountAmount,
        vat: vatAmount,
        taxable: taxableAmount,
        nonTaxable: nonTaxableAmount,
        TotalAmount: purchaseTotal,
        grandTotal: response.Amount,
      });
    } catch (e) {
      alert(e);
      errorMessage("Invalid import bill id.");
      history.push("/import-bill");
    }
  };

  const fetchPurchaseData = async() => {
    const response: IPurchase = await getPurchase(id);
    const getExciseDutyAmount = (itemRate: number, exciseDuty: number) => {
      if (exciseDuty === 0) {
        return 0.0;
      }
      const exciseDutyAmount = (itemRate * exciseDuty) / 100 + itemRate;
      return exciseDutyAmount;
    };


    const getAfterImportDuty = (grossRate:number,importDuty:number) => {
      const AfterImportDuty = grossRate + importDuty;
      return AfterImportDuty
    }

    const getVATAmount = (purchaseRate: number, taxRate:number) => {
      const VATAmount = (purchaseRate * taxRate) / 100

      return VATAmount;
    }

    const getAfterVatAmount = (itemRate: number, taxRate: number) => {
      const afterVatAmount = (itemRate * taxRate) / 100 + itemRate;

      return afterVatAmount;
    };

    const getTotalAmount = (itemRate: number, taxRate: number ,quantity:number) => {
      const totalAmount = ((itemRate *taxRate) / 100 + itemRate) * quantity

      return totalAmount;
  }

   await Promise.all(        
    response.PurchaseDetails.map((data,index) => {
      // console.log(data,"Test")
      let ExciseDuty = 0;
      ExciseDuty = data.ExciseDuty;

    const exciseDutyAmount = getExciseDutyAmount(
      data.PurchaseRate,
      data.ExciseDutyRate
    );
    let additionalProductCost: IAdditionalProductCost[] = [];

    let additionalLocalProductCost: IAdditionalProductCost[] = [];

    response.AccountTransactionValues.filter(
      (debitProductCost) =>
        debitProductCost.Credit === 0 &&
        debitProductCost.ProductId === data.InventoryItemId &&
        debitProductCost.IS_Product_Cost === true 

    ).map((debitProductCost) => {
      const creditProductCost = response.AccountTransactionValues.find(
        (credit) =>
          credit.Debit === 0 &&
          credit.Identifier === debitProductCost.Identifier &&
          credit.ProductId === data.InventoryItemId &&
          credit.IS_Product_Cost === true
      );

      additionalProductCost.push({
        CreditId: creditProductCost ? creditProductCost.AccountId : 0,
        DebitId: debitProductCost?.AccountId,
        BillTermId: debitProductCost?.BillTermId,
        CreditRefId: creditProductCost?.Id ? creditProductCost.Id : 0,
        DebitRefId: debitProductCost?.Id ? debitProductCost.Id : 0,
        // LedgerId: creditProductCost ? creditProductCost.Id : 0,
        Amount: debitProductCost.Debit,
        AddCost: debitProductCost.AddCost,
        // index:index,
      });
    }
    );

    response.AccountTransactionValues.filter(
      (debitProductCost) =>
        debitProductCost.Credit === 0 &&
        debitProductCost.ProductId === data.InventoryItemId &&
        debitProductCost.IS_Local_Cost === true 

    ).map((debitProductCost) => {
      const creditProductCost = response.AccountTransactionValues.find(
        (credit) =>
          credit.Debit === 0 &&
          credit.Identifier === debitProductCost.Identifier &&
          credit.ProductId === data.InventoryItemId &&
          credit.IS_Local_Cost === true
      );

      additionalLocalProductCost.push({
        CreditId: creditProductCost ? creditProductCost.AccountId : 0,
        DebitId: debitProductCost?.AccountId,
        BillTermId: debitProductCost?.BillTermId,
        CreditRefId: creditProductCost?.Id ? creditProductCost.Id : 0,
        DebitRefId: debitProductCost?.Id ? debitProductCost.Id : 0,
        // LedgerId: creditProductCost ? creditProductCost.Id : 0,
        Amount: debitProductCost.Debit,
        AddCost: debitProductCost.AddCost,
        // // index:index,
      });
    }
    );
    
    setAdditionalPurchaseDtl([{
      ...additionalPurchaseDtl,
      ExciseDuty: ExciseDuty,
      ExcriseDutyAmount: exciseDutyAmount,
      AfterVatAmount: getAfterVatAmount(data.PurchaseRate, data.TaxRate),
      AdditionalProductCost: additionalProductCost,
      AdditionalLocalProductCost: additionalLocalProductCost,
      VATAmount: getVATAmount(data.PurchaseRate, data.TaxRate),
      TotalPurchaseValue: getTotalAmount(data.PurchaseRate, data.TaxRate,data.Quantity),
      AfterImportDuty: getAfterImportDuty(data.GrossRate,data.ImportDuty),
      Quantity: data.Quantity,
    }]);

    // setAdditionalPurchaseDtl(prevState => [...prevState, newData]);

  }) 
  )
  // productData
}

  useEffect(() => {
    setData();
    fetchPurchaseData();
    
  }, [id]);


  useEffect(() => {
    console.log(purchaseData,"purchaseData")
    console.log(additionalPurchaseDtl,"Bibek")
    // const ok = additionalPurchaseDtl[0]?.ExciseDuty
    // console.log("ExciseDuty: ", ok )
  },[id])

  const getBranch = (id: number): string => {
    const branchName = branch?.find((data) => data.Id === id)
    return branchName ? branchName.NameEnglish : "";
  }

  const getWarehouse = (id: number): string => {
    const warehouseName = warehouse?.find((data) => data.Id === id)
    return warehouseName ? warehouseName.Name : "";
  }

  const getDepartment = (id: number): string => {
    const departmentName = department?.find((data) => data.Id === id)
    return departmentName ? departmentName.Name : "";
  }

  const getProductName = (id: number): string => {
    const productDetails = products.find((data) => data.Id === id);
    return productDetails ? productDetails.Name : "";
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
      <Box sx={{ mt: 3, width: "90%", mx: "auto" }}>
        <ViewHeader name="Import Bill Voucher" />

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

              <Typography sx={{ fontWeight: "500", mt: 1, fontSize: 15 }}>
                Warehouse:
                <Typography
                  display="inline"
                  sx={{ marginLeft: 1, fontSize: 14 }}
                >
                  {purchaseData && getWarehouse(purchaseData.WareHouseId)}
                </Typography>
              </Typography>

              <Typography sx={{ fontWeight: "500", mt: 1, fontSize: 15 }}>
                Pragyapan Patra Number:
                <Typography
                  display="inline"
                  sx={{ marginLeft: 1, fontSize: 14 }}
                >
                  {purchaseData && purchaseData.PragyapanPatraNo}
                </Typography>
              </Typography>

              <Typography sx={{ fontWeight: "500", mt: 1, fontSize: 15 }}>
                Exchange Rate:
                <Typography
                  display="inline"
                  sx={{ marginLeft: 1, fontSize: 14 }}
                >
                  {purchaseData && purchaseData.PurchaseDetails[0].CurrencyExchangeRate}
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

              <Typography sx={{ fontWeight: "500", mt:1, fontSize: 15 }}>
                Branch: 
                <Typography
                  display="inline"
                  sx={{ marginLeft: 1, fontSize: 14 }}
                >
                  {purchaseData &&
                    getBranch(purchaseData.BranchId)}
                </Typography>
              </Typography>

              <Typography sx={{ fontWeight: "500", mt:1, fontSize: 15 }}>
                Department: 
                <Typography
                  display="inline"
                  sx={{ marginLeft: 1, fontSize: 14 }}
                >
                  {purchaseData &&
                    getDepartment(purchaseData.DepartmentId)}
                </Typography>
              </Typography>

              <Typography sx={{ fontWeight: "500", mt:1, fontSize: 15 }}>
                LC/Draft No:
                <Typography
                  display="inline"
                  sx={{ marginLeft: 1, fontSize: 14 }}
                >
                  {purchaseData &&
                    purchaseData.DraftNo}
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
                <TableCell colSpan={5} >Particular</TableCell>
                <TableCell colSpan={6} sx={{ textAlign: "right" }}>Amount (Rs.)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
  
              {purchaseData &&
                purchaseData.PurchaseDetails.map((data, index) => {
                  return (
                    <>
                    <TableRow  key={index} >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell colSpan={5} >{getProductName(data.InventoryItemId)}</TableCell>
                      <TableCell colSpan={6} ></TableCell>
                    </TableRow>

                    <TableRow  key={index} >
                      <TableCell></TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>SourceRate</TableCell>
                      <TableCell>NPR Rate</TableCell>
                      <TableCell>Total NPR</TableCell>
                      <TableCell colSpan={6}  ></TableCell>
                    </TableRow>

                    <TableRow  key={index} >
                      <TableCell></TableCell>
                      <TableCell>{data.Quantity}</TableCell>
                      <TableCell>{data.PurchaseRate}</TableCell>
                      <TableCell>{data.ImportRate}</TableCell>
                      <TableCell>{data.ImportAmount}</TableCell>
                      <TableCell colSpan={6}></TableCell>
                    </TableRow>

                {additionalPurchaseDtl[0]?.AdditionalProductCost.length > 0 &&
                 (
                  <>
                  <TableRow key={index} >
                      <TableCell></TableCell>
                      <TableCell colSpan={5} >Add Cost Per Item</TableCell>
                      <TableCell colSpan={6} ></TableCell>
                    </TableRow>
                  </>
                )
                }

                {
                additionalPurchaseDtl[0]?.AdditionalProductCost.length > 0 &&
                additionalPurchaseDtl[0]?.AdditionalProductCost.map((data) => {
                  return(
                    <>
                    <TableRow key={index} >
                      <TableCell></TableCell>
                      <TableCell>BillTerm</TableCell>
                      <TableCell>Debit</TableCell>
                      <TableCell>Credit</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell colSpan={6} ></TableCell>
                    </TableRow>

                    <TableRow key={index} >
                      <TableCell></TableCell>
                      <TableCell>{data.BillTermId}</TableCell>
                      <TableCell>{data.DebitId}</TableCell>
                      <TableCell>{data.CreditId}</TableCell>
                      <TableCell>{data.Amount}</TableCell>
                      <TableCell colSpan={6} ></TableCell>
                    </TableRow>

                    <TableRow>
                    <TableCell></TableCell>
                    <TableCell>AddToCost</TableCell>
                    <TableCell>Avg Rate</TableCell>
                    <TableCell colSpan={5} ></TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>{data.AddCost ? `true` : `false` }</TableCell>
                      { data.AddCost ? <TableCell>{data.Amount / additionalPurchaseDtl[0].Quantity}</TableCell> :
                      <TableCell>0</TableCell>
                      }
                      <TableCell colSpan={5} ></TableCell>
                    </TableRow>

                    {/* <TableRow key={index} ></TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell> */}

                    </>
                  )
                })
                }   
                    <TableRow   >
                      <TableCell></TableCell>
                      <TableCell>Gross Rate</TableCell>
                      <TableCell>Import Duty Rate</TableCell>
                      <TableCell>Import Duty Amount</TableCell>
                      <TableCell>After Import Rate</TableCell>
                      <TableCell colSpan={6}  ></TableCell>
                    </TableRow>

                    <TableRow   >
                      <TableCell></TableCell>
                      <TableCell>{data.GrossRate}</TableCell>
                      <TableCell>{data.ImportDutyRate}</TableCell>
                      <TableCell>{data.ImportDuty}</TableCell>
                      <TableCell>{additionalPurchaseDtl[index]?.AfterImportDuty}</TableCell>
                      <TableCell colSpan={6} ></TableCell>
                    </TableRow>

                    <TableRow   >
                      <TableCell></TableCell>
                      <TableCell>Excise Duty Rate</TableCell>
                      <TableCell>Excise Duty Amount</TableCell>
                      <TableCell>After Excise Duty</TableCell>
                      <TableCell>Net Purchase Rate</TableCell>
                      <TableCell colSpan={6} ></TableCell>
                    </TableRow>

                    <TableRow   >
                      <TableCell></TableCell>
                      <TableCell>{data.ExciseDutyRate}</TableCell>
                      <TableCell>{data.ExciseDuty}</TableCell>
                      <TableCell>{data.GrossAmount}</TableCell>
                      <TableCell>{data.PurchaseRate}</TableCell>
                      <TableCell colSpan={6} ></TableCell>
                    </TableRow>
                   
  
               {
                 additionalPurchaseDtl[0]?.AdditionalLocalProductCost.length > 0 &&
                 additionalPurchaseDtl[0]?.AdditionalLocalProductCost.map((data,index) => {
                  return(
                    <>
                    <TableRow key={index} >
                      <TableCell></TableCell>
                      <TableCell colSpan={5} >Local Add Cost Per Item</TableCell>
                      <TableCell colSpan={6} ></TableCell>
                    </TableRow>

                    <TableRow key={index} >
                      <TableCell></TableCell>
                      <TableCell>BillTerm</TableCell>
                      <TableCell>Debit</TableCell>
                      <TableCell>Credit</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>AddToCost</TableCell>
                      
                      <TableCell></TableCell>
                    </TableRow>

                    <TableRow key={index} >
                      <TableCell></TableCell>
                      <TableCell>{data.BillTermId}</TableCell>
                      <TableCell>{data.DebitId}</TableCell>
                      <TableCell>{data.CreditId}</TableCell>
                      <TableCell>{data.Amount}</TableCell>
                      <TableCell>{data.AddCost ? `true` : `false` }</TableCell>
                      
                      <TableCell></TableCell>
                    </TableRow>
                    </>
                  )
                 }
                 )
              }
              </>  
                );  
            })}

              {grandDetails.taxable === 0 ? (
                ""
              ) : (
                <TableRow>
                  <TableCell colSpan={6}></TableCell>
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
                  <TableCell colSpan={6}></TableCell>
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
                  <TableCell colSpan={6}></TableCell>
                  <TableCell sx={{ fontWeight: "500", textAlign: "right" }}>
                    Vat:{" "}
                    <Typography sx={{ display: "inline" }}>
                      {grandDetails.vat.toFixed(2)}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {/* {transactionValues.map((data, index) => {
                  if (data.name !== "Excise Duty") {
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
                })} */}

              <TableRow>
                <TableCell colSpan={6}></TableCell>
                <TableCell sx={{ fontWeight: "500", textAlign: "right" }}>
                  GrandTotal:{" "}
                  <Typography sx={{ display: "inline" }}>
                    {grandDetails.grandTotal}
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
