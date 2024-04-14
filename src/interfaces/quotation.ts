export interface IQuotation {
  Id: number;
  AccountId: number;
  QuotationNumber: string;
  EnglishDate: string;
  NepaliDate: string;
  ExpiredEnglishDate: string;
  ExpiredNepaliDate: string;
  Message: string;
  MessageStatement: string;
  QuotationDetails: IQuotationDetail[];
  FinancialYear: string;
  CompanyCode: number;
  BranchCode: number;
  DepartmentId: number;
  WareHouseId: number;
  BranchId: number;
}

export interface IQuotationDetail {
  Id?: number;
  QuotationId: number;
  ItemId: string;
  Qty: string;
  UnitType: string;
  TotalAmount: string;
  UnitPrice: number;
  Discount: number;
  TaxRate: string;
  UserName: string;
  FinancialYear: string;
  CompanyCode: number;
  DepartmentId: number;
  WarehouseId: number;
  BranchId: number;
}
