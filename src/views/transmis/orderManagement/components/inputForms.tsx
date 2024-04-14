import {
  Autocomplete,
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { BiUserPlus } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { useHistory } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  DeleteDialog,
  SaveProgressDialog,
} from "../../../../components/dialogBox";
import { selectCompany } from "../../../../features/companySlice";
import { getCurrentFinancialYear } from "../../../../features/financialYearSlice";
import { updateOrMgDataAction } from "../../../../features/ormgSlice";
import { selectUser } from "../../../../features/userSlice";
import { ISelectType } from "../../../../interfaces/autoComplete";
import { IBranch } from "../../../../interfaces/branch";
import { IDepartment } from "../../../../interfaces/department";
import { IOnSubmit } from "../../../../interfaces/event";
import {
  IOrderDetail,
  IOrderManagement,
} from "../../../../interfaces/orderManagement";
import {
  IAccountHolder,
  IPurchaseMenu,
} from "../../../../interfaces/purchaseOrder";
import { IWarehouse } from "../../../../interfaces/warehouse";
import { getAllBranch } from "../../../../services/branchApi";
import { getAllDepartments } from "../../../../services/departmentApi";
import { getEnglishDate } from "../../../../services/getEnglishDate";
import {
  addOrderManagement,
  createInvoice,
  deleteOrderManagement,
  deleteOrderManagementRow,
  editOrderManagement,
} from "../../../../services/orderManagementApi";
import {
  getAllAccountHolder,
  getAllPurchase,
} from "../../../../services/purchaseOrderApi";
import { getAllWarehouseData } from "../../../../services/warehouseApi";
import handleRenderOption from "../../../../utils/autoSuggestHighlight";
import {
  CloseButton,
  CreateButton,
  DeleteButton,
  SaveButton,
  UpdateButton,
} from "../../../../utils/buttons";
import InputField from "../../../../utils/customTextField";
import {
  deleteMessage,
  deleteRowMessage,
  editMessage,
  errorMessage,
  successMessage,
} from "../../../../utils/messageBox/Messages";
import { getNepaliDate } from "../../../../utils/nepaliDate";
import { IAdditionalSales } from "./initialState";
import RowHeaderOrder from "./rowHeader";

