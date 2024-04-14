import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useHistory, useParams } from "react-router";
import { IBranch } from "../../../../interfaces/branch";
import { ICategory } from "../../../../interfaces/category";
import { IDepartment } from "../../../../interfaces/department";
import { IParams } from "../../../../interfaces/params";
import { IProduct } from "../../../../interfaces/product";
import { IUnitType } from "../../../../interfaces/unitType";
import { IWarehouse } from "../../../../interfaces/warehouse";
import { getAllBranch } from "../../../../services/branchApi";
import { getAllCategory } from "../../../../services/categoryApi";
import { getAllDepartments } from "../../../../services/departmentApi";
import { getAllUnitType } from "../../../../services/unitTypeApi";
import { getAllWarehouseData } from "../../../../services/warehouseApi";
import {
  CloseButton,
  DeleteButton,
  SaveButton,
  UpdateButton,
} from "../../../../utils/buttons";
import InputField from "../../../../utils/customTextField";
import AddModalComponent from "./AddModalComponent";
import AddWarehouseModal from "./AddWarehouseModal";
import { _deleteProduct_ } from "./helperFunctions";
import ItemTableComponent from "./ItemTableComponent";
import handleRenderOption from "../../../../utils/autoSuggestHighlight";
import { DeleteDialog } from "../../../../components/dialogBox";
import ProductPictures from "./ProductPictures";
import { getAllProducts } from "../../../../services/productApi";
import { errorMessage } from "../../../../utils/messageBox/Messages";
interface IProps {
  data: IProduct;
  setData: any;
  onSubmit: any;
}
interface ILists {
  label: string;
  value: any;
}
const useStyles = makeStyles({
  field: {
    float: "left",
  },
  addingBtn: {
    cursor: "pointer",
    float: "left",
    marginLeft: "7px",
    paddingTop: "7px",
    paddingBottom: "4px",
    display: "block",
    width: "39px",
    fontSize: 38,
    border: "1px solid",
    borderRadius: "4px",
  },
  flexProperty: {
    display: "flex",
  },
});

