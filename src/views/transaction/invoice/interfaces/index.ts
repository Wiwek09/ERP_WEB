export interface ICommonObj {
  id: number;
  name: string;
  panNo: string;
}

export interface IDate {
  StartDate: string;
  EndDate: string;
}
export interface SMonth {
  currenmonth: string;
}
export interface IReportTypeBook {
  CurrenSales: any;
}
export interface IInvSelectedFormData {
  branch: number | null;
  warehouse: number | null;
  department: number | null;
}

export interface IAdditionalSales {
  salesType: string | null;
  salesDate: string | null;
  customer: number | null;
  vehicleNo: string | null;
  vehicleLength: string | null;
  vehicleWidth: string | null;
  vehicleHieght: string | null;
  ChallanNo : string | null;
  description: string;
  branch: number | null;
  warehouse: number | null;
  department: number | null;
}

export interface PSelectedProduct {
  ItemId: number;
}
export interface ISelectedProduct {
  tempId?: number;
  Id: number;
  OrderId: number;
  OrderNumber: number;
  ItemId: number | null;
  ItemName: string;
  Qty: number;
  DiscountE: number;
  UnitType: string;
  ExciseDuty: number;
  ExcriseDutyAmount: number;
  TotalAmount: number;
  UnitPrice: number;
  TaxRate: number;
  MRPPrice: number;
  DiscountType: string | null;
  Discount: number;
  AmountAfterVat: number;
  OrderDescription: string;
  Tags: string;
  IsSelected: boolean;
  IsVoid: boolean;
  FinancialYear: string;
  UserId?: any;
  BranchId: number;
  DepartmentId: number;
  WarehouseId: number;
  SelectedProductDetails: string;
  CurrentStock: number;
}

export interface IGrandDetails {
  amount: number;
  discount: number;
  grandTotal: number;
  tax: number;
  taxdic: number;
  taxable: number;
  taxabledic: number;
  nonTaxable: number;
  nontaxabledic: number;
  exciseDuty: number;
}

export type IActionType = "loading" | "update" | "add";

export interface ILedgerCalculation {
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

export interface IMinimumLedgerDetails {
  name: string | null;
  address: string | null;
  telephoneNo: string | null;
  email: string | null;
  panvatno: string | null;
}

export interface ILedger {
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

export interface ICustomer {
  id: number;
  label: string;
}
