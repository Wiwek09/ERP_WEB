import { IRoute } from "../interfaces/route";
import permissionList from "../userRoles/permissionList";
import PageNotFound from "../views/404";
import DashboardPage from "../views/dashboard";
import Category from "../views/inventory/category";
import ManageCategory from "../views/inventory/category/ManageCategory";
import Product from "../views/inventory/product";
import ManageProduct from "../views/inventory/product/ManageProduct";
import UnitType from "../views/inventory/unitType";
import ManageUnitType from "../views/inventory/unitType/ManageUnitType";
import Warehouse from "../views/inventory/warehouse";
import WarehouseManage from "../views/inventory/warehouse/warehouseManage";
import WareHouseType from "../views/inventory/warehouseType";
import AddEdit from "../views/inventory/warehouseType/components/addEdit";
import ManageBranch from "../views/management/branch/ManageBranch";
import Branch from "../views/management/branch/index";
import Company from "../views/management/company/Company";
import EditCompany from "../views/management/company/EditCompany";
import Department from "../views/management/department";
import ManageDepartment from "../views/management/department/ManageDepartment";
import Financial from "../views/management/financial";
import ManageFinanical from "../views/management/financial/ManageFinanical";
import MasterLedger2 from "../views/masterAccount/LedgerMaster";
import BillTerm from "../views/masterAccount/billTerm";
import ManageBillTerm from "../views/masterAccount/billTerm/ManageBillTerm";
import GroupLedger from "../views/masterAccount/groupLedger";
import ManageGroupLedger from "../views/masterAccount/groupLedger/manageGroupLedger";
import MasterLedger from "../views/masterAccount/masterLedger";
import ManageMasterLedger from "../views/masterAccount/masterLedger/manageMasterLedger";
import TransactionType from "../views/masterAccount/transactionType";
import ManageTt from "../views/masterAccount/transactionType/manageTt";
import PosBilling from "../views/posBilling";
import AllItemWiseProfitReport from "../views/report/AllItemWiseProfit";
import CreditorsReport from "../views/report/CreditorsReport";
import CustomerReport from "../views/report/CustomerReport";
import DebtorsAgeingReport from "../views/report/DebtorsAgeingReport";
import DebtorsReport from "../views/report/DebtorsReport";
import StockAgeingReport from "../views/report/StockAgeingReport";
import Accounting from "../views/report/accounting";
import AuditTrial from "../views/report/auditTrial";
import BalanceSheet from "../views/report/balanceSheet";
import ItemStockLedger from "../views/report/itemStockLedger";
import ItemWiseProfitability from "../views/report/itemWiseProfitablity";
import LedgerDetail from "../views/report/ledger";
import MaterializedView from "../views/report/materializedView";
import ProfitAndLoss from "../views/report/profitAndLoss";
import PurchaseBookGrid from "../views/report/purchaseBook";
import PurchaseReturnBook from "../views/report/purchaseReturnBook";
import SalesBook from "../views/report/salesBook";
import SalesDateWise from "../views/report/salesDateWise";
import SalesReturnBook from "../views/report/salesReturnBook";
import StockInHand from "../views/report/stockInHand";
import TrialBalance from "../views/report/trialBalance";
import Contra from "../views/transaction/contra";
import ManageContra from "../views/transaction/contra/ManageContra";
import ViewContra from "../views/transaction/contra/components/ViewContra";
import ImportBill from "../views/transaction/importBill";
import ManageImportBill from "../views/transaction/importBill/ManageImportBill";
import ImportBillView from "../views/transaction/importBill/components/PurchaseView";
// import ImportBill from "../views/transaction/importBill";
// import ManageImportBill from "../views/transaction/importBill/ManageImportBill";
// import ImportBillView from "../views/transaction/importBill/components/PurchaseView";
import Invoice from "../views/transaction/invoice";
import ManageInvoice from "../views/transaction/invoice/ManageInvoice";
import ViewInvoice from "../views/transaction/invoice/components/ViewInvoice";
import Journal from "../views/transaction/journal";
import ManageJournal from "../views/transaction/journal/ManageJournal";
import ViewJournal from "../views/transaction/journal/components/ViewJournal";
import Payment from "../views/transaction/payment";
import ManagePayment from "../views/transaction/payment/ManagePayment";
import ViewPayment from "../views/transaction/payment/components/ViewPayment";
import Purchase from "../views/transaction/purchase";
import ManagePurchase from "../views/transaction/purchase/ManagePurchase";
import PurchaseView from "../views/transaction/purchase/components/PurchaseView";
import PurchaseReturn from "../views/transaction/purchaseReturn";
import PrintViewPurchaseReturn from "../views/transaction/purchaseReturn/components/viewPurchaseReturn";
import ManagePurchaseReturn from "../views/transaction/purchaseReturn/managePr";
import Receipt from "../views/transaction/receipt";
import ManageReceipt from "../views/transaction/receipt/ManageReceipt";
import ViewReceipt from "../views/transaction/receipt/components/ViewReceipt";
import SalesReturn from "../views/transaction/salesReturn";
import PrintViewSalesReturn from "../views/transaction/salesReturn/components/viewSalesReturn";
import ManageSalesReturn from "../views/transaction/salesReturn/manageSr";
import OrderManagement from "../views/transmis/orderManagement";
import PrintViewOrderManagement from "../views/transmis/orderManagement/components/viewsOrder";
import ManageOrdermanagement from "../views/transmis/orderManagement/manageOrdermanagement";
import PurchaseOrder from "../views/transmis/purchaseOrder";
import PrintViewPurchaseOrder from "../views/transmis/purchaseOrder/components/viewPurchaseOrder";
import ManagePurchaseOrder from "../views/transmis/purchaseOrder/managePurchaseOrder";
import Quotation from "../views/transmis/quotation";
import PrintViewQuotation from "../views/transmis/quotation/components/viewQuotation";
import ManageQuotation from "../views/transmis/quotation/manageQuotation";
import AssignRoles from "../views/user/assignRoles";
import AssignRoleManage from "../views/user/assignRoles/manageAssignRoles";
import ChangePassword from "../views/user/changePassword";
import Roles from "../views/user/roles";
import RolesManage from "../views/user/roles/rolesManage";
import SMS from "../views/user/sms";
import User from "../views/user/users";
import ManageUser from "../views/user/users/ManageUser";

