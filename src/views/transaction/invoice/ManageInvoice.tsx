import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { IProduct, ISales } from "../../../interfaces/invoice";
import { IParams } from "../../../interfaces/params";
import {
  deleteAllSales,
  deleteSales,
  getAllCustomers,
  getAllProducts,
  getSalesData,
  postSales,
  updateSales,
} from "../../../services/invoice";
import {
  errorMessage,
  successMessage,
} from "../../../utils/messageBox/Messages";
import AdditionalSaleDetails from "./components/AdditionSalesDetails";
import AddNewSales from "./components/AddNewSales";
import ButtonsHolder from "./components/ButtonsHolder";
import SalesDescription from "./components/SalesDescription";
import SalesGrandDetails from "./components/SalesGrandDetails";
import {
  IActionType,
  IAdditionalSales,
  ICommonObj,
  ICustomer,
  IGrandDetails,
  IInvSelectedFormData,
  IMinimumLedgerDetails,
  ISelectedProduct,
} from "./interfaces";
import { getNepaliDate } from "../../../utils/nepaliDate/";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import FormHeader from "../../../components/headers/formHeader";
import { Paper } from "@mui/material";
import { getAllBranch } from "../../../services/branchApi";
import { getAllWarehouseData } from "../../../services/warehouseApi";
import { getAllDepartments } from "../../../services/departmentApi";
import { IOnChange, IOnSubmit } from "../../../interfaces/event";
import { addNewLedger } from "../../../components/modal/userModal/userModalApi";
import UserModal from "../../../components/modal/userModal/UserModal";
import {
  resetInvDataAction,
  updateInvDataAction,
} from "../../../features/invSlice";
import { SaveProgressDialog } from "../../../components/dialogBox";
import {
  resetInvOtherDataAction,
  updateInvOtherDataAction,
} from "../../../features/invSlice/otherInv";
import { getAllItemStockLedgers } from "../../../services/itemStockLedgerApi";
import { VscArrowSwap } from "react-icons/vsc";
import { checkDate } from "../components/helperFunctions";

const initialAdditionalSales: IAdditionalSales = {
  salesType: null,
  salesDate: getNepaliDate(),
  customer: null,
  vehicleNo: null,
  vehicleLength: null,
  vehicleWidth: null,
  vehicleHieght: null,
  ChallanNo : null,
  description: "",
  branch: null,
  warehouse: null,
  department: null,
};

const initialSelectedProduct: ISelectedProduct = {
  Id: 0,
  OrderId: 0,
  OrderNumber: 0,
  ItemId: 0,
  ItemName: "",
  Qty: 0,
  DiscountE: 0,
  UnitType: "",
  TotalAmount: 0,
  UnitPrice: 0,
  TaxRate: 0,
  MRPPrice: 0,
  ExciseDuty: 0,
  ExcriseDutyAmount: 0,
  DiscountType: "",
  Discount: 0,
  AmountAfterVat: 0,
  OrderDescription: "",
  Tags: "",
  IsSelected: false,
  IsVoid: false,
  FinancialYear: "",
  UserId: null,
  BranchId: 0,
  DepartmentId: 0,
  WarehouseId: 0,
  SelectedProductDetails: "",
  CurrentStock: 0,
};

const initialProductData: IProduct = {
  Id: 0,
  Name: "",
  ItemId: 0,
  CategoryId: 0,
  UnitPrice: 0,
  Qty: 0,
  DiscountE: 0,
  ExciseDuty: 0,
  UnitTypeBase: "",
  UnitDivided: 0,
  UnitType: "",
  DepartmentId: 0,
  WareHouseId: 0,
  BranchId: 0,
  IsProduct: false,
  IsService: false,
  IsMenuItem: false,
  Description: "",
  MetaDescription: "",
  TaxRate: 0,
  MarginRate: 0,
  ItemCode: "",
  PhoteIdentity: "",
  IdentityFileName: "",
  IdentityFileType: "",
  CurrentStock: 0,
};

const initialGrandDetails: IGrandDetails = {
  amount: 0,
  discount: 0,
  grandTotal: 0,
  tax: 0,
  taxdic: 0,
  taxable: 0,
  taxabledic: 0,
  exciseDuty: 0,
  nonTaxable: 0,
  nontaxabledic: 0,
};

const initialNewLedger: IMinimumLedgerDetails = {
  name: "",
  address: "",
  telephoneNo: "",
  email: "",
  panvatno: "",
};

