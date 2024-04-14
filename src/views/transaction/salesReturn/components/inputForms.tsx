import {
  Autocomplete,
  Grid,
  IconButton,
  Paper,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { useHistory } from "react-router";
import { useAppSelector } from "../../../../app/hooks";
import { selectCompany } from "../../../../features/companySlice";
import { getCurrentFinancialYear } from "../../../../features/financialYearSlice";
import { selectUser } from "../../../../features/userSlice";
import { ISelectType } from "../../../../interfaces/autoComplete";

import { IOnSubmit } from "../../../../interfaces/event";

import {
  IAccountHolder,
  IPurchaseMenu,
} from "../../../../interfaces/purchaseOrder";
import { IProductSalesReturn, ISalesReturn } from "../../../../interfaces/salesReturn";

import {
  getAllAccountHolder,
  getAllPurchase,
} from "../../../../services/purchaseOrderApi";

import {
  CloseButton,
  DeleteButton,
  SaveButton,
  UpdateButton,
} from "../../../../utils/buttons";
import InputField from "../../../../utils/customTextField";
import {
  deleteMessage,
  editMessage,
  errorMessage,
  successMessage,
} from "../../../../utils/messageBox/Messages";
import { getNepaliDate } from "../../../../utils/nepaliDate";
import {
  addSalesReturn,
  deleteSalesReturn,
  editSalesReturn,
  getAllItems,
  getRefNo,
  getSalesReturn,
} from "../../../../services/salesReturnApi";
import { Box } from "@mui/system";
import handleRenderOption from "../../../../utils/autoSuggestHighlight";
import { DeleteDialog, SaveProgressDialog } from "../../../../components/dialogBox";
import Ledgerbycus from "../../../../components/showRemain/ledgerbycus";
import { checkDate } from "../../components/helperFunctions";

interface IProps {
  paramID: string;
}
const InputForms = ({ paramID }: IProps) => {
  const [accountHolder, setAccountHolder] = useState<ISelectType[]>([]);
  const [products, setProducts] = useState<ISelectType[]>([]);
  const [RefNo, setRefNo] = useState<ISelectType[]>([]);

  const [Qty, setQty] = useState<any[]>([]);
  const [totalExciseDuty, setTotalExciseDuty] = useState<number>(0);
  const [totalVat, setTotalVat] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [totalTaxable, setTotalTaxable] = useState<number>(0);
  const [totalNonTaxable, setTotalNonTaxable] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalgrandAmount, setTotalGrandAmount] = useState<number>(0);
  const [toalwithoutdsc, setTotalWithOutDsc] = useState<number>(0);

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [allSalesReturn, setAllSalesReturn] = useState<ISalesReturn>();
  const [salesReturnDesc, setSalesReturnDesc] = useState<any>("");

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);

  const history = useHistory();

  const companyData = useAppSelector((state) => state.company.data.Id);
  const FinancialYear = useAppSelector(getCurrentFinancialYear);
  const startDate = useAppSelector((state) => state.financialYear.NepaliStartDate);
  const endDate = useAppSelector((state) => state.financialYear.NepaliEndDate);
  const userDetail = useAppSelector(selectUser);

  const [otherDetails, setOtherDetails] = useState<any>({
    customerId: 0,
    refNo: 0,
    date: getNepaliDate(),
  });
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName)

  const [selectedCustomerId, setSelectedCustomerId] = useState<number>(0);

  useEffect(() => {
    const loadData = async () => {
      if(loginedUserRole.includes("SRAdd") && paramID === "add"){
          return;
      }else if(loginedUserRole.includes("SREdit") && paramID !== "add"){
        const res: any = await getSalesReturn(paramID);
        if (res.Id > 0) {
          setAllSalesReturn(res);
          setAllProducts(res.SalesOrderDetails.map((item: any) => {
            return{
              BranchId: item.BranchId,
              DepartmentId: item.DepartmentId,
              Discount: item.Discount,
              FinancialYear: item.FinancialYear,
              Id: item.Id,
              IsSelected: item.IsSelected,
              IsVoid: item.IsVoid,
              ItemId: item.ItemId,
              ItemName: item.ItemName,
              MRPPrice: item.MRPPrice,
              OrderDescription: item.OrderDescription,
              OrderId: item.OrderId,
              OrderNumber: item.OrderNumber,
              Qty: item.Qty < 0 ? item.Qty * -1 : item.Qty,
              Tags: item.Tags,
              TaxRate: item.TaxRate,
              TotalAmount: item.TotalAmount,
              UnitPrice: item.UnitPrice,
              UnitType: item.UnitType,
              UserId: item.UserId,
              WarehouseId: item.WarehouseId,
              ExciseDuty: item.ExciseDuty,
              CompanyCode: item.CompanyCode,
            }
          }));
          setSalesReturnDesc(res.Description)
          setOtherDetails({
            customerId: res.SourceAccountTypeId,
            refNo: res.ref_invoice_number,
            date: getNepaliDate()
          });
        }
        else {
          errorMessage();
          history.push("/sales-return");
        }
      }else{
        history.push("/sales-return");
        errorMessage("Sorry! permission is denied");
      }
    };
    const getAccountHolderData = async () => {
      const res: IAccountHolder[] = await getAllAccountHolder();
      setAccountHolder(
        res.map((item) => {
          return { label: item.Name, value: item.Id };
        })
      );
    };

    const getPurchases = async () => {
      const res: IPurchaseMenu[] = await getAllPurchase();
      setProducts(
        res.map((item) => {
          return { label: item.Name, value: item.Id };
        })
      );
    };
    loadData();
    getAccountHolderData();
    getPurchases();
  }, []);

  useEffect(() => {
    const refNo = async () => {
      const res: any = await getRefNo(
        otherDetails.customerId,
        FinancialYear.Name
      );
      setRefNo(
        res.map((item: any) => {
          return { label: item.Id, value: item.Id };
        })
      );
    };
    refNo();
  }, [otherDetails.customerId]);

  useEffect(() => {
    const getAllItemms = async () => {
      const res: IProductSalesReturn[] = await getAllItems(
        otherDetails.customerId,
        otherDetails.refNo,
        FinancialYear.Name
      );
      setQty(res.map((item: any)=>{
        return{
          qty: item.Qty,
        }
      }));
      if (paramID === "add"){
        setAllProducts(res.map((item: any) => {
          return{
            BranchId: item.BranchId,
            DepartmentId: item.DepartmentId,
            Discount: item.Discount,
            FinancialYear: item.FinancialYear,
            Id: item.Id,
            IsSelected: item.IsSelected,
            IsVoid: item.IsVoid,
            ItemId: item.ItemId,
            ItemName: item.ItemName,
            MRPPrice: item.MRPPrice,
            OrderDescription: item.OrderDescription,
            OrderId: item.OrderId,
            OrderNumber: item.OrderNumber,
            Qty: item.Qty < 0 ? item.Qty * -1 : item.Qty,
            Tags: item.Tags,
            TaxRate: item.TaxRate,
            TotalAmount: item.TotalAmount,
            UnitPrice: item.UnitPrice,
            UnitType: item.UnitType,
            UserId: item.UserId,
            WarehouseId: item.WarehouseId,
            ExciseDuty: item.ExciseDuty,
            CompanyCode: item.CompanyCode,
          }
        }));
      }
    };
    getAllItemms();
  }, [otherDetails.refNo, otherDetails.customerId]);

  useEffect(() => {
    let exciseTotal = 0;
    allProducts.forEach((elmt) => {
      exciseTotal += ((elmt.ExciseDuty / 100) * elmt.UnitPrice) * elmt.Qty;
    });
    setTotalExciseDuty(exciseTotal);
  },[allProducts]);
  useEffect(() => {
    let vatTotal = 0;
    allProducts.forEach((elmt) => {
      const ExcriseDutyAmount = ((elmt.ExciseDuty / 100) * elmt.UnitPrice)+ elmt.UnitPrice;
      if(elmt.ExciseDuty > 0){
        vatTotal += ((elmt.TaxRate / 100) * ExcriseDutyAmount) * elmt.Qty
      }else{
      vatTotal += ((elmt.TaxRate / 100) * elmt.UnitPrice) * elmt.Qty;
      }
    });
    setTotalVat(vatTotal);
  },[allProducts]);
  useEffect(() => {
    let taxableTotal = 0;
    let nontaxableTotal = 0;
    allProducts.forEach((elmt) => {
      if(elmt.TaxRate > 0){
        taxableTotal += elmt.Qty * elmt.UnitPrice;
      }else{
        nontaxableTotal += elmt.Qty * elmt.UnitPrice;
      }
    });
    setTotalTaxable(taxableTotal);
    setTotalNonTaxable(nontaxableTotal);
  },[allProducts]);
  useEffect(() => {
    let total = 0;
    allProducts.forEach((elmt) => {
      total += elmt.Qty * elmt.UnitPrice;
    });
    setTotalAmount(total);
  },[allProducts]);
  useEffect(() => {
    let discounttotal = 0;
    allProducts.forEach((elmt) => {
      discounttotal += elmt.Discount;
    });
    setDiscount(discounttotal);
  },[allProducts]);
  useEffect(() => {
    let total = 0;
    let exciseTotal = 0;
    let vatTotal = 0;
    let discounttotal = 0;
    let grandtotal = 0;
    let totals = 0;
    allProducts.forEach((elmt) => {
      const ExcriseDutyAmount = ((elmt.ExciseDuty / 100) * elmt.UnitPrice)+ elmt.UnitPrice;
      if(elmt.ExciseDuty > 0){
        vatTotal += ((elmt.TaxRate / 100) * ExcriseDutyAmount) * elmt.Qty
      }else{
      vatTotal += ((elmt.TaxRate / 100) * elmt.UnitPrice) * elmt.Qty;
      }
      exciseTotal += ((elmt.ExciseDuty / 100) * elmt.UnitPrice) * elmt.Qty;
      discounttotal += elmt.Discount;
      total += elmt.Qty * elmt.UnitPrice;

      grandtotal = total - discounttotal + exciseTotal + vatTotal;
      totals = total + exciseTotal + vatTotal;
    });
    setTotalGrandAmount(grandtotal);
    setTotalWithOutDsc(totals);
  },[allProducts]);

  const accountHolderValue =
    accountHolder &&
    accountHolder.find((obj) => obj.value === otherDetails.customerId);

  const refNoValue =
    RefNo && RefNo.find((obj) => obj.value === otherDetails.refNo);

  const addRowHandler = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    let list = [...allProducts];
    let lists = [...Qty];
    let name = e.target.name;
    let value = e.target.value;
    switch (name) {
      case "Qty":
        list[i]["Qty"] = value;
        if(list[i]["Qty"] > lists[i].qty){
          errorMessage("Not more than " + lists[i].qty);
          list[i]["Qty"] = 0;
          break;
        }
        else{
          list[i]["Qty"] = value;
          list[i]["TotalAmount"] = list[i]["Qty"] * list[i]["UnitPrice"];
          break;
        }
    }
    setAllProducts(list);
  };

  const deleteNewRow = async (e: any, id: number) => {
    if(allProducts.length > 0){
      const lists = [...allProducts];
      lists.splice(id, 1);
      setAllProducts(lists);
    }else{
      errorMessage("not to delete");
    }
  };

  const getGrandTotal: any =
    allProducts.length > 0 &&
    allProducts.reduce((sum, { TotalAmount }) => sum + TotalAmount, 0);

  const getDiscount: number =
    allProducts.length > 0 &&
    allProducts.reduce((sum, { Discount }) => sum + Discount, 0);

  const onSubmitHandler = async (e: IOnSubmit) => {
    e.preventDefault();
    const currentNepaliData = getNepaliDate();
    const validDate = await checkDate(otherDetails.date, startDate, endDate);
    if (validDate) {
      if (
        otherDetails.date !== null &&
        otherDetails.date > currentNepaliData
      ) {
        errorMessage("Invalid sales return date.");
        return;
      }

      if (paramID === "add") {
        setOpenSaveDialog(true);
        let data: ISalesReturn = {
          PurchaseDetails: null,
          SalesOrderDetails: allProducts,
          AccountTransactionValues: [],
          Id: 0,
          Name: "Credit Note",
          // Amount: getGrandTotal,
          Amount: totalAmount,
          // Discount: getDiscount,
          Discount: discount,
          PercentAmount: 0,
          NetAmount: 0,
          //VATAmount: totalTaxable,
          VATAmount: totalVat,
          GrandAmount: totalgrandAmount,
          IsDiscountPercentage: false,
          Date: otherDetails.date,
          NVDate: "",
          ExchangeRate: 0,
          ExciseDuty: totalExciseDuty,
          AccountTransactionDocumentId: 0,
          AccountTransactionTypeId: 0,
          SourceAccountTypeId: otherDetails.customerId,
          TargetAccountTypeId: 0,
          Description: salesReturnDesc,
          IsReversed: false,
          Reversable: false,
          FinancialYear: FinancialYear.Name,
          UserName: userDetail.UserName,
          ref_invoice_number: otherDetails.refNo,
          IRD_Status_Code:"", 
          Sync_With_IRD: false,
          IS_Bill_Printed: false,
          IS_Bill_Active: false,
          Printed_Time: "",
          Real_Time: false,
          CompanyCode: companyData,
          PhoteIdentity: null,
          IdentityFileName: null,
          IdentityFileType: null,
          VehicleNo: "",
          VehicleLength: null,
          VehicleWidth: null,
          VehicleHeight: null,
        };
        if (data.ref_invoice_number === 0) {
          setOpenSaveDialog(false);
          errorMessage("Please select Ref No...");
        } else {
          const res = await addSalesReturn(
            otherDetails.customerId,
            FinancialYear.Name,
            data
          );
          if (res) {
            setOpenSaveDialog(false);
            successMessage();
            history.push("/sales-return");
          } else {
            setOpenSaveDialog(false);
            errorMessage();
          }
        }
      } else {
        setOpenSaveDialog(true);
        let data: any = {
          ...allSalesReturn,
          SalesOrderDetails: allProducts,
          AccountTransactionValues: [],
          Amount: totalAmount,
          Discount: discount,
          VATAmount: totalTaxable,
          GrandAmount: totalgrandAmount,
          Date: otherDetails.date,
          ExciseDuty: totalExciseDuty,
          SourceAccountTypeId: otherDetails.customerId,
          Description: salesReturnDesc,
          FinancialYear: FinancialYear.Name,
          UserName: userDetail.UserName,
          ref_invoice_number: otherDetails.refNo,
          Real_Time: false,
          CompanyCode: companyData,
        };
        const res = await editSalesReturn(paramID, data);
        if (res) {
          setOpenSaveDialog(false);
          editMessage();
          history.push("/sales-return");
        } else {
          setOpenSaveDialog(false);
          errorMessage();
        }
      }
    }
  };

  const deleteUserConfirm = async () => {
    setOpenDialog(false);
    const res = await deleteSalesReturn(allProducts);
    if (res) {
      deleteMessage();
      history.push("purchase-order");
    } else {
      errorMessage();
    }
  };

  const onChangeHandlerSelect = (value: number) => {
    setOtherDetails({ ...otherDetails, customerId: value, refNo: 0 });
    setSelectedCustomerId(value);
  }

  const handleDesc = (e: any) => {
    setSalesReturnDesc(e.target.value);
  }

  return (
    <>
      <Paper
        component="form"
        autoComplete="off"
        onSubmit={onSubmitHandler}
        sx={{ p: 2 }}
      >
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={2}>
            <TextField
              label="Voucher Type"
              size="small"
              fullWidth
              value={"Credit Note"}
            />
          </Grid>
          {selectedCustomerId
            ? 
            <Grid item xs={12} md={4}>
              <Autocomplete
                disablePortal
                options={accountHolder}
                onChange={(e, v) =>
                  onChangeHandlerSelect(v.value)
                }
                isOptionEqualToValue={(option, value) =>
                  option.label === value.label 
                }
                value={accountHolderValue ? accountHolderValue.label : ""}
                disableClearable
                renderInput={(params) => (
                  <TextField
                    autoFocus
                    {...params}
                    error={!otherDetails.customerId}
                    label="Customer"
                    variant="outlined"
                    size="small"
                    required
                    fullWidth
                    helperText="Select Customer"
                  />
                )}
                renderOption={handleRenderOption}//add this
              />
            </Grid>
            :
            <Grid item xs={12} md={6}>
              <Autocomplete
                disablePortal
                options={accountHolder}
                onChange={(e, v) =>
                  onChangeHandlerSelect(v.value)
                }
                isOptionEqualToValue={(option, value) =>
                  option.label === value.label 
                }
                value={accountHolderValue ? accountHolderValue.label : ""}
                disableClearable
                renderInput={(params) => (
                  <TextField
                    autoFocus
                    {...params}
                    error={!otherDetails.customerId}
                    label="Customer"
                    variant="outlined"
                    size="small"
                    required
                    fullWidth
                    helperText="Select Customer"
                  />
                )}
                renderOption={handleRenderOption}//add this
              />
            </Grid>
          }
          
          {selectedCustomerId
            ? 
            <Grid item xs={12} md={2}>
              <Ledgerbycus cusID = {selectedCustomerId}/>
            </Grid>
            :
            ""
          }

          <Grid item xs={6} md={2}>
            <Autocomplete
              disablePortal
              options={RefNo ? RefNo : []}
              onChange={(e, v) =>
                setOtherDetails({ ...otherDetails, refNo: v.value })
              }
              isOptionEqualToValue={(option, value) =>
                option.label === value.label
              }
              value={refNoValue ? refNoValue?.value :otherDetails.refNo}
              disableClearable
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={!otherDetails.refNo}
                  label="Ref No"
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                  helperText="Select Ref No"
                />
              )}
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <TextField
              fullWidth
              label="Date"
              value={otherDetails.date? otherDetails.date: getNepaliDate()}
              size="small"
              onChange={(e) => 
                setOtherDetails({...otherDetails, date: e.target.value})
              }
            />
          </Grid>
        </Grid>
        {/* <RowHeaderSalesReturn /> */}

        {allProducts?.map((elm, i) => {
          const productValue =
            products && products.find((obj) => obj.value === elm.ItemId);
          return (
            <>
            <Grid
              container
              spacing={1}
              sx={{
                mx: "auto",
                mt: 3,
                display: "flex",
                justifyContent: "end",
              }}
            >
              <Grid sm={12} item>
                <TextField
                  value={productValue?.label ? productValue.label : ""}
                  label="Product"
                  size="small"
                  fullWidth
                  required
                />
              </Grid>
              <Grid xs item sx={{ marginTop: 2 }}>
                <InputField
                  helperText="Enter Quantity"
                  label="Quantity"
                  name="Qty"
                  type="number"
                  required
                  value={elm.Qty ? Math.abs(elm.Qty) : ""}
                  onChange={(e) => addRowHandler(e, i)}
                />
              </Grid>
              <Grid xs item sx={{ marginTop: 2 }}>
                <TextField
                  label="Rate"
                  fullWidth
                  type="number"
                  size="small"
                  value={elm.UnitPrice}
                />
              </Grid>
              <Grid xs item sx={{ marginTop: 2 }}>
                <TextField
                  label="Excise Duty"
                  fullWidth
                  type="number"
                  size="small"
                  value={(((elm.ExciseDuty/100)*elm.UnitPrice)+elm.UnitPrice).toFixed(2)}
                />
              </Grid>
              <Grid xs item sx={{ marginTop: 2 }}>
                <TextField
                  label="VAT Amount"
                  fullWidth
                  type="number"
                  size="small"
                  value={
                    elm.ExciseDuty > 0 ?
                    ((elm.TaxRate/100)*(((elm.ExciseDuty/100)*elm.UnitPrice)+elm.UnitPrice)+((elm.ExciseDuty/100)*elm.UnitPrice)+elm.UnitPrice).toFixed(2) :
                    (((elm.TaxRate/100)*elm.UnitPrice) + elm.UnitPrice).toFixed(2)
                  }
                />
              </Grid>
              <Grid xs item sx={{ marginTop: 2 }}>
                <TextField
                  size="small"
                  fullWidth
                  label="Total Amount"
                  type="number"
                  value={
                    parseInt(elm.Qty) * elm.UnitPrice
                      ? Math.abs(parseInt(elm.Qty) * elm.UnitPrice).toFixed(2)
                      : "0"
                  }
                />
              </Grid>
              <Grid item sx={{ marginTop: 2 }}>
                <Box>
                  {allProducts.length > 1 ? (
                    <IconButton color="error">
                      <RiDeleteBack2Fill
                        onClick={(e) => deleteNewRow(e, i)}
                        style={{ cursor: "pointer" }}
                      />
                    </IconButton>
                  ) : (
                    ""
                  )}
                </Box>
                
              </Grid>
            </Grid>
            </>
          );
        })}

        <Grid container spacing={2} sx={{ mt: 2}} justifyContent="flex-end" >
          <Grid xs={12} item md={2} >
            <TextField
              label="Taxable Amount"
              size="small"
              required
              fullWidth
              value={totalTaxable.toFixed(2)}
            />
          </Grid>
          <Grid item md={2}>
            <TextField
              label="Non Taxable Amount"
              size="small"
              required
              fullWidth
              value={totalNonTaxable.toFixed(2)}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mt: 0.3}} justifyContent="flex-end" >
          <Grid item md={2}>
            <TextField
              label="Total Amount"
              size="small"
              required
              fullWidth
              value={totalAmount.toFixed(2)}
            />
          </Grid>
          <Grid item md={2}>
            <TextField
              label="Excies Duty Amount"
              size="small"
              required
              fullWidth
              value={totalExciseDuty.toFixed(2)}
            />
          </Grid>
          <Grid item md={2}>
            <TextField
              label="Tax Amount"
              size="small"
              required
              fullWidth
              value={totalVat.toFixed(2)}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mt: 0.3}} justifyContent="flex-end" >
          <Grid item md={2}>
            <TextField
              label="Grand Total"
              size="small"
              required
              fullWidth
              value={totalgrandAmount.toFixed(2)}
            />
          </Grid>
        </Grid>
        <Grid item sx={{ mt: 3 }}>
          <TextField
            label="Sales Return  description"
            placeholder="Sales Return description..."
            fullWidth={true}
            multiline={true}
            rows={2}
            value={salesReturnDesc}
            onChange={(e) => handleDesc(e)}
          />
        </Grid>

        <Grid item xs={12} sx={{ textAlign: "end", my: 3 }}>
          {paramID === "add" ? (
            <SaveButton variant="outlined" />
          ) : (
            <>
              <UpdateButton variant="outlined" />
              {
                loginedUserRole.includes("SRDelete")?
                <DeleteButton
                variant="outlined"
                onClick={(e) => setOpenDialog(true)}
              />:
              ""
              }
              
            </>
          )}

          <CloseButton variant="outlined" />
        </Grid>

        <DeleteDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          name={`Sales Return`}
          deleteData={deleteUserConfirm}
        />
        <SaveProgressDialog
        openDialog={openSaveDialog}
        setOpenDialog={setOpenSaveDialog}
        name={"Saving ..."}
      />
      </Paper>
    </>
  );
};

export default InputForms;


