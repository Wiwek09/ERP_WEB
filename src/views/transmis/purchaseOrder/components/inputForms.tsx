import {
  Autocomplete,
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { RiDeleteBack2Fill } from "react-icons/ri";
import { useHistory } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { DeleteDialog, SaveProgressDialog } from "../../../../components/dialogBox";
import { selectCompany } from "../../../../features/companySlice";
import { getCurrentFinancialYear } from "../../../../features/financialYearSlice";
import { updatePurOrDataAction } from "../../../../features/purorSlice";
import { selectUser } from "../../../../features/userSlice";
import { ISelectType } from "../../../../interfaces/autoComplete";
import { IBranch } from "../../../../interfaces/branch";
import { IDepartment } from "../../../../interfaces/department";
import { IOnSubmit } from "../../../../interfaces/event";
import {
  IAccountHolder,
  IPurchaseMenu,
  IPurchaseOrder,
  IPurchaseOrderDetails,
} from "../../../../interfaces/purchaseOrder";
import { IWarehouse } from "../../../../interfaces/warehouse";
import { getAllBranch } from "../../../../services/branchApi";
import { getAllDepartments } from "../../../../services/departmentApi";
import { getEnglishDate } from "../../../../services/getEnglishDate";
import {
  addPurchaseOrder,
  deletePurchaseOrder,
  deleteSinglePurchaseOrderRow,
  editPurchaseOrder,
  getAllAccountHolder,
  getAllPurchase,
} from "../../../../services/purchaseOrderApi";
import { getAllWarehouseData } from "../../../../services/warehouseApi";
import {
  CloseButton,
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
import RowHeader from "./rowHeader";
interface IProps {
  allData: IPurchaseOrder;
  setAllData: any;
  paramId: string;
}
const InputForms = ({ allData, setAllData, paramId }: IProps) => {
  const [branchDetails, setBranchDetails] = useState<ISelectType[]>([]);
  const [accountHolder, setAccountHolder] = useState<ISelectType[]>([]);
  const [products, setProducts] = useState<ISelectType[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [warehouse, setWarehouse] = useState<ISelectType[]>([]);
  const [filterWarehouse, setFilterWarehouse] = useState<any[]>([]);
  const [department, setDepartment] = useState<ISelectType[]>([]);
  const { PurchaseOrderDetails } = allData;
  const history = useHistory();
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName)

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

  const validationRow = PurchaseOrderDetails.every(
    (item) => item.ItemId && item.Qty && item.UnitPrice
  );
  const addNewRow = (e: any) => {
    e.preventDefault();
    if (validationRow) {
      let data = [...PurchaseOrderDetails];
      data.push({
        ItemId: "",
        Qty: "",
        UnitPrice: "",
        Discount: "",
        TaxRate: "",
        TotalAmount: "",
      });

      setAllData({
        ...allData,
        PurchaseOrderDetails: data,
      });
    } else {
      errorMessage("Data must be filled");
    }
  };

  const addRowHandler = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    let list = [...PurchaseOrderDetails];
    let name = e.target.name;
    let value = e.target.value;

    switch (name) {
      case "Qty":
        list[i]["Qty"] = value;
        let amount = parseInt(value) * parseInt(list[i].UnitPrice)
        list[i]["TotalAmount"] = amount.toString();
        break;
      case "UnitPrice":
        list[i]["UnitPrice"] = value;
        let amt = parseInt(value) * parseInt(list[i].Qty)
        list[i]["TotalAmount"] = amt.toString();
        break;
    }

    setAllData({ ...allData, PurchaseOrderDetails: list });
  };

  const deleteNewRow = async (id: number, rowId: any) => {
    if (PurchaseOrderDetails.length > 1) {
      if (rowId) {
        const res: any = await deleteSinglePurchaseOrderRow(rowId);
        if (res) {
          deleteRowMessage();
          const lists = [...PurchaseOrderDetails];
          lists.splice(id, 1);
          setAllData({ ...allData, PurchaseOrderDetails: lists });
        } else {
          errorMessage();
        }
      } else {
        const lists = [...PurchaseOrderDetails];
        lists.splice(id, 1);
        setAllData({ ...allData, PurchaseOrderDetails: lists });
      }
    } else {
      errorMessage("There must be atleast 1 product");
    }
  };

  const addselectHandler = (e: any, i: number) => {
    let list = [...PurchaseOrderDetails];
    let { value } = e;

    const getItemData: IPurchaseOrderDetails = allProducts.find(
      (elm) => elm.Id === value
    );
    list[i]["ItemId"] = value;
    list[i]["UnitType"] = getUnitType(value);
    list[i]["Qty"] = getItemData.Qty;
    list[i]["UnitPrice"] = getItemData.UnitPrice;

    setAllData({ ...allData, PurchaseOrderDetails: list });
  };

  const getUnitType = (id: number) => {
    for (let index = 0; index < products.length; index++) {
      if (products[index].value === id) {
        return products[index].unitType;
      }
    }
  };

  const onSubmitHandler = async (e: IOnSubmit) => {
    e.preventDefault();
    setOpenSaveDialog(true);
    const getEnglishDateD = await getEnglishDate(allData.NepaliDate);
    const getEnglishExpireDate = await getEnglishDate(
      allData.ExpiredNepaliDate
    );

    if (paramId === "add") {
      if (getEnglishDateD > getEnglishExpireDate) {
        setOpenSaveDialog(false);
        errorMessage("Purchase date must be greater !!");
      } else {
        let itemList: any = [];
        PurchaseOrderDetails.forEach((element) => {
          itemList.push({
            BranchId: allData.BranchId,
            WareHouseId: allData.WareHouseId,
            CompanyCode: companyData.BranchCode,
            DepartmentId: allData.DepartmentId,
            FinancialYear: FinancialYear.Name,
            ItemId: element.ItemId,
            Qty: parseInt(element.Qty),
            UnitPrice: parseFloat(element.UnitPrice),
            TotalAmount: parseInt(element.Qty) * parseInt(element.UnitPrice),
            UserName: userDetail.UserName,
            UnitType: element.UnitType,
          });
        });
        const purchaseOrderDetailsObject = {
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
          PurchaseOrderDetails: itemList,
        };
        const res: any = await addPurchaseOrder(purchaseOrderDetailsObject);
        if (res) {
          setOpenSaveDialog(false);
          history.push("/purchase-order");
          successMessage();
        } else {
          setOpenSaveDialog(false);
          errorMessage();
        }
      }
    } else {
      const UpdateObject = {
        ...allData,
        Id: allData.Id,
        AccountId: allData.AccountId,
        EnglishDate: allData.EnglishDate,
        NepaliDate: allData.NepaliDate,
        ExpiredEnglishDate: allData.ExpiredEnglishDate,
        ExpiredNepaliDate: allData.ExpiredNepaliDate,
        Message: allData.Message,
        MessageStatement: allData.MessageStatement,
        FinancialYear: allData.FinancialYear,
        CompanyCode: allData.CompanyCode,
        DepartmentId: allData.DepartmentId,
        WareHouseId: allData.WareHouseId,
        BranchId: allData.BranchId,
        PurchaseOrderDetails: PurchaseOrderDetails,
      };
      if (
        UpdateObject.NepaliDate.substring(0, 10).replaceAll("-", ".") >
        UpdateObject.ExpiredNepaliDate.substring(0, 10).replaceAll("-", ".")
      ) {
        setOpenSaveDialog(false);
        errorMessage("Purchase date must be greater !!");
      } else {
        const res = await editPurchaseOrder(paramId, UpdateObject);
        if (res) {
          setOpenSaveDialog(false);
          editMessage();
          history.push("/purchase-order");
        } else {
          setOpenSaveDialog(false);
          errorMessage();
        }
      }
    }
  };

  const deleteUserConfirm = async () => {
    setOpenDialog(false);
    const res = await deletePurchaseOrder(paramId);
    if (res) {
      deleteMessage();
      history.push("purchase-order");
    } else {
      errorMessage();
    }
  };

  const changeValues = (name: string, value: any) => {
    dispatch(updatePurOrDataAction({ name: name, value: value }));
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
          <Grid item xs={12} md={8}>
            <Autocomplete
              disablePortal
              options={accountHolder}
              onChange={(e, v) =>
                changeValues( "AccountId",  v.value )
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
                  error={!allData.AccountId}
                  label="Account Holder"
                  variant="outlined"
                  size="small"
                  required
                  fullWidth
                  helperText="Select Account holder"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              disablePortal
              options={branchDetails}
              onChange={(e, v) => changeValues( "BranchId", v.value )}
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
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Autocomplete
              disablePortal
              options={optionsWarehouse ? optionsWarehouse : []}
              onChange={(e, v) =>
                changeValues( "WareHouseId", v.value )
              }
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
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Autocomplete
              disablePortal
              options={department}
              onChange={(e, v) =>
                changeValues( "DepartmentId", v.value )
              }
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
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              label="Purchase Order Date"
              size="small"
              fullWidth
              value={
                allData.NepaliDate
                  ? allData.NepaliDate.substring(0, 10).replaceAll("-", ".")
                  : ""
              }
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <InputField
              helperText="Date format: YYYY.MM.DD"
              label="Expiry Date"
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
                changeValues( "ExpiredNepaliDate", e.target.value )
              }
            />
          </Grid>
        </Grid>

        <RowHeader />

        {PurchaseOrderDetails.map((elm, i) => {
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
              <Grid md={5} xs={12} item>
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
                />
              </Grid>
              <Grid md={2} xs={6} item>
                <InputField
                  helperText="Select Quantity"
                  label="Quantity"
                  name="Qty"
                  type="number"
                  required
                  value={elm.Qty}
                  onChange={(e) => addRowHandler(e, i)}
                />
              </Grid>
              <Grid md={2} xs={6} item>
                <InputField
                  helperText="Select Price"
                  label="Price"
                  type="number"
                  name="UnitPrice"
                  required
                  value={elm.UnitPrice}
                  onChange={(e) => addRowHandler(e, i)}
                />
              </Grid>
              <Grid md={2} xs={10} item>
                <TextField
                  size="small"
                  disabled
                  label="Total Amount"
                  type="number"
                  fullWidth
                  value={
                    parseInt(elm.Qty) * parseInt(elm.UnitPrice)
                      ? parseInt(elm.Qty) * parseInt(elm.UnitPrice)
                      : "0"
                  }
                />
              </Grid>
              <Grid md={1} xs={2} item>
                <IconButton color="error">
                  <RiDeleteBack2Fill
                    onClick={(e) => deleteNewRow(i, elm.PurchaseOrderId)}
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
              label="Message"
              helperText="Enter Message"
              rows="4"
              fullWidth
              name="message"
              placeholder="Text here..."
              value={allData.Message}
              error={!allData.Message}
              onChange={(e: any) =>
                changeValues("Message", e.target.value )
              }
            />
          </Grid>
          <Grid md={6} xs={12} item>
            <TextField
              multiline
              label="Message Statement"
              helperText="Enter Message statement"
              rows="4"
              fullWidth
              name="messageStatement"
              placeholder="Text here..."
              value={allData.MessageStatement}
              error={!allData.MessageStatement}
              onChange={(e: any) =>
                changeValues("MessageStatement", e.target.value )
              }
            />
          </Grid>
        </Grid>

        <Grid item xs={12} sx={{ textAlign: "end", my: 3 }}>
          {paramId === "add" ? (
            <SaveButton variant="outlined" />
          ) : (
            <>
              <UpdateButton variant="outlined" />
              {
                loginedUserRole.includes("PODelete")?
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