const getSalesType = (name: string): string => {
  let type = "";
  let endPosition = name.search("#");
  for (let index = 0; index < endPosition - 1; index++) {
    type += name[index];
  }

  return type.trim();
};

//get from local
const getLocalItem = (key: string, id: string) => {
  if (id === "add") {
    localStorage.removeItem(key);
    return [initialSelectedProduct];
  }
  let data = localStorage.getItem(key);
  const parsedData = JSON.parse(data || "[]");
  const isMatched = parsedData.every(
    (item: ISelectedProduct) => item?.tempId === Number(id)
  );
  if (!isMatched) {
    localStorage.removeItem(key);
    return [initialSelectedProduct];
  }
  return parsedData.filter((item: ISelectedProduct) => item.ItemId);
};

const ManageInvoice = () => {
  const history = useHistory();
  const { id }: IParams = useParams();
  const hostName = window.location.host;
  const invProData = hostName + "invProData";
  const userName = useAppSelector((state) => state.user.data.UserName);
  const financialyear = useAppSelector((state) => state.financialYear.Name);
  const startDate = useAppSelector(
    (state) => state.financialYear.NepaliStartDate
  );
  const endDate = useAppSelector((state) => state.financialYear.NepaliEndDate);
  const companyId = useAppSelector((state) => state.company.data.Id);
  const [actionType, setActionType] = useState<IActionType>("loading");
  const [branch, setBranch] = useState<ICommonObj[]>([]);
  const [warehouse, setWarehouse] = useState<ICommonObj[]>([]);
  const [department, setDepartment] = useState<ICommonObj[]>([]);
  const [customer, setLedgers] = useState<ICommonObj[]>([]);

  const [salesDetails, setSalesDetails] = useState<ISales>();
  const [products, setProducts] = useState<IProduct[]>([]);

  const dispatch = useAppDispatch();
  const invoice = useAppSelector((state) => state.invData.data);
  const otherinvoice = useAppSelector((state) => state.invotherData.data);
  const [additionalSalesDtls, setAdditionalSalesDtls] =
    useState<IAdditionalSales>({
      ...invoice,
      ...otherinvoice,
      salesDate: getNepaliDate(),
    });
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [selectedProductData, setSelectedProductData] = useState<
    ISelectedProduct[]
  >(getLocalItem(invProData, id));
  const [grandDetails, setGrandDetails] = useState(initialGrandDetails);

  const [newLedger, setNewLedger] =
    useState<IMinimumLedgerDetails>(initialNewLedger);
  const [displayNewLedgerModal, setDisplayNewLedgerModal] =
    useState<boolean>(false);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName);
  // const dispatch = useAppDispatch();
  // const [selectedFormData, setSelectedFormData] = useState<IInvSelectedFormData>({...invoice});
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [activeDelete, setActiveDelete] = useState<boolean>(false);
  const [runUpdate, setRunUpdate] = useState<boolean>(false);

  useEffect(() => {
    if (id !== "add") {
      const data = selectedProductData.map((item) => {
        return {
          ...item,
          tempId: Number(id),
        };
      });
      localStorage.setItem(invProData, JSON.stringify(data));
    }
    if (selectedProductData.length < 1 && id === "add") {
      setSelectedProductData([initialSelectedProduct]);
    }
    setIsUpdated(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProductData]);

  useEffect(() => {
    if (id === "add" && isFirstRender) {
      localStorage.removeItem(invProData);
    }
    setIsFirstRender(false);
  }, [id, isFirstRender, invProData]);

  const setAllData = async () => {
    try {
      const productsData: IProduct[] = await getAllProducts();
      setProducts(productsData);
      const departmentData = await getAllDepartments();
      const warehouseData = await getAllWarehouseData();
      const branchData = await getAllBranch();
      const ledgersData = await getAllCustomers();
      setBranch(
        branchData.map((data: any) => {
          return { id: data.Id, label: data.NameEnglish };
        })
      );
      setDepartment(
        departmentData.map((data: any) => {
          return { id: data.Id, label: data.Name };
        })
      );
      setWarehouse(
        warehouseData.map((data: any) => {
          return { id: data.Id, label: data.Name };
        })
      );
      setLedgers(
        ledgersData.map((data: any) => {
          return { id: data.Id, label: data.Name };
        })
      );
    } catch {
      errorMessage("Someting went wrong. Please try again later.");
    }
  };

  const setSalesData = async () => {
    try {
      const response = await getSalesData(id);
      setSalesDetails(response);
      setAdditionalSalesDtls({
        ...additionalSalesDtls,
        salesDate: response.AccountTransactionValues[0].NVDate,
        customer: response.SourceAccountTypeId,
        vehicleHieght: response.VehicleHeight,
        vehicleLength: response.VehicleLength,
        vehicleNo: response.VehicleNo,
        ChallanNo:response.ChallanNo,
        vehicleWidth: response.VehicleWidth,
        description: response.Description,
        salesType: getSalesType(response.Name),
        branch: response.BranchId,
        warehouse: response.WareHouseId,
        department: response.DepartmentId,
      });

      const salesProducts: ISelectedProduct[] = [];
      response.SalesOrderDetails.forEach((element: ISelectedProduct) => {
        const exciseDutyAmount =
          (element.UnitPrice * element.ExciseDuty) / 100 + element.UnitPrice;
        let afterVat = 0;
        if (element.ExciseDuty > 0) {
          afterVat =
            (exciseDutyAmount * element.TaxRate) / 100 + exciseDutyAmount;
        } else {
          afterVat =
            (exciseDutyAmount * element.TaxRate) / 100 + element.UnitPrice;
        }
        let amount = 0;
        if (element.DiscountType === "Percent") {
          amount =
            element.UnitPrice * element.Qty -
            (element.UnitPrice * element.Qty * element.Discount) / 100;
        } else {
          amount = element.UnitPrice * element.Qty - element.Discount;
        }

        salesProducts.push({
          ...element,
          ExcriseDutyAmount: element.ExciseDuty ? exciseDutyAmount : 0,
          AmountAfterVat: afterVat,
          TotalAmount: amount,
        });
      });

      if (id !== "add") {
        const data = getLocalItem(invProData, id);
        const localData =
          data.filter((item: ISelectedProduct) => {
            return !salesProducts.find(
              (item2: ISelectedProduct) => item2.Id === item.Id
            );
          }) || [];
        const newData = [...salesProducts, ...localData];
        setSelectedProductData(newData);
      } else {
        setSelectedProductData(salesProducts);
      }
    } catch {
      errorMessage("Invalid sales id.");
      history.push("/invoice");
    }
  };

  useEffect(() => {
    setAllData();
    if (loginedUserRole.includes("InvAdd") && id === "add") {
      setActionType("add");
    } else if (loginedUserRole.includes("InvEdit") && id !== "add") {
      setSalesData();
      setActionType("update");
    } else {
      history.push("/invoice");
      errorMessage("Sorry! permission is denied");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculateData = (isBeforeDelete?: boolean) => {
    let amount = 0;
    let taxable = 0;
    let grandTaxableafterdic = 0;
    let nonTaxable = 0;
    let grandNonTaxableafterdic = 0;
    let discount = 0;
    let tax = 0;
    let grandTaxafterdic = 0;
    let exciseDuty = 0;

    const dataItems = isBeforeDelete
      ? selectedProductData.filter((item) => item.Id)
      : selectedProductData;

    dataItems.forEach((element) => {
      let excAmount = 0;
      if (element.ExciseDuty > 0) {
        excAmount = (element.UnitPrice * element.ExciseDuty) / 100;
        exciseDuty += excAmount * element.Qty;
      }
      if (element.TaxRate > 0) {
        const taxValue = ((excAmount + element.UnitPrice) * element.TaxRate) / 100;
        tax += taxValue * element.Qty;
        if (element.DiscountType === "Percent") {
          let dictax = (taxValue * element.Qty * element.Discount) / 100;
          grandTaxafterdic += taxValue * element.Qty - dictax;
          let currentdiscount = 0;
          currentdiscount = 
            (element.Qty * element.UnitPrice * element.Discount) / 100;
          discount += currentdiscount;
          grandTaxableafterdic +=
            element.UnitPrice * element.Qty - currentdiscount;
        } else {
          let dictax = (element.Discount * element.TaxRate) / 100;
          grandTaxafterdic += taxValue * element.Qty - dictax;
          discount += element.Discount * 1;
          grandTaxableafterdic +=
            element.UnitPrice * element.Qty - element.Discount;
        }
        taxable += element.UnitPrice * element.Qty;
      } else {
        let nonTaxValue = element.UnitPrice * element.Qty;
        if (element.DiscountType === "Percent") {
          let currentDiscount = 0;
          currentDiscount = 
            (element.Qty * element.UnitPrice * element.Discount) / 100;
          grandNonTaxableafterdic += nonTaxValue - currentDiscount;
          discount += currentDiscount;
        } else {
          grandNonTaxableafterdic += +nonTaxValue - element.Discount;
          discount += element.Discount * 1;
        }
        nonTaxable += nonTaxValue;
      }
      amount += element.UnitPrice * element.Qty;
      if (tax.toString() === "NaN") {
        tax = 0;
      }
    });

    const items = {
      amount: Math.round(amount),
      taxable: Math.round(grandTaxableafterdic),
      taxabledic: Math.round(grandTaxableafterdic),
      nonTaxable: Math.round(grandNonTaxableafterdic),
      nontaxabledic: Math.round(grandNonTaxableafterdic),
      discount: Math.round(discount),
      exciseDuty: Math.round(exciseDuty),
      tax: Math.round(grandTaxafterdic),
      taxdic: Math.round(grandTaxafterdic),
      grandTotal:
      Math.round(grandTaxableafterdic) +
      Math.round(grandNonTaxableafterdic) +
      Math.round(exciseDuty) +
        Math.round(grandTaxafterdic),
    };
    if (isBeforeDelete) {
      return items;
    }
    setGrandDetails(items);
  };

  useEffect(() => {
    calculateData();
    activeDelete && setRunUpdate(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProductData, activeDelete]);

  const updateNewLedgerFields = (e: IOnChange) => {
    if (e.target.name === "telephoneNo") {
      if (isNaN(Number(e.target.value))) {
        return;
      }
    }
    setNewLedger({ ...newLedger, [e.target.name]: e.target.value });
  };

  const addNewLedgerFromModal = async (e: IOnSubmit) => {
    e.preventDefault();
    try {
      const response = await addNewLedger({
        Name: newLedger.name,
        Address: newLedger.address,
        Email: newLedger.email,
        Telephone: newLedger.telephoneNo,
        AccountTypeId: 18,
        PanNo: newLedger.panvatno,
      });
      successMessage("New customer successfully added.");
      setDisplayNewLedgerModal(false);
      setNewLedger(initialNewLedger);
      setAllData();
    } catch {
      errorMessage("Invalid data");
    }
  };

  const changeAdditionSalesDtl = (name: string, value: any | null) => {
    dispatch(updateInvDataAction({ name: name, value: value }));
    dispatch(updateInvOtherDataAction({ name: name, value: value }));
    setAdditionalSalesDtls({ ...additionalSalesDtls, [name]: value });
  };
  const getProductData = (id: number) => {
    for (let index = 0; index < products.length; index++) {
      const element = products[index];
      if (element.Id === id) {
        return element;
      }
    }
    return initialProductData;
  };

  const addNewProduct = (): void => {
    for (let index = 0; index < selectedProductData.length; index++) {
      const element = selectedProductData[index];
      if (element.ItemId === null || element.ItemId === 0) {
        errorMessage("Please select product.");
        return;
      }
    }
    setSelectedProductData([...selectedProductData, initialSelectedProduct]);
  };

  const updateSelectedProduct = async (
    index: number,
    name: string,
    value: any,
    itemId?: number | null | undefined
  ) => {
    const productData = getProductData(value);
    const hasProductExisted = (): boolean => {
      for (let index = 0; index < selectedProductData.length; index++) {
        const element = selectedProductData[index];
        if (productData.Id === element.ItemId) {
          return true;
        }
      }
      return false;
    };

    if (name === "Product") {
      if (value === null) {
        return;
      }
      if (hasProductExisted()) {
        errorMessage("Sorry, the product has already been in the list.");
        return;
      }
      const itemStock = await getAllItemStockLedgers(value);
      setSelectedProductData(
        selectedProductData.map((data, i) => {
          if (index === i) {
            const exciseDutyAmount =
              (productData.UnitPrice * productData.ExciseDuty) / 100 +
              productData.UnitPrice;
            let afterVat = 0;
            if (productData.ExciseDuty > 0) {
              afterVat =
                (exciseDutyAmount * productData.TaxRate) / 100 +
                exciseDutyAmount;
            } else {
              afterVat =
              (exciseDutyAmount * productData.TaxRate) / 100 +
                productData.UnitPrice;
            }
            return {
              ...data,
              ItemId: productData.Id,
              ItemName: productData.Name,
              Qty: 0,
              Discount: 0,
              DiscountType: "",
              DiscountE: 0.0,
              UnitPrice: productData.UnitPrice,
              TotalAmount: productData.UnitPrice,
              UnitType: productData.UnitType,
              MRPPrice: productData.UnitPrice,
              TaxRate: productData.TaxRate,
              ExciseDuty: productData.ExciseDuty,
              ExcriseDutyAmount: productData.ExciseDuty ? exciseDutyAmount : 0,
              AmountAfterVat: afterVat,
              CurrentStock: itemStock,
            };
          } else {
            return data;
          }
        })
      );
    } else if (name === "Qty") {
      const itemStock = await getAllItemStockLedgers(itemId || 0);
      if (itemStock > 0 && value > itemStock) {
        errorMessage("Sorry, " + value + " Quantity amount out of stock.");
        return;
      }
      setSelectedProductData(
        selectedProductData.map((data, i) => {
          if (i === index) {
            if (data.Discount > 0) {
              if (data.DiscountType === "Percent") {
                return {
                  ...data,
                  Qty: value,
                  TotalAmount: (value * data.UnitPrice) - ((value * data.UnitPrice) * data.Discount/ 100),
                  CurrentStock: itemStock - Number(value),
                };
              } else {
                return {
                  ...data,
                  Qty: value,
                  TotalAmount: data.UnitPrice * value - data.Discount,
                  CurrentStock: itemStock - Number(value),
                };
              }
            } else {
              return {
                ...data,
                Qty: value,
                TotalAmount: data.UnitPrice * value,
                CurrentStock: itemStock - Number(value),
              };
            }
          } else {
            return data;
          }
        })
      );
    } else if (name === "DiscountType") {
      setSelectedProductData(
        selectedProductData.map((data, i) => {
          if (i === index) {
            return {
              ...data,
              DiscountType: value,
            };
          }
          return data;
        })
      );
    } else if (name === "DiscountE") {
      setSelectedProductData(
        selectedProductData.map((data, i) => {
          if (i === index && value >= 0) {
            if (data.DiscountType === "Percent") {
              return {
                ...data,
                DiscountE: (data.Qty * data.UnitPrice * value) / 100,
                Discount: 1 * value,
                TotalAmount:
                  data.Qty * data.UnitPrice - 
                  (data.Qty * data.UnitPrice * value) / 100,
              };
            } else {
              return {
                ...data,
                DiscountE: value,
                Discount: 1 * value,
                TotalAmount: data.Qty * data.UnitPrice - value,
              };
            }
          }
          return data;
        })
      );
    } else if (name === "UnitPrice") {
      setSelectedProductData(
        selectedProductData.map((data, i) => {
          if (i === index && value >= 0) {
            let val = parseInt(value);
            const exciseDutyAmount = (val * data.ExciseDuty) / 100 + val;
            let afterVat = 0;
            if (data.ExciseDuty > 0) {
              afterVat =
                (exciseDutyAmount * data.TaxRate) / 100 + exciseDutyAmount;
            } else {
              afterVat = exciseDutyAmount * (data.TaxRate / 100) + val;
            }
            const dic = Math.round((data.Qty * value * data.Discount) / 100);
            if (data.DiscountType === "Percent") {
              return {
                ...data,
                UnitPrice: value,
                DiscountE: dic,
                ExcriseDutyAmount: data.ExciseDuty ? exciseDutyAmount : 0,
                AmountAfterVat: afterVat,
                TotalAmount: data.Qty * value - dic,
              };
            } else {
              return {
                ...data,
                UnitPrice: value,
                TotalAmount: data.Qty * value - data.Discount,
                ExcriseDutyAmount: data.ExciseDuty ? exciseDutyAmount : 0,
                AmountAfterVat: afterVat,
              };
            }
          }
          return data;
        })
      );
    }
  };

  useEffect(() => {
    if (selectedProductData.length > 0 && id !== "add" && !isUpdated) {
      const loadData = async () => {
        const data = [...selectedProductData];
        const promises: any = [];
        data.forEach(async (element: ISelectedProduct) => {
          promises.push(getAllItemStockLedgers(element.ItemId));
        });
        await Promise.all(promises).then((res) => {
          const stockItems = selectedProductData.map((item, index) => {
            return {
              ...item,
              CurrentStock: res[index] > 0 ? res[index] - item.Qty : 0,
            };
          });
          setSelectedProductData(stockItems);
        });
      };
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdated]);

  const deleteIndividualProduct = async (id: number) => {
    try {
      const response = await deleteSales(id);
      if (response !== 1) {
        errorMessage(
          "The product item was not actually deleted in the server."
        );
      }
    } catch {
      errorMessage("The product item was not actually deleted in the server.");
    }
    setSalesData();
  };

  const deleteProduct = (index: number) => {
    const selectedProduct = selectedProductData.find((_, i) => index === i);
    const Id = selectedProduct ? selectedProduct.Id : null;
    if (Id && id !== "add") {
      const savedItems = selectedProductData.filter(
        (item: ISelectedProduct) => item.Id
      );
      if (savedItems.length <= 1) {
        errorMessage(
          "You cannot add remove this row, Please add new row and save to delete this row."
        );
        return;
      }
    }
    setSelectedProductData(
      selectedProductData.filter((data, i) => {
        if (index !== i) {
          return data;
        } else {
          if (data.Id !== 0) {
            deleteIndividualProduct(data.Id);
            setActiveDelete(true);
            // handleUpdateInvoiceDataOnDelete(index);
            successMessage("Product deleted successfully.");
          }
        }
      })
    );
  };

  const reset = () => {
    setAdditionalSalesDtls(initialAdditionalSales);
    setSelectedProductData([initialSelectedProduct]);
    dispatch(resetInvDataAction());
  };

  const addInvoice = async () => {
    const currentNepaliData = getNepaliDate();

    if (additionalSalesDtls.salesType === null) {
      errorMessage("Select a sales type.");
      return;
    } else if (
      additionalSalesDtls.salesDate === null ||
      additionalSalesDtls.salesDate.trim().length <= 5
    ) {
      errorMessage("Sales date is either invalid or null.");
      return;
    } else if (additionalSalesDtls.customer === null) {
      errorMessage("Select a customer.");
      return;
    } else if (additionalSalesDtls.branch === null) {
      errorMessage("Select a branch.");
      return;
    } else if (additionalSalesDtls.warehouse === null) {
      errorMessage("Select an warehouse.");
      return;
    } else if (additionalSalesDtls.department === null) {
      errorMessage("Select a department.");
      return;
    }

    const validDate = await checkDate(
      additionalSalesDtls.salesDate,
      startDate,
      endDate
    );
    if (validDate) {
      if (
        additionalSalesDtls.salesDate !== null &&
        additionalSalesDtls.salesDate > currentNepaliData
      ) {
        errorMessage("Invalid sales date.");
        return;
      }

      for (let index = 0; index < selectedProductData.length; index++) {
        const element = selectedProductData[index];
        if (element.ItemId === null || element.ItemId <= 0) {
          errorMessage(`Please select a product for the list No: ${index + 1}`);
          return;
        } else if (element.Qty === 0) {
          errorMessage(
            `Please enter the product quantity for the list No: ${index + 1}`
          );
          return;
        } else if (element.UnitPrice < 1) {
          errorMessage(
            `Please enter the product rate for the list No. ${index + 1}`
          );
          return;
        }
      }
      const products = selectedProductData.map((data) => {
        if (data?.tempId) {
          return {
            ...data,
            tempId: undefined,
          };
        }
        return data;
      });

      const productData = products.map((data) => {
        return {
          ...data,
          UserId: userName,
          FinancialYear: financialyear,
          BranchId: additionalSalesDtls.branch,
          DepartmentId: additionalSalesDtls.department,
          WarehouseId: additionalSalesDtls.warehouse,
        };
      });

      const salesData = {
        SalesOrderDetails: productData,
        Name: additionalSalesDtls.salesType,
        Amount: Math.round(grandDetails.amount),
        Discount: Math.round(grandDetails.discount),
        NetAmount: Math.round(grandDetails.amount),
        VATAmount:Math.round(grandDetails.tax),
        ExciseDuty: Math.round(grandDetails.exciseDuty),
        GrandAmount: Math.round(grandDetails.grandTotal)-Math.round(grandDetails.discount),
        IsDiscountPercentage: false,
        Date: additionalSalesDtls.salesDate,
        Description: additionalSalesDtls.description,
        FinancialYear: financialyear,
        UserName: userName,
        CompanyCode: companyId,
        SourceAccountTypeId: additionalSalesDtls.customer,
        VehicleNo: additionalSalesDtls.vehicleNo,
        ChallanNo:additionalSalesDtls.ChallanNo,
        VehicleLength: additionalSalesDtls.vehicleLength,
        VehicleWidth: additionalSalesDtls.vehicleWidth,
        VehicleHeight: additionalSalesDtls.vehicleHieght,
        BranchId: additionalSalesDtls.branch,
        DepartmentId: additionalSalesDtls.department,
        WarehouseId: additionalSalesDtls.warehouse,
      };
      try {
        setOpenSaveDialog(true);
        if (salesData.SalesOrderDetails.length <= 0) {
          errorMessage("Error No Product is selected.");
        } else {
          const response = await postSales(salesData);
          if (response === -1) {
            errorMessage("post error");
            setOpenSaveDialog(false);
          } else {
            successMessage("New invoice (sales) is successfully added.");
            history.push(`/invoice/view/${response}`);
            setAdditionalSalesDtls(initialAdditionalSales);
            setSelectedProductData([initialSelectedProduct]);
            setOpenSaveDialog(false);
            dispatch(resetInvOtherDataAction());
            localStorage.removeItem(invProData);
          }
        }
      } catch (error) {
        errorMessage("Operation was failed. Please try again later.");
        setOpenSaveDialog(false);
      }
    }
  };

  const handleUpdateInvoiceDataOnDelete = async (isDelete?: boolean) => {
    isDelete && localStorage.removeItem(invProData);
    const products = selectedProductData.map((data) => {
      if (data?.tempId) {
        return {
          ...data,
          tempId: undefined,
        };
      }
      return data;
    });

    const productsData = products.map((data) => {
      return {
        ...data,
        UserId: userName,
        FinancialYear: financialyear,
        BranchId: additionalSalesDtls.branch,
        DepartmentId: additionalSalesDtls.department,
        WarehouseId: additionalSalesDtls.warehouse,
      };
    });

    const getSalesData = () => {
      if (isDelete) {
        const salesData = calculateData(true);
        return {
          Amount: salesData ? Math.round(salesData.amount) : 0,
          Discount: salesData ? Math.round(salesData.discount) : 0,
          NetAmount: salesData ? Math.round(salesData.amount) : 0,
          VATAmount: salesData ? Math.round(salesData.tax) : 0,
          GrandAmount: salesData ? Math.round(salesData.grandTotal) : 0,
          ExciseDuty: salesData ? Math.round(salesData.exciseDuty) : 0,
        };
      }
      return {
        Amount: Math.round(grandDetails.amount),
        Discount: Math.round(grandDetails.discount),
        NetAmount: Math.round(grandDetails.amount),
        VATAmount: Math.round(grandDetails.tax),
        GrandAmount: Math.round(grandDetails.grandTotal),
        ExciseDuty: Math.round(grandDetails.exciseDuty),
      };
    };

    const data = {
      ...salesDetails,
      SalesOrderDetails: isDelete
        ? productsData?.filter((data) => data.Id)
        : productsData,
      AccountTransactionValues:
        salesDetails &&
        salesDetails.AccountTransactionValues.map((data: any) => {
          return { ...data, NVDate: additionalSalesDtls.salesDate };
        }),
      Name: additionalSalesDtls.salesType,
      Date: additionalSalesDtls.salesDate,
      ...getSalesData(),
      VehicleNo: additionalSalesDtls.vehicleNo,
      VehicleLength: additionalSalesDtls.vehicleLength,
      VehicleWidth: additionalSalesDtls.vehicleWidth,
      VehicleHeight: additionalSalesDtls.vehicleLength,
      ChallanNo:additionalSalesDtls.ChallanNo,
      Description: additionalSalesDtls.description,
      SourceAccountTypeId: additionalSalesDtls.customer,
      FinancialYear: financialyear,
      BranchId: additionalSalesDtls.branch,
      DepartmentId: additionalSalesDtls.department,
      WarehouseId: additionalSalesDtls.warehouse,
    };
    if (isDelete) {
      await updateSales(data.Id, data);
    } else {
      return data;
    }
  };

  useEffect(() => {
    if (activeDelete && runUpdate) {
      handleUpdateInvoiceDataOnDelete(true);
      setActiveDelete(false);
      setRunUpdate(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDelete, selectedProductData, runUpdate]);

  const updateInvoice = async () => {
    const currentNepaliData = getNepaliDate();

    if (additionalSalesDtls.salesType === null) {
      errorMessage("Select a sales type.");
      return;
    } else if (
      additionalSalesDtls.salesDate === null ||
      additionalSalesDtls.salesDate.trim().length <= 5
    ) {
      errorMessage("Sales date is either invalid or null.");
      return;
    } else if (additionalSalesDtls.customer === null) {
      errorMessage("Select a customer.");
      return;
    } else if (additionalSalesDtls.branch === null) {
      errorMessage("Select a branch.");
      return;
    } else if (additionalSalesDtls.warehouse === null) {
      errorMessage("Select an warehouse.");
      return;
    } else if (additionalSalesDtls.department === null) {
      errorMessage("Select a department.");
      return;
    }

    const validDate = await checkDate(
      additionalSalesDtls.salesDate,
      startDate,
      endDate
    );
    if (validDate) {
      if (
        additionalSalesDtls.salesDate !== null &&
        additionalSalesDtls.salesDate > currentNepaliData
      ) {
        errorMessage("Invalid sales date.");
        return;
      }

      for (let index = 0; index < selectedProductData.length; index++) {
        const element = selectedProductData[index];
        if (element.ItemId === null || element.ItemId <= 0) {
          errorMessage(`Please select a product for the list No: ${index + 1}`);
          return;
        } else if (element.Qty < 0) {
          errorMessage(
            `Please enter the product quantity for the list No: ${index + 1}`
          );
          return;
        } else if (element.UnitPrice < 1) {
          errorMessage(
            `Please enter the product rate for the list No. ${index + 1}`
          );
          return;
        }
      }

      const data = await handleUpdateInvoiceDataOnDelete();
      try {
        setOpenSaveDialog(true);
        const response = await updateSales(data?.Id, data);
        if (response === 1) {
          setOpenSaveDialog(false);
          successMessage("Successfully updated");
          await localStorage.removeItem(invProData);
          history.push("/invoice");
        } else {
          setOpenSaveDialog(false);
          errorMessage("Operation failed. Sorry can't Delete.");
        }
      } catch {
        setOpenSaveDialog(false);
        errorMessage("Operation failed. Sorry can't Delete.");
      }
    }
  };

  const deleteInvoice = async () => {
    const productsData = selectedProductData.map((data) => {
      return { ...data, UserId: additionalSalesDtls.customer };
    });
    const data = {
      ...salesDetails,
      SalesOrderDetails: productsData,
      AccountTransactionValues:
        salesDetails &&
        salesDetails.AccountTransactionValues.map((data: any) => {
          return { ...data, NVDate: additionalSalesDtls.salesDate };
        }),
      Name: additionalSalesDtls.salesType,
      Amount: grandDetails.amount,
      Discount: grandDetails.discount,
      NetAmount: grandDetails.amount,
      GrandAmount: grandDetails.grandTotal,
      VehicleNo: additionalSalesDtls.vehicleNo,
      VehicleLength: additionalSalesDtls.vehicleLength,
      VehicleWidth: additionalSalesDtls.vehicleWidth,
      VehicleHeight: additionalSalesDtls.vehicleLength,
      Description: additionalSalesDtls.description,
      ChallanNo: additionalSalesDtls.ChallanNo,
    };

    try {
      const response = await deleteAllSales(data);
      if (response === 1) {
        successMessage("Successfully deleted.");
        history.push("/invoice");
      }
    } catch {
      errorMessage("Operation failed. Sorry can't Delete Invoice.");
    }
  };

  const cancelInvoice = () => {
    history.push("/invoice");
  };

  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <FormHeader headerName={id === "add" ? "Add Invoice" : "Edit Invoice"} />
      <Paper sx={{ padding: 2 }}>
        <AdditionalSaleDetails
          data={additionalSalesDtls}
          onChange={changeAdditionSalesDtl}
          branch={branch}
          customer={customer}
          warehouse={warehouse}
          department={department}
          setDisplayUserModal={setDisplayNewLedgerModal}
        />
        <AddNewSales
          products={products}
          selectedProducts={selectedProductData}
          addNewProduct={addNewProduct}
          updateSelectedProduct={updateSelectedProduct}
          deleteProduct={deleteProduct}
        />
        <SalesGrandDetails data={grandDetails} />
        <SalesDescription
          data={additionalSalesDtls.description}
          onChange={changeAdditionSalesDtl}
        />
        <ButtonsHolder
          actionType={actionType}
          addInvoice={addInvoice}
          updateInvoice={updateInvoice}
          deleteInvoice={deleteInvoice}
          cancelInvoice={cancelInvoice}
          reset={reset}
          deleteDialog={setOpenDialog}
        />
      </Paper>
      <UserModal
        displayStatus={displayNewLedgerModal}
        setDisplayStatus={setDisplayNewLedgerModal}
        ledgerDetails={newLedger}
        setInputData={updateNewLedgerFields}
        setLedgerDetails={setNewLedger}
        onClickHandler={addNewLedgerFromModal}
      />
      <SaveProgressDialog
        openDialog={openSaveDialog}
        setOpenDialog={setOpenSaveDialog}
        name={"Saving ..."}
      />
    </>
  );
};

export default ManageInvoice;
