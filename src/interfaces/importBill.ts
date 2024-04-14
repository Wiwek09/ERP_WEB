export interface IAutoComplete {
  id: number;
  label: string;
}

export interface IVoucherType {
  id: string;
  label: string;
}

export interface IImportBillDetail {
  branch: number | 0;
  warehouse: number | 0;
  department: number | 0;
  voucherType: string;
  invoiceNo: string;
  voucherDate: string;
  customer: number;
  description: string;
  exchangeRate: number | 0;
  ppNo: string;
  draftNo: string;
}

export interface ISelectedBillProduct {
  tempId?: number | undefined;
  PurchaseId: number;
  AccountTransactionId: number;
  AccountTransactionDocumentId: number;
  Quantity: number;
  SourceRate: number;
  SourceAmount: number;
  GrossRate: number; 
  GrossAmount: number; 
  PurchaseRate: number;
  PurchaseAmount: number;
  UnitType: string;
  BeforePriceVAT:number;
  CostPrice: number;
  MRPPrice: number;
  TotalPurchaseValue : number;
  MarginRate: number;
  ExciseDuty: number;
  AfterExciseDuty: number;
  AfterVatAmount: number;
  AfterExchangeAmount: number;
  InventoryItemId: number;
  FinancialYear: string;
  CompanyCode: number;
  NepaliMonth?: string;
  NVDate: string;
  UserName: string;
  TaxRate: number;
  ImportDutyRate: number;
  ImportDuty: number;
  AfterImportDuty: number;
  ExciseDutyRate: number;
  ExtraImportDuty: number;
  Transportation: number;
  LabourCharge: number;
  OtherCharge: number;
  Discount: number;
  Currency?: string;
  CurrencyExchangeRate: number;
  ImportRate: number;
  ImportAmount: number;
  DepartmentId: number;
  WareHouseId: number;
  BranchId: number;
  CurrentStock: number;
  VATAmount:number;
  AdditionalProductCost?: Array<IAdditionalProductCost>;
  AdditionalLocalProductCost? : Array<IAdditionalProductCost>;
  LocalQuantityCost: number;
  LocalAmountCost: number;
  // ExciseDuty: number;
  // VATAmount: number;
}

export interface IAdditionalProductCost {
  CreditId: number;
  DebitId: number;
  BillTermId: number;
  LedgerId?: number;
  CreditRefId: number;
  DebitRefId: number;
  Amount: number;
  AddCost: boolean;
  Name?: string;
  index?:number;
}

export interface IAdditionalLocalCost {
  CreditId: number;
  DebitId: number;
  BillTermId: number;
  LedgerId: number;
  Amount: number;
  AddCost: number;
  VatRate: number;
  VatAmount: number;
  FinalAmount: number;
  ShowInBill: boolean;
  BillNo: string;
  BillDate: string;
}

export interface IVoucher {
  Id: number;
  BillTermId: number;
  Name: string;
  Description: string;
  AccountTypeId: number;
  AccountId: number;
  Date: string;
  Debit: number;
  Quantity: number;
  Credit: number;
  Exchange: number;
  ImportDutyId: number;
  ExciseDutyId: number;
  AccountTransactionId: number;
  AccountTransactionDocumentId: number;
  entityLists: string;
  ref_invoice_number: any;
  Sync_With_IRD: boolean;
  IS_Bill_Printed: boolean;
  IS_Bill_Active: boolean;
  Printed_Time: any;
  Real_Time: boolean;
  CompanyCode: number;
  NepaliMonth: string;
  NVDate: string;
  FinancialYear: string;
  UserName: string;
  DepartmentId: number;
  WareHouseId: number;
  BranchId: number;
  AddCost: boolean;
  AddCostBy: number;
  VatRate: number;
  VatAmount: number;
  CostAmount: number;
  ShowInBill: boolean;
  IS_Product_Cost: boolean;
  IS_Local_Cost: boolean;
  Identifier: string;
  ProductId: number;
  IsTaxable?: boolean;
  IsNonTaxable?: boolean;
  IsDiscount?: boolean;
  IsVAT?: boolean;
  IsExciseDuty?: boolean;  
  IsImportDuty?: boolean;
}

