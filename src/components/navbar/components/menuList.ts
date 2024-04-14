import { AiOutlineLock, AiOutlineStock } from "react-icons/ai";
import {
  BiBasket,
  BiReceipt,
  BiTransferAlt,
  BiUserCheck,
} from "react-icons/bi";
import {
  BsBank,
  BsBarChart,
  BsCalendar2Date,
  BsCalendarDate,
  BsChatText,
  BsGraphDown,
  BsGraphUp,
  BsJournalCheck,
  BsReverseLayoutTextSidebarReverse,
} from "react-icons/bs";
import { FaWarehouse } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import {
  GiBlackBook,
  GiBookPile,
  GiNotebook,
  GiPayMoney,
  GiScales,
  GiShoppingCart,
} from "react-icons/gi";
import {
  HiOutlineDocumentReport,
  HiOutlineUserAdd,
  HiOutlineUserGroup,
} from "react-icons/hi";
import {
  MdAddShoppingCart,
  MdHouseSiding,
  MdImportExport,
  MdOutlineCalculate,
  MdOutlineCategory,
  MdOutlineHomeWork,
  MdOutlineInventory2,
  MdOutlineManageAccounts,
  MdOutlineOtherHouses,
  MdOutlineShopTwo,
  MdPayment,
  MdProductionQuantityLimits,
} from "react-icons/md";
import { RiHome6Line, RiUserStarLine } from "react-icons/ri";
import { VscBook, VscGraph, VscGraphLeft } from "react-icons/vsc";
import { INavMenu } from "../../../interfaces/nav";
import permissionList from "../../../userRoles/permissionList";

const menuItem: INavMenu[] = [
  {
    name: "Pos/Billing",
    path: "/pos-billing",
    icon: MdOutlineCalculate,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Transaction",
    icon: BiTransferAlt,
    subItem: [
      {
        name: "Invoice",
        path: "/invoice",
        icon: BsGraphUp,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "Purchase",
        path: "/purchase",
        icon: GiShoppingCart,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "ImportBill",
        path: "/import-bill",
        icon: BiReceipt,
        permissionClass: permissionList.COMPANY,
      },      
      {
        name: "Receipt",
        path: "/receipt",
        icon: BiReceipt,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "Payment",
        path: "/payment",
        icon: MdPayment,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "BankCash",
        path: "/contra",
        icon: BsBank,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "SalesReturn",
        path: "/sales-return",
        icon: BsGraphDown,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "PurchaseReturn",
        path: "/purchase-return",
        icon: BiBasket,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "Journal",
        path: "/journal",
        icon: BsJournalCheck,
        permissionClass: permissionList.COMPANY,
      },
    ],
  },
  {
    name: "TRANMIS",
    icon: MdImportExport,
    subItem: [
      {
        name: "OrderManagement",
        path: "/order-management",
        icon: MdOutlineShopTwo,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "Quotation",
        path: "/quotation",
        icon: GiPayMoney,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "PurchaseOrder",
        path: "/purchase-order",
        icon: MdAddShoppingCart,
        permissionClass: permissionList.COMPANY,
      },
    ],
  },
  {
    name: "Report",
    icon: HiOutlineDocumentReport,
    subItem: [
      {
        name: "Ledger",
        path: "/ledger-detail",
        icon: VscBook,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "TrialBalance",
        path: "/trial-balance",
        icon: BsGraphUp,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "ProfitLoss",
        path: "/account-balance",
        icon: AiOutlineStock,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "ProfitLoss",
        path: "/profitandloss",
        icon: AiOutlineStock,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "BalanceSheet",
        path: "/balancesheet",
        icon: VscGraph,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "SalesDateWise",
        path: "/sales-date-wise",
        icon: BsCalendarDate,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "ItemWiseProfit",
        path: "/item-date-profit",
        icon: BsCalendarDate,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "SalesBook",
        path: "/salesbook",
        icon: GiNotebook,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "SalesReturnBook",
        path: "/salesreturnbook",
        icon: BsReverseLayoutTextSidebarReverse,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "MaterializedView",
        path: "/materializedview",
        icon: VscGraphLeft,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "PurchaseBook",
        path: "/purchase-book",
        icon: GiBookPile,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "PurchaseReturnBook",
        path: "/purchasereturnbook",
        icon: GiBlackBook,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "ItemStockLedger",
        path: "/item-stock-ledger",
        icon: RiUserStarLine,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "StockInHand",
        path: "/stock-in-hand",
        icon: BsBarChart,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "Audit",
        path: "/audit-trial",
        icon: BsBarChart,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "DebtorsReport",
        path: "/Debtors-Report",
        icon: BsBarChart,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "CreditorsReport",
        path: "/Creditors-Report",
        icon: BsBarChart,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "AllItemWiseProfit",
        path: "/Item-wise-Profit",
        icon: BsBarChart,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "StockAgeingReport",
        path: "/Stock-Ageing-Report",
        icon: BsBarChart,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "CustomerReport",
        path: "/Customer-Report",
        icon: BsBarChart,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "DebtorsAgeingReport",
        path: "/Debtors-Ageing-Report",
        icon: BsBarChart,
        permissionClass: permissionList.COMPANY,
      },
    ],
  },
  {
    name: "Master Account",
    icon: HiOutlineUserGroup,
    subItem: [
      {
        name: "MasterLedger",
        path: "/master-ledger",
        icon: GiNotebook,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "MasterLedger2",
        path: "/master-ledger2",
        icon: GiNotebook,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "GroupLedger",
        path: "/group-ledger",
        icon: GiBookPile,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "TransactionType",
        path: "/transaction-type",
        icon: VscBook,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "BillTerm",
        path: "/bill-term",
        icon: BiReceipt,
        permissionClass: permissionList.COMPANY,
      },
    ],
  },
  {
    name: "Inventory",
    icon: MdOutlineInventory2,
    subItem: [
      {
        name: "Products",
        path: "/products",
        icon: MdProductionQuantityLimits,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "Category",
        path: "/category",
        icon: MdOutlineCategory,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "UnitType",
        path: "/unit-type",
        icon: GiScales,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "Warehouse",
        path: "/warehouse",
        icon: MdHouseSiding,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "WarehouseType",
        path: "/warehouse-types",
        icon: FaWarehouse,
        permissionClass: permissionList.COMPANY,
      },
    ],
  },
  {
    name: "Management",
    icon: MdOutlineManageAccounts,
    subItem: [
      {
        name: "Departments",
        path: "/department",
        icon: MdOutlineOtherHouses,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "FinancialYear",
        path: "/financial",
        icon: BsCalendar2Date,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "Company",
        path: "/company",
        icon: MdOutlineHomeWork,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "Branch",
        path: "/branch",
        icon: RiHome6Line,
        permissionClass: permissionList.COMPANY,
      },
    ],
  },
  {
    name: "User",
    icon: FiUsers,
    subItem: [
      {
        name: "Users",
        path: "/users",
        icon: FiUsers,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "AssignRoles",
        path: "/assign-roles",
        icon: HiOutlineUserAdd,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "Roles",
        path: "/user-roles",
        icon: BiUserCheck,
        permissionClass: permissionList.COMPANY,
      },
      {
        name: "ChangePassword",
        path: "/change-password",
        icon: AiOutlineLock,
        permissionClass: permissionList.COMPANY,
      },
    ],
  },
  {
    name: "SMS",
    icon: BsChatText,
    subItem: [
      {
        name: "SMS",
        path: "/sms",
        icon: BsChatText,
        permissionClass: permissionList.COMPANY,
      },
    ],
  },
];
export default menuItem;
