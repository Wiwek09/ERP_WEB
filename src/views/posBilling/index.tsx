import { Grid, LinearProgress } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { IOnChange, IOnSubmit } from "../../interfaces/event";
import { ILedger, IProduct } from "../../interfaces/posBiling";
import {
  getAllLedger,
  getAllProducts,
  postLedger,
  postPosBilling,
} from "../../services/posBilling";
import { errorMessage, successMessage } from "../../utils/messageBox/Messages";
import { getNepaliDate } from "../../utils/nepaliDate";
import EditProductModal from "./components/EditProductModal";
import GrandDetails from "./components/GrandDetails";
import PosForm from "./components/PosForm";
import PosHeader from "./components/PosHeader";
import PosTable from "./components/PosTable";
import Products from "./components/Products";
import {
  IFormData,
  IGrandDetails,
  IMinimumLedgerDetails,
  INormalizedPosData,
  INormalizedProduct,
  IPosSelectedFormData,
  ISelectedProducts,
} from "./interface";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import PosBtnContainer from "./components/PosButtonContainer";
import { getAllBranch } from "../../services/branchApi";
import { IBranch } from "../../interfaces/branch";
import { getAllWarehouseData } from "../../services/warehouseApi";
import { IWarehouse } from "../../interfaces/warehouse";
import { getAllDepartments } from "../../services/departmentApi";
import { IDepartment } from "../../interfaces/department";
import AddUserModal from "./components/AddUserModal";
import { useHistory } from "react-router";
import {
  resetPosDataAction,
  updatePosDataAction,
} from "../../features/posSlice";
import Product from "../inventory/product";
import { SaveProgressDialog } from "../../components/dialogBox";
import { getAllStockInHands } from "../../services/stockInHandsApi";
import GetReturnBox from "./components/GetReturnBox";
import { IsDateValidation } from "./dateValidation";

// Initial data
const initialPosForm: IPosSelectedFormData = {
  branch: null,
  warehouse: null,
  department: null,
  ledger: null,
  salesType: null,
};

const initialGrandDeails: IGrandDetails = {
  amount: 0,
  discount: 0,
  taxable: 0,
  taxableafterdic: 0,
  nonTaxable: 0,
  nonTaxableafterdic: 0,
  tax: 0,
  taxafterdic: 0,
  total: 0,
};

const initialEditProductDtl: ISelectedProducts = {
  ItemId: 0,
  ItemName: "",
  Qty: 0,
  InitialQty: 0,
  UnitType: "",
  TotalAmount: 0,
  UnitPrice: 0,
  InitialPrice: 0,
  MRPPrice: 0,
  TaxType: null,
  TaxValue: 0,
  Tax: 0,
  TaxRate: 0,
  DiscountType: null,
  DiscountValue: 0,
  Discount: 0,
  FinancialYear: "",
  UserId: null,
  DepartmentId: null,
  WarehouseId: null,
  BranchId: null,
};

const initialNewLedgerDtl: IMinimumLedgerDetails = {
  name: null,
  address: null,
  telephoneNo: null,
  email: null,
  panvat: null,
};

