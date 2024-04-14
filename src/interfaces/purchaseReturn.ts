export interface IAllPurchaseReturn {
  PurchaseDetails: IAllPurchaseDetail[];
  Id: number;
  VDate: string;
  Name?: any;
  VType: string;
  VoucherNo: string;
  IdentityFile: boolean;
  AccountTransactionValues: IAllAccountTransactionValue[];
}

export interface IAllAccountTransactionValue {
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
  Amount: number;
  DebitAmount: number;
  CreditAmount: number;
  drTotal?: any;
  crTotal?: any;
  IdentityFile: boolean;
  TicketReferences?: any;
  AccountTransactionValues: any[];
  InventoryReceiptDetails?: any;
  PurchaseDetails: IAllPurchaseDetail[];
  SalesOrderDetails?: any;
  CompanyCode: number;
  DepartmentId: number;
  WareHouseId: number;
  BranchId: number;
  FinancialYear: string;
  UserName: string;
  ExciseDuty: number;
  VATAmount: number;
}

export interface IAllPurchaseDetail {
  PurchaseId: number; //
  AccountTransactionId: number;
  AccountTransactionDocumentId: number;
  Quantity: number;
  PurchaseRate: number;
  PurchaseAmount: number;
  MRPPrice: number;
  Discount: number;
  TaxRate: number;
  ExciseDuty: number;
  UnitType?: any;
  CostPrice: number;
  InventoryItemId: number;
  FinancialYear: string;
  CompanyCode: number;
  DepartmentId: number;
  WareHouseId: number;
  BranchId: number;
  NepaliMonth: string;
  NVDate: string;
  UserName: string;
  CurrentStock: number;
}
export interface IVoucher {
  Id: number;
  Name: string;
  Description: string;
  AccountTypeId: number;
  AccountId: number;
  Date: string;
  Debit: number;
  Credit: number;
  Exchange: number;
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
}

// *************
export interface IPurchaseReturn {
  Id: number;
  AccountType?: any;
  Name: string;
  AccountTransactionType: string;
  AccountTransactionDocumentId: number;
  AccountTransactionTypeId: number;
  SourceAccountTypeId: number;
  ref_invoice_number: string;
  IsReversed: boolean;
  Reversable: boolean;
  TargetAccountTypeId: number;
  Description: string;
  Date: string;
  Amount: string;
  DebitAmount: number;
  CreditAmount: number;
  drTotal: string;
  crTotal: string;
  IdentityFile: boolean;
  TicketReferences?: any;
  AccountTransactionValues: AccountTransactionValue[];
  InventoryReceiptDetails?: any;
  PurchaseDetails: IAllPurchaseDetail[];
  SalesOrderDetails?: any;
  CompanyCode: number;
  DepartmentId: number;
  WareHouseId: number;
  BranchId: number;
}

export interface IProduct {
  Id: number;
  Name: string;
  ItemId: number;
  CategoryId: number;
  UnitPrice: number;
  Qty: number;
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
}


interface AccountTransactionValue {
  Id: number;
  Name: string;
  Description: string;
  AccountTypeId: number;
  AccountId: number;
  Date: string;
  Debit: number;
  Credit: number;
  Exchange: number;
  AccountTransactionId: number;
  AccountTransactionDocumentId: number;
  entityLists: string;
  ref_invoice_number?: any;
  Sync_With_IRD: boolean;
  IS_Bill_Printed: boolean;
  IS_Bill_Active: boolean;
  Printed_Time: string;
  Real_Time: boolean;
  CompanyCode: number;
  DepartmentId: number;
  WareHouseId: number;
  BranchId: number;
  NepaliMonth: string;
  NVDate: string;
  FinancialYear: string;
  UserName: string;
}
