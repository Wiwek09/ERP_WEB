export interface IOrderManagement {
  Id: number;
  AccountId: number;
  OrderNumber: string;
  EnglishDate: string;
  NepaliDate: string;
  DueEnglishDate: string;
  DueNepaliDate: string;
  Message: string;
  MessageStatement: string;
  OrderDetails: IOrderDetail[];
  FinancialYear: string;
  CompanyCode: number;
  BranchCode: number;
  DepartmentId: number | 0;
  WareHouseId: number | 0;
  BranchId: number | 0;
  WorkDueEnglishDate: string;
  WorkDueNepaliDate: string;
}

export interface IOrderDetail {
  Id?: number;
  OrderManagementId?: number;
  ItemId: string;
  Qty: number;
  UnitType: string;
  TotalAmount: number;
  UnitPrice: number;
  Discount: number;
  TaxRate: number;
  ExciseDuty: number;
  UserName: string;
  FinancialYear: string;
  CompanyCode: number;
  DepartmentId: number;
  WarehouseId: number;
  BranchId: number;
}
