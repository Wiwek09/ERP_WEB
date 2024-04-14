import {
  Autocomplete,
  Grid,
  IconButton,
  Paper,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { useHistory, useParams } from "react-router";
import { useAppSelector } from "../../../../app/hooks";
import { DeleteDialog, SaveProgressDialog } from "../../../../components/dialogBox";
import { getCurrentFinancialYear } from "../../../../features/financialYearSlice";
import { selectUser } from "../../../../features/userSlice";
import { ISelectType } from "../../../../interfaces/autoComplete";

import { IOnSubmit } from "../../../../interfaces/event";
import { IParams } from "../../../../interfaces/params";
import { IAdditionalPurchaseDtl, IPurchase } from "../../../../interfaces/purchase";

import {
  IAccountHolder,
  IPurchaseMenu,
} from "../../../../interfaces/purchaseOrder";
import {IAllAccountTransactionValue, IAllPurchaseDetail, IVoucher } from "../../../../interfaces/purchaseReturn";
import { getPurchase } from "../../../../services/purchaseApi";

import {
  getAllAccountHolder,
  getAllPurchase,
} from "../../../../services/purchaseOrderApi";
import {
  addPurchaseReturn,
  deletePurchaseReturn,
  editPurchaseReturn,
  getAllItems,
  getPurchaseReturn,
  getRefNo,
} from "../../../../services/purchaseReturnApi";
import handleRenderOption from "../../../../utils/autoSuggestHighlight";

import {
  CloseButton,
  DeleteButton,
  SaveButton,
  UpdateButton,
} from "../../../../utils/buttons";
import InputField from "../../../../utils/customTextField";
import {
  editMessage,
  errorMessage,
  successMessage,
} from "../../../../utils/messageBox/Messages";
import { getNepaliDate } from "../../../../utils/nepaliDate";

import RowHeaderPurchaseReturn from "./rowHeader";

import Ledgerbycus from "../../../../components/showRemain/ledgerbycus";
import { checkDate } from "../../components/helperFunctions";

interface IProps {
  paramID: string;
}
const initialAdditionalPurchaseDtl: IAdditionalPurchaseDtl = {
  branch: 0,
  warehouse: 0,
  department: 0,
  voucherType: "",
  invoiceNo: "",
  voucherDate: getNepaliDate(),
  customer: 0,
  description: "",
};
const getVoucherType = (name: string): string => {
  let type = "";
  let endPosition = name.search("#");
  for (let index = 0; index < endPosition - 1; index++) {
    type += name[index];
  }

  return type.trim();
};

const InputForms = ({ paramID }: IProps) => {
  const [accountHolder, setAccountHolder] = useState<ISelectType[]>([]);
  const { id }: IParams = useParams();
  const [products, setProducts] = useState<ISelectType[]>([]);
  const [Qty, setQty] = useState<any[]>([]);
  const [RefNo, setRefNo] = useState<ISelectType[]>([]);
  const [totalExciseDuty, setTotalExciseDuty] = useState<number>(0);
  const [totalVat, setTotalVat] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [totalTaxable, setTotalTaxable] = useState<number>(0);
  const [totalNonTaxable, setTotalNonTaxable] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalgrandAmount, setTotalGrandAmount] = useState<number>(0);
  const [toalwithoutdsc, setTotalWithOutDsc] = useState<number>(0);
  const [vatAmount, setVatAmount] = useState<any[]>([]);

const [additionalPurchaseDtl, setAdditionalPurchaseDtl] =
    useState<IAdditionalPurchaseDtl>(initialAdditionalPurchaseDtl);

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [allPurchaseReturn, setAllPurchaseAccount] = useState<IAllAccountTransactionValue[]>([]);

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);

  const history = useHistory();

  const companyData = useAppSelector((state) => state.company.data.Id);
  const FinancialYear = useAppSelector(getCurrentFinancialYear);
  const startDate = useAppSelector((state) => state.financialYear.NepaliStartDate);
  const endDate = useAppSelector((state) => state.financialYear.NepaliEndDate);
  const userDetail = useAppSelector(selectUser);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName)

  const [otherDetails, setOtherDetails] = useState<any>({
    customerId: 0,
    refNo: 0,
    date: getNepaliDate()
  });

  const [selectedCustomerId, setSelectedCustomerId] = useState<number>(0);

  useEffect(() => {
    const loadData = async () => {
      if(loginedUserRole.includes("PRAdd") && paramID === "add"){
        return;
      }
      else if(loginedUserRole.includes("PREdit") && paramID !== "add"){
        const res: any = await getPurchaseReturn(paramID);
        setAllPurchaseAccount(res);
        setAllProducts(res.PurchaseDetails.map((vla: any)=> {
          return{
            PurchaseId: vla.PurchaseId,
            AccountTransactionId: vla.AccountTransactionId,
            AccountTransactionDocumentId: vla.AccountTransactionDocumentId,
            Quantity: vla.Quantity < 0 ? vla.Quantity * -1 : vla.Quantity,
            PurchaseRate: vla.PurchaseRate,
            PurchaseAmount: vla.PurchaseAmount,
            MRPPrice: vla.MRPPrice,
            Discount: vla.Discount,
            TaxRate: vla.TaxRate,
            ExciseDuty: vla.ExciseDuty,
            UnitType: vla.UnitType,
            CostPrice: vla.CostPrice,
            InventoryItemId: vla.InventoryItemId,
            FinancialYear: vla.FinancialYear,
            CompanyCode: vla.CompanyCode,
            DepartmentId: vla.DepartmentId,
            WareHouseId: vla.WareHouseId,
            BranchId: vla.BranchId,
            NepaliMonth: vla.NepaliMonth,
            NVDate: vla.NVDate,
            UserName: vla.UserName,
          }
        }));
        setOtherDetails({
          customerId: res.SourceAccountTypeId,
          refNo: res.ref_invoice_number,
          date: getNepaliDate()
        });
      }
      else{
        history.push("/purchase-return");
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
      const res: IAllPurchaseDetail[] = await getAllItems(
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
            PurchaseId: item.PurchaseId, //
            AccountTransactionId: item.AccountTransactionId,
            AccountTransactionDocumentId: item.AccountTransactionDocumentId,
            Quantity: item.Quantity,
            PurchaseRate: item.PurchaseRate,
            PurchaseAmount: item.PurchaseAmount,
            MRPPrice: item.MRPPrice,
            Discount: item.Discount,
            TaxRate: item.TaxRate,
            ExciseDuty: item.ExciseDuty,
            UnitType: item.UnitType,
            CostPrice: item.CostPrice,
            InventoryItemId: item.InventoryItemId,
            FinancialYear: item.FinancialYear,
            CompanyCode: item.CompanyCode,
            DepartmentId: item.DepartmentId,
            WareHouseId: item.WareHouseId,
            BranchId: item.BranchId,
            NepaliMonth: item.NepaliMonth,
            NVDate: item.NVDate,
            UserName: item.UserName,
            CurrentStock: item.CurrentStock,            
          }
        }));
      }
    };
    getAllItemms();
  }, [otherDetails.refNo, otherDetails.customerId]);

  useEffect(() => {
    let exciseTotal = 0;
    allProducts.forEach((elmt) => {
      exciseTotal += ((elmt.ExciseDuty / 100) * elmt.PurchaseRate) * elmt.Quantity;
    });
    setTotalExciseDuty(exciseTotal);
  },[allProducts]);
  useEffect(() => {
    let vatTotal = 0;
    allProducts.forEach((elmt) => {
      const ExcriseDutyAmount = ((elmt.ExciseDuty / 100) * elmt.PurchaseRate)+ elmt.PurchaseRate;
      if(elmt.ExciseDuty > 0){
        vatTotal += ((elmt.TaxRate / 100) * ExcriseDutyAmount) * elmt.Quantity
      }else{
      vatTotal += ((elmt.TaxRate / 100) * elmt.PurchaseRate) * elmt.Quantity;
      }
    });
    setTotalVat(vatTotal);
  },[allProducts]);

  useEffect(() => {
    let taxableTotal = 0;
    let nontaxableTotal = 0;
    allProducts.forEach((elmt) => {
      if(elmt.TaxRate > 0){
        taxableTotal += elmt.Quantity * elmt.PurchaseRate;
      }else{
        nontaxableTotal += elmt.Quantity * elmt.PurchaseRate;
      }
    });
    setTotalTaxable(taxableTotal);
    setTotalNonTaxable(nontaxableTotal);
  },[allProducts]);

  useEffect(() => {
    let total = 0;
    allProducts.forEach((elmt) => {
      total += elmt.Quantity * elmt.PurchaseRate;
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
      const ExcriseDutyAmount = ((elmt.ExciseDuty / 100) * elmt.PurchaseRate)+ elmt.PurchaseRate;
      if(elmt.ExciseDuty > 0){
        vatTotal += ((elmt.TaxRate / 100) * ExcriseDutyAmount) * elmt.Quantity
      }else{
      vatTotal += ((elmt.TaxRate / 100) * elmt.PurchaseRate) * elmt.Quantity;
      }
      exciseTotal += ((elmt.ExciseDuty / 100) * elmt.PurchaseRate) * elmt.Quantity;
      discounttotal += elmt.Discount;
      total += elmt.Quantity * elmt.PurchaseRate;

      grandtotal = total - discounttotal + exciseTotal + vatTotal;
      totals = total + exciseTotal + vatTotal;
    });
    setTotalGrandAmount(grandtotal);
    setTotalWithOutDsc(totals);
  },[allProducts])
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
        list[i]["Quantity"] = value;
        if(list[i]["Quantity"] > lists[i].qty){
          errorMessage("Not more than " + lists[i].qty);
          list[i]["Quantity"] = 0;
          break;
        }
        else{
          list[i]["Quantity"] = value;
          list[i]["PurchaseAmount"] = list[i]["Quantity"] * list[i]["PurchaseRate"];
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
      errorMessage("not allowed to delete");
    }
  };
  const onSubmitHandler = async (e: IOnSubmit) => {
    e.preventDefault();
    const currentNepaliData = getNepaliDate();
    const validDate = await checkDate(otherDetails.date, startDate, endDate);
    if (validDate) {
      if (
        otherDetails.date !== null &&
        otherDetails.date > currentNepaliData
      ) {
        errorMessage("Invalid purchase return date.");
        return;
      }

      if (paramID === "add") {
        setOpenSaveDialog(true);
        let data: IAllAccountTransactionValue = {
          Id: 0,
          AccountType: null,
          Name: "Debit Note",
          AccountTransactionType: "",
          AccountTransactionDocumentId: 0,
          AccountTransactionTypeId: 0,
          SourceAccountTypeId: otherDetails.customerId,
          ref_invoice_number: otherDetails.refNo,
          IsReversed: false,
          Reversable: false,
          TargetAccountTypeId: 0,
          Description: "",
          Date: otherDetails.date,
          Amount: totalgrandAmount,
          DebitAmount: 0,
          CreditAmount: 0,
          drTotal: 0,
          crTotal: 0,
          IdentityFile: false,
          TicketReferences: null,
          AccountTransactionValues: [],
          InventoryReceiptDetails: null,
          PurchaseDetails: allProducts,
          SalesOrderDetails: null,
          CompanyCode: companyData,
          DepartmentId: additionalPurchaseDtl.department,
          WareHouseId: additionalPurchaseDtl.warehouse,
          BranchId: additionalPurchaseDtl.branch,
          FinancialYear: FinancialYear.Name,
          UserName: userDetail.UserName,
          ExciseDuty: totalExciseDuty,
          VATAmount: totalVat,
        };
        if (data.ref_invoice_number === 0) {
          setOpenSaveDialog(false);
          errorMessage("Please select Ref No...");
        } else {
          const res = await addPurchaseReturn(data);
          if (res) {
            setOpenSaveDialog(false);
            successMessage();
            history.push("/purchase-return");
          } else {
            setOpenSaveDialog(false);
            errorMessage();
          }
        }
      } else {
        setOpenSaveDialog(true);
        const res: any = await getPurchaseReturn(paramID);
        const data: IAllAccountTransactionValue = {
          Id: res.Id,
          AccountType: res.AccountType,
          Name: res.Name,
          AccountTransactionType: res.AccountTransactionType,
          AccountTransactionDocumentId: res.AccountTransactionDocumentId,
          AccountTransactionTypeId: res.AccountTransactionTypeId,
          SourceAccountTypeId: otherDetails.customerId,
          ref_invoice_number: otherDetails.refNo,
          IsReversed: false,
          Reversable: true,
          TargetAccountTypeId: res.TargetAccountTypeId,
          Description: res.Description,
          Date: otherDetails.date,
          Amount: totalgrandAmount,
          DebitAmount: toalwithoutdsc,
          CreditAmount: toalwithoutdsc,
          drTotal: toalwithoutdsc,
          crTotal: toalwithoutdsc,
          IdentityFile: false,
          TicketReferences: null,
          AccountTransactionValues: res.AccountTransactionValues,
          InventoryReceiptDetails: null,
          PurchaseDetails: allProducts,
          SalesOrderDetails: null,
          CompanyCode: companyData,
          DepartmentId: additionalPurchaseDtl.department,
          WareHouseId: additionalPurchaseDtl.warehouse,
          BranchId: additionalPurchaseDtl.branch,
          FinancialYear: FinancialYear.Name,
          UserName: userDetail.UserName,
          ExciseDuty: totalExciseDuty,
          VATAmount: totalVat,
        };
        const ress = await editPurchaseReturn(paramID, data);
        if (ress) {
          setOpenSaveDialog(false);
          editMessage();
          history.push("/purchase-return");
        } else {
          setOpenSaveDialog(false);
          errorMessage();
        }
      }
    }
  };

  const deleteUserConfirm = async () => {
    let data: IAllAccountTransactionValue = {
      Id: 0,
      AccountType: null,
      Name: "Debit Note",
      AccountTransactionType: "",
      AccountTransactionDocumentId: 0,
      AccountTransactionTypeId: 0,
      SourceAccountTypeId: otherDetails.customerId,
      ref_invoice_number: otherDetails.refNo,
      IsReversed: false,
      Reversable: false,
      TargetAccountTypeId: 0,
      Description: "",
      Date: otherDetails.date,
      Amount: totalgrandAmount,
      DebitAmount: 0,
      CreditAmount: 0,
      drTotal: 0,
      crTotal: 0,
      IdentityFile: false,
      TicketReferences: null,
      AccountTransactionValues: [],
      InventoryReceiptDetails: null,
      PurchaseDetails: allProducts,
      SalesOrderDetails: null,
      CompanyCode: companyData,
      DepartmentId: additionalPurchaseDtl.department,
      WareHouseId: additionalPurchaseDtl.warehouse,
      BranchId: additionalPurchaseDtl.branch,
      FinancialYear: FinancialYear.Name,
      UserName: userDetail.UserName,
      ExciseDuty: totalExciseDuty,
      VATAmount: totalVat,
    };
    const response = await deletePurchaseReturn(id, data);
    if (response) {
      history.push("/purchase-return");
    }
  };

  const onChangeHandlerSelect = (value: number) => {
    setOtherDetails({ ...otherDetails, customerId: value, refNo: 0 });
    setSelectedCustomerId(value);
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
              helperText="Voucher Type"
              label="Voucher Type"
              size="small"
              fullWidth
              value={"Debit Note"}
            />
          </Grid>
          {
            selectedCustomerId
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
                      label="Select Customer"
                      variant="outlined"
                      size="small"
                      required
                      fullWidth
                      helperText="Please Choose Customer"
                    />
                  )}
                  renderOption={handleRenderOption}
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
                      label="Select Customer"
                      variant="outlined"
                      size="small"
                      required
                      fullWidth
                      helperText="Please Choose Customer"
                    />
                  )}
                  renderOption={handleRenderOption}
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
          <Grid item xs={12} md={2}>
            <Autocomplete
              disablePortal
              options={RefNo}
              onChange={(e, v) =>
                setOtherDetails({ ...otherDetails, refNo: v.value })
              }
              isOptionEqualToValue={(option, value) =>
                option.label === value.label
              }
              value={refNoValue ? refNoValue?.value : otherDetails.refNo}
              disableClearable
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={!otherDetails.refNo}
                  label="Select Ref No"
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                  helperText="Please Choose Ref No"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              helperText="Purchase Return Date"
              label="Date"
              fullWidth
              value={otherDetails.date? otherDetails.date: getNepaliDate()}
              onChange={(e) =>
                setOtherDetails({...otherDetails, date: e.target.value})
              }
              size="small"
            />
          </Grid>
        </Grid>

        {/* <RowHeaderPurchaseReturn /> */}

        {allProducts?.map((elm, i) => {
          const productValue =
            products &&
            products.find((obj) => obj.value === elm.InventoryItemId
            );
          return (
            <>
            <Grid
              container
              spacing={1}
              sx={{
                mx: "auto",
                mt: 2,
                display: "flex",
                justifyContent: "end",
              }}
            >
              <Grid xs={12} item>
                <TextField
                  value={productValue ? productValue?.label : "No Data *"}
                  label="Item Name"
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                />
              </Grid>
              <Grid xs  item sx={{ marginTop: 2 }}>
                <InputField
                  helperText="Quantity"
                  label="Select Quantity"
                  name="Qty"
                  type="number"
                  required
                  value={elm.Quantity ? Math.abs(elm.Quantity) : ""}
                  onChange={(e) => addRowHandler(e, i)}
                />
              </Grid>
              <Grid xs item sx={{ marginTop: 2 }}>
                <TextField
                  helperText="Rate"
                  label="Rate"
                  name="Rate"
                  type="number"
                  size="small"
                  fullWidth
                  value={elm.PurchaseRate}
                />
              </Grid>
              <Grid xs item sx={{ marginTop: 2 }}>
                <TextField
                  helperText="After Excise Duty"
                  label="Excise Duty"
                  name="excise"
                  type="number"
                  size="small"
                  fullWidth
                  value={((elm.ExciseDuty/100)*elm.PurchaseRate)+elm.PurchaseRate }
                />
              </Grid>
              <Grid xs item sx={{ marginTop: 2 }}>
                <TextField
                  helperText="After Tax"
                  label="Tax"
                  name="tax"
                  type="number"
                  size="small"
                  fullWidth
                  value={
                    elm.ExciseDuty > 0 ?
                    ((elm.TaxRate/100)*(((elm.ExciseDuty/100)*elm.PurchaseRate)+elm.PurchaseRate)+((elm.ExciseDuty/100)*elm.PurchaseRate)+elm.PurchaseRate) :
                    (((elm.TaxRate/100)*elm.PurchaseRate) + elm.PurchaseRate)
                  }
                />
              </Grid>
              <Grid xs item sx={{ marginTop: 2 }}>
                <TextField
                  size="small"
                  helperText="Amount"
                  label="Total Amount"
                  type="number"
                  fullWidth
                  value={
                    parseInt(elm.Quantity) * elm.PurchaseRate
                      ? Math.abs(parseInt(elm.Quantity) * elm.PurchaseRate)
                      : "0"
                  }
                />
              </Grid>
              <Grid item sx={{ marginTop: 2 }} >
                <Box>
                  {
                    allProducts.length > 1 ? (
                      <IconButton color="error">
                      <RiDeleteBack2Fill
                        onClick={(e) => deleteNewRow(e, i)}
                        style={{ cursor: "pointer" }}
                      />
                    </IconButton>
                    ):(
                      ""
                    )
                  }
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
        <Grid item xs={12} sx={{ textAlign: "end", my: 3 }}>
          {paramID === "add" ? (
            <SaveButton variant="outlined"  />
          ) : (
            <>
              <UpdateButton variant="outlined" />
              {
                loginedUserRole.includes("PRDelete")?
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
