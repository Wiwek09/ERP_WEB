export interface IPurchaseOrderDetails {
  BranchId?: number;
  CompanyCode?: number;
  DepartmentId?: number;
  Discount: string;
  FinancialYear?: string;
  ItemId: string;
  POId?: number;
  PurchaseOrderId?: number;
  Qty: string;
  TotalAmount: string;
  UnitPrice: string;
  UnitType?: any;
  UserName?: string;
  WarehouseId?: number;
  TaxRate: string;
}

export interface IPurchaseOrderAllData {
  PurchaseOrderDetails: PurchaseOrderDetail[];
  Id: number;
  AccountId: number;
  PurchaseOrderNumber?: any;
  EnglishDate: string;
  NepaliDate: string;
  ExpiredEnglishDate: string;
  ExpiredNepaliDate: string;
  Message: string;
  MessageStatement: string;
  FinancialYear: string;
  CompanyCode: number;
  DepartmentId: number;
  WareHouseId: number;
  BranchId: number;
}

export interface PurchaseOrderDetail {
  PurchaseOrderId: number;
  POId: number;
  ItemId: number;
  Qty: string;
  UnitType?: any;
  TotalAmount: string;
  UnitPrice: string;
  Discount: number;
  UserName: string;
  FinancialYear: string;
  CompanyCode: number;
  DepartmentId: number;
  WarehouseId: number;
  BranchId: number;
}
export interface IPurchaseOrder {
  Id?: string;
  AccountId: number;
  EnglishDate: string;
  NepaliDate: string;
  ExpiredNepaliDate: string;
  ExpiredEnglishDate: string;
  Message: string;
  MessageStatement: string;
  BranchId: number;
  WareHouseId: number;
  DepartmentId: number;
  FinancialYear?: string;
  CompanyCode?: string;
  PurchaseOrderDetails: Array<IPurchaseOrderDetails>;
}

export interface IPurchaseMenu {
  Id: number;
  Name: string;
  ItemId: number;
  CategoryId: number;
  UnitPrice: number;
  Qty: number;
  UnitTypeBase?: any;
  UnitDivided: number;
  UnitType?: any;
  DepartmentId: number;
  WareHouseId: number;
  BranchId: number;
  IsProduct: boolean;
  IsService: boolean;
  IsMenuItem: boolean;
  Description?: any;
  MetaDescription?: any;
  TaxRate: number;
  MarginRate: number;
  ItemCode?: any;
  PhoteIdentity?: any;
  IdentityFileName?: any;
  IdentityFileType?: any;
}

export interface IAccountHolder {
  Id: number;
  Name: string;
  AccountTypeId: number;
  ForeignCurrencyId: number;
  TaxClassificationName: string;
  TaxType: string;
  TaxRate: string;
  GSTType: string;
  ServiceCategory: string;
  ExciseDutyType: string;
  TraderLedNatureOfPurchase: string;
  TDSDeducteeType: string;
  TDSRateName: string;
  LedgerFBTCategory: string;
  IsBillWiseOn: boolean;
  ISCostCentresOn: boolean;
  IsInterestOn: boolean;
  AllowInMobile: boolean;
  IsCondensed: boolean;
  AffectsStock: boolean;
  ForPayRoll: boolean;
  InterestOnBillWise: boolean;
  OverRideInterest: boolean;
  OverRideADVInterest: boolean;
  UseForVat: boolean;
  IgnoreTDSExempt: boolean;
  IsTCSApplicable: boolean;
  IsTDSApplicable: boolean;
  IsFBTApplicable: boolean;
  IsGSTApplicable: boolean;
  ShowInPaySlip: boolean;
  UseForGratuity: boolean;
  ForServiceTax: boolean;
  IsInputCredit: boolean;
  IsExempte: boolean;
  IsAbatementApplicable: boolean;
  TDSDeducteeIsSpecialRate: boolean;
  Audited: boolean;
  SortPosition: number;
  OpeningBalance: number;
  DRCR?: any;
  InventoryValue: boolean;
  MaintainBilByBill: boolean;
  Address: string;
  District: string;
  City: string;
  Street: string;
  PanNo: string;
  IsVAT: boolean;
  Telephone: string;
  Email: string;
  Amount: number;
  AcceptCard: boolean;
  Agent: number;
  RateofInterest: number;
  CreditLimit: number;
  CreditDays: number;
  IsAgent: boolean;
  BankGuarentee: number;
  BankName?: any;
  SecurityDeposit: number;
  ExpireMiti?: any;
  ExpireDate?: any;
}