const ProductForm = ({ data, setData, onSubmit }: IProps) => {
  const classes = useStyles();
  const [categoryList, setCategoryList] = useState<any>([]);
  const [branchList, setBranchList] = useState<any>([]);
  const [warehouseList, setWarehouseList] = useState<any>([]);
  const [departmentList, setDepartmentList] = useState<any>([]);
  const [mouList, setMouList] = useState<any>([]);
  const { id }: IParams = useParams();
  const [products, setProducts] = useState([]);

  const getCategoryList = async () => {
    const response = await getAllCategory();
    if (response) {
      setCategoryList(
        response.map((item: ICategory) => ({
          label: item.Name,
          value: item.Id,
        }))
      );
    }
  };

  const getBranchList = async () => {
    const response = await getAllBranch();
    if (response) {
      setBranchList(
        response.map((item: IBranch) => ({
          label: item.NameEnglish,
          value: item.Id,
        }))
      );
    }
  };

  const getWarehouseList = async () => {
    const response = await getAllWarehouseData();
    if (response) {
      setWarehouseList(
        response.map((item: IWarehouse) => ({
          label: item.Name,
          value: item.Id,
        }))
      );
    }
  };
  const getDepartmentList = async () => {
    const response = await getAllDepartments();
    if (response) {
      setDepartmentList(
        response.map((item: IDepartment) => ({
          label: item.Name,
          value: item.Id,
        }))
      );
    }
  };

  const getMOUList = async () => {
    const response = await getAllUnitType();
    if (response) {
      setMouList(
        response.map((item: IUnitType) => ({
          label: item.Name,
          value: item.Name,
        }))
      );
    }
  };

  const getProductList = async () => {
    const response = await getAllProducts();
    if (response) {
      setProducts(
        response.map((product: IProduct) => ({
          label: product.Name,
          value: product.Id,
        }))
      );
    }
  };

  let category =
    data && categoryList.find((obj: ILists) => obj.value === data.categoryId);

  let branch =
    data && branchList.find((obj: ILists) => obj.value === data.BranchId);

  let warehouse =
    data && warehouseList.find((obj: ILists) => obj.value === data.WareHouseId);

  let department =
    data &&
    departmentList.find((obj: ILists) => obj.value === data.DepartmentId);

  let unitType =
    data && mouList.find((obj: ILists) => obj.value === data.UnitType);
  let unitTypeBase =
    data && mouList.find((obj: ILists) => obj.value === data.UnitTypeBase);

  useEffect(() => {
    getCategoryList();
    getBranchList();
    getWarehouseList();
    getDepartmentList();
    getMOUList();
    getProductList();
  }, []);

  useEffect(() => {
    if(id === "add"){
      if(products.find((obj: ILists) => obj.label === data.Name) || products.find((obj: ILists) => obj.label.toLowerCase() === data.Name)){
        errorMessage(`The name ${data.Name} is already used...`);
      }
    }else{
    }
  },[data]);

  const history = useHistory();

  const [openDialogAdd, setOpenDialogAdd] = useState(false);
  const [selectedHeading, setSelectedHeading] = useState("");
  const addNewCategory = () => {
    setOpenDialogAdd(true);
    setSelectedHeading("category");
  };

  const addBranch = () => {
    setOpenDialogAdd(true);
    setSelectedHeading("branch");
  };

  const [openDialogWarehouse, setOpenDialogWarehouse] = useState(false);
  const addWarehouse = () => {
    setOpenDialogWarehouse(true);
    setSelectedHeading("warehouse");
  };

  const addDepartment = () => {
    setOpenDialogAdd(true);
    setSelectedHeading("department");
  };

  const addUnitType = () => {
    setOpenDialogAdd(true);
    setSelectedHeading("unit type");
  };

  const [openDialog, setOpenDialog] = useState(false);
  const deleteProduct = async () => {
    const response = await _deleteProduct_(data.Id);
    if (response) {
      history.push("/products");
    }
  };

  const getRefreshList = (selected: string) => {
    if (selected === "category") {
      getCategoryList();
      return;
    } else if (selected === "branch") {
      getBranchList();
      return;
    } else if (selected === "department") {
      getDepartmentList();
      return;
    } else if (selected === "unit type") {
      getMOUList();
      return;
    }
  };

  //handle changes in exise and tex
  const handleChanges = (e:any) => {
    setData({
      ...data,
      ExciseDuty: parseFloat(e.target.value).toFixed(2)
      // ExciseDuty: e.target.value
    })
  }

  return (
    <>
      <Paper
        component="form"
        autoComplete="off"
        onSubmit={onSubmit}
        sx={{
          py: 2,
          mt: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          "& > :not(style)": { m: 1 },
        }}
      >
        <Grid container spacing={2} sx={{paddingRight: 2}}>
          <Grid item xs={12} md={6}>
            <InputField
              helperText="Please enter product name"
              placeholder="Name"
              value={data && data.Name ? data.Name : ""}
              onChange={(e) => setData({ ...data, Name: e.target.value })}
              name="Name"
              label="Name"
              required
            />
          </Grid>
          <Grid item xs={12} md={6} className={classes.flexProperty}>
            {/*add renderOption for text highlighting */}
            <Autocomplete
              fullWidth
              id="highlights"
              disablePortal
              options={categoryList}
              value={category ? category.label : ""}
              onChange={(e, v) => setData({ ...data, categoryId: v.value })}
              isOptionEqualToValue={(option, value) =>
                option.label === value.label
              }
              disableClearable
              renderInput={(params) => (
                <TextField
                  {...params}
                  helperText="Please select category"
                  placeholder="Category"
                  name="Category"
                  label="Category"
                  variant="outlined"
                  required
                  size="small"
                  className={classes.field}
                />
              )}
              renderOption={handleRenderOption}//add this
            />
            <IoIosAddCircleOutline
              onClick={addNewCategory}
              className={classes.addingBtn}
            />
          </Grid>
          <Grid item xs={12} md={6} className={classes.flexProperty}>
            <Autocomplete
              fullWidth
              disablePortal
              options={branchList && branchList}
              value={branch ? branch.label : ""}
              onChange={(e, v) => setData({ ...data, BranchId: v.value })}
              isOptionEqualToValue={(option, value) =>
                option.label === value.label
              }
              disableClearable
              renderInput={(params) => (
                <TextField
                  {...params}
                  helperText="Please select Branch"
                  placeholder="Branch"
                  name="Branch"
                  label="Branch"
                  required
                  variant="outlined"
                  size="small"
                  className={classes.field}
                />
              )}
            />
            <IoIosAddCircleOutline
              onClick={addBranch}
              className={classes.addingBtn}
            />
          </Grid>
          <Grid item xs={12} md={6} className={classes.flexProperty}>
            <Autocomplete
              fullWidth
              disablePortal
              options={warehouseList && warehouseList}
              value={warehouse ? warehouse.label : ""}
              onChange={(e, v) => setData({ ...data, WareHouseId: v.value })}
              isOptionEqualToValue={(option, value) =>
                option.label === value.label
              }
              disableClearable
              renderInput={(params) => (
                <TextField
                  {...params}
                  helperText="Please select warehouse "
                  placeholder="Warehouse"
                  name="Warehouse"
                  label="Warehouse"
                  required
                  variant="outlined"
                  size="small"
                  className={classes.field}
                />
              )}
            />
            <IoIosAddCircleOutline
              onClick={addWarehouse}
              className={classes.addingBtn}
            />
          </Grid>
          <Grid item xs={12} md={6} className={classes.flexProperty}>
            <Autocomplete
              fullWidth
              disablePortal
              options={departmentList && departmentList}
              value={department ? department.label : ""}
              onChange={(e, v) => setData({ ...data, DepartmentId: v.value })}
              isOptionEqualToValue={(option, value) =>
                option.label === value.label
              }
              disableClearable
              renderInput={(params) => (
                <TextField
                  {...params}
                  helperText="Please select department"
                  placeholder="Department"
                  name="Department"
                  label="Department"
                  required={false}
                  variant="outlined"
                  size="small"
                  className={classes.field}
                />
              )}
            />

            <IoIosAddCircleOutline
              onClick={addDepartment}
              className={classes.addingBtn}
            />
          </Grid>
          <Grid item xs={12} md={6} className={classes.flexProperty}>
            <Autocomplete
              fullWidth
              disablePortal
              options={mouList && mouList}
              value={unitType ? unitType.label : ""}
              onChange={(e, v) => setData({ ...data, UnitType: v.value })}
              isOptionEqualToValue={(option, value) =>
                option.label === value.label
              }
              disableClearable
              renderInput={(params) => (
                <TextField
                  {...params}
                  helperText="Please select OUM sales"
                  placeholder="OUM Sales"
                  name="OUM sales"
                  label="OUM sales"
                  required
                  variant="outlined"
                  size="small"
                  className={classes.field}
                />
              )}
            />
            <IoIosAddCircleOutline
              onClick={addUnitType}
              className={classes.addingBtn}
            />
          </Grid>
          <Grid item xs={12} md={6} className={classes.flexProperty}>
            <Autocomplete
              fullWidth
              disablePortal
              options={mouList && mouList}
              value={unitTypeBase ? unitTypeBase.label : ""}
              onChange={(e, v) => setData({ ...data, UnitTypeBase: v.value })}
              isOptionEqualToValue={(option, value) =>
                option.label === value.label
              }
              disableClearable
              renderInput={(params) => (
                <TextField
                  {...params}
                  helperText="Please select OUM purchase"
                  placeholder="OUM purchase"
                  name="OUM purchase"
                  label="OUM purchase"
                  required
                  variant="outlined"
                  size="small"
                  className={classes.field}
                />
              )}
            />
            <IoIosAddCircleOutline
              onClick={addUnitType}
              className={classes.addingBtn}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              helperText="Please enter unit divided"
              label="Unit Divided"
              variant="outlined"
              placeholder="Unit Divided"
              value={data.UnitDivided}
              onChange={(e) =>
                setData({ ...data, UnitDivided: e.target.value })
              }
              name="Unit Divided"
              type="number"
              required
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              helperText="Please enter Excise duty"
              label="Excise Duty"
              variant="outlined"
              placeholder="Excise Duty"
              value={data.ExciseDuty}
              // onChange={(e) => setData({ ...data, ExciseDuty: e.target.value })}
              onChange = {handleChanges}
              name="ExciseDuty"
              type="number"
              required
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              helperText="Please enter tax rate (%)"
              label="Tax Rate"
              variant="outlined"
              placeholder="Tax Rate"
              value={Number(data.TaxRate)}
              onChange={(e) => setData({ ...data, TaxRate: e.target.value})}
              name="TaxRate"
              type="number"
              required
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              helperText="Please enter margin rate (%)"
              label="Margin rate"
              variant="outlined"
              placeholder="Margin rate"
              value={data.MarginRate}
              onChange={(e) => setData({ ...data, MarginRate: e.target.value })}
              name="Margin rate"
              type="number"
              required
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              helperText="Please enter Cost Price"
              label="Cost Price"
              variant="outlined"
              placeholder="Cost Price"
              value={data.CostPrice}
              onChange={(e) => setData({ ...data, CostPrice: e.target.value })}
              name="Cost Price"
              type="number"
              required
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              helperText="Please enter description"
              label="Description"
              variant="outlined"
              placeholder="Description"
              value={data ? data.Description : " "}
              onChange={(e) =>
                setData({ ...data, Description: e.target.value })
              }
              name="Description"
              error={!data.Description}
              multiline
              rows={3}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TextField
              helperText="Please enter meta description"
              label="Meta Description"
              variant="outlined"
              placeholder="Meta Description"
              value={data ? data.MetaDescription : " "}
              onChange={(e) =>
                setData({ ...data, MetaDescription: e.target.value })
              }
              name="Meta Description"
              error={!data.MetaDescription}
              multiline
              rows={3}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <FormControlLabel
              sx={{ px: 2 }}
              control={
                <Checkbox
                  color="primary"
                  checked={data.IsProduct}
                  onChange={(e) =>
                    setData({
                      ...data,
                      ["IsProduct"]: !data.IsProduct,
                    })
                  }
                />
              }
              label="Raw Material"
            />
            <FormControlLabel
              control={
                <Checkbox
                  value="Service"
                  color="primary"
                  checked={data.IsService}
                  onChange={(e) =>
                    setData({
                      ...data,
                      IsService: !data.IsService,
                    })
                  }
                />
              }
              label="Service"
            />

            <FormControlLabel
              control={
                <Checkbox
                  value="MenuItem"
                  color="primary"
                  checked={data.IsMenuItem}
                  onChange={(e) =>
                    setData({
                      ...data,
                      IsMenuItem: !data.IsMenuItem,
                    })
                  }
                />
              }
              label="Menu Item"
            />
            <FormControlLabel
              control={
                <Checkbox
                  value="BestSeller"
                  color="primary"
                  checked={data.BestSeller}
                  onChange={(e) =>
                    setData({
                      ...data,
                      BestSeller: !data.BestSeller,
                    })
                  }
                />
              }
              label="Best Seller"
            />
            <FormControlLabel
              control={
                <Checkbox
                  value="FeaturedSeller"
                  color="primary"
                  checked={data.FeaturedSeller}
                  onChange={(e) =>
                    setData({
                      ...data,
                      FeaturedSeller: !data.FeaturedSeller,
                    })
                  }
                />
              }
              label="Featured Seller"
            />            
          </Grid>
          {id!=='add'
            ?(
              <Grid item xs={12} md={12}>
                <ProductPictures />
              </Grid>
            ):''}
          
          <Grid item xs={12} md={12}>
            <ItemTableComponent data={data} setData={setData} />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "end" }}>
            {id === "add" ? (
              <SaveButton variant="outlined" />
            ) : (
              <>
                {" "}
                <UpdateButton variant="outlined" />{" "}
                <DeleteButton
                  onClick={(e) => setOpenDialog(true)}
                  variant="outlined"
                />{" "}
              </>
            )}

            <CloseButton variant="outlined" />
          </Grid>
        </Grid>

        <AddModalComponent
          openDialogAdd={openDialogAdd}
          setOpenDialogAdd={setOpenDialogAdd}
          selectedHeading={selectedHeading}
          getRefreshList={getRefreshList}
        />
        <AddWarehouseModal
          openDialogWarehouse={openDialogWarehouse}
          setOpenDialogWarehouse={setOpenDialogWarehouse}
          getRefreshList={getWarehouseList}
        />
        <DeleteDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          name={data.Name}
          deleteData={deleteProduct}
        />
      </Paper>
    </>
  );
};

export default ProductForm;
