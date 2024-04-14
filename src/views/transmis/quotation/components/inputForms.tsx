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
import { IoMdAdd } from "react-icons/io";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { useHistory } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { selectCompany } from "../../../../features/companySlice";
import { getCurrentFinancialYear } from "../../../../features/financialYearSlice";
import { selectUser } from "../../../../features/userSlice";
import { ISelectType } from "../../../../interfaces/autoComplete";
import { IBranch } from "../../../../interfaces/branch";
import { IDepartment } from "../../../../interfaces/department";
import { IOnSubmit } from "../../../../interfaces/event";
import {
  IAccountHolder,
  IPurchaseMenu,
} from "../../../../interfaces/purchaseOrder";
import { IQuotation } from "../../../../interfaces/quotation";
import { IWarehouse } from "../../../../interfaces/warehouse";
import { getAllBranch } from "../../../../services/branchApi";
import { getAllDepartments } from "../../../../services/departmentApi";
import { getEnglishDate } from "../../../../services/getEnglishDate";
import {
  getAllAccountHolder,
  getAllPurchase,
} from "../../../../services/purchaseOrderApi";
import {
  addQuotation,
  deleteQuotation,
  deleteQuotationRow,
  editQuotation,
} from "../../../../services/quotationApi";
import { getAllWarehouseData } from "../../../../services/warehouseApi";
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
import { IOrderDetail } from "../../../../interfaces/orderManagement";
import RowHeaderQuotation from "./rowHeaderQuotation";
import { addOrderManagement } from "../../../../services/orderManagementApi";
import { getNepaliDate } from "./../../../../utils/nepaliDate/index";
import handleRenderOption from "../../../../utils/autoSuggestHighlight";
import { BiUserPlus } from "react-icons/bi";
import {
  DeleteDialog,
  SaveProgressDialog,
} from "../../../../components/dialogBox";
import { updateQuoDataAction } from "../../../../features/quoSlice";

