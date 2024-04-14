export interface IFormData {
  label: string;
  id: number;
}

export interface IPosSelectedFormData {
  branch: number | null;
  warehouse: number | null;
  department: number | null;
  ledger: number | null;
  salesType: string | null;
}

export interface ISelectedProducts {
  ItemId: number;
  ItemName: string;
  Qty: number;
  InitialQty:number,
  UnitType: string | null;
  TotalAmount: number;
  UnitPrice: number;
  InitialPrice: number;
  MRPPrice: number;
  TaxType: string | null;
  TaxValue: number;
  Tax: number;
  TaxRate: number;
  DiscountType: string | null;
  DiscountValue: number;
  Discount: number;
  FinancialYear: string;
  UserId: string | number | null;
  DepartmentId: number | null;
  WarehouseId: number | null;
  BranchId: number | null;
}

export interface IGrandDetails {
  amount: number;
  discount: number;
  taxable: number;
  taxableafterdic: number;
  nonTaxable: number;
  nonTaxableafterdic: number;
  tax: number;
  taxafterdic: number;
  total: number;
  
}

export interface INormalizedProduct {
  ItemId: number;
  Qty: number;
  UnitType: string | null;
  TotalAmount: number;
  UnitPrice: number;
  MRPPrice: number;
  Discount: number;
  Tax: number;
  TaxRate : number;
  FinancialYear: string;
  UserId: string | number | null;
  DepartmentId: number | null;
  WarehouseId: number | null;
  BranchId: number | null;
}

export interface INormalizedPosData {
  SalesOrderDetails: INormalizedProduct[];
  Name: string | null;
  Amount: number;
  Discount: number;
  PercentAmount: number;
  NetAmount: number;
  VATAmount: number;
  GrandAmount: number;
  IsDiscountPercentage: boolean;
  Date: string;
  Description: string;
  FinancialYear: string;
  UserName: string | number;
  CompanyCode: number;
  SourceAccountTypeId: number;
  DepartmentId: number | null;
  WarehouseId: number | null;
  BranchId: number | null;
}

export interface IMinimumLedgerDetails {
  name: string | null;
  address: string | null;
  telephoneNo: string | null;
  email: string | null;
  panvat: string | null;
}