export interface IDebit {
  Debit: number;
  Credit: number;
  Description: string;
}

export interface IPurchase {
  Id: number;
  AccountType: any;
  Name: string;
  AccountTransactionType: string;
  AccountTransactionDocumentId: number;
  AccountTransactionTypeId: number;
  SourceAccountTypeId: number;
  ref_invoice_number: any;
  IsReversed: boolean;
  Reversable: boolean;
  TargetAccountTypeId: number;
  Description: string;
  Amount: number;
  DebitAmount: number;
  CreditAmount: number;
  drTotal: number | string;
  crTotal: number | string;
  IdentityFile: boolean;
  TicketReferences?: any;
  AccountTransactionValues: IVoucher[];
  InventoryReceiptDetails: any;
  PurchaseDetails: ISelectedBillProduct[];
  SalesOrderDetails: any;
  DepartmentId: number;
  WareHouseId: number;
  BranchId: number;
  CompanyCode: number;
  Date: string;
  FinancialYear: string;
  UserName: string;
  ImportDuty: number;
  ExciseDuty: number;
  VATAmount: number;
  PragyapanPatraNo: string;
  DraftNo: string;
}

export interface IProduct {
  Id: number;
  Name: string;
  ItemId: number;
  CategoryId: number;
  UnitPrice: number;
  Qty: number;
  Discount: number;
  ExciseDuty: number;
  UnitTypeBase?: any;
  UnitDivided: number;
  UnitType?: any;
  CostPrice: number;
  DepartmentId: number;
  WareHouseId: number;
  BranchId: number;
  IsProduct: boolean;
  IsService: boolean;
  IsMenuItem: boolean;
  Description: string;
  MetaDescription?: any;
  TaxRate: number;
  MarginRate: number;
  ItemCode?: any;
  PhoteIdentity?: any;
  IdentityFileName?: any;
  IdentityFileType?: any;
  CurrentStock: number;
}

export interface IAccount {
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
  DRCR: string;
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
  BankName: string;
  SecurityDeposit: number;
  ExpireMiti: string;
  ExpireDate: string;
}

interface IAccountTransicationValue {
  Id: number;
  AccountType?: any;
  Name: string;
  AccountTransactionType: string;
  AccountTransactionDocumentId: number;
  AccountTransactionTypeId: number;
  SourceAccountTypeId: number;
  ref_invoice_number?: any;
  IsReversed: boolean;
  Reversable: boolean;
  TargetAccountTypeId: number;
  Description: string;
  Date: string;
  Amount: string;
  DebitAmount: number;
  CreditAmount: number;
  drTotal?: any;
  crTotal?: any;
  IdentityFile: boolean;
  TicketReferences?: any;
  AccountTransactionValues: any[];
  InventoryReceiptDetails?: any;
  PurchaseDetails?: any;
  SalesOrderDetails?: any;
  CompanyCode: number;
  DepartmentId: number;
  WareHouseId: number;
  BranchId: number;
}

export interface IGetAllPurchase {
  PurchaseDetails: ISelectedBillProduct[];
  AccountTransactionValues: IAccountTransicationValue[];
  Id: number;
  VDate: string;
  Name: any;
  VType: string;
  VoucherNo: string;
  RefInvoiceNo: string;
  IdentityFile: boolean;
}
export interface IdState {
  importDuty : AccountValue;
  exciseDuty: AccountValue;
  discount: AccountValue;
  taxable: AccountValue;
  nonTaxable: AccountValue;
  vat: AccountValue;
}

interface AccountValue {
  id: number;
  accountId: number;
  debit: number;
}