interface ISalesType {
  id: string | null;
  label: string | null;
}
const salesType: ISalesType[] = [
  { id: "Cash Sales", label: "Cash Sales" },
  { id: "Credit Sales", label: "Credit Sales" },
];
interface IProps {
  allData: IOrderManagement;
  setAllData: any;
  paramId: string;
  paramType?: string;
  setDisplayUserModal: any;
}
const initialAdditionalSales: IAdditionalSales = {
  salesType: null,
  salesDate: getNepaliDate(),
};
const InputForms = ({
  allData,
  setAllData,
  paramId,
  paramType,
  setDisplayUserModal,
}: IProps) => {
  const [branchDetails, setBranchDetails] = useState<ISelectType[]>([]);
  const [accountHolder, setAccountHolder] = useState<ISelectType[]>([]);
  const [products, setProducts] = useState<ISelectType[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [warehouse, setWarehouse] = useState<ISelectType[]>([]);
  const [filterWarehouse, setFilterWarehouse] = useState<any[]>([]);
  const [department, setDepartment] = useState<ISelectType[]>([]);
  const { OrderDetails } = allData && allData;
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const history = useHistory();
  const [salesTypeValue, setSalesTypeValue] = useState<ISalesType | null>(null);
  const [additionalSalesDtls, setAdditionalSalesDtls] =
    useState<IAdditionalSales>(initialAdditionalSales);
  const [handleDate, setHandleDate] = useState(
    getNepaliDate().substring(0, 10).replaceAll("-", ".")
  );
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName);

  const companyData = useAppSelector(selectCompany);
  const FinancialYear = useAppSelector(getCurrentFinancialYear);
  const userDetail = useAppSelector(selectUser);
  //added
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getBranchData = async () => {
      const res: IBranch[] = await getAllBranch();
      setBranchDetails(
        res.map((item) => {
          return { label: item.NameEnglish, value: item.Id };
        })
      );
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
      setAllProducts(res);
      setProducts(
        res.map((item) => {
          return { label: item.Name, value: item.Id, unitType: item.UnitType };
        })
      );
    };

    const getWareHouseType = async () => {
      const res: IWarehouse[] = await getAllWarehouseData();
      setFilterWarehouse(res);
      setWarehouse(
        res.map((item) => {
          return { label: item.Name, value: item.Id };
        })
      );
    };
    const getDepartment = async () => {
      const res: IDepartment[] = await getAllDepartments();
      setDepartment(
        res.map((item) => {
          return { label: item.Name, value: item.Id };
        })
      );
    };

    getDepartment();
    getWareHouseType();
    getBranchData();
    getAccountHolderData();
    getPurchases();
    setSalesData();
  }, [accountHolder]);

  const setSalesData = () => {
    if (
      additionalSalesDtls.salesType !== null ||
      additionalSalesDtls.salesType === ""
    ) {
      setSalesTypeValue({
        id: additionalSalesDtls.salesType,
        label: additionalSalesDtls.salesType,
      });
    } else {
      setSalesTypeValue(null);
    }
  };

  const branchValue =
    branchDetails &&
    branchDetails.find((obj) => obj.value === allData.BranchId);

  const departmentValue =
    department && department.find((obj) => obj.value === allData.DepartmentId);
  const filterWarehouses =
    filterWarehouse &&
    filterWarehouse.filter((data) => {
      return data.BranchId === allData.BranchId;
    });
  const optionsWarehouse =
    filterWarehouses &&
    filterWarehouses.map((item) => {
      return { value: item.Id, label: item.Name };
    });

  const warehouseValue =
    warehouse && warehouse.find((obj) => obj.value === allData.WareHouseId);

  const accountHolderValue =
    accountHolder &&
    accountHolder.find((obj) => obj.value === allData.AccountId);

  const validationRow = OrderDetails?.every(
    (item) => item.ItemId && item.Qty && item.UnitPrice
  );
  const addNewRow = (e: any) => {
    e.preventDefault();
    if (validationRow) {
      let data = [...OrderDetails];
      data.push({
        Id: 0,
        OrderManagementId: 0,
        ItemId: "",
        Qty: 0,
        UnitType: "",
        TotalAmount: 0,
        UnitPrice: 0,
        ExciseDuty: 0,
        Discount: 0,
        TaxRate: 0,
        UserName: "",
        FinancialYear: "",
        CompanyCode: 0,
        DepartmentId: 0,
        WarehouseId: 0,
        BranchId: 0,
      });

      setAllData({
        ...allData,
        OrderDetails: data,
      });
    } else {
      errorMessage("Data must be filled");
    }
  };

  const addRowHandler = (e: any, i: number) => {
    let list = [...OrderDetails];
    let name = e.target.name;
    let value = e.target.value;
    const getItemData: IOrderDetail = allProducts.find(
      (elm) => elm.Id === list[i].ItemId
    );
    switch (name) {
      case "Qty":
        if (value >= 0) {
          list[i]["Qty"] = value;
        }
        if (getItemData.ExciseDuty > 0) {
          let exciseDutyAmount =
            (getItemData.ExciseDuty / 100) * list[i].UnitPrice +
            list[i].UnitPrice;
          list[i]["TaxRate"] =
            (getItemData.TaxRate / 100) * exciseDutyAmount * parseInt(value);
        } else {
          list[i]["TaxRate"] =
            (getItemData.TaxRate / 100) * list[i].UnitPrice * parseInt(value);
        }
        break;
      case "UnitPrice":
        list[i]["UnitPrice"] = parseInt(value);
        if (getItemData.ExciseDuty > 0) {
          let exciseDutyAmount =
            (getItemData.ExciseDuty / 100) * parseInt(value) + parseInt(value);
          list[i]["TaxRate"] =
            (getItemData.TaxRate / 100) * exciseDutyAmount * list[i].Qty;
        } else {
          list[i]["TaxRate"] =
            (getItemData.TaxRate / 100) * parseInt(value) * list[i].Qty;
        }
        break;
      case "Discount":
        list[i]["Discount"] = parseInt(value);
        break;
      case "TaxRate":
        list[i]["TaxRate"] = parseInt(value);
        break;
    }
    let TotalAmount =
      list[i].Discount > 0
        ? list[i].UnitPrice * list[i].Qty - list[i].Discount + list[i].TaxRate
        : list[i].UnitPrice * list[i].Qty + list[i].TaxRate;
    list[i]["TotalAmount"] = TotalAmount;
    setAllData({ ...allData, OrderDetails: list });
  };

  const deleteNewRow = async (id: number, rowId: any) => {
    if (paramType === "create-invoice") {
      const lists = [...OrderDetails];
      lists.splice(id, 1);
      setAllData({ ...allData, OrderDetails: lists });
    } else {
      if (OrderDetails.length > 1) {
        if (rowId) {
          const res: any = await deleteOrderManagementRow(rowId);
          if (res) {
            deleteRowMessage();
            const lists = [...OrderDetails];
            lists.splice(id, 1);
            setAllData({ ...allData, OrderDetails: lists });
          } else {
            errorMessage();
          }
        } else {
          const lists = [...OrderDetails];
          lists.splice(id, 1);
          setAllData({ ...allData, OrderDetails: lists });
        }
      } else {
        errorMessage("There must be atleast 1 product");
      }
    }
  };

  const addselectHandler = (e: any, i: number) => {
    let list = [...OrderDetails];
    let { value } = e;
    const hasProductExisted = (): boolean => {
      for (let i = 0; i < list.length; i++) {
        const element = list[i];
        if (e.value === element.ItemId) {
          return true;
        }
      }
      return false;
    };
    if (hasProductExisted()) {
      errorMessage("Sorry, the product has already been in the list.");
      return;
    }
    const getItemData: IOrderDetail = allProducts.find(
      (elm) => elm.Id === value
    );
    list[i]["ItemId"] = value;
    list[i]["UnitType"] = getUnitType(value);
    list[i]["Qty"] = getItemData.Qty;
    list[i]["UnitPrice"] = getItemData.UnitPrice;
    const TaXrateData = getItemData.TaxRate;
    setAllData({ ...allData, OrderDetails: list });
    let TotalAmount = getItemData.UnitPrice * getItemData.Qty;
    if (TaXrateData > 0) {
      const calc = (TaXrateData / 100) * TotalAmount;
      list[i]["TaxRate"] = calc;
      list[i]["TotalAmount"] = TotalAmount + calc;
      setAllData({ ...allData, OrderDetails: list });
    } else {
      list[i]["TotalAmount"] = TotalAmount;
      setAllData({ ...allData, OrderDetails: list });
    }
  };

  const getUnitType = (id: number) => {
    for (let index = 0; index < products.length; index++) {
      if (products[index].value === id) {
        return products[index].unitType;
      }
    }
  };

  var sum =
    OrderDetails &&
    OrderDetails.reduce(function (a: any, b: any) {
      return a + b.TotalAmount;
    }, 0);

  var Discount =
    OrderDetails &&
    OrderDetails.reduce(function (a: any, b: any) {
      return a + b.Discount;
    }, 0);

  var TaxAmount =
    OrderDetails &&
    OrderDetails.reduce(function (a: any, b: any) {
      return a + b.TaxRate;
    }, 0);

  const onSubmitHandler = async (e: IOnSubmit) => {
    e.preventDefault();
    setOpenSaveDialog(true);
    const getEnglishDateD = await getEnglishDate(allData.NepaliDate);
    const getEnglishExpireDate = await getEnglishDate(allData.DueNepaliDate);
    const getEnglishDueDate = await getEnglishDate(allData.WorkDueNepaliDate);

    if (paramId === "add") {
      if (
        getEnglishDateD > getEnglishExpireDate &&
        getEnglishDateD > getEnglishDueDate
      ) {
        setOpenSaveDialog(false);
        errorMessage("Order date must be greater !!");
      } else {
        let itemList: any = [];
        OrderDetails.forEach((element) => {
          itemList.push({
            BranchId: allData.BranchId,
            WareHouseId: allData.WareHouseId,
            BranchCode: companyData.BranchCode,
            CompanyCode: companyData.BranchCode,
            DepartmentId: allData.DepartmentId,
            FinancialYear: FinancialYear.Name,
            Discount: element.Discount,
            TaxRate: element.TaxRate,
            ItemId: element.ItemId,
            Qty: element.Qty,
            UnitPrice: element.UnitPrice,
            TotalAmount: element.Qty * element.UnitPrice,
            UserName: userDetail.UserName,
            UnitType: element.UnitType,
          });
        });
        const OrderDetailsObject = {
          AccountId: allData.AccountId,
          EnglishDate: getEnglishDateD?.substring(0, 10),
          NepaliDate: allData.NepaliDate,
          DueNepaliDate: allData.DueNepaliDate,
          DueEnglishDate: getEnglishExpireDate?.substring(0, 10),
          WorkDueNepaliDate: allData.WorkDueNepaliDate,
          WorkDueEnglishDate: getEnglishDueDate?.substring(0, 10),
          Message: allData.Message,
          MessageStatement: allData.MessageStatement,
          WareHouseId: allData.WareHouseId,
          BranchId: allData.BranchId,
          DepartmentId: allData.DepartmentId,
          CompanyCode: companyData.BranchCode,
          FinancialYear: FinancialYear.Name,
          OrderDetails: itemList,
        };
        const res: any = await addOrderManagement(OrderDetailsObject);
        if (res) {
          setOpenSaveDialog(false);
          successMessage();
          history.push("/order-management");
        } else {
          setOpenSaveDialog(false);
          errorMessage();
        }
      }
    } else if (paramType === "create-invoice") {
      let itemList: any = [];
      OrderDetails.forEach((element) => {
        itemList.push({
          BranchId: allData.BranchId,
          WareHouseId: allData.WareHouseId,
          BranchCode: companyData.BranchCode,
          CompanyCode: companyData.BranchCode,
          DepartmentId: allData.DepartmentId,
          FinancialYear: FinancialYear.Name,
          Discount: element.Discount,
          TaxRate: element.TaxRate,
          ItemId: element.ItemId,
          Qty: element.Qty,
          UnitPrice: element.UnitPrice,
          TotalAmount: element.Qty * element.UnitPrice,
          UserName: userDetail.UserName,
          UnitType: element.UnitType,
        });
      });
      const OrderDetailsObject = {
        SalesOrderDetails: itemList,
        Name: additionalSalesDtls.salesType,
        Amount: sum,
        Discount: Discount,
        PercentAmount: 0.0,
        NetAmount: sum,
        VATAmount: TaxAmount,
        GrandAmount: sum - Discount + TaxAmount,
        IsDiscountPercentage: false,
        Date: handleDate.substring(0, 10).replaceAll("-", "."),
        Description: allData.Message,
        FinancialYear: FinancialYear.Name,
        UserName: userDetail.UserName,
        CompanyCode: companyData.BranchCode,
        SourceAccountTypeId: allData.AccountId,
        WareHouseId: allData.WareHouseId,
        BranchId: allData.BranchId,
        DepartmentId: allData.DepartmentId,
      };
      try {
        if (salesTypeValue === null) {
          setOpenSaveDialog(false);
          errorMessage("Please select sales type");
        } else {
          const res: any = await createInvoice(OrderDetailsObject);
          if (res === -1) {
            setOpenSaveDialog(false);
            errorMessage("post error");
          } else {
            setOpenSaveDialog(false);
            successMessage("invoice created sucessfully");
            history.push(`/invoice/view/${res}`);
          }
        }
      } catch (error) {
        setOpenSaveDialog(false);
        errorMessage("Operation was failed. Please try again later.");
      }
    } else {
      const UpdateObject = {
        ...allData,
        Id: allData.Id,
        AccountId: allData.AccountId,
        DueEnglishDate: getEnglishExpireDate?.substring(0, 10),
        DueNepaliDate: allData.DueNepaliDate,
        WorkDueEnglishDate: getEnglishDueDate?.substring(0, 10),
        WorkDueNepaliDate: allData.WorkDueNepaliDate,
        Message: allData.Message,
        MessageStatement: allData.MessageStatement,
        FinancialYear: allData.FinancialYear,
        CompanyCode: allData.CompanyCode,
        DepartmentId: allData.DepartmentId,
        WareHouseId: allData.WareHouseId,
        BranchId: allData.BranchId,
        OrderDetails: OrderDetails,
      };

      if (
        UpdateObject.NepaliDate.substring(0, 10).replaceAll("-", ".") >
          UpdateObject.DueNepaliDate.substring(0, 10).replaceAll("-", ".") &&
        UpdateObject.NepaliDate.substring(0, 10).replaceAll("-", ".") >
          UpdateObject.WorkDueNepaliDate.substring(0, 10).replaceAll("-", ".")
      ) {
        setOpenSaveDialog(false);
        errorMessage("Order date must be greater !!");
      } else {
        const res = await editOrderManagement(paramId, UpdateObject);
        if (res) {
          setOpenSaveDialog(false);
          editMessage();
          history.push("/order-management");
        } else {
          setOpenSaveDialog(false);
          errorMessage();
        }
      }
    }
  };

  const deleteUserConfirm = async () => {
    setOpenDialog(false);
    const res = await deleteOrderManagement(paramId);
    if (res) {
      deleteMessage();
      history.push("/order-management");
    } else {
      errorMessage();
    }
  };
  const onChange = (name: string, value: any) => {
    setAdditionalSalesDtls({ ...additionalSalesDtls, [name]: value });
  };

  const changeValues = (name: string, value: any) => {
    if (name === "BranchId") {
      setAllData({
        ...allData,
        [name]: value,
        ["WareHouseId"]: 0,
      });
      dispatch(updateOrMgDataAction({ name: name, value: value }));
      dispatch(updateOrMgDataAction({ name: "WareHouseId", value: 0 }));
      return;
    }
    dispatch(updateOrMgDataAction({ name: name, value: value }));
    setAllData({ ...allData, [name]: value });
  };

  return (
    <>
      <Paper
        component="form"
        autoComplete="off"
        onSubmit={onSubmitHandler}
        sx={{ p: 2 }}
      >
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {paramType === "create-invoice" ? (
            <Grid
              container
              spacing={2}
              sx={{ paddingTop: 2, paddingLeft: 2, paddingBottom: 2 }}
            >
              <Grid item xs={12} md={6}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={salesType}
                  size="small"
                  isOptionEqualToValue={(
                    option: ISalesType,
                    value: ISalesType
                  ) => option.id === value.id}
                  value={salesTypeValue === null ? null : salesTypeValue}
                  renderInput={(params) => (
                    <TextField {...params} label="Sales type" />
                  )}
                  onChange={(event: any, newValue: ISalesType | null) => {
                    onChange("salesType", newValue && newValue.id);
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Sales Date"
                  size="small"
                  fullWidth
                  inputProps={{
                    pattern:
                      "([1-9][0-9]{3}.((0[1-9])|(1[0-2])).((0[1-9])|(1[0-9])|(2[0-9])|(3[0-1])))",
                  }}
                  value={
                    allData.NepaliDate
                      ? allData.NepaliDate.substring(0, 10).replaceAll("-", ".")
                      : ""
                  }
                  onChange={(e) => changeValues("NepaliDate", e.target.value)}
                />
              </Grid>
            </Grid>
          ) : (
            ""
          )}
          <Grid item xs={12}>
            <Autocomplete
              style={{ width: "calc(100% - 50px)", float: "left" }}
              disablePortal
              options={accountHolder}
              onChange={(e, v) => changeValues("AccountId", v.value)}
              isOptionEqualToValue={(option, value) =>
                option.label === value.label
              }
              value={accountHolderValue ? accountHolderValue.label : ""}
              disableClearable
              renderInput={(params) => (
                <TextField
                  autoFocus
                  {...params}
                  error={!allData.AccountId}
                  label="Account Holder"
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                  helperText="Select Account holder"
                />
              )}
              renderOption={handleRenderOption}
            />
            <IconButton
              style={{
                float: "left",
                width: "45px",
                height: "30px",
                marginLeft: "5px",
              }}
              sx={{ border: 1, borderRadius: 1 }}
              onClick={(e) => setDisplayUserModal(true)}
            >
              <BiUserPlus />
            </IconButton>
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              disablePortal
              options={branchDetails}
              onChange={(e, v) => changeValues("BranchId", v.value)}
              isOptionEqualToValue={(option, value) =>
                option.label === value.label
              }
              value={branchValue ? branchValue?.label : ""}
              disableClearable
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={!allData.BranchId}
                  label="Branch"
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                  helperText="Select Branch"
                />
              )}
              renderOption={handleRenderOption}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              disablePortal
              options={optionsWarehouse ? optionsWarehouse : []}
              onChange={(e, v) => changeValues("WareHouseId", v.value)}
              isOptionEqualToValue={(option, value) =>
                option.label === value.label
              }
              value={warehouseValue ? warehouseValue?.label : ""}
              disableClearable
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={!allData.WareHouseId}
                  label="Warehouse"
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                  helperText="Select Warehouse"
                />
              )}
              renderOption={handleRenderOption}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              disablePortal
              options={department}
              onChange={(e, v) => changeValues("DepartmentId", v.value)}
              isOptionEqualToValue={(option, value) =>
                option.label === value.label
              }
              value={departmentValue ? departmentValue?.label : ""}
              disableClearable
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={!allData.DepartmentId}
                  label="Department"
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                  helperText="Select Department"
                />
              )}
              renderOption={handleRenderOption}
            />
          </Grid>
          {paramType === "create-invoice" ? (
            ""
          ) : (
            <Grid
              container
              spacing={2}
              sx={{ paddingTop: 2, paddingLeft: 2, paddingBottom: 2 }}
            >
              <Grid item xs={12} md={4}>
                <TextField
                  label="Order Date"
                  size="small"
                  fullWidth
                  inputProps={{
                    pattern:
                      "([1-9][0-9]{3}.((0[1-9])|(1[0-2])).((0[1-9])|(1[0-9])|(2[0-9])|(3[0-1])))",
                  }}
                  value={
                    allData.NepaliDate
                      ? allData.NepaliDate.substring(0, 10).replaceAll("-", ".")
                      : ""
                  }
                  onChange={(e) => changeValues("NepaliDate", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Due Date"
                  size="small"
                  fullWidth
                  inputProps={{
                    pattern:
                      "([1-9][0-9]{3}.((0[1-9])|(1[0-2])).((0[1-9])|(1[0-9])|(2[0-9])|(3[0-1])))",
                  }}
                  value={
                    allData.WorkDueNepaliDate
                      ? allData.WorkDueNepaliDate.substring(0, 10).replaceAll(
                          "-",
                          "."
                        )
                      : ""
                  }
                  onChange={(e) =>
                    changeValues("WorkDueNepaliDate", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <InputField
                  helperText="Date format: YYYY.MM.DD"
                  label="Expire Date"
                  required
                  inputProps={{
                    pattern:
                      "([1-9][0-9]{3}.((0[1-9])|(1[0-2])).((0[1-9])|(1[0-9])|(2[0-9])|(3[0-1])))",
                  }}
                  value={
                    allData.DueNepaliDate
                      ? allData.DueNepaliDate.substring(0, 10).replaceAll(
                          "-",
                          "."
                        )
                      : ""
                  }
                  onChange={(e) =>
                    changeValues("DueNepaliDate", e.target.value)
                  }
                />
              </Grid>
            </Grid>
          )}
        </Grid>

        <RowHeaderOrder />

        {OrderDetails?.map((elm, i) => {
          const productValue =
            products && products.find((obj) => obj.value === elm.ItemId);

          return (
            <Grid
              container
              spacing={1}
              sx={{
                mx: "auto",
                mt: 3,
              }}
            >
              <Grid xs={12} item>
                <Autocomplete
                  disablePortal
                  options={products}
                  onChange={(e, v) => addselectHandler(v, i)}
                  isOptionEqualToValue={(option, value) =>
                    option.label === value.label
                  }
                  value={productValue?.label ? productValue.label : ""}
                  disableClearable
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={!elm.ItemId}
                      label="Product"
                      variant="outlined"
                      size="small"
                      required
                      fullWidth
                      helperText="Select Product"
                    />
                  )}
                  renderOption={handleRenderOption}
                />
              </Grid>
              <Grid xs item>
                <InputField
                  helperText="Enter Quantity"
                  label="Quantity"
                  placeholder="Enter Quantity"
                  name="Qty"
                  type="number"
                  required
                  inputProps={{ min: "" }}
                  value={elm.Qty ? elm.Qty : ""}
                  onChange={(e) => addRowHandler(e, i)}
                />
              </Grid>
              <Grid xs item>
                <InputField
                  helperText="Enter Price"
                  label="Price"
                  placeholder="Enter Price"
                  type="number"
                  name="UnitPrice"
                  required
                  value={elm.UnitPrice.toString()}
                  onChange={(e) => addRowHandler(e, i)}
                />
              </Grid>
              <Grid xs item>
                <TextField
                  helperText="Enter Discount"
                  placeholder="Enter Discount"
                  size="small"
                  type="number"
                  name="Discount"
                  label="Discount"
                  fullWidth
                  value={elm.Discount && elm.Discount.toString()}
                  onChange={(e: any) => addRowHandler(e, i)}
                />
              </Grid>
              <Grid xs item>
                <TextField
                  label="Tax"
                  size="small"
                  type="number"
                  name="TaxRate"
                  fullWidth
                  value={elm.TaxRate && elm.TaxRate}
                  onChange={(e: any) => addRowHandler(e, i)}
                />
              </Grid>

              <Grid xs item>
                <TextField
                  size="small"
                  disabled
                  label="Total Amount"
                  type="number"
                  fullWidth
                  value={elm.TotalAmount && elm.TotalAmount}
                  // value={
                  //   elm.Discount > 0
                  //     ? elm.UnitPrice * elm.Qty - elm.Discount +elm.TaxRate
                  //     : elm.UnitPrice * elm.Qty + elm.TaxRate
                  // }
                />
              </Grid>
              <Grid item>
                <IconButton color="error">
                  <RiDeleteBack2Fill
                    onClick={(e) => deleteNewRow(i, elm.Id)}
                    style={{ cursor: "pointer" }}
                  />
                </IconButton>
              </Grid>
            </Grid>
          );
        })}
        <Grid item xs={12} sx={{ textAlign: "start", my: 3 }}>
          <Button
            size="small"
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<IoMdAdd />}
            sx={{ mx: 1 }}
            onClick={addNewRow}
          >
            Add New Row
          </Button>
        </Grid>

        <Grid item xs={12} sx={{ textAlign: "end", my: 3 }}>
          <Typography sx={{ fontWeight: "600" }}>
            Discount : {Discount >= 0 ? Math.abs(Discount) : 0}
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "end", my: 3 }}>
          <Typography sx={{ fontWeight: "600" }}>
            Tax Amount : {TaxAmount ? TaxAmount.toFixed(2) : 0}
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "end", my: 3 }}>
          <Typography sx={{ fontWeight: "600" }}>
            Sub Total : {sum ? sum.toFixed(2) : 0}
          </Typography>
        </Grid>

        {paramType === "create-invoice" ? (
          <Grid
            container
            spacing={1}
            sx={{
              mx: "auto",
              mt: 2,
            }}
          >
            <Grid xs={12} item>
              <TextField
                multiline
                label="sales message"
                helperText="Enter Message"
                rows="4"
                fullWidth
                name="message"
                placeholder="Text here..."
                value={allData.Message ? allData.Message : ""}
                error={!allData.Message}
                onChange={(e: any) => changeValues("Message", e.target.value)}
              />
            </Grid>
          </Grid>
        ) : (
          <Grid
            container
            spacing={1}
            sx={{
              mx: "auto",
              mt: 2,
            }}
          >
            <Grid sm={6} xs={12} item>
              <TextField
                multiline
                label={
                  paramType === "create-invoice" ? "Order Message" : "Message"
                }
                helperText="Enter Message"
                rows="4"
                fullWidth
                name="message"
                placeholder="Text here..."
                value={allData.Message ? allData.Message : ""}
                error={!allData.Message}
                onChange={(e: any) => changeValues("Message", e.target.value)}
              />
            </Grid>
            <Grid sm={6} xs={12} item>
              <TextField
                multiline
                label="Message Statement"
                helperText="Enter Message statement"
                rows="4"
                fullWidth
                name="messageStatement"
                placeholder="Text here..."
                value={allData.MessageStatement ? allData.MessageStatement : ""}
                error={!allData.MessageStatement}
                onChange={(e: any) =>
                  changeValues("MessageStatement", e.target.value)
                }
              />
            </Grid>
          </Grid>
        )}

        <Grid item xs={12} sx={{ textAlign: "end", my: 3 }}>
          {paramId === "add" ? (
            <SaveButton variant="outlined" />
          ) : paramType === "create-invoice" ? (
            <>
              <CreateButton btnName="Create Invoice" />
            </>
          ) : (
            <>
              <UpdateButton variant="outlined" />
              {loginedUserRole.includes("OMDelete") ? (
                <DeleteButton
                  variant="outlined"
                  onClick={(e) => setOpenDialog(true)}
                />
              ) : (
                ""
              )}
            </>
          )}

          <CloseButton variant="outlined" />
        </Grid>

        <DeleteDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          name={`Purchase Order ${allData.Id}`}
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
