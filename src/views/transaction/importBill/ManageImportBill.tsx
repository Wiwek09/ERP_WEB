import { LinearProgress, Paper } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect } from "react";
import useState from "react-usestateref";
import { useHistory, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { SaveProgressDialog } from "../../../components/dialogBox";
import FormHeader from "../../../components/headers/formHeader";
import UserModal from "../../../components/modal/userModal/UserModal";
import { addNewLedger } from "../../../components/modal/userModal/userModalApi";
import Domain from "../../../domain";
import {
  resetPurOtherDataAction,
  updatePurOtherDataAction,
} from "../../../features/productAllSlice/otherpur";
import { updatePurDataAction } from "../../../features/purSlice";
import { IBillTerm } from "../../../interfaces/billTerm";
import { IBranch } from "../../../interfaces/branch";
import { ICompany } from "../../../interfaces/company";
import { IDepartment } from "../../../interfaces/department";
import { IOnChange, IOnSubmit } from "../../../interfaces/event";
import {
  IAccount,
  IAdditionalLocalCost,
  IAdditionalProductCost,
  IDebit,
  IImportBillDetail,
  IProduct,
  IPurchase,
  ISelectedBillProduct,
  IVoucher,
  IdState,
} from "../../../interfaces/importBill";
import { IParams } from "../../../interfaces/params";
import { IWarehouse } from "../../../interfaces/warehouse";
import { getAllBillTerm } from "../../../services/billTermApi";
import { getAllBranch } from "../../../services/branchApi";
import { getCompanyApi } from "../../../services/companyApi";
import { getAllDepartments } from "../../../services/departmentApi";
import { getAllItemStockLedgers } from "../../../services/itemStockLedgerApi";
import { deleteJournalRow } from "../../../services/journalApi";
import { getAllMasterLedger } from "../../../services/masterLedgerAPI";
import {
  addPurchase,
  checkInvoice,
  deleteIndividualPurchase,
  deletePurchase,
  getAllAccount,
  getAllLedger,
  getAllProducts,
  getPurchase,
  updatePurchase,
} from "../../../services/purchaseApi";
import { getAllWarehouseData } from "../../../services/warehouseApi";
import {
  errorMessage,
  successMessage,
} from "../../../utils/messageBox/Messages";
import { getNepaliDate } from "../../../utils/nepaliDate";
import { checkDate } from "../components/helperFunctions";
import AdditionalVoucherDtl from "./components/AdditionalVoucherDtl";
import ImportBillDetail from "./components/ImportBillDetail";
import Products from "./components/Products";
import PurchaseButtonsHolder from "./components/PurchaseButtonsHolder";
import Vouchers from "./components/Vouchers";
import {
  IAutoComplete,
  IMinimumLedgerDetails,
  IVoucherType,
} from "./interfaces";
import { ADDITIONAL_COST_CREDIT, UPDATE_TYPE } from "../../../utils/const/const";

const initalCompany: ICompany = {
  Id: 0,
  BillFrontSizeItem: 0,
  BillFrontWeight: 0,
  BillFrontWeightHeader: 0,
  BillFrontWeightItem: 0,
  BillHeaderFront: "",
  NameEnglish: "",
  NameNepali: "",
  Pan_Vat: "",
  Address: "",
  Street: "",
  City: "",
  District: "",
  Phone: "",
  Email: "",
  BranchCode: "",
  IRD_UserName: "",
  IRD_Password: "",
  PhotoIdentity: "",
  IdentityFileType: "",
  IdentityFileName: "",
  ServiceCharge: 0,
  Description: "",
  VATRate: 0,
  ExciseDuty: 0,
  IRD_SYS: "",
  FirstPageRow: 0,
  BillFrontSizeHeader : 0,
  PrinterType : ""  
};
const initialAdditionalPurchaseDtl: IImportBillDetail = {
  branch: 0,
  warehouse: 0,
  department: 0,
  voucherType: "",
  invoiceNo: "",
  voucherDate: getNepaliDate(),
  customer: 0,
  description: "",
  exchangeRate: 1,
  ppNo: "",
  draftNo: "",
};

const initialSelectedProducts: ISelectedBillProduct = {
  PurchaseId: 0,
  AccountTransactionId: 0,
  AccountTransactionDocumentId: 0,
  Quantity: 0,
  SourceRate: 0,
  SourceAmount: 0,
  GrossRate: 0, //NPR Rate
  GrossAmount: 0, //NPR Amount
  PurchaseRate: 0,
  PurchaseAmount: 0,
  BeforePriceVAT : 0, 
  TotalPurchaseValue:0,
  UnitType: "",
  CostPrice: 0,
  MRPPrice: 0,
  MarginRate: 0,
  TaxRate: 0,
  ExciseDuty: 0,
  AfterExciseDuty: 0,
  ImportDutyRate: 0,
  ImportDuty: 0,
  AfterImportDuty: 0,
  ExciseDutyRate: 0,
  ExtraImportDuty: 0,
  Transportation: 0,
  LabourCharge: 0,
  OtherCharge: 0,
  AfterVatAmount: 0,
  AfterExchangeAmount: 0,
  Currency: "",
  CurrencyExchangeRate: 0,
  ImportRate: 0,
  ImportAmount: 0,
  InventoryItemId: 0,
  FinancialYear: "",
  CompanyCode: 0,
  NepaliMonth: "",
  NVDate: "",
  UserName: "",
  Discount: 0,
  DepartmentId: 0,
  WareHouseId: 0,
  BranchId: 0,
  CurrentStock: 0,
  VATAmount : 0,
  LocalQuantityCost: 0,
  LocalAmountCost: 0,
  AdditionalProductCost: [
    {
      CreditId: 0,
      DebitId: 0,
      BillTermId: 0,
      LedgerId: 0,
      Amount: 0,
      CreditRefId: 0,
      DebitRefId: 0,
      AddCost: false,
    },
  ],
  AdditionalLocalProductCost: [
    {
      CreditId: 0,
      DebitId: 0,
      BillTermId: 0,
      LedgerId: 0,
      Amount: 0,
      CreditRefId: 0,
      DebitRefId: 0,
      AddCost: false,
    },
  ],
};

const initialAdditionalLocalCost: IAdditionalLocalCost = {
  CreditId: 0,
  DebitId: 0,
  BillTermId: 0,
  LedgerId: 0,
  Amount: 0,
  AddCost: 0,
  VatRate: 0,
  VatAmount: 0,
  FinalAmount: 0,
  ShowInBill: false,
  BillNo: "",
  BillDate: "",
};

const initialProductData: IProduct = {
  Id: 0,
  Name: "",
  ItemId: 0,
  CategoryId: 0,
  UnitPrice: 0,
  Qty: 0,
  Discount: 0,
  UnitTypeBase: "",
  ExciseDuty: 0,
  UnitDivided: 0,
  UnitType: "",
  CostPrice: 0,
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

const initailAccountTransactionValue: IVoucher = {
  Id: 0,
  BillTermId: 0,
  Name: "",
  Description: "",
  AccountTypeId: 0,
  AccountId: 0,
  Date: "",
  Debit: 0,
  Quantity: 0,
  // TotalDiscount: 0,
  Credit: 0,
  Exchange: 0,
  ImportDutyId:0,
  ExciseDutyId: 0,
  AccountTransactionId: 0,
  AccountTransactionDocumentId: 0,
  entityLists: "",
  ref_invoice_number: null,
  Sync_With_IRD: false,
  IS_Bill_Printed: false,
  IS_Bill_Active: false,
  Printed_Time: false,
  Real_Time: false,
  CompanyCode: 0,
  NepaliMonth: "",
  NVDate: "",
  FinancialYear: "",
  UserName: "",
  DepartmentId: 0,
  WareHouseId: 0,
  BranchId: 0,
  AddCostBy: 0,
  AddCost: false,
  VatRate: 0,
  VatAmount: 0,
  CostAmount: 0,
  ShowInBill: false,
  IS_Product_Cost: false,
  IS_Local_Cost: false,
  Identifier: "",
  ProductId: 0,
  IsDiscount: false,
  IsNonTaxable: false,
  IsTaxable: false,
  IsVAT: false,
  IsExciseDuty: false,
  IsImportDuty : false,
};

const initailDebitTransactionValue: IDebit = {
  Debit: 0,
  Credit: 0,
  Description: "",
};

const initialNewLedger: IMinimumLedgerDetails = {
  name: "",
  address: "",
  telephoneNo: "",
  email: "",
  panvatno: "",
};

const getVoucherType = (name: string): string => {
  let type = "";
  let endPosition = name.search("#");
  for (let index = 0; index < endPosition - 1; index++) {
    type += name[index];
  }

  return type.trim();
};

const getLocalItem = (key: string, id: string) => {
  if (id === "add") {
    localStorage.removeItem(key);
    return [initialSelectedProducts];
  }
  let data = localStorage.getItem(key);
  const parsedData = JSON.parse(data || "[]");
  const isMatched = parsedData.every(
    (item: ISelectedBillProduct) => item?.tempId === Number(id)
  );
  if (!isMatched) {
    localStorage.removeItem(key);
    return [initialSelectedProducts];
  }
  return parsedData.filter(
    (item: ISelectedBillProduct) => item.InventoryItemId
  );
};

const ManageImportBill = () => {
  const history = useHistory();
  const { id }: IParams = useParams();
  const hostName = window.location.host;
  const purchaseProData = hostName + "importBillData";
  const username = useAppSelector((state) => state.user.data.UserName);
  const companyId = useAppSelector((state) => state?.company.data.Id);
  const financialYear = useAppSelector((state) => state.financialYear.Name);
  const startDate = useAppSelector(
    (state) => state.financialYear.NepaliStartDate
  );
  const endDate = useAppSelector((state) => state.financialYear.NepaliEndDate);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName);
  const [customer, setCustomer] = useState<IAutoComplete[]>([]);
  const [branch, setBranch] = useState<IAutoComplete[]>([]);
  const [warehouse, setWarehouse] = useState<IAutoComplete[]>([]);
  const [department, setDepartment] = useState<IAutoComplete[]>([]);
  const [voucherType, setVoucherType] = useState<IVoucherType[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [account, setAccount] = useState<IAutoComplete[]>([]);

  const [isPurchaseDataLoaded, setIsPurchaseDataLoaded] =
    useState<boolean>(false);

  const [isFirstLoad, setFirstLoad] = useState<boolean>(false);
  const [areAllDataLoaded, setAreAllDataLoaded] = useState<boolean>(false);
  const [purchaseData, setPurchaseData] = useState<IPurchase>();

  const dispatch = useAppDispatch();
  const purchase = useAppSelector((state) => state.purData.data);
  const otherpurchase = useAppSelector((state) => state.purotherData.data);
  const propurchase = useAppSelector((state) => state.purporData);
  const [additionalPurchaseDtl, setAdditionalPurchaseDtl] =
    useState<IImportBillDetail>({
      ...purchase,
      ...otherpurchase,
      invoiceNo: "",
      voucherDate: getNepaliDate(),
      exchangeRate: 1,
      ppNo: "",
      draftNo: "",
    });
  const [openSaveDialog, setOpenSaveDialog] = useState(false);

  const [selectedProductData, setSelectedProductData] = useState<
    Array<ISelectedBillProduct>
  >(getLocalItem(purchaseProData, id));

  const [additionalLocalCost, setAdditionalLocalCost] = useState<
    Array<IAdditionalLocalCost>
  >([]);
  const [billTerm, setBillterm] = useState<Array<any>>([]);
  // >([propurchase]);

  const [updatedTaxable, setUpdatedTaxable] = useState<number>(0);
  const [updatedNonTaxable, setUpdatedNonTaxable] = useState<number>(0);

  const [showAdditionalCost, setShowAdditionalCost] = useState({key:"",open: false}); // state for opening dailogue of additional product cost

  const [showCurrentStock, setCurrentStock] = useState(0);
  const [showStock, setStock] = useState<number>(0);
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [ledgerData, setLedgerData] = useState<Array<any>>([]);
  const [company, setCompany] = useState<ICompany>(initalCompany);
  const [updatedExciseDuty, setUpdatedExciseDuty] = useState<number>(0);
  const [updatedImportDuty,setUpdatedImportDuty] = useState<number>(0)

  const [Id, setId] = useState<IdState>({
    importDuty: { id: 0, accountId: 0, debit: 0 },
    exciseDuty: { id: 0, accountId: 0, debit: 0 },
    discount: { id: 0, accountId: 0, debit: 0 },
    taxable: { id: 0, accountId: 0, debit: 0 },
    nonTaxable: { id: 0, accountId: 0, debit: 0 },
    vat: { id: 0, accountId: 0, debit: 0 },
  });

  useEffect(() => {
    if (id !== "add") {
      const data = selectedProductData.map((item) => {
        return {
          ...item,
          tempId: Number(id),
        };
      });
      localStorage.setItem(purchaseProData, JSON.stringify(data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProductData]);

  useEffect(() => {
    if (id === "add" && isFirstRender) {
      localStorage.removeItem(purchaseProData);
    }
    setIsFirstRender(false);
  }, [id, isFirstRender, purchaseProData]);

  const [selectedVoucherData, setSelectedVoucherData] = useState<IVoucher[]>([
    initailAccountTransactionValue,
  ]);
  const [selectedAccountData, setSelectedAccountData] = useState<IVoucher[]>([
    { ...initailAccountTransactionValue, IsImportDuty: false},
    { ...initailAccountTransactionValue, IsExciseDuty: false },
    { ...initailAccountTransactionValue, IsDiscount: false },
    { ...initailAccountTransactionValue, IsTaxable: false },
    { ...initailAccountTransactionValue, IsVAT: false },
    { ...initailAccountTransactionValue, IsNonTaxable: false },
  ]);

  const [debitSection, setDebitSectionData] = useState<IDebit[]>([
    initailDebitTransactionValue,
  ]);

  const [moredetails, setMoredetails] = useState<IVoucher[]>([
    initailAccountTransactionValue,
  ]);

  const [totalProduct, setTotalProduct] = useState<number>(0);
  const [totalVoucher, setTotalVoucher] = useState<number>(0);
  const [totalVat, setTotalVat] = useState<number>(0);
  const [totalImportDuty, setTotalImportDuty] = useState<number>(0);
  const [totalExciesDuty, setTotalExciesDuty] = useState<number>(0);
  const [totalDiscount, setTotalDiscount] = useState<number>(0);
  const [totalTaxable, setTotalTaxable] = useState<number>(0);
  const [totalNonTaxable, setTotalNonTaxable] = useState<number>(0);

  const [newLedger, setNewLedger] =
    useState<IMinimumLedgerDetails>(initialNewLedger);
  const [displayNewLedgerModal, setDisplayNewLedgerModal] =
    useState<boolean>(false);
  const [isLoaded, setLoaded] = useState<boolean>(false);

  const [grandTotal, setGrandTotal] = useState<number>(
    totalProduct+totalVoucher+ 
    totalTaxable +
      totalNonTaxable +
      totalImportDuty +
      totalVat +
      updatedExciseDuty
  );

  //for grand total calcualtion
  useEffect(() => {
    setGrandTotal(
      totalTaxable +
        totalNonTaxable +
        updatedExciseDuty +
        totalVat +
        totalImportDuty
    );
  }, [totalTaxable]);

  useEffect(() => {
    setGrandTotal(
      totalTaxable +
        totalNonTaxable +
        updatedExciseDuty +
        // totalExciesDuty +
        totalVat +
        totalImportDuty
    );
  }, [totalNonTaxable]);

  // useEffect(() => {
  //   setGrandTotal(
  //     totalTaxable +
  //       totalNonTaxable +
  //       updatedExciseDuty +
  //       // totalExciesDuty +
  //       totalVat +
  //       totalImportDuty
  //   );
  // }, [totalExciesDuty]);

  useEffect(() => {
    setGrandTotal(
      totalTaxable +
        totalNonTaxable +
        updatedExciseDuty +
        // totalExciesDuty +
        totalVat +
        totalImportDuty
    );
  }, [totalVat]);

  useEffect(() => {
    setGrandTotal(
      totalTaxable +
        totalNonTaxable +
        updatedExciseDuty +
        // totalExciesDuty +
        totalVat +
        totalImportDuty
    );
  }, [totalImportDuty]);

  useEffect(() => {
    setGrandTotal(
      totalTaxable +
        totalNonTaxable +
        updatedExciseDuty +
        // totalExciesDuty +
        totalVat +
        totalImportDuty
    );
  }, [updatedExciseDuty]);

  //end calculation excise duty


  //for Get Company 
  useEffect(() => {
    if (!isLoaded) {
      getCompanyApi().then((response: ICompany) => {
        setCompany(response);
        getAllBillTerm().then((response: any) => {
          const billTerm = response.map((item: IBillTerm) => {
            return {
              label: item.Name,
              value: item.Id,
              ledgerId: item.LinkedLedgerId,
            };
          });
          setBillterm(billTerm);
          loadMasterLedger();
        });
      });
    }
  });

  const loadMasterLedger = () => {
    getAllMasterLedger().then((response) => {
      if (response) {
        let ledgerData: any = response.map((elm: any) => {
          return {
            value: elm.Id.toString(),
            label: elm.Name,
          };
        });
        setLedgerData(ledgerData);
        setLoaded(true);
      }
    });
  };
//for Get Total Value for Product
  useEffect(() => {
    let total = 0;
    selectedProductData.forEach((element) => {
      total += element?.PurchaseAmount - element?.Discount;
    });
    setTotalProduct(total);
  }, [selectedProductData]);

  useEffect(() => {
    let total = 0;
    selectedVoucherData.forEach((element) => {
      total += element.Debit;
    });
    setTotalVoucher(total);
  }, [selectedVoucherData]);

  useEffect(() => {
    let vattotal = 0;
    selectedProductData.forEach((element) => {
      if (additionalPurchaseDtl.voucherType === "Purchase Non Vat") {
        vattotal = 0;
      } else {
        if (element.Discount > 0) {
          vattotal +=
            (element.TaxRate / 100) *
            (element.PurchaseRate * element.Quantity);
        } else {
          vattotal +=
            (element.TaxRate / 100) * element.PurchaseRate * element.Quantity;
        }
      }
    });
    setTotalVat(Id.vat.debit > 0 ? Id.vat.debit : vattotal);

    selectedAccountData?.forEach((data) => {
      if (data.IsTaxable) {
        if (data.Debit === 0) {
          setUpdatedTaxable(0);
        } else {
          setUpdatedTaxable(totalTaxable);
        }
      }
      if (data.IsNonTaxable) {
        if (data.Debit === 0) {
          setUpdatedNonTaxable(0);
        } else {
          setUpdatedNonTaxable(totalNonTaxable);
        }
      }
    });    
  }, [selectedProductData, selectedAccountData]);

  useEffect(() => {
    let exciestotal = 0;
    selectedProductData.forEach((element) => {
      exciestotal += element.ExciseDuty * element.Quantity;
    });
    selectedAccountData?.forEach((data) => {
      if (data.IsExciseDuty) {
        if (data.Debit === 0) {
          setUpdatedExciseDuty(0);
        } else {
          setUpdatedExciseDuty(exciestotal);
        }
      }
    });
    setTotalExciesDuty(isFirstLoad && Id.exciseDuty.debit > 0 ? Id.exciseDuty.debit : exciestotal);
  }, [selectedProductData, selectedAccountData]);

  useEffect(() => {
    let importtotal = 0;
    selectedProductData.forEach((element) => {
      importtotal += element.ImportDuty * element.Quantity;
    });
    selectedAccountData?.forEach((data) => {
      if (data.IsImportDuty) {
        if (data.Debit === 0) {
          setUpdatedImportDuty(0);
        } else {
          setUpdatedImportDuty(importtotal);
        }
      }
    });
    setTotalImportDuty( isFirstLoad && Id.importDuty.debit > 0 ? Id.importDuty.debit : importtotal);
  }, [selectedProductData, selectedAccountData]);

  useEffect(() => {
    let discounttotal = 0;
    let taxableTotal = 0;
    let nontaxableTotal = 0;

    selectedProductData.forEach((element) => {
      discounttotal += element.Discount * element.Quantity;
      if (additionalPurchaseDtl.voucherType === "Purchase Non Vat") {
        nontaxableTotal +=
          element.Quantity * element.PurchaseRate;
        taxableTotal = 0;
      } else {
        if (element.TaxRate > 0) {
          taxableTotal +=
            element.Quantity * element.PurchaseRate;
        } else {
          nontaxableTotal +=
            element.Quantity * element.PurchaseRate;
        }
      }
    });
    setTotalTaxable(
      additionalPurchaseDtl.voucherType === "Purchase Non Vat"
        ? 0
        : taxableTotal
    );
    setTotalNonTaxable(nontaxableTotal);
    setTotalDiscount(discounttotal);
    selectedAccountData?.forEach((data) => {
      // if (data.IsDiscount) {
      //   if (data.Debit === 0) {
      //     // setUpdatedDiscount(0);
      //   } else {
      //     // setUpdatedDiscount(discounttotal);
      //   }
      // }
      if (data.IsTaxable) {
        if (data.Debit === 0) {
          setUpdatedTaxable(0);
        } else {
          setUpdatedTaxable(totalTaxable);
        }
      }
      if (data.IsNonTaxable) {
        if (data.Debit === 0) {
          setUpdatedNonTaxable(0);
        } else {
          setUpdatedNonTaxable(nontaxableTotal);
        }
      }
    });
  }, [selectedProductData, selectedAccountData]);

   //arrange array of selected account data
   useEffect(() => {
    if (id !== "add" && isPurchaseDataLoaded) {
      const updatedData = [...selectedAccountData]; // Create a copy of the array

      if (Id.exciseDuty.id === 0) {
        updatedData.splice(ADDITIONAL_COST_CREDIT.EXCISE_DUTY.index, 0, {
          ...initailAccountTransactionValue,
          IsExciseDuty: true,
        });
      }
     
      if (Id.importDuty.id === 0) {
        updatedData.splice(ADDITIONAL_COST_CREDIT.IMPORT_DUTY.index, 0, {
          ...initailAccountTransactionValue,
          IsImportDuty: true,
        });
      }
        
      if (Id.discount.id === 0) {
        updatedData.splice(ADDITIONAL_COST_CREDIT.Discount.index, 0, {
          ...initailAccountTransactionValue,
          IsDiscount: true,
        });
      }

      if (Id.taxable.id === 0) {
        updatedData.splice(ADDITIONAL_COST_CREDIT.TAXABLE_PURCHASE.index, 0, {
          ...initailAccountTransactionValue,
        });
      }

      if (Id.vat.id === 0) {
        updatedData.splice(ADDITIONAL_COST_CREDIT.TOTAL_VAT.index, 0, {
          ...initailAccountTransactionValue,
        });
      }

      if (Id.nonTaxable.id === 0) {
        updatedData.splice(
          ADDITIONAL_COST_CREDIT.NON_TAXABLE_PURCHASE.index,
          0,
          { ...initailAccountTransactionValue }
        );
      }

      // Set the updated data to the state
      setSelectedAccountData(updatedData);
    }
  }, [isPurchaseDataLoaded]);

  useEffect(() => {
    let taxableTotal = 0;
    let nontaxableTotal = 0;
    selectedProductData.forEach((element) => {
      if (additionalPurchaseDtl.voucherType === "Purchase Non Vat") {
        nontaxableTotal +=
          element.Quantity * element.PurchaseRate;
        taxableTotal = 0;
      } else {
        if (element.TaxRate > 0) {
          taxableTotal +=
            element.Quantity * element.PurchaseRate;
        } else {
          nontaxableTotal +=
            element.Quantity * element.PurchaseRate;
        }
      }
    });
    setTotalTaxable(
      additionalPurchaseDtl.voucherType === "Purchase Non Vat"
        ? 0
        : taxableTotal
    );
    setTotalNonTaxable(nontaxableTotal);
  }, [selectedProductData]);

  const setAllData = async () => {
    try {
      const departmentData = await getAllDepartments();
      const warehouseData = await getAllWarehouseData();
      const branchData = await getAllBranch();
      const customerData = await getAllLedger();
      const productsData = await getAllProducts();
      const accountData = await getAllAccount();

      setCustomer(
        customerData.map((data: any) => {
          return { id: data.Id, label: data.Name };
        })
      );

      setBranch(
        branchData.map((data: IBranch) => {
          return { id: data.Id, label: data.NameEnglish };
        })
      );
      setDepartment(
        departmentData.map((data: IDepartment) => {
          return { id: data.Id, label: data.Name };
        })
      );
      setWarehouse(
        warehouseData.map((data: IWarehouse) => {
          return { id: data.Id, label: data.Name };
        })
      );

      setVoucherType([
        { id: "Purchase Vat", label: "Purchase Vat" },
        { id: "Purchase Non Vat", label: "Purchase Non Vat" },
        { id: "Purchase Import", label: "Purchase Import" },
        { id: "Purchases Capital", label: "Purchases Capital" },
      ]);
      setProducts(productsData);
      setAccount(
        accountData.map((data: any) => {
          return { id: data.Id, label: data.Name };
        })
      );
      setAreAllDataLoaded(true);
    } catch {
      errorMessage("Sorry data is not loaded properly. Please try again later.");
      resetAll();
      history.push("/import-bill");
    }
  };

  const fetchPurchaseData = async () => {
    try {
      const response: IPurchase = await getPurchase(id);
      console.log(response,":Fetch")
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

      setAdditionalPurchaseDtl({
        ...additionalPurchaseDtl,
        voucherType: getVoucherType(response.Name),
        invoiceNo: response.ref_invoice_number,
        customer: response.SourceAccountTypeId,
        voucherDate: response.AccountTransactionValues[0].NVDate,
        branch: response.BranchId,
        warehouse: response.WareHouseId,
        department: response.DepartmentId,
        description: response.Description,
        ppNo: response.PragyapanPatraNo,
        draftNo: response.DraftNo,
        exchangeRate:
          response.PurchaseDetails.length > 0
            ? response.PurchaseDetails[0].CurrencyExchangeRate
            : 1,
      });
      setPurchaseData(response);

      // let additionalLocalCost: IAdditionalLocalCost[] = [];

      // let LocalQuantityCost = 0;
      // let LocalAmountCost = 0;
      // response.AccountTransactionValues.filter(
      //   (debitLocalCost) =>
      //     debitLocalCost.Credit === 0 && debitLocalCost.IS_Local_Cost === true
      // ).map((debitLocalCost) => {
      //   const creditLocalCost = response.AccountTransactionValues.find(
      //     (credit) =>
      //       credit.Debit === 0 &&
      //       credit.Identifier === debitLocalCost.Identifier &&
      //       credit.IS_Local_Cost === true
      //   );
      //   if (debitLocalCost.AddCostBy === 0) {
      //     LocalAmountCost = LocalAmountCost + debitLocalCost.Debit;
      //   }
      //   else if (debitLocalCost.AddCostBy === 1) {
      //     LocalQuantityCost = LocalQuantityCost + debitLocalCost.Debit;
      //   }
      //   additionalLocalCost.push({
      //     CreditId: creditLocalCost ? creditLocalCost.AccountId : 0,
      //     DebitId: debitLocalCost.AccountId,
      //     BillTermId: debitLocalCost.BillTermId,
      //     LedgerId: creditLocalCost ? creditLocalCost.AccountId : 0,
      //     Amount: debitLocalCost.CostAmount,
      //     AddCost: debitLocalCost.AddCostBy,
      //     VatRate: debitLocalCost.VatRate,
      //     VatAmount: debitLocalCost.VatAmount,
      //     FinalAmount: debitLocalCost.Debit,
      //     ShowInBill: debitLocalCost.ShowInBill,
      //     BillNo: debitLocalCost.ref_invoice_number,
      //     BillDate: debitLocalCost.NVDate,
      //   });
      // });
      // setAdditionalLocalCost(additionalLocalCost);
      const productData =  await Promise.all(        
        response.PurchaseDetails.map((data) => {
          console.log(data,"Test")
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
          });
        }
        );
        return {
          ...data,
          ExciseDuty: ExciseDuty,
          ExcriseDutyAmount: exciseDutyAmount,
          AfterVatAmount: getAfterVatAmount(data.PurchaseRate, data.TaxRate),
          AdditionalProductCost: additionalProductCost,
          AdditionalLocalProductCost: additionalLocalProductCost,
          VATAmount: getVATAmount(data.PurchaseRate, data.TaxRate),
          TotalPurchaseValue: getTotalAmount(data.PurchaseRate, data.TaxRate,data.Quantity),
          AfterImportDuty: getAfterImportDuty(data.GrossRate,data.ImportDuty)
        };
      })
      );
      if (id !== "add") {
        const data = getLocalItem(purchaseProData, id);
        const localData =
          data.filter((item: ISelectedBillProduct) => {
            return !productData.find(
              (item2: ISelectedBillProduct) =>
                item2.PurchaseId === item.PurchaseId
            );
          }) || [];
        const newData = [...productData, ...localData];

        setSelectedProductData(newData);
      } else {
        setSelectedProductData(productData);
      }

      // setSelectedProductData(productData);
      const accountResponse: IAccount[] = await getAllAccount();
      const discountId = 3;
      const vatId = 8;

      const taxablePurchaeData = accountResponse.find(
        (data) => data.Name === "Taxable Purchase"
      );
      const nonTaxablePurchaseData = accountResponse.find(
        (data) => data.Name === "Non Taxable Purchase"
      );
      const exciseDutyData = accountResponse.find(
        (data) => data.Name === "Excise Duty"
      );
      const importDutyData = accountResponse.find(
        (data) => data.Name === "Import Duty"
      );

      const taxablePurchaseId = taxablePurchaeData
        ? taxablePurchaeData.Id
        : null;
      const nonTaxablePurchaseId = nonTaxablePurchaseData
        ? nonTaxablePurchaseData.Id
        : null;
      const exciseDutyId = exciseDutyData ? exciseDutyData.Id : null;

      const importDutyId = importDutyData ? importDutyData.Id : null;

      setSelectedVoucherData(
        await Promise.all(
        response.AccountTransactionValues.filter((data) => {
          if (data.AccountId !== response.SourceAccountTypeId) {
            if (
              data.AccountId !== discountId &&
              data.AccountId !== vatId &&
              data.AccountId !== taxablePurchaseId &&
              data.AccountId !== nonTaxablePurchaseId &&
              data.AccountId !== importDutyId &&
              data.AccountId !== exciseDutyId &&
              data.IS_Local_Cost === false &&
              data.IS_Product_Cost === false

            ) {
              return data;
            }
          }
        })
      )
    );
      setSelectedAccountData(
        await Promise.all(
          response.AccountTransactionValues.filter((data) => {
            if (
              data.IsDiscount ||
              data.IsImportDuty ||
              data.IsExciseDuty ||
              data.IsNonTaxable ||
              data.IsTaxable ||
              data.IsVAT ||
              data.entityLists == "Cr"
            ) {
              if (data.IsDiscount) {
                setId((prevState) => ({
                  ...prevState,
                  discount: {
                    id: data.Id,
                    accountId: data.AccountId,
                    debit: data.Debit,
                  },
                }));
              }

              if(data.IsImportDuty){
                setId((prevState) => ({
                  ...prevState,
                  importDuty: {
                    id: data.Id,
                    accountId: data.AccountId,
                    debit: data.Debit,
                  }
                }));
              }
              
              if (data.IsExciseDuty) {
                setId((prevState) => ({
                  ...prevState,
                  exciseDuty: {
                    id: data.Id,
                    accountId: data.AccountId,
                    debit: data.Debit,
                  },
                }));
              }
              if (data.IsTaxable) {
                setId((prevState) => ({
                  ...prevState,
                  taxable: {
                    id: data.Id,
                    accountId: data.AccountId,
                    debit: data.Debit,
                  },
                }));
              }
              if (data.IsVAT) {
                setId((prevState) => ({
                  ...prevState,
                  vat: {
                    id: data.Id,
                    accountId: data.AccountId,
                    debit: data.Debit,
                  },
                }));
              }
              if (data.IsNonTaxable) {
                setId((prevState) => ({
                  ...prevState,
                  nonTaxable: {
                    id: data.Id,
                    accountId: data.AccountId,
                    debit: data.Debit,
                  },
                }));
              }
              return data;
            }
          })
        )
      );

      setMoredetails(
        await Promise.all(
        response.AccountTransactionValues.filter((data) => {
          if (data.AccountId !== response.SourceAccountTypeId) {
            if (
              data.AccountId !== discountId &&
              data.AccountId !== vatId &&
              data.AccountId !== taxablePurchaseId &&
              data.AccountId !== nonTaxablePurchaseId &&
              data.AccountId !== importDutyId &&
              data.AccountId !== exciseDutyId &&
              data.IS_Local_Cost === false &&
              data.IS_Product_Cost === false
            ) {
              return data;
            }
          }
        })
       )
      );
      
      setIsPurchaseDataLoaded(true);
    } catch {
      errorMessage("Invalid import bill id.");
      resetAll();
      history.push("/import-bill");
    }
    setTimeout(() => {
      setFirstLoad(false);
    }, 5000);
  };

  useEffect(() => {
    if (selectedVoucherData.length === 0) {
      setSelectedVoucherData([initailAccountTransactionValue]);
    }
  }, [selectedVoucherData]);

  useEffect(() => {
    if (moredetails.length === 0) {
      setMoredetails([initailAccountTransactionValue]);
    }
  }, [moredetails]);

  useEffect(() => {
    const fetchData = async () => {
    setAllData();
    if (loginedUserRole.includes("IBAdd") && id === "add") {
      setIsPurchaseDataLoaded(true);
    } else if (loginedUserRole.includes("IBEdit") && id !== "add") {
      setFirstLoad(true);
      await fetchPurchaseData();
      // console.log(fetchPurchaseData() ,": fetch-call")
    } else {
      history.push("/import-bill");
      resetAll();
      errorMessage("Sorry! permission is denied");
    }
  };
  fetchData();
  }, []);

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
        AccountTypeId: 6,
        PanNo: newLedger.panvatno,
      });
      successMessage("New supplier successfully added.");
      setDisplayNewLedgerModal(false);
      setNewLedger(initialNewLedger);
      setAllData();
    } catch {
      errorMessage("Invalid data");
    }
  };

  const isAdditionalCostFilled = (): boolean => {
    let error = false;
    selectedProductData.map((item) => {
      if (
        item.AdditionalProductCost != null &&
        item.AdditionalProductCost.length > 1
      ) {
        item.AdditionalProductCost.map((cost) => {
          if (
            cost.BillTermId === 0 ||
            // cost.LedgerId === 0 ||
            cost.Amount === 0
          ) {
            error = true;
          }
        });
      }
    });
    if (error) {
      errorMessage(
        "Please input all the required value and amount must be greater than 0 in additional product cost.!"
      );
      return false;
    }
    return true;
  };
  const isAdditionalPurchaseDataFilled = (): boolean => {
    if (additionalPurchaseDtl.voucherType.length < 1) {
      errorMessage("Please select a voucher type.");
      return false;
    } else if (additionalPurchaseDtl.invoiceNo.trim().length <= 0) {
      errorMessage("Please enter the invoice number.");
      return false;
    } else if (additionalPurchaseDtl.customer === 0) {
      errorMessage("Please select a customer.");
      return false;
    } else if (additionalPurchaseDtl.branch === 0) {
      errorMessage("Please select a branch.");
      return false;
    } else if (additionalPurchaseDtl.warehouse === 0) {
      errorMessage("Please select a warehouse.");
      return false;
    } else if (additionalPurchaseDtl.department === 0) {
      errorMessage("Please select a department.");
      return false;
    } else {
      return true;
    }
  };

  const isSelectedProductsVerified = (): boolean => {
    for (let index = 0; index < selectedProductData.length; index++) {
      const element = selectedProductData[index];
      if (element.InventoryItemId === null) {
        errorMessage(
          `Select a inventory name for the row number ${index + 1}.`
        );
        return false;
      } else if (element.Quantity < 0) {
        errorMessage(`Fill the quantity for the row number ${index + 1}.`);
        return false;
      } else if (element.PurchaseRate < 0) {
        errorMessage(
          `Fill the inventory rate for the row number ${index + 1}.`
        );
        return false;
      }
    }
    return true;
  };

  const isSelectedVourchersVerified = () => {
    if (
      selectedVoucherData.length === 1 &&
      selectedVoucherData[0].AccountId === 0
    ) {
      return true;
    }
    for (let index = 0; index < selectedVoucherData.length; index++) {
      const element = selectedVoucherData[index];
      if (element.AccountId === 0) {
        errorMessage(`Select an account name for the row number ${index + 1}.`);
        return false;
      } else if (element.Debit < 0) {
        errorMessage(`Fill the debit amount for the row number ${index + 1}.`);
        return false;
      }
    }
    return true;
  };

  const resetAll = () => {
    setSelectedProductData([initialSelectedProducts]);
    setSelectedVoucherData([initailAccountTransactionValue]);
    setMoredetails([initailAccountTransactionValue]);
    setAdditionalPurchaseDtl(initialAdditionalPurchaseDtl);
    setTotalProduct(0);
    setTotalVoucher(0);
    setTotalVat(0);
    setTotalExciesDuty(0);
    setTotalImportDuty(0);
    setUpdatedExciseDuty(0);
    setTotalDiscount(0);
    setTotalTaxable(0);
    setTotalNonTaxable(0);
    dispatch(resetPurOtherDataAction());
    setAdditionalLocalCost([
      {
        CreditId: 0,
        DebitId: 0,
        BillTermId: 0,
        LedgerId: 0,
        Amount: 0,
        AddCost: 0,
        VatRate: 0,
        VatAmount: 0,
        FinalAmount: 0,
        ShowInBill: false,
        BillNo: "",
        BillDate: "",
      },
    ]);
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

  const calculateMRPPrice = (
    id: number,
    currentPrice: number,
    voucherType: string
  ) => {
    const productData = getProductData(id);
    const taxRate = productData.TaxRate;
    const marginRate = productData.MarginRate;

    let tax = 0;
    if (taxRate > 0 && additionalPurchaseDtl.voucherType !== null) {
      if (
        voucherType === "Purchase Vat" ||
        voucherType === "Purchase Import" ||
        voucherType === "Purchases Capital"
      ) {
        tax = (currentPrice * taxRate) / 100;
      }
    }
    let mrpPrice = 0;
    if (marginRate > 0) {
      mrpPrice = currentPrice + ((currentPrice + tax) * marginRate) / 100;
    } else {
      mrpPrice = currentPrice + tax;
    }
    return mrpPrice;
  };

  useEffect(() => {
    if (additionalPurchaseDtl.voucherType === "Purchase Non Vat") {
      setSelectedProductData([initialSelectedProducts]);
      return;
    }
    if (additionalPurchaseDtl.voucherType === "Purchase Vat") {
      setSelectedProductData([initialSelectedProducts]);
      return;
    }
    setSelectedProductData(
      selectedProductData.map((data) => {
        return {
          ...data,
          MRPPrice: calculateMRPPrice(
            data.InventoryItemId,
            data.PurchaseRate,
            additionalPurchaseDtl.voucherType
          ),
        };
      })
    );
  }, [additionalPurchaseDtl.voucherType]);
  // useEffect(() => {
  //   let vattotal = 0;
  //   selectedProductData.forEach((element) => {
  //     if (additionalPurchaseDtl.voucherType === "Purchase Non Vat") {
  //       vattotal = 0;
  //     } else {
  //       vattotal +=
  //         (element.TaxRate / 100) *
  //         (element.PurchaseRate - element.Discount + element.ExciseDuty) *
  //         element.Quantity;
  //     }
  //   });

  //   //setTotalVat(isFirstLoad && Id.vat.debit > 0 ? Id.vat.debit : vattotal);
  // }, [selectedProductData, selectedAccountData]);

  const updateAdditionalPurchaseField = (name: string, value: any | null) => {
    dispatch(updatePurDataAction({ name: name, value: value }));
    dispatch(updatePurOtherDataAction({ name: name, value: value }));
    setAdditionalPurchaseDtl({ ...additionalPurchaseDtl, [name]: value });
    if (name === "exchangeRate") {
      setSelectedProductData(
        selectedProductData.map((item) => {
          return updateProduct("CurrencyExchangeRate", value, item);
        })
      );
    }
  };

  //Excise Duty
  // useEffect(() => {
  //   let exciestotal = 0;
  //   selectedProductData.forEach((element) => {
  //     exciestotal += element.ExciseDuty * element.Quantity;
  //   });
  //   selectedAccountData?.forEach((data) => {
  //     if (data.IsExciseDuty) {
  //       if (data.Debit === 0) {
  //         //setUpdatedExciseDuty(0);
  //       } else {
  //         //setUpdatedExciseDuty(exciestotal);
  //       }
  //     }
  //   });
  //   // setTotalExciesDuty(
  //   //   isFirstLoad && Id.exciseDuty.debit > 0 ? Id.exciseDuty.debit : exciestotal
  //   // );
  // }, [selectedProductData, selectedAccountData]);

  //start of updating account data
  const updateSelectedAccountData = (
    index: number,
    name: string,
    value: number,
    accountId?: number
  ) => {
    if (name === UPDATE_TYPE.ACCOUNT_ID && value === null) {
      for (const data of selectedAccountData) {
        if (data.Id === accountId) {
          deleteJournalRow(data.Id);
          break;
        }
      }
    }

    let counter = 0;
    let updateCounter = 0;
    setSelectedAccountData((prevData) => {
      const updatedState =
        prevData &&
        prevData?.map((data, i) => {
          if (
            name === UPDATE_TYPE.ACCOUNT_ID &&
            value === null &&
            data.Id === accountId &&
            counter === 0
          ) {
            counter++;
            return { ...data, Debit: 0, Credit: 0, AccountId: data.AccountId };
          } else if (
            id !== "add" &&
            data.Id === accountId &&
            value !== 0 &&
            value !== null &&
            accountId !== 0
          ) {
            updateCounter++;
            return { ...data, [name]: value };
          } else if (
            i === index &&
            value !== null &&
            data.Credit === 0 &&
            updateCounter === 0 &&
            accountId == 0
          ) {
            return { ...data, [name]: value };
          } else {
            return { ...data };
          }
        });

      return updatedState;
    });
  };

  //end of account data
  
  //add for current stock
  const [vvlue, setvvlue] = useState(0);
  const [curValue, setCurStk] = useState<number>(0);
  useEffect(() => {
    const loadDat = async () => {
      const res = await getAllItemStockLedgers(vvlue);
      setCurStk(res);
    };
    loadDat();
  }, [vvlue]);

  const addNewProduct = (): void => {
    if (!isAdditionalPurchaseDataFilled()) {
      return;
    }
    if (!isSelectedProductsVerified()) {
      return;
    }
    initialSelectedProducts.TaxRate = company.VATRate;
    setSelectedProductData([...selectedProductData, initialSelectedProducts]);
  };

  const updateProduct = (
    name: string,
    value: any,
    data: ISelectedBillProduct
  ) => {
    if (
      (name === "ImportRate" || name === "ExciseDutyRate") &&
      (value > 100 || Math.sign(value) === -1)
    ) {
      errorMessage("Rate can't be more than 100 & negative");
    }

    let additionalProductCost =
      name === "AdditionalProductCost" ? value : data.AdditionalProductCost;
    if (name === "NewAdditionalProductCost") {
      additionalProductCost.push(value);
    }
    let additionalLocalProductCost =
    name === "AdditionalLocalProductCost" ? value : data.AdditionalLocalProductCost;
    if (name === "NewAdditionalLocalProductCost") {
      additionalLocalProductCost.push(value);
    }
    let totalAdditionalCost = 0;
    let totalAdditionalLocalCost = 0;
    if (additionalProductCost != null) {
      additionalProductCost
        .filter((item: IAdditionalProductCost) => item.AddCost === true)
        .map((item: IAdditionalProductCost) => {
          totalAdditionalCost = totalAdditionalCost + Number(item.Amount);
        });
    }

    if (additionalLocalProductCost != null) {
      additionalLocalProductCost
        .filter((item: IAdditionalProductCost) => item.AddCost === true)
        .map((item: IAdditionalProductCost) => {
          totalAdditionalLocalCost = totalAdditionalLocalCost + Number(item.Amount);
        });
    }

    const quantity = name === "Quantity" ? value : data.Quantity;
    const taxRate = name === "TaxRate" ? value : data.TaxRate;
    const sourceRate = name === "SourceRate" ? value : data.SourceRate;
    const ImportDutyRate = name === "ImportDutyRate" ? value : data.ImportDutyRate;
    const exciseDutyRate = name === "ExciseDutyRate" ? value : data.ExciseDutyRate;
    const exchangeRate = name === "CurrencyExchangeRate" ? value : data.CurrencyExchangeRate;
    const rateNpr = sourceRate * exchangeRate;
    const ImportAmount = rateNpr * quantity;
  
     const grossRate = rateNpr + (Number(totalAdditionalCost) / quantity);
    const ImportDuty =  (ImportDutyRate * grossRate) / 100;
    const AfterImportDuty = grossRate + ImportDuty;
    const exciseDutyAmount = (AfterImportDuty * exciseDutyRate) / 100;
    const GrossAmount = grossRate + ImportDuty+ exciseDutyAmount;
    const LocalAddCostRate = Number((totalAdditionalLocalCost) / quantity);
    
    const purchaseRate = GrossAmount + LocalAddCostRate ;
    const purchaseAmount = purchaseRate * quantity;
    const VATAmount = (taxRate * purchaseRate) / 100;
    const AfterVatAmount = purchaseRate + VATAmount;
    const TotalPurchaseValue = AfterVatAmount * quantity;

    return {
      ...data,
      TaxRate: taxRate,
      Quantity: quantity,
      ImportRate: rateNpr,
      CurrencyExchangeRate: exchangeRate,
      SourceRate: sourceRate,
      ImportAmount:ImportAmount,
      GrossRate: grossRate,
      ImportDutyRate: ImportDutyRate,
      ImportDuty : ImportDuty,
      AfterImportDuty: AfterImportDuty,
      ExciseDutyRate: exciseDutyRate,
      ExciseDuty: exciseDutyAmount,
      GrossAmount: GrossAmount,
      PurchaseRate: purchaseRate,
      PurchaseAmount: purchaseAmount,
      VATAmount : VATAmount,
      AfterVatAmount: AfterVatAmount,
      TotalPurchaseValue : TotalPurchaseValue,
      AdditionalProductCost: additionalProductCost,
      AdditionalLocalProductCost: additionalLocalProductCost
    };
  };

  const updateSelectedProduct = (index: number | string, name: string, value: any) => {
    const hasProductExisted = (): boolean => {
      const productData = getProductData(value);
      for (let index = 0; index < selectedProductData.length; index++) {
        const element = selectedProductData[index];
        if (productData.Id === element.InventoryItemId) {
          return true;
        }
      }
      return false;
    };

    if (!isAdditionalPurchaseDataFilled()) {
      return;
    }

    if (name === "InventoryItemId") {
      if (value === null) {
        return;
      }
      if (hasProductExisted()) {
        errorMessage("Sorry, the product has already been in the list.");
        return;
      }
      setSelectedProductData(
        selectedProductData.map((data, i) => {
          // console.log('ManageImport-Page-data :>> ', data);
          if (index === i) {
            const productData = getProductData(value);
            setvvlue(value);
            let TaxRate = 0;
            if (additionalPurchaseDtl.voucherType === "Purchase Non Vat") {
              TaxRate = 0;
            } else {
              TaxRate = productData.TaxRate;
            }
            return {
              ...data,
              InventoryItemId: productData.Id,
              TaxRate: TaxRate,
              Quantity: 0,
              ImportRate: 0,
              SourceRate: 0,
              ImportAmount: 0,
              CurrencyExchangeRate:
                additionalPurchaseDtl && additionalPurchaseDtl.exchangeRate
                  ? additionalPurchaseDtl.exchangeRate
                  : 1,
              AfterExchangeAmount: 0,
              ImportDutyRate: 0,
              ImportDuty: 0,
              AfterImportDuty: 0,
              ExciseDutyRate: 0,
              ExciseDuty: 0,
              AfterExciseDuty: 0,
              ExtraImportDuty: 0,
              Transportation: 0,
              LabourCharge: 0,
              OtherCharge: 0,
              PurchaseRate: 0,
              PurchaseAmount: 0,
              UnitType: productData.UnitType,
              CostPrice: 0,
              Discount: 0,
              CurrentStock: 0,
            };
          } else {
            return data;
          }
        })
      );
    } 
    else {
      setSelectedProductData(
        selectedProductData.map((data, i) => {
          if (index === i) {
            return updateProduct(name, value, data);
          } else {
            return data;
          }
        })
      );
    }
  };

  // console.log('selectedProductData :>> ', selectedProductData);

  // useEffect(() => {
  //   setSelectedProductData(
  //     selectedProductData.map((data, i) => {
  //       return updateProduct("LocalCost", 0, data);
  //     })
  //   );
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [additionalLocalCost]);

  const addNewLocalCost = (): void => {
    setAdditionalLocalCost([
      ...additionalLocalCost,
      {
        CreditId: 0,
        DebitId: 0,
        BillTermId: 0,
        LedgerId: 0,
        Amount: 0,
        AddCost: 0,
        VatRate: company?.VATRate ? company.VATRate : 0,
        VatAmount: 0,
        FinalAmount: 0,
        ShowInBill: false,
        BillNo: "",
        BillDate: "",
      },
    ]);
  };

  // const updateLocalCost = (index: number, name: string, value: any) => {
  //   const localCost = additionalLocalCost.map((item, itemIndex) => {
  //     if (itemIndex === index) {
  //       const amount = name === "Amount" ? value : item.Amount;
  //       const addCost = name === "AddCost" ? value : item.AddCost;
  //       const vatRate = name === "VatRate" ? value : item.VatRate;
  //       const vatAmount = (Number(amount) * Number(vatRate)) / 100;
  //       const finalAmount = Number(amount) + Number(vatAmount);
  //       item.BillTermId = name === "BillTermId" ? value : item.BillTermId;
  //       item.LedgerId = name === "LedgerId" ? value : item.LedgerId;
  //       item.Amount = amount;
  //       item.AddCost = addCost;
  //       item.VatRate = vatRate;
  //       item.VatAmount = vatAmount;
  //       item.FinalAmount = finalAmount;
  //       item.ShowInBill = name === "ShowInBill" ? value : item.ShowInBill;
  //       item.BillNo = name === "BillNo" ? value : item.BillNo;
  //       item.BillDate = name === "BillDate" ? value : item.BillDate;
  //     }
  //     return item;
  //   });
  //   setAdditionalLocalCost(localCost);
  // };

  const deleteLocalCost = async (index: number) => {
    const data = additionalLocalCost.find(
      (item, itemIndex) => itemIndex === index
    );
    if (data?.CreditId) {
      await deleteJournalRow(data.CreditId);
    }
    if (data?.DebitId) {
      await deleteJournalRow(data.DebitId);
    }
    setAdditionalLocalCost(
      additionalLocalCost.filter((item, itemIndex) => itemIndex !== index)
    );
  };

  const deleteSelectedProduct = async (index: number) => {
    const selectedProduct = selectedProductData.find((data, i) => index === i);
    const Id = selectedProduct ? selectedProduct.PurchaseId : null;
    if (Id && id !== "add") {
      const savedItems = selectedProductData.filter(
        (item: ISelectedBillProduct) => item.PurchaseId
      );
      if (savedItems.length <= 1) {
        errorMessage(
          "You cannot add remove this row, Please add new row and save to delete this row."
        );
        return;
      }
    }

    try {
      if (Id === null) {
        errorMessage("This product is not deleted. Please try again later.");
        return;
      } else if (Id !== 0) {
        const response = await deleteIndividualPurchase(Id);
        if (response === 1) {
          handleUpdatePurchaseDataOnDelete(index);
          successMessage("Product deleted successfully.");
        }
      }
    } catch {
      errorMessage("This product is not deleted. Please try again later.");
      return;
    }

    setSelectedProductData(
      selectedProductData.filter((data, i) => index !== i)
    );
  };

  const addNewVoucher = () => {
    if (!isSelectedVourchersVerified()) {
      return;
    }

    setSelectedVoucherData([
      ...selectedVoucherData,
      initailAccountTransactionValue,
    ]);

    // setSelectedVoucherData([...selectedVoucherData]);

    // setDebitSectionData([initailDebitTransactionValue]);

    // setDebitSectionData([...selectedVoucherData, initailDebitTransactionValue]);

    setMoredetails([initailAccountTransactionValue]);
  };

  const updateSelectedVoucherData = (
    index: number,
    name: string,
    value: number
  ) => {
    if (name === "AccountId") {
      for (let index = 0; index < selectedVoucherData.length; index++) {
        const element = selectedVoucherData[index];
        const id = element.AccountId;
        if (id === value) {
          errorMessage("Please select a new account.");
          return;
        }
      }
      for (let index = 0; index < selectedAccountData.length; index++) {
        const element = selectedAccountData[index];
        const id = element.AccountId;
        if (id === value) {
          errorMessage("Please select a new account.");
          return;
        }
      }
    }
    setSelectedVoucherData(
      selectedVoucherData.map((data, i) => {
        if (i === index) {
          if (name === UPDATE_TYPE.ACCOUNT_ID && value === null) {
            deleteJournalRow(data.Id);
            return { ...data, Debit: 0, Credit: 0, [name]: value };
          }

          return {
            ...data,
            [name]: value,
          };
        } else {
          return { ...data };
        }
      })
    );    
    setSelectedVoucherData(
      selectedVoucherData.map((data, i) => {
        if (i === index) {
          return { ...data, [name]: value };
        } else {
          return { ...data };
        }
      })
    );
    setMoredetails(
      selectedVoucherData.map((data, i) => {
        if (i === index) {
          return { ...data, [name]: value };
        } else {
          return { ...data };
        }
      })
    );
  };

  const deleteSelectedVoucher = (index: number) => {
    setSelectedVoucherData(
      selectedVoucherData.filter((data, i) => i !== index)
    );
    setMoredetails(moredetails.filter((data, i) => i !== index));
  };

  const addPurchaseData = async () => {
    const currentNepaliData = getNepaliDate();
    if (
      !isAdditionalPurchaseDataFilled() ||
      !isSelectedProductsVerified() ||
      !isSelectedVourchersVerified() ||
      !isAdditionalCostFilled()
    ) {
      return;
    }

    const validDate = await checkDate(
      additionalPurchaseDtl.voucherDate,
      startDate,
      endDate
    );
    const validInvoice = await checkInvoice(
      additionalPurchaseDtl.customer,
      additionalPurchaseDtl.invoiceNo,
      financialYear,
      id
    );

    if (validInvoice) {
      if (validDate) {
        if (
          additionalPurchaseDtl.voucherDate !== null &&
          additionalPurchaseDtl.voucherDate > currentNepaliData
        ) {
          errorMessage("Invalid purchase date.");
          return;
        }

        for (let index = 0; index < selectedProductData.length; index++) {
          const element = selectedProductData[index];
          if (
            element.InventoryItemId === null ||
            element.InventoryItemId <= 0
          ) {
            errorMessage(
              `Please select a product for the list No: ${index + 1}`
            );
            return;
          } else if (element.Quantity === 0) {
            errorMessage(
              `Please enter the product quantity for the list No: ${index + 1}`
            );
            return;
          } else if (element.PurchaseRate < 0) {
            errorMessage(
              `Please enter the product rate for the list No. ${index + 1}`
            );
            return;
          }
        }

        for (let index = 0; index < selectedVoucherData.length; index++) {
          const element = selectedVoucherData[index];
          if (element.Debit < 0) {
            errorMessage(
              `Fill the debit amount for the row number ${index + 1}.`
            );
            return false;
          }
        }

        const products = selectedProductData.map((data) => {
          return {
            ...data,
            FinancialYear: financialYear,
            UserName: username,
            NVDate: additionalPurchaseDtl.voucherDate,
            CompanyCode: companyId,
            BranchId: additionalPurchaseDtl.branch,
            WareHouseId: additionalPurchaseDtl.warehouse,
            DepartmentId: additionalPurchaseDtl.department,
          };
        });

        let accountTransactionValue: IVoucher[] = selectedVoucherData.map(
          (data) => {
            // console.log("Data Log taxable / non taxable ", data);

            return {
              ...data,
              Name: additionalPurchaseDtl.voucherType,
              entityLists: "Dr",
              Date: additionalPurchaseDtl.voucherDate,
              Credit: 0,
              CompanyCode: companyId,
              NVDate: additionalPurchaseDtl.voucherDate,
              ref_invoice_number: additionalPurchaseDtl.invoiceNo,
              FinancialYear: financialYear,
              UserName: username,
              DepartmentId: additionalPurchaseDtl.department,
              WareHouseId: additionalPurchaseDtl.warehouse,
              BranchId: additionalPurchaseDtl.branch,
            };
          }
        );

        selectedAccountData.forEach((data, index) => {
          console.log(data,"SelectedAccountData")
          const valueExist = accountTransactionValue.some((transaction) => 
          { console.log(transaction,"Transactions")
            return transaction.AccountId !== data.AccountId;
          });

          if (valueExist && data.AccountId !== 0) {
            const totalDebitVoucher = {
              ...data,
              Id: 0,
              Name: data.Name,
              entityLists: "Dr",
              Debit: data.Debit,
              Credit: 0,
              AddCost: false,
              AddCostBy: 0,
              BillTermId: 0,
              VatRate: 0,
              AccountId: data.AccountId || 0,
              VatAmount: 0,
              CostAmount: 0,
              ShowInBill: false,
              ref_invoice_number: additionalPurchaseDtl.invoiceNo,
              NVDate: additionalPurchaseDtl.voucherDate,
              IS_Local_Cost: false,
              IS_Product_Cost: true,
              ProductId: 0,
              Identifier: "index" + index,
              Description: data.Description,
              AccountTypeId: 0,
              Quantity: 0,
              AccountTransactionId: 0,
              Exchange: 0,
              ExciseDutyId: 0,
              AccountTransactionDocumentId: 0,
              Sync_With_IRD: false,
              IS_Bill_Printed: false,
              IS_Bill_Active: false,
              Printed_Time: false,
              Real_Time: false,
              NepaliMonth: "",
              CompanyCode: companyId,
              Date: additionalPurchaseDtl.voucherDate,
              FinancialYear: financialYear,
              UserName: username,
              DepartmentId: additionalPurchaseDtl.department,
              WareHouseId: additionalPurchaseDtl.warehouse,
              BranchId: additionalPurchaseDtl.branch,
            };
            accountTransactionValue.push(totalDebitVoucher);
          }
        });

        const TotalCreditVoucher = {
          Id: 0,
          BillTermId: 0,
          Name: additionalPurchaseDtl.voucherType,
          entityLists: "Cr",
          Debit: 0,
          Credit: grandTotal + totalVoucher,
          AddCost: false,
          AddCostBy: 0,
          AccountId: additionalPurchaseDtl.customer,
          VatRate: 0,
          VatAmount: 0,
          CostAmount: 0,
          ShowInBill: false,
          ref_invoice_number: additionalPurchaseDtl.invoiceNo,
          NVDate: additionalPurchaseDtl.voucherDate,
          IS_Local_Cost: false,
          IS_Product_Cost: true,
          ProductId: 0,
          Identifier: "index" + 0,
          Description: "",
          AccountTypeId: 0,
          Quantity: 0,
          AccountTransactionId: 0,
          Exchange: 0,
          ImportDutyId:0,
          ExciseDutyId: 0,
          AccountTransactionDocumentId: 0,
          Sync_With_IRD: false,
          IS_Bill_Printed: false,
          IS_Bill_Active: false,
          Printed_Time: false,
          Real_Time: false,
          NepaliMonth: "",
          CompanyCode: companyId,
          Date: additionalPurchaseDtl.voucherDate,
          FinancialYear: financialYear,
          UserName: username,
          DepartmentId: additionalPurchaseDtl.department,
          WareHouseId: additionalPurchaseDtl.warehouse,
          BranchId: additionalPurchaseDtl.branch,
          IsDiscount: false,
          IsNonTaxable: false,
          IsTaxable: false,
          IsVAT: false,
          IsExciseDuty: false,
        };
        accountTransactionValue.push(TotalCreditVoucher);

        // let accountTransactionValue: IVoucher[] = selectedAccountData.map(
        //   (data) => {
        //     console.log("Data Log taxable / non taxable ", data);

        //     return {
        //       ...data,
        //       Name: additionalPurchaseDtl.voucherType,
        //       entityLists: "Dr",
        //       Date: additionalPurchaseDtl.voucherDate,
        //       Credit: 0,
        //       CompanyCode: companyId,
        //       NVDate: additionalPurchaseDtl.voucherDate,
        //       ref_invoice_number: additionalPurchaseDtl.invoiceNo,
        //       FinancialYear: financialYear,
        //       UserName: username,
        //       DepartmentId: additionalPurchaseDtl.department,
        //       WareHouseId: additionalPurchaseDtl.warehouse,
        //       BranchId: additionalPurchaseDtl.branch,
        //     };
        //   }
        // );

        // console.log("My console Log taxable / non taxable selectedVoucherData", selectedVoucherData);
        // console.log("My console Log taxable / non taxable selectedAccountData ", selectedAccountData);

        // const TotalCreditVoucher = {
        //   Id: 0,
        //   BillTermId: 0,
        //   Name: additionalPurchaseDtl.voucherType,
        //   entityLists: "Cr",
        //   Debit: 0,
        //   Credit: grandTotal + totalVoucher,
        //   AddCost: false,
        //   AddCostBy: 0,
        //   AccountId: additionalPurchaseDtl.customer,
        //   VatRate: 0,
        //   VatAmount: 0,
        //   CostAmount: 0,
        //   ShowInBill: false,
        //   ref_invoice_number: additionalPurchaseDtl.invoiceNo,
        //   NVDate: additionalPurchaseDtl.voucherDate,
        //   IS_Local_Cost: false,
        //   IS_Product_Cost: true,
        //   ProductId: 0,
        //   Identifier: "index" + 0,
        //   Description: "",
        //   AccountTypeId: 0,
        //   Quantity: 0,
        //   AccountTransactionId: 0,
        //   Exchange: 0,
        //   ImportDutyId:0,
        //   ExciseDutyId: 0,
        //   AccountTransactionDocumentId: 0,
        //   Sync_With_IRD: false,
        //   IS_Bill_Printed: false,
        //   IS_Bill_Active: false,
        //   Printed_Time: false,
        //   Real_Time: false,
        //   NepaliMonth: "",
        //   CompanyCode: companyId,
        //   Date: additionalPurchaseDtl.voucherDate,
        //   FinancialYear: financialYear,
        //   UserName: username,
        //   DepartmentId: additionalPurchaseDtl.department,
        //   WareHouseId: additionalPurchaseDtl.warehouse,
        //   BranchId: additionalPurchaseDtl.branch,
        //   IsDiscount: false,
        //   IsNonTaxable: false,
        //   IsTaxable: false,
        //   IsVAT: false,
        //   IsExciseDuty: false,
        // };
        // accountTransactionValue.push(TotalCreditVoucher);

        // accountTransactionValue.push(TotalCreditVoucher);


        // console.log("My console Log taxable / non taxable accountTransactionValue totalImportDuty", totalImportDuty);

        // console.log("My console Log taxable / non taxable accountTransactionValue selectedAccountData", selectedAccountData);
        // selectedAccountData.forEach((element) => {
        //   console.log("My console Log taxable / non taxable accountTransactionValue selectedAccountData", element.AccountId, element.Debit, element.Credit);
        // });

        products.map((data : any) => {
          if (
            data.AdditionalProductCost != null ||
            data.AdditionalLocalProductCost != null
          ) {
            ["AdditionalProductCost", "AdditionalLocalProductCost"].forEach(
              (element) => {
                data?.[element].map((item : any, index :number) => {
                  const bill = billTerm.find((bt) => bt.value == item.BillTermId);
                  if (bill) {
                    const IS_Local_Cost = element === "AdditionalLocalProductCost" ? true : false;

                    const IS_Product_Cost = element === "AdditionalProductCost" ? true : false;
                    
                    const creditVoucher: IVoucher = {
                      Id: item?.CreditRefId,
                      BillTermId: item.BillTermId,
                      Name: bill.label,
                      entityLists: "Cr",
                      Debit: 0,
                      Credit: item.Amount,
                      AddCost: item.AddCost,
                      AddCostBy: 0,
                      AccountId: item.CreditId,
                      VatRate: 0,
                      VatAmount: 0,
                      CostAmount: 0,
                      ShowInBill: false,
                      ref_invoice_number: additionalPurchaseDtl.invoiceNo,
                      NVDate: additionalPurchaseDtl.voucherDate,
                      IS_Local_Cost: IS_Local_Cost,
                      IS_Product_Cost: IS_Product_Cost,
                      ProductId: data.InventoryItemId,
                      Identifier: "index" + index,
                      Description: "",
                      AccountTypeId: 0,
                      Quantity: 0,
                      AccountTransactionId: 0,
                      Exchange: 0,
                      ImportDutyId: 0,
                      ExciseDutyId: 0,
                      AccountTransactionDocumentId: 0,
                      Sync_With_IRD: false,
                      IS_Bill_Printed: false,
                      IS_Bill_Active: false,
                      Printed_Time: false,
                      Real_Time: false,
                      NepaliMonth: "",
                      CompanyCode: companyId,
                      Date: additionalPurchaseDtl.voucherDate,
                      FinancialYear: financialYear,
                      UserName: username,
                      DepartmentId: additionalPurchaseDtl.department,
                      WareHouseId: additionalPurchaseDtl.warehouse,
                      BranchId: additionalPurchaseDtl.branch,
                    };
                    const debitVoucher: IVoucher = {
                      Id: item?.DebitRefId,
                      BillTermId: item.BillTermId,
                      Name: bill.label,
                      entityLists: "Dr",
                      Debit: item.Amount,
                      Credit: 0,
                      AddCost: item.AddCost,
                      AddCostBy: 0,
                      AccountId: item.DebitId,
                      VatRate: 0,
                      VatAmount: 0,
                      CostAmount: 0,
                      ShowInBill: false,
                      ref_invoice_number: additionalPurchaseDtl.invoiceNo,
                      NVDate: additionalPurchaseDtl.voucherDate,
                      IS_Local_Cost: IS_Local_Cost, 
                      IS_Product_Cost: IS_Product_Cost,
                      ProductId: data.InventoryItemId,
                      Identifier: "index" + index,
                      Description: "",
                      AccountTypeId: 0,
                      Quantity: 0,
                      AccountTransactionId: 0,
                      Exchange: 0,
                      ImportDutyId: 0,
                      ExciseDutyId: 0,
                      AccountTransactionDocumentId: 0,
                      Sync_With_IRD: false,
                      IS_Bill_Printed: false,
                      IS_Bill_Active: false,
                      Printed_Time: false,
                      Real_Time: false,
                      NepaliMonth: "",
                      CompanyCode: companyId,
                      Date: additionalPurchaseDtl.voucherDate,
                      FinancialYear: financialYear,
                      UserName: username,
                      DepartmentId: additionalPurchaseDtl.department,
                      WareHouseId: additionalPurchaseDtl.warehouse,
                      BranchId: additionalPurchaseDtl.branch,
                    };
                    accountTransactionValue.push(creditVoucher);
                    accountTransactionValue.push(debitVoucher);
                  }
                });
              }
            );
          }
          delete data?.AdditionalProductCost;
          delete data?.AdditionalLocalProductCost;
        });
    
        const data: IPurchase = {
          Id: 0,
          AccountType: null,
          Name: additionalPurchaseDtl.voucherType,
          AccountTransactionType: additionalPurchaseDtl.voucherType,
          AccountTransactionDocumentId: 0,
          AccountTransactionTypeId: 0,
          SourceAccountTypeId: additionalPurchaseDtl.customer,
          ref_invoice_number: additionalPurchaseDtl.invoiceNo.toString(),
          IsReversed: false,
          Reversable: false,
          TargetAccountTypeId: 0,
          Description: additionalPurchaseDtl.description,
          Amount:grandTotal + totalVoucher,
          DebitAmount: grandTotal + totalVoucher,
          CreditAmount: 0,
          drTotal: grandTotal + totalVoucher,
          crTotal: 0,
          IdentityFile: false,
          TicketReferences: null,
          AccountTransactionValues:
            accountTransactionValue.length === 1 &&
            accountTransactionValue[0].AccountId === 0
              ? []
              : accountTransactionValue,
          InventoryReceiptDetails: null,
          PurchaseDetails: products,
          SalesOrderDetails: null,
          Date: additionalPurchaseDtl.voucherDate,
          CompanyCode: companyId,
          WareHouseId: additionalPurchaseDtl.warehouse,
          DepartmentId: additionalPurchaseDtl.department,
          BranchId: additionalPurchaseDtl.branch,
          FinancialYear: financialYear,
          UserName: username,
          ImportDuty: totalImportDuty,
          ExciseDuty: totalExciesDuty,
          VATAmount: totalVat,
          PragyapanPatraNo: additionalPurchaseDtl.ppNo,
          DraftNo: additionalPurchaseDtl.draftNo,
        };


        try {
          setOpenSaveDialog(true);
          if (data.PurchaseDetails.length === 0) {
            errorMessage("please select some products...");
          } else {
            console.log("Post-take-data: ",data)
            const response = await addPurchase(data);
            console.log("Post- Response : ",response.data)
            if (response === -1) {
              setOpenSaveDialog(false);
              errorMessage("Operation failed. Please try again later.");
            } else {
              if (id === "add") {
                localStorage.removeItem(purchaseProData);
              }
              setOpenSaveDialog(false);
              // console.log("Hello Yagya Data Posit", selectedVoucherData)
              successMessage("Successfully added.");
              resetAll();
              history.push("/import-bill");
            }
          }
        } catch {
          setOpenSaveDialog(false);
          errorMessage("Operation failed. Please try again later.");
        }
      }
    }
  };

  const handleUpdatePurchaseDataOnDelete = async (index?: number) => {
    const products = selectedProductData.map((data) => {
      return {
        ...data,
        FinancialYear: financialYear,
        UserName: username,
        NVDate: additionalPurchaseDtl.voucherDate,
        CompanyCode: companyId,
        BranchId: additionalPurchaseDtl.branch,
        WareHouseId: additionalPurchaseDtl.warehouse,
        DepartmentId: additionalPurchaseDtl.department,
      };
    });

    let accountTransactionValue: IVoucher[] = selectedVoucherData.map(
      (data) => {
        return {
          ...data,
          Name: additionalPurchaseDtl.voucherType,
          entityLists: "Dr",
          Date: additionalPurchaseDtl.voucherDate,
          Credit: 0,
          CompanyCode: companyId,
          NVDate: additionalPurchaseDtl.voucherDate,
          FinancialYear: financialYear,
          UserName: username,
          DepartmentId: additionalPurchaseDtl.department,
          WareHouseId: additionalPurchaseDtl.warehouse,
          BranchId: additionalPurchaseDtl.branch,
        };
      }
    );

    for (const [index, data] of selectedAccountData.entries()) {
      const containValue = accountTransactionValue.some(
        (value) => value.AccountId === data.AccountId
      );
      if (!containValue) {
        const totalDebitVoucher = {
          ...data,
          Id: data.Id || 0,
          Name: data.Name,
          entityLists: "Dr",
          Debit: data.AccountId !== null ? data.Debit : 0,
          Credit: 0,
          AddCost: false,
          AddCostBy: 0,
          BillTermId: 0,
          VatRate: 0,
          AccountId: data.AccountId || 0,
          VatAmount: 0,
          CostAmount: 0,
          ShowInBill: false,
          ref_invoice_number: additionalPurchaseDtl.invoiceNo,
          NVDate: additionalPurchaseDtl.voucherDate,
          IS_Local_Cost: false,
          IS_Product_Cost: true,
          ProductId: 0,
          Identifier: "index" + index,
          Description: data.Description,
          AccountTypeId: 0,
          Quantity: 0,
          AccountTransactionId: 0,
          Exchange: 0,
          ExciseDutyId: 0,
          AccountTransactionDocumentId: 0,
          Sync_With_IRD: false,
          IS_Bill_Printed: false,
          IS_Bill_Active: false,
          Printed_Time: false,
          Real_Time: false,
          NepaliMonth: "",
          CompanyCode: companyId,
          Date: additionalPurchaseDtl.voucherDate,
          FinancialYear: financialYear,
          UserName: username,
          DepartmentId: additionalPurchaseDtl.department,
          WareHouseId: additionalPurchaseDtl.warehouse,
          BranchId: additionalPurchaseDtl.branch,
        };
        accountTransactionValue.push(totalDebitVoucher);
      }

      if (data.entityLists === "Cr") {
        const creditVoucher = {
          ...data,
          AccountId: additionalPurchaseDtl.customer,
          Credit: grandTotal + totalVoucher,
        };
        accountTransactionValue.push(creditVoucher);
      }
    }
        products.map((data: any) => {
          if (
            data.AdditionalProductCost != null ||
            data.AdditionalLocalProductCost != null
          ) {
            ["AdditionalProductCost", "AdditionalLocalProductCost"].forEach(
              (element) => {
                data?.[element].map((item: any, index: number) => {
                  const bill = billTerm.find((bt) => bt.value == item.BillTermId);
                  if (bill) {
                    const IS_Local_Cost = element === "AdditionalLocalProductCost" ? true : false;

                    const IS_Product_Cost = element === "AdditionalProductCost" ? true : false;
                    
                    const creditVoucher: IVoucher = {
                      Id: item?.CreditRefId,
                      BillTermId: item.BillTermId,
                      Name: bill.label,
                      entityLists: "Cr",
                      Debit: 0,
                      Credit: item.Amount,
                      AddCost: item.AddCost,
                      AddCostBy: 0,
                      AccountId: item.CreditId,
                      VatRate: 0,
                      VatAmount: 0,
                      CostAmount: 0,
                      ShowInBill: false,
                      ref_invoice_number: additionalPurchaseDtl.invoiceNo,
                      NVDate: additionalPurchaseDtl.voucherDate,
                      IS_Local_Cost: IS_Local_Cost,
                      IS_Product_Cost: IS_Product_Cost,
                      ProductId: data.InventoryItemId,
                      Identifier: "index" + index,
                      Description: "",
                      AccountTypeId: 0,
                      Quantity: 0,
                      AccountTransactionId: 0,
                      Exchange: 0,
                      ImportDutyId: 0,
                      ExciseDutyId: 0,
                      AccountTransactionDocumentId: 0,
                      Sync_With_IRD: false,
                      IS_Bill_Printed: false,
                      IS_Bill_Active: false,
                      Printed_Time: false,
                      Real_Time: false,
                      NepaliMonth: "",
                      CompanyCode: companyId,
                      Date: additionalPurchaseDtl.voucherDate,
                      FinancialYear: financialYear,
                      UserName: username,
                      DepartmentId: additionalPurchaseDtl.department,
                      WareHouseId: additionalPurchaseDtl.warehouse,
                      BranchId: additionalPurchaseDtl.branch,
                    };
                    const debitVoucher: IVoucher = {
                      Id: item?.DebitRefId,
                      BillTermId: item.BillTermId,
                      Name: bill.label,
                      entityLists: "Dr",
                      Debit: item.Amount,
                      Credit: 0,
                      AddCost: item.AddCost,
                      AddCostBy: 0,
                      AccountId: item.DebitId,
                      VatRate: 0,
                      VatAmount: 0,
                      CostAmount: 0,
                      ShowInBill: false,
                      ref_invoice_number: additionalPurchaseDtl.invoiceNo,
                      NVDate: additionalPurchaseDtl.voucherDate,
                      IS_Local_Cost: IS_Local_Cost, 
                      IS_Product_Cost: IS_Product_Cost,
                      ProductId: data.InventoryItemId,
                      Identifier: "index" + index,
                      Description: "",
                      AccountTypeId: 0,
                      Quantity: 0,
                      AccountTransactionId: 0,
                      Exchange: 0,
                      ImportDutyId: 0,
                      ExciseDutyId: 0,
                      AccountTransactionDocumentId: 0,
                      Sync_With_IRD: false,
                      IS_Bill_Printed: false,
                      IS_Bill_Active: false,
                      Printed_Time: false,
                      Real_Time: false,
                      NepaliMonth: "",
                      CompanyCode: companyId,
                      Date: additionalPurchaseDtl.voucherDate,
                      FinancialYear: financialYear,
                      UserName: username,
                      DepartmentId: additionalPurchaseDtl.department,
                      WareHouseId: additionalPurchaseDtl.warehouse,
                      BranchId: additionalPurchaseDtl.branch,
                    };
                    accountTransactionValue.push(creditVoucher);
                    accountTransactionValue.push(debitVoucher);
                  }
                });
              }
            );
          }
          delete data?.AdditionalProductCost;
          delete data?.AdditionalLocalProductCost;
        });

    const data: IPurchase | null = purchaseData
      ? {
          ...purchaseData,
          Name: additionalPurchaseDtl.voucherType,
          AccountTransactionType: additionalPurchaseDtl.voucherType,
          ref_invoice_number: additionalPurchaseDtl.invoiceNo,
          SourceAccountTypeId: additionalPurchaseDtl.customer,
          BranchId: additionalPurchaseDtl.branch,
          WareHouseId: additionalPurchaseDtl.warehouse,
          DepartmentId: additionalPurchaseDtl.department,
          Description: additionalPurchaseDtl.description,
          AccountTransactionValues:
            accountTransactionValue.length === 1 &&
            accountTransactionValue[0].AccountId === 0
              ? []
              : accountTransactionValue,
          Date: additionalPurchaseDtl.voucherDate,
          PurchaseDetails: index
            ? products?.filter((item: ISelectedBillProduct, i) => i !== index)
            : products,
          Amount:grandTotal + totalVoucher,
          DebitAmount: grandTotal+totalVoucher,
          drTotal: grandTotal+totalVoucher,
          FinancialYear: financialYear,
          UserName: username,
          ImportDuty: totalImportDuty,
          ExciseDuty: totalExciesDuty,
          VATAmount: totalVat,
          PragyapanPatraNo: additionalPurchaseDtl.ppNo,
          DraftNo: additionalPurchaseDtl.draftNo,
        }
      : null;

    if (index) {
      await updatePurchase(id, data);
    } else {
      return data;
    }
  };

  const updatePurchaseData = async () => {
    const currentNepaliData = getNepaliDate();
    if (
      !isAdditionalPurchaseDataFilled() ||
      !isSelectedProductsVerified() ||
      !isSelectedVourchersVerified() ||
      !isAdditionalCostFilled()
    ) {
      return;
    }
    const validDate = await checkDate(
      additionalPurchaseDtl.voucherDate,
      startDate,
      endDate
    );

    const validInvoice = await checkInvoice(
      additionalPurchaseDtl.customer,
      additionalPurchaseDtl.invoiceNo,
      financialYear,
      id
    );

    if (validInvoice) {
      if (validDate) {
        if (
          additionalPurchaseDtl.voucherDate !== null &&
          additionalPurchaseDtl.voucherDate > currentNepaliData
        ) {
          errorMessage("Invalid purchase date.");
          return;
        }

        for (let index = 0; index < selectedProductData.length; index++) {
          const element = selectedProductData[index];
          if (
            element.InventoryItemId === null ||
            element.InventoryItemId <= 0
          ) {
            errorMessage(
              `Please select a product for the list No: ${index + 1}`
            );
            return;
          } else if (element.Quantity === 0) {
            errorMessage(
              `Please enter the product quantity for the list No: ${index + 1}`
            );
            return;
          } else if (element.PurchaseRate < 0) {
            errorMessage(
              `Please enter the product rate for the list No. ${index + 1}`
            );
            return;
          }
        }

        const data: IPurchase | null | undefined =
          await handleUpdatePurchaseDataOnDelete();
        try {
          setOpenSaveDialog(true);
          if (data?.PurchaseDetails.length === 0) {
            errorMessage("please select some products...");
            setOpenSaveDialog(false);
          } else {
            console.log("Update-take-date: ",data)
            const response = await updatePurchase(id, data);
            console.log("Update-Response: ",response.data)
            if (response) {
              setOpenSaveDialog(false);
              successMessage("Successfully updated.");
              await localStorage.removeItem(purchaseProData);
              resetAll();
              history.push("/import-bill");
            } else {
              await localStorage.removeItem(purchaseProData);
              setOpenSaveDialog(false);
              successMessage("Successfully updated.");
              history.push("/import-bill");
            }
          }
        } catch (error) {
          setOpenSaveDialog(false);
          errorMessage("Update operation failed. Please try again later.");
        }
      }
    }
  };

  const deletePurchaseData = async () => {
    try {
      const response: IPurchase = await getPurchase(id);
      await deletePurchase(response);
      if (id !== "add") {
        localStorage.removeItem(`${Domain.domainName}_purProData_${id}`);
      }
      successMessage("Import Bill is successfully deleted.");
      resetAll();
      history.push("/import-bill");
    } catch {
      errorMessage("Delete operation failed. Please try again later.");
    }
  };
  return (
    <>
      <Box>
        <FormHeader
          headerName={id === "add" ? "Add Import Bill" : "Edit Import Bill"}
        />
        {isPurchaseDataLoaded && areAllDataLoaded ? (
          <Paper sx={{ paddingX: 3, paddingY: 4 }}>
            <ImportBillDetail
              branch={branch}
              warehouse={warehouse}
              department={department}
              customer={customer}
              voucherType={voucherType}
              data={additionalPurchaseDtl}
              updateData={updateAdditionalPurchaseField}
              setDisplayUserModal={setDisplayNewLedgerModal}
            />
            <Products
              company={company}
              billTerm={billTerm}
              accountData={account}
              selectedAccountData={selectedAccountData}
              updateSelectedVoucher={updateSelectedVoucherData}
              products={products}
              moredetails={moredetails}
              addNewProduct={addNewProduct}
              selectedProducts={selectedProductData}
              setSelectedProducts={setSelectedProductData}
              updateSelectedProduct={updateSelectedProduct}
              deleteSelectedProduct={deleteSelectedProduct}
              updateSelectedAccountData={updateSelectedAccountData}
              vattotal={totalVat}
              importdutytotal={totalImportDuty}
              excisedutytotal={totalExciesDuty}
              discounttotal={totalDiscount}
              taxabletotal={totalTaxable}
              nontaxabletotal={totalNonTaxable}
              addNewLocalCost={addNewLocalCost}
              additionalLocalCost={additionalLocalCost}
              // updateLocalCost={updateLocalCost}
              deleteLocalCost={deleteLocalCost}
              ledgerData={ledgerData}
              Ids={Id}
              showAdditionalCost={showAdditionalCost}
              setShowAdditionalCost={setShowAdditionalCost}
            />
            <Vouchers
              accountData={account}
              selectedVoucher={selectedVoucherData}
              debitSection={debitSection}
              // moredetails={moredetails}
              addNewVoucher={addNewVoucher}
              updateSelectedVoucher={updateSelectedVoucherData}
              deleteSelectedVoucher={deleteSelectedVoucher}
              total={totalVoucher}
              grandTotal={grandTotal}
            />
            <AdditionalVoucherDtl
              description={additionalPurchaseDtl.description}
              setDescription={updateAdditionalPurchaseField}
            />
            <PurchaseButtonsHolder
              actionType={id}
              addPurchase={addPurchaseData}
              updatePurchase={updatePurchaseData}
              deletePurchase={deletePurchaseData}
            />
          </Paper>
        ) : (
          <LinearProgress sx={{ marginTop: 3 }} />
        )}
      </Box>
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

export default ManageImportBill;