interface IProps {
  allData: IQuotation;
  setAllData: any;
  paramId: string;
  paramType?: string;
  setDisplayUserModal: any;
}
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
  const { QuotationDetails } = allData && allData;
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const history = useHistory();
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName);
  const companyData = useAppSelector(selectCompany);
  const FinancialYear = useAppSelector(getCurrentFinancialYear);
  const userDetail = useAppSelector(selectUser);
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
  }, []);

  useEffect(() => {
    let data = [...allData.QuotationDetails];
    let temp_element = { ...data[1] };
    temp_element.QuotationId = 0;
    temp_element.ItemId = "";
    temp_element.Qty = "";
    temp_element.UnitType = "";
    temp_element.TotalAmount = "";
    temp_element.UnitPrice = 0;
    temp_element.Discount = 0;
    temp_element.TaxRate = "";
    temp_element.UserName = "";
    temp_element.FinancialYear = "";
    temp_element.CompanyCode = 0;
    temp_element.DepartmentId = 0;
    temp_element.WarehouseId = 0;
    temp_element.BranchId = 0;
    data[1] = temp_element;
    setAllData({
      ...allData,
      QuotationDetails: data,
    });
  }, []);

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

  const validationRow = QuotationDetails?.every(
    (item) => item.ItemId && item.Qty && item.UnitPrice
  );
  const addNewRow = (e: any) => {
    e.preventDefault();
    if (validationRow) {
      let data = [...QuotationDetails];
      data.push({
        QuotationId: 0,
        ItemId: "",
        Qty: "",
        UnitType: "",
        TotalAmount: "",
        UnitPrice: 0,
        Discount: 0,
        TaxRate: "",
        UserName: "",
        FinancialYear: "",
        CompanyCode: 0,
        DepartmentId: 0,
        WarehouseId: 0,
        BranchId: 0,
      });

      setAllData({
        ...allData,
        QuotationDetails: data,
      });
    } else {
      errorMessage("Data must be filled");
    }
  };

  const addRowHandler = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    let list = [...QuotationDetails];
    let name = e.target.name;
    let value = e.target.value;
    const getItemData: IOrderDetail = allProducts.find(
      (elm) => elm.Id === list[i].ItemId
    );
    switch (name) {
      case "Qty":
        list[i]["Qty"] = value;
        if (getItemData.ExciseDuty > 0) {
          let exciseDutyAmount =
            (getItemData.ExciseDuty / 100) * list[i].UnitPrice +
            list[i].UnitPrice;
          list[i]["TaxRate"] = (
            (getItemData.TaxRate / 100) *
            exciseDutyAmount *
            parseInt(value)
          ).toString();
        } else {
          list[i]["TaxRate"] = (
            (getItemData.TaxRate / 100) *
            list[i].UnitPrice *
            parseInt(value)
          ).toString();
        }
        break;
      case "UnitPrice":
        list[i]["UnitPrice"] = parseInt(value);
        if (getItemData.ExciseDuty > 0) {
          let exciseDutyAmount =
            (getItemData.ExciseDuty / 100) * parseInt(value) + parseInt(value);
          list[i]["TaxRate"] = (
            (getItemData.TaxRate / 100) *
            exciseDutyAmount *
            parseInt(list[i].Qty)
          ).toString();
        } else {
          list[i]["TaxRate"] = (
            (getItemData.TaxRate / 100) *
            parseInt(value) *
            parseInt(list[i].Qty)
          ).toString();
        }
        break;
      case "Discount":
        list[i]["Discount"] = parseInt(value);
        break;
    }
    let TotalAmount =
      list[i].Discount > 0
        ? list[i].UnitPrice * parseInt(list[i].Qty) -
          list[i].Discount +
          parseInt(list[i].TaxRate)
        : list[i].UnitPrice * parseInt(list[i].Qty) + parseInt(list[i].TaxRate);
    list[i]["TotalAmount"] = TotalAmount.toString();
    setAllData({ ...allData, QuotationDetails: list });
  };

  const deleteNewRow = async (id: number, rowId: any) => {
    if (paramType === "createorder") {
      const lists = [...QuotationDetails];
      lists.splice(id, 1);
      setAllData({ ...allData, QuotationDetails: lists });
    } else {
      if (QuotationDetails.length > 1) {
        if (rowId) {
          const res: any = await deleteQuotationRow(rowId);
          if (res) {
            deleteRowMessage();
            const lists = [...QuotationDetails];
            lists.splice(id, 1);
            setAllData({ ...allData, QuotationDetails: lists });
          } else {
            errorMessage();
          }
        } else {
          const lists = [...QuotationDetails];
          lists.splice(id, 1);
          setAllData({ ...allData, QuotationDetails: lists });
        }
      } else {
        errorMessage("There must be atleast 1 product");
      }
    }
  };

  const addselectHandler = (e: any, i: number) => {
    let list = [...QuotationDetails];
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
    const getItemData: any = allProducts.find((elm) => elm.Id === value);
    list[i]["ItemId"] = value;
    list[i]["UnitType"] = getUnitType(value);
    list[i]["Qty"] = getItemData.Qty;
    list[i]["UnitPrice"] = getItemData.UnitPrice;
    const TaXrateData = getItemData.TaxRate;
    setAllData({ ...allData, QuotationDetails: list });
    let TotalAmount = getItemData.UnitPrice * getItemData.Qty;
    if (TaXrateData > 0) {
      const calc = (TaXrateData / 100) * TotalAmount;
      list[i]["TaxRate"] = calc.toString();
      list[i]["TotalAmount"] = (TotalAmount + calc).toString();
      setAllData({ ...allData, OrderDetails: list });
    } else {
      list[i]["TotalAmount"] = TotalAmount.toString();
      setAllData({ ...allData, QuotationDetails: list });
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
    QuotationDetails &&
    QuotationDetails.reduce(function (a: any, b: any) {
      return a + parseInt(b.TotalAmount);
    }, 0);

  var Discount =
    QuotationDetails &&
    QuotationDetails.reduce(function (a: any, b: any) {
      return a + b.Discount;
    }, 0);

  const onSubmitHandler = async (e: IOnSubmit) => {
    e.preventDefault();
    setOpenSaveDialog(true);
    const getEnglishDateD = await getEnglishDate(allData.NepaliDate);
    const getEnglishExpireDate = await getEnglishDate(
      allData.ExpiredNepaliDate?.substring(0, 10).replaceAll("-", ".")
    );

    if (paramId === "add") {
      if (getEnglishDateD > getEnglishExpireDate) {
        setOpenSaveDialog(false);
        errorMessage("Quotation date must be greater !!");
      } else {
        let itemList: any = [];
        QuotationDetails.forEach((element) => {
          itemList.push({
            BranchId: allData.BranchId,
            WareHouseId: allData.WareHouseId,
            BranchCode: companyData.BranchCode,
            CompanyCode: companyData.BranchCode,
            DepartmentId: allData.DepartmentId,
            Discount: element.Discount,
            FinancialYear: FinancialYear.Name,
            ItemId: element.ItemId,
            Qty: parseInt(element.Qty),
            UnitPrice: element.UnitPrice,
            TotalAmount: parseInt(element.TotalAmount),
            UserName: userDetail.UserName,
            UnitType: element.UnitType,
          });
        });
        const QuotationDetailsObject = {
          AccountId: allData.AccountId,
          EnglishDate: getEnglishDateD?.substring(0, 10),
          NepaliDate: allData.NepaliDate,
          ExpiredNepaliDate: allData.ExpiredNepaliDate,
          ExpiredEnglishDate: getEnglishExpireDate?.substring(0, 10),
          Message: allData.Message,
          MessageStatement: allData.MessageStatement,
          WareHouseId: allData.WareHouseId,
          BranchId: allData.BranchId,
          DepartmentId: allData.DepartmentId,
          CompanyCode: companyData.BranchCode,
          FinancialYear: FinancialYear.Name,
          QuotationDetails: itemList,
        };
        const res: any = await addQuotation(QuotationDetailsObject);
        if (res) {
          setOpenSaveDialog(false);
          successMessage();
          history.push("/quotation");
        } else {
          setOpenSaveDialog(false);
          errorMessage();
        }
      }
    } else if (paramType === "createorder") {
      const getEnglishDateOrder = await getEnglishDate(getNepaliDate());
      let itemList: any = [];
      QuotationDetails.forEach((element) => {
        itemList.push({
          BranchId: allData.BranchId,
          WareHouseId: allData.WareHouseId,
          BranchCode: companyData.BranchCode,
          CompanyCode: companyData.BranchCode,
          DepartmentId: allData.DepartmentId,
          FinancialYear: FinancialYear.Name,
          ItemId: element.ItemId,
          Qty: element.Qty,
          UnitPrice: element.UnitPrice,
          TotalAmount: parseInt(element.TotalAmount),
          UserName: userDetail.UserName,
          UnitType: element.UnitType,
        });
      });
      const OrderDetailsObject = {
        AccountId: allData.AccountId,
        EnglishDate: getEnglishDateOrder?.substring(0, 10),
        NepaliDate: allData.NepaliDate,
        DueNepaliDate: allData.ExpiredNepaliDate,
        DueEnglishDate: getEnglishExpireDate?.substring(0, 10),
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
        successMessage("Order created successfully");
        history.push("/order-management");
      } else {
        setOpenSaveDialog(false);
        errorMessage();
      }
    } else {
      const UpdateObject = {
        ...allData,
        Id: allData.Id,
        AccountId: allData.AccountId,
        ExpiredEnglishDate: getEnglishExpireDate?.substring(0, 10),
        ExpiredNepaliDate: allData.ExpiredNepaliDate,
        Message: allData.Message,
        MessageStatement: allData.MessageStatement,
        FinancialYear: allData.FinancialYear,
        CompanyCode: allData.CompanyCode,
        DepartmentId: allData.DepartmentId,
        WareHouseId: allData.WareHouseId,
        BranchId: allData.BranchId,
        QuotationDetails: QuotationDetails,
      };

      if (
        UpdateObject.NepaliDate.substring(0, 10).replaceAll("-", ".") >
        UpdateObject.ExpiredNepaliDate.substring(0, 10).replaceAll("-", ".")
      ) {
        setOpenSaveDialog(false);
        errorMessage("Quotation date must be greater !!");
      } else {
        const res = await editQuotation(paramId, UpdateObject);
        if (res) {
          setOpenSaveDialog(false);
          editMessage();
          history.push("/quotation");
        } else {
          setOpenSaveDialog(false);
          errorMessage();
        }
      }
    }
  };

  const deleteUserConfirm = async () => {
    setOpenDialog(false);
    const res = await deleteQuotation(paramId);
    if (res) {
      deleteMessage();
      history.push("/quotation");
    } else {
      errorMessage();
    }
  };

  const changeValues = (name: string, value: any) => {
    dispatch(updateQuoDataAction({ name: name, value: value }));
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
          <Grid item xs={12} md={6}>
            <TextField
              label={
                paramType === "createorder" ? "Order Date" : "Quotation Date"
              }
              size="small"
              fullWidth
              value={
                allData.NepaliDate
                  ? allData.NepaliDate.substring(0, 10).replaceAll("-", ".")
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputField
              helperText="Date format: YYYY.MM.DD"
              label="Due Date"
              required
              inputProps={{
                pattern:
                  "([1-9][0-9]{3}.((0[1-9])|(1[0-2])).((0[1-9])|(1[0-9])|(2[0-9])|(3[0-1])))",
              }}
              value={
                allData.ExpiredNepaliDate
                  ? allData.ExpiredNepaliDate.substring(0, 10).replaceAll(
                      "-",
                      "."
                    )
                  : ""
              }
              onChange={(e) =>
                changeValues("ExpiredNepaliDate", e.target.value)
              }
            />
          </Grid>
        </Grid>

        <RowHeaderQuotation />

        {QuotationDetails?.map((elm, i) => {
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
                      label="Product Name"
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
                  label="Quantity"
                  helperText="Enter Quantity"
                  name="Qty"
                  type="number"
                  required
                  value={elm.Qty}
                  onChange={(e) => addRowHandler(e, i)}
                />
              </Grid>
              <Grid xs item>
                <InputField
                  helperText="Enter Price"
                  label="Price"
                  type="number"
                  name="UnitPrice"
                  required
                  value={elm.UnitPrice.toString()}
                  onChange={(e) => addRowHandler(e, i)}
                />
              </Grid>

              <Grid xs item>
                <InputField
                  helperText="Enter Discount"
                  label="Discount"
                  type="number"
                  name="Discount"
                  required
                  value={elm.Discount && elm.Discount.toString()}
                  onChange={(e) => addRowHandler(e, i)}
                />
              </Grid>
              <Grid xs item>
                <TextField
                  size="small"
                  disabled
                  fullWidth
                  label="Total Amount"
                  type="number"
                  value={elm.TotalAmount && elm.TotalAmount}
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

        <Grid item xs={12} sx={{ textAlign: "end" }}>
          <Typography sx={{ fontWeight: "600" }}>
            Discount : {Discount > 0 ? Math.abs(Discount) : 0}
          </Typography>
        </Grid>
        <Grid xs={12} sx={{ textAlign: "end", my: 3 }}>
          <Typography sx={{ fontWeight: "600" }}>
            Sub Total : {sum ? sum : 0}
          </Typography>
        </Grid>

        <Grid
          container
          spacing={1}
          sx={{
            mx: "auto",
            mt: 2,
          }}
        >
          <Grid md={6} xs={12} item>
            <TextField
              multiline
              label={
                paramType === "createorder"
                  ? "Order Message"
                  : "Quotation Message"
              }
              helperText="Enter Quotation Message"
              rows="4"
              fullWidth
              name="message"
              placeholder="Text here..."
              value={allData.Message ? allData.Message : ""}
              error={!allData.Message}
              onChange={(e: any) => changeValues("Message", e.target.value)}
            />
          </Grid>
          <Grid md={6} xs={12} item>
            <TextField
              multiline
              label="Message Statement"
              helperText="Enter Message statement..."
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

        <Grid item xs={12} sx={{ textAlign: "end", my: 3 }}>
          {paramId === "add" ? (
            <SaveButton variant="outlined" />
          ) : paramType === "createorder" ? (
            <>
              <CreateButton btnName="Create Order" />
            </>
          ) : (
            <>
              <UpdateButton variant="outlined" />
              {loginedUserRole.includes("QuotationDelete") ? (
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