const homeRoutes: IRoute[] = [
  {
    name: "Dashboard",
    path: "/",
    component: DashboardPage,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "POS Billing",
    path: "/pos-billing",
    component: PosBilling,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "warehouse",
    path: "/warehouse",
    component: Warehouse,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "warehouseCRUD",
    path: "/warehouse/:id",
    component: WarehouseManage,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "warehouse Type",
    path: "/warehouse-types",
    component: WareHouseType,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "warehouse Type CRUD",
    path: "/warehouse-type/:id",
    component: AddEdit,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },

  {
    name: "Page Not Found",
    path: "/404",
    component: PageNotFound,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
];
//Report Routes
const reportRoutes = [
  {
    name: "Profit And Loss",
    path: "/profitandloss",
    component: ProfitAndLoss,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Balance Sheet",
    path: "/balancesheet",
    component: BalanceSheet,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Materialized View",
    path: "/materializedview",
    component: MaterializedView,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Sales Book",
    path: "/salesbook",
    component: SalesBook,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Sales Return Book",
    path: "/salesreturnbook",
    component: SalesReturnBook,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Item Stock Ledger",
    path: "/item-stock-ledger",
    component: ItemStockLedger,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Trial Balance",
    path: "/trial-balance",
    component: TrialBalance,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Account Balance",
    path: "/account-balance",
    component: Accounting,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Ledger Details",
    path: "/ledger-detail",
    component: LedgerDetail,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },

  {
    name: "Purchase Book",
    path: "/purchase-book",
    component: PurchaseBookGrid,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Page Not Found",
    path: "/purchasereturnbook",
    component: PurchaseReturnBook,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Stock In Hand",
    path: "/stock-in-hand",
    component: StockInHand,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Items Wise Sales Report",
    path: "/sales-date-wise",
    component: SalesDateWise,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Items Wise Profit Report",
    path: "/item-date-profit",
    component: ItemWiseProfitability,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Audit Trial",
    path: "/audit-trial",
    component: AuditTrial,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Debtors Report",
    path: "/Debtors-Report",
    component: DebtorsReport,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Creditors Report",
    path: "/Creditors-Report",
    component: CreditorsReport,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Item wise Profit",
    path: "/Item-wise-Profit",
    component: AllItemWiseProfitReport,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Stock Ageing Report",
    path: "/Stock-Ageing-Report",
    component: StockAgeingReport,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Customer Report",
    path: "/Customer-Report",
    component: CustomerReport,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Debtors Ageing Report",
    path: "/Debtors-Ageing-Report",
    component: DebtorsAgeingReport,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
];
//sms
const sms = [
  {
    name: "sms",
    path: "/sms",
    component: SMS,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
];
//user Routes
const userRoutes = [
  {
    name: "user",
    path: "/users",
    component: User,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "curd user",
    path: "/users/:id",
    component: ManageUser,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Assign Roles Manage",
    path: "/assign-roles/:id",
    component: AssignRoleManage,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Assign Roles",
    path: "/assign-roles",
    component: AssignRoles,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "User Roles Manage",
    path: "/user-roles/:id",
    component: RolesManage,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "User Roles",
    path: "/user-roles",
    component: Roles,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Change Password",
    path: "/change-password",
    component: ChangePassword,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
];
//Master Account
const masterAccount = [
  {
    name: "Master Ledger CRUD",
    path: "/master-ledger/:id",
    component: ManageMasterLedger,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Master Ledger",
    path: "/master-ledger",
    component: MasterLedger,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Master Ledger",
    path: "/master-ledger2",
    component: MasterLedger2,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Group Ledger",
    path: "/group-ledger",
    component: GroupLedger,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Group Ledger CRUD",
    path: "/group-ledger/:id",
    component: ManageGroupLedger,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Transaction Type",
    path: "/transaction-type",
    component: TransactionType,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Transaction Type CRUD",
    path: "/transaction-type/:id",
    component: ManageTt,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Bill Terms",
    path: "/bill-term",
    component: BillTerm,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "manage Bill Term",
    path: "/bill-term/:id",
    component: ManageBillTerm,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
];

//TRansMis Router
const transmisRoutes = [
  {
    name: "Purchase Order",
    path: "/purchase-order",
    component: PurchaseOrder,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Purchase Order CRUD",
    path: "/purchase-order/:id",
    component: ManagePurchaseOrder,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Purchase Order View",
    path: "/purchase-order/view/:id",
    component: PrintViewPurchaseOrder,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Order Management",
    path: "/order-management",
    component: OrderManagement,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Order Management CRUD",
    path: "/order-management/:id",
    component: ManageOrdermanagement,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    //added
    name: "Order Management CRUD",
    path: "/order-management/:id/:type?",
    component: ManageOrdermanagement,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Order Management View",
    path: "/view/order-management/:id",
    component: PrintViewOrderManagement,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Quotation",
    path: "/quotation",
    component: Quotation,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Quotaion CRUD",
    path: "/quotation/:id",
    component: ManageQuotation,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Quotaion CRUD",
    path: "/quotation/:id/:type?",
    component: ManageQuotation,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Quotaion View",
    path: "/viewquotation/:viewid",
    component: PrintViewQuotation,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
];
// Inventory allRoutes

const inventoryRoutes = [
  {
    name: "Product",
    path: "/products",
    component: Product,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Product",
    path: "/products/:id",
    component: ManageProduct,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "crud category",
    path: "/category/:id",
    component: ManageCategory,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Category",
    path: "/category",
    component: Category,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Unit Type",
    path: "/unit-type",
    component: UnitType,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "crud Unit Type",
    path: "/unit-type/:id",
    component: ManageUnitType,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
];

// This is for management
const managementRoutes = [
  {
    name: "Copmany",
    path: "/company",
    component: Company,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Edit compamy",
    path: "/company/edit",
    component: EditCompany,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Branch",
    path: "/branch",
    component: Branch,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Branch CRUD",
    path: "/branch/:id",
    component: ManageBranch,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Department",
    path: "/department/",
    component: Department,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Department CRUD",
    path: "/department/:id",
    component: ManageDepartment,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Financial",
    path: "/financial",
    component: Financial,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "crud Financial",
    path: "/financial/:id",
    component: ManageFinanical,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
];
const transactionRoutes = [
  {
    name: "Journal",
    path: "/journal",
    component: Journal,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },

  {
    name: "Invoice",
    path: "/invoice",
    component: Invoice,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "manage invoice",
    path: "/invoice/:id",
    component: ManageInvoice,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "view invoice",
    path: "/invoice/view/:id",
    component: ViewInvoice,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "purchase",
    path: "/purchase",
    component: Purchase,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "manage purchase",
    path: "/purchase/:id",
    component: ManagePurchase,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Purchase view",
    path: "/purchase/view/:id",
    component: PurchaseView,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Import Bill",
    path: "/import-bill",
    component: ImportBill,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "manage Import Bill",
    path: "/import-bill/:id",
    component: ManageImportBill,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Import Bill view",
    path: "/import-bill/view/:id",
    component: ImportBillView,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Journal",
    path: "/journal-voucher/:id",
    component: ManageJournal,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "JournalView ",
    path: "/journal/view/:id",
    component: ViewJournal,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Payment",
    path: "/payment",
    component: Payment,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "PaymentCRUD",
    path: "/payment/:id",
    component: ManagePayment,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },

  {
    name: "PaymentView",
    path: "/payment/view/:id",
    component: ViewPayment,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },

  {
    name: "Receipt",
    path: "/receipt",
    component: Receipt,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "ReceiptCRUD",
    path: "/receipt/:id",
    component: ManageReceipt,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "ReceiptView",
    path: "/receipt/view/:id",
    component: ViewReceipt,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Contra",
    path: "/contra",
    component: Contra,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "ContraCrud",
    path: "/contra/:id",
    component: ManageContra,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "ContraView",
    path: "/contra/view/:id",
    component: ViewContra,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Sales Return",
    path: "/sales-return",
    component: SalesReturn,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Sales Return CRUD",
    path: "/sales-return/:id",
    component: ManageSalesReturn,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Sales Return VIEW",
    path: "/sales-return/view/:id",
    component: PrintViewSalesReturn,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Purchase Return",
    path: "/purchase-return",
    component: PurchaseReturn,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Purchase Return CRUD",
    path: "/purchase-return/:id",
    component: ManagePurchaseReturn,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
  {
    name: "Purchase Return VIEW",
    path: "/purchase-return/view/:id",
    component: PrintViewPurchaseReturn,
    exact: true,
    permissionClass: permissionList.COMPANY,
  },
];

const allRoutes = [
  ...homeRoutes,
  ...managementRoutes,
  ...inventoryRoutes,
  ...transactionRoutes,
  ...sms,
  ...userRoutes,
  ...managementRoutes,
  ...inventoryRoutes,
  ...masterAccount,
  ...transmisRoutes,
  ...reportRoutes,
];
export default allRoutes;