const PosBilling = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();

  // getting mendatory data from redux
  const userName = useAppSelector((state) => state.user.data.UserName);
  const companyId = useAppSelector((state) => state.company.data.Id);
  const currentFinancialYear = useAppSelector(
    (state) => state.financialYear.Name
  );
  const financialYear = useAppSelector((state) => state.financialYear);

  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [areAllDataLoaded, setAreAllDataLoaded] = useState<boolean>(false);

  const posData = useAppSelector((state) => state.posData.data);
  const [selectedFormData, setSelectedFormData] =
    useState<IPosSelectedFormData>({
      ...posData,
      ledger: null,
      salesType: null,
    });

  const [selectedProducts, setSelectedProducts] = useState<ISelectedProducts[]>(
    []
  );
  const [grandDetails, setGrandDetails] =
    useState<IGrandDetails>(initialGrandDeails);

  const [products, setProducts] = useState<IProduct[]>([]);
  const [stockproducts, setStockProducts] = useState<any[]>([]);
  const [branch, setBranch] = useState<IFormData[]>([]);
  const [warehouse, setWarehouse] = useState<IFormData[]>([]);
  const [department, setDepartment] = useState<IFormData[]>([]);
  const [ledger, setLedger] = useState<IFormData[]>([]);

  const [editProduct, setEditProduct] = useState<ISelectedProducts>(
    initialEditProductDtl
  );

  const [payAmt, setPayAmt] = useState(0);
  const [paymentOk, setPaymentOk] = useState<boolean>(true);
  const [editProductModalDisplay, setEditProductModalDispaly] =
    useState<boolean>(false);

  const [newLedger, setNewLedger] =
    useState<IMinimumLedgerDetails>(initialNewLedgerDtl);
  const [userModalDispaly, setUserModalDispaly] = useState<boolean>(false);

  useEffect(() => {
    const getLocalItem = () => {
      let data = localStorage.getItem("myPageDataArr");
      if (data !== "undefined") {
        window.opener = null;
        window.open("", "_self");
        window.close();
      } else {
      }
    };
    getLocalItem();
  });

  // Function to set data

  const setData = async () => {
    try {
      const productsData = await getAllProducts();
      const stockProductData = await getAllStockInHands(
        getNepaliDate(),
        currentFinancialYear
      );
      const branchData = await getAllBranch();
      const warehouseData = await getAllWarehouseData();
      const departmentData = await getAllDepartments();
      const ledgerData = await getAllLedger();

      setProducts(
        productsData.map((data: IProduct) => {
          return data;
        })
      );
      setStockProducts(
        stockProductData.map((data: any) => {
          return data;
        })
      );

      setBranch(
        branchData.map((data: IBranch) => {
          return { id: data.Id, label: data.NameEnglish };
        })
      );
      setWarehouse(
        warehouseData.map((data: IWarehouse) => {
          return { id: data.Id, label: data.Name };
        })
      );

      setDepartment(
        departmentData.map((data: IDepartment) => {
          return { id: data.Id, label: data.Name };
        })
      );
      setLedger(
        ledgerData.map((data: ILedger) => {
          return { id: data.Id, label: data.Name };
        })
      );
      setAreAllDataLoaded(true);
    } catch {
      errorMessage("Something went wrong. Please try again later.");
      history.push("/");
    }
  };

  let prevCount = 0;
  useEffect(() => {
    if (!IsDateValidation(getNepaliDate(), financialYear)) {
      errorMessage("Invalid Financial Year");
      return;
    }
    setData();
  }, [selectedProducts]);

  useEffect(() => {
    let grandDiscount = 0;
    let grandTaxable = 0;
    let grandTaxableafterdic = 0;
    let grandNonTaxable = 0;
    let grandNonTaxableafterdic = 0;
    let grandTax = 0;
    let grandTaxafterdic = 0;
    let grandTotal = 0;
    let amount = 0;
    selectedProducts.forEach((element) => {
      grandDiscount += element.Discount * 1;
      amount += element.UnitPrice * element.InitialQty;
      // let excAmount = 0;
      if (element.TaxRate > 0) {
        const taxValue =
          (element.InitialQty * element.UnitPrice * element.TaxRate) / 100;
        grandTax += taxValue;
        if (element.DiscountType === "Percent") {
          let dictax = (taxValue * element.DiscountValue) / 100;
          grandTaxafterdic += taxValue - dictax;
        } else {
          let dictax = (element.DiscountValue * element.TaxRate) / 100;
          grandTaxafterdic += taxValue - dictax;
        }
        grandTaxable += element.UnitPrice * element.InitialQty;
        // const dictaxable = ((element.UnitPrice * element.InitialQty) * element.DiscountValue) / 100;
        grandTaxableafterdic +=
          element.UnitPrice * element.InitialQty - element.Discount;
      } else {
        // grandTax += element.Tax * element.InitialQty;
        const nonTaxValue = element.UnitPrice * element.InitialQty;
        grandNonTaxable += nonTaxValue;
        // let dicnontax = (nonTaxValue * element.DiscountValue) / 100;
        grandNonTaxableafterdic = +nonTaxValue - element.Discount;
      }
    });
    grandTotal =
      grandTaxableafterdic + grandTaxafterdic + grandNonTaxableafterdic;
    setGrandDetails({
      amount: amount,
      discount: grandDiscount,
      taxable: grandTaxable,
      taxableafterdic: grandTaxableafterdic,
      nonTaxable: grandNonTaxable,
      nonTaxableafterdic: grandNonTaxableafterdic,
      tax: grandTaxafterdic,
      taxafterdic: grandTaxafterdic,
      total: grandTotal,
    });
  }, [selectedProducts]);

  useEffect(() => {
    if (payAmt < grandDetails.total) {
      errorMessage(`Paying Amount must be equal to ${grandDetails.total}`);
      setPaymentOk(true);
      return;
    } else {
      setPaymentOk(false);
    }
  }, [payAmt]);

  // Function to update selectedForm data
  const updateSelectedFormData = (name: string, value: any | null) => {
    if (name === "warehouse") {
      setSelectedFormData({
        ...selectedFormData,
        [name]: value,
        ["department"]: null,
      });
      dispatch(updatePosDataAction({ name: name, value: value }));
      dispatch(updatePosDataAction({ name: "department", value: null }));
      return;
    }
    if (name === "salesType") {
      if (value === "Cash Sales") {
        setPaymentOk(true);
      } else {
        setPaymentOk(false);
      }
    }
    dispatch(updatePosDataAction({ name: name, value: value }));
    setSelectedFormData({ ...selectedFormData, [name]: value });
  };

  // Functions for the products

  const increateQty = (index: number) => {
    setSelectedProducts(
      selectedProducts.map((data, i) => {
        if (index === i) {
          data.InitialQty = data.InitialQty + 1;
          data.TotalAmount = data.UnitPrice * data.InitialQty;
        }
        return data;
      })
    );
  };

  const setEditProductInputQty = (
    name: string,
    value: number,
    index: number
  ) => {
    const calculateDiscount = (
      taxType: any,
      price: number,
      discountRate: number
    ) => {
      if (taxType === null) {
        return 0;
      }
      if (taxType.toLowerCase() === "percent") {
        return (price * discountRate) / 100;
      } else {
        return discountRate;
      }
    };
    setSelectedProducts(
      selectedProducts.map((data, i) => {
        if (index === i) {
          if (name === "InitialQty") {
            const selectedStockList = stockproducts.find(
              (stockdata) => stockdata.Id === data.ItemId
            );
            if (value > selectedStockList.Qty) {
              errorMessage("Entered Quantity is out of Stock.");
              data.InitialQty = 0;
              data.UnitPrice = data.UnitPrice;
              data.TotalAmount = data.UnitPrice * data.InitialQty;
            } else {
              if (data.DiscountType !== null && data.DiscountValue > 0) {
                data.InitialQty = value;
                data.Discount = calculateDiscount(
                  data.DiscountType,
                  data.InitialPrice * data.InitialQty,
                  data.DiscountValue
                );
                let vals = products.filter(
                  (product) => product.ItemId === data.ItemId
                );
                let val = vals.filter(
                  (product) => product.Qty <= data.InitialQty
                );
                let arrayQty = val.sort((a, b) => (a.Qty < b.Qty ? 1 : -1));
                if (arrayQty.length === 0) {
                  data.UnitPrice = data.UnitPrice;
                } else {
                  data.UnitPrice = arrayQty[0].UnitPrice;
                }
              } else {
                data.InitialQty = value;
                let vals = products.filter(
                  (product) => product.ItemId === data.ItemId
                );
                let val = vals.filter(
                  (product) => product.Qty <= data.InitialQty
                );
                let arrayQty = val.sort((a, b) => (a.Qty < b.Qty ? 1 : -1));
                if (arrayQty.length === 0) {
                  data.UnitPrice = data.UnitPrice;
                } else {
                  data.UnitPrice = arrayQty[0].UnitPrice;
                }
              }
              data.TotalAmount =
                data.UnitPrice * data.InitialQty - data.Discount;
            }
          }
        }
        return data;
      })
    );
  };

  const setEditProductModalData = (index: number) => {
    setEditProduct(selectedProducts[index]);
    setEditProductModalDispaly(true);
  };

  const deleteSelectedProduct = (index: number) => {
    setSelectedProducts(
      selectedProducts.filter((data, i) => {
        if (i !== index) {
          return data;
        }
      })
    );
  };
  // Function to change the price in range

  const findrange = (productData: IProduct) => {
    if (selectedProducts.find((data) => data.ItemId === productData.Id)) {
      if (
        selectedProducts.find((data) => data.InitialQty === productData.Qty)
      ) {
      }
    }
  };

  // Function to add new product on the table.
  const addNewProduct = (productData: IProduct) => {
    if (selectedProducts.find((data) => data.ItemId === productData.Id)) {
      errorMessage("Sorry, you have already included this product.");
      return;
    }
    const selectedStockList = stockproducts.find(
      (data) => data.Id === productData.ItemId
    );

    if (selectedStockList.Qty === 0) {
      errorMessage("Sorry! Product is not available in Stock.");
      return;
    } else {
      if (productData.Qty > selectedStockList.Qty) {
        errorMessage("Sorry!! Selected Product Range is greater than Stock.");
      } else {
        if (productData) {
          setSelectedProducts([
            ...selectedProducts,
            {
              ItemId: productData.Id,
              ItemName: productData.Name,
              Qty: productData.Qty,
              InitialQty: productData.Qty,
              UnitType: productData.UnitType,
              TotalAmount: productData.UnitPrice * productData.Qty,
              UnitPrice: productData.UnitPrice,
              InitialPrice: productData.UnitPrice,
              MRPPrice: productData.UnitPrice,
              TaxType: null,
              TaxValue: 0,
              Tax: 0,
              TaxRate: productData.TaxRate,
              DiscountType: null,
              DiscountValue: 0,
              Discount: 0,
              FinancialYear: "Name", // got from redux.
              UserId: null,
              DepartmentId: null,
              WarehouseId: null,
              BranchId: null,
            },
          ]);
          setPaymentOk(true);
          successMessage("New product successfully added.");
        }
      }
    }
  };

  // Functions for edit product modal
  const setEditProductInput = (name: string, value: any) => {
    setEditProduct({ ...editProduct, [name]: value });
  };

  const updateEditProduct = (e: IOnSubmit) => {
    e.preventDefault();

    const calculateDiscount = (
      taxType: any,
      price: number,
      discountRate: number
    ) => {
      if (taxType === null) {
        return 0;
      }
      if (taxType.toLowerCase() === "percent") {
        return (price * discountRate) / 100;
      } else {
        return discountRate;
      }
    };

    if (
      editProduct.TaxType !== null &&
      editProduct.TaxType.toLowerCase() === "inclusive"
    ) {
      const initialPrice = editProduct.InitialPrice;
      const taxRate = editProduct.TaxValue;
      const priceAfterTax = initialPrice / (taxRate / 100 + 1);
      const tax = initialPrice - priceAfterTax;
      const discount = calculateDiscount(
        editProduct.DiscountType,
        priceAfterTax,
        editProduct.DiscountValue
      );
      setSelectedProducts(
        selectedProducts.map((data) => {
          if (data.ItemId === editProduct.ItemId) {
            data.InitialPrice = initialPrice;
            data.UnitPrice = priceAfterTax;
            if (
              editProduct.DiscountType !== null &&
              editProduct.DiscountValue > 0
            ) {
              data.DiscountType = editProduct.DiscountType;
              data.DiscountValue = editProduct.DiscountValue;
              data.Discount = discount;
            }
            if (editProduct.TaxValue > 0) {
              data.TaxType = "Inclusive";
              data.TaxValue = taxRate;
              data.Tax = tax;
            }
            data.TotalAmount = priceAfterTax * data.InitialQty;
          }
          return data;
        })
      );
    } else if (
      editProduct.TaxType !== null &&
      editProduct.TaxType.toLowerCase() === "exclusive"
    ) {
      const initialPrice = editProduct.InitialPrice;
      const initialQty = editProduct.InitialQty;
      const discount = calculateDiscount(
        editProduct.DiscountType,
        initialPrice,
        editProduct.DiscountValue
      );

      const priceAfterDiscount = initialPrice - discount;
      const tax = (priceAfterDiscount * editProduct.TaxValue) / 100;

      setSelectedProducts(
        selectedProducts.map((data) => {
          if (data.ItemId === editProduct.ItemId) {
            data.InitialPrice = initialPrice;
            data.UnitPrice = initialPrice;
            data.InitialQty = initialQty;
            data.Qty = initialQty;
            if (
              editProduct.DiscountType !== null &&
              editProduct.DiscountValue > 0
            ) {
              data.DiscountType = editProduct.DiscountType;
              data.DiscountValue = editProduct.DiscountValue;
              data.Discount = discount;
            }
            if (editProduct.TaxValue > 0) {
              data.TaxType = "Exclusive";
              data.TaxValue = editProduct.TaxValue;
              data.Tax = tax;
            }
            data.TotalAmount = initialPrice * initialQty;
          }
          return data;
        })
      );
    } else {
      setSelectedProducts(
        selectedProducts.map((data) => {
          if (data.ItemId === editProduct.ItemId) {
            data.InitialPrice = editProduct.InitialPrice;
            data.InitialQty = editProduct.InitialQty;
            data.UnitPrice = editProduct.InitialPrice;
            data.Qty = editProduct.InitialQty;
            if (
              editProduct.DiscountType !== null &&
              editProduct.DiscountValue > 0
            ) {
              data.DiscountType = editProduct.DiscountType;
              data.DiscountValue = editProduct.DiscountValue;
              data.Discount = calculateDiscount(
                editProduct.DiscountType,
                editProduct.InitialPrice * editProduct.InitialQty,
                editProduct.DiscountValue
              );
            }
            data.TotalAmount =
              editProduct.InitialPrice * editProduct.InitialQty;
          }
          return data;
        })
      );
    }
    setEditProductModalDispaly(false);
    setEditProduct(initialEditProductDtl);
  };

  // Functions for pay now and reset buttons

  const resetAll = () => {
    setSelectedProducts([]);
    setSelectedFormData(initialPosForm);
    dispatch(resetPosDataAction());
  };

  const reset = () => {
    setSelectedProducts([]);
  };

  const payNow = async () => {
    if (selectedProducts.length < 1) {
      errorMessage("Please select at least one product.");
      return;
    }
    if (selectedFormData.salesType === null) {
      errorMessage("Please select a Sales Type");
      return;
    } else if (selectedFormData.branch === null) {
      errorMessage("Please select a branch");
      return;
    } else if (selectedFormData.warehouse === null) {
      errorMessage("Please select a warehouse");
      return;
    } else if (selectedFormData.department === null) {
      errorMessage("Please select a department");
      return;
    } else if (selectedFormData.ledger === null) {
      errorMessage("Please select a ledger");
      return;
    }

    let productData = [];
    for (let index = 0; index < selectedProducts.length; index++) {
      const element = selectedProducts[index];
      if (element.UnitPrice === 0) {
        errorMessage(
          `Sorry, the product's price can't be zero (${element.ItemName}).`
        );
        return;
      }

      let singleProduct: INormalizedProduct = {
        ItemId: element.ItemId,
        Qty: element.InitialQty,
        UnitType: element.UnitType,
        TotalAmount: element.TotalAmount - element.Discount,
        UnitPrice: element.UnitPrice,
        MRPPrice: element.MRPPrice,
        Discount: element.Discount,
        Tax: element.Tax,
        TaxRate: element.TaxRate,
        FinancialYear: currentFinancialYear,
        UserId: selectedFormData.ledger,
        WarehouseId: selectedFormData.warehouse,
        BranchId: selectedFormData.branch,
        DepartmentId: selectedFormData.department,
      };
      productData.push(singleProduct);
    }

    const data: INormalizedPosData = {
      SalesOrderDetails: productData,
      Name: selectedFormData.salesType,
      Amount:
        grandDetails.taxable + grandDetails.nonTaxable - grandDetails.discount,
      Discount: grandDetails.discount,
      PercentAmount: 0.0,
      NetAmount: grandDetails.total,
      VATAmount: grandDetails.tax,
      GrandAmount: grandDetails.total,
      IsDiscountPercentage: false,
      Date: getNepaliDate(),
      Description: "Counter Sales",
      FinancialYear: currentFinancialYear,
      UserName: userName,
      CompanyCode: companyId,
      SourceAccountTypeId: selectedFormData.ledger,
      WarehouseId: selectedFormData.warehouse,
      BranchId: selectedFormData.branch,
      DepartmentId: selectedFormData.department,
    };
    setOpenSaveDialog(true);
    const response = await postPosBilling(data);
    if (response === -1) {
      setOpenSaveDialog(false);
      errorMessage("Operation was failed. Please try again leater.");
    } else {
      setOpenSaveDialog(false);
      successMessage("Successfully added.");
      history.push(`/invoice/view/${response}`);
      reset();
    }
  };

  // Functions for the add new ledger
  const displayAddUserModal = () => {
    setUserModalDispaly(true);
  };

  const setNewLedgerInputData = (e: IOnChange) => {
    if (e.target.name === "telephoneNo") {
      let value = e.target.value;

      if (isNaN(Number(value)) || value.length > 15) {
        return;
      }
    }
    setNewLedger({ ...newLedger, [e.target.name]: e.target.value });
  };

  const addNewLedger = async (e: IOnSubmit) => {
    e.preventDefault();
    const response = await postLedger({
      Name: newLedger.name,
      Address: newLedger.address,
      Email: newLedger.email,
      Telephone: newLedger.telephoneNo,
      AccountTypeId: 18,
      PanNo: newLedger.panvat,
    });

    if (response !== -1) {
      successMessage("New ledger successfully added.");
      setUserModalDispaly(false);
      setData();
    }
  };

  if (!areAllDataLoaded) {
    return <LinearProgress />;
  }

  return (
    <>
      <Box>
        <PosHeader />
        <Grid container spacing={2} style={{ marginTop: "1px" }}>
          <Grid item xs={12} md={6}>
            <PosForm
              branch={branch}
              warehouse={warehouse}
              department={department}
              ledger={ledger}
              selectedData={selectedFormData}
              updateSelectedData={updateSelectedFormData}
              displayAddUserModal={displayAddUserModal}
            />
            <PosTable
              product={selectedProducts}
              findrange={findrange}
              increateQty={increateQty}
              editProduct={setEditProductModalData}
              setInputQty={setEditProductInputQty}
              deleteProduct={deleteSelectedProduct}
              rangepriceproduct={[]}
            />
            <GrandDetails data={grandDetails} />
            <GetReturnBox
              amount={grandDetails}
              setPayAmt={setPayAmt}
              payAmt={payAmt}
            />
            <PosBtnContainer
              reset={resetAll}
              paydis={paymentOk}
              payNow={payNow}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Products products={products} addNewProduct={addNewProduct} />
          </Grid>
        </Grid>
      </Box>

      <EditProductModal
        displayStatus={editProductModalDisplay}
        setDisplayStatus={setEditProductModalDispaly}
        data={editProduct}
        setData={setEditProduct}
        setInput={setEditProductInput}
        updateProduct={updateEditProduct}
      />
      <AddUserModal
        displayStatus={userModalDispaly}
        setDisplayStatus={setUserModalDispaly}
        ledgerDetails={newLedger}
        setLedgerDetails={setNewLedger}
        setInputData={setNewLedgerInputData}
        onClickHandler={addNewLedger}
      />
      <SaveProgressDialog
        openDialog={openSaveDialog}
        setOpenDialog={setOpenSaveDialog}
        name={"Saving ..."}
      />
    </>
  );
};

export default PosBilling;
