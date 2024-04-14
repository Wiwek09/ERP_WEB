export interface ISalesReturn {
  PurchaseDetails?: any;
  SalesOrderDetails: any[];
  AccountTransactionValues: AccountTransactionValue[];
  Id: number;
  Name: string;
  Amount: number;
  Discount: number;
  PercentAmount: number;
  NetAmount: number;
  VATAmount: number;
  GrandAmount: number;
  IsDiscountPercentage: boolean;
  Date: string;
  NVDate: string;
  ExchangeRate: number;
  ExciseDuty: number;
  AccountTransactionDocumentId: number;
  AccountTransactionTypeId: number;
  SourceAccountTypeId: number;
  TargetAccountTypeId: number;
  Description?: any;
  IsReversed: boolean;
  Reversable: boolean;
  FinancialYear?: any;
  UserName?: any;
  ref_invoice_number: any;
  IRD_Status_Code: any;
  Sync_With_IRD: boolean;
  IS_Bill_Printed: boolean;
  IS_Bill_Active: boolean;
  Printed_Time: string;
  Real_Time: boolean;
  CompanyCode: number;
  PhoteIdentity?: any;
  IdentityFileName?: any;
  IdentityFileType?: any;
  VehicleNo?: any;
  VehicleLength?: any;
  VehicleWidth?: any;
  VehicleHeight?: any;
}

export interface AccountTransactionValue {
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
  CompanyCode: number; //
  NepaliMonth: string; //
  NVDate: string; //
  FinancialYear: string;
  UserName: string; //
}

//SalesOrderDetails
export interface IProductSalesReturn {
  BranchId: number; //
  DepartmentId: number; //
  Discount: number;
  FinancialYear: string; //
  Id: number;
  IsSelected: boolean;
  IsVoid: boolean;
  ItemId: number;
  ItemName?: any;
  MRPPrice: number;
  OrderDescription?: any;
  OrderId: number;
  OrderNumber: number;
  Qty: number;
  Tags?: any;
  TaxRate: number;
  TotalAmount: number;
  UnitPrice: number;
  UnitType?: any;
  UserId: string;
  WarehouseId: number; //
  ExciseDuty: number;
  CompanyCode: number;
}
