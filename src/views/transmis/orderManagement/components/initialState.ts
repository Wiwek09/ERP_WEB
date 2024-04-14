export const InitialState = {
  Id: 0,
  AccountId: 0,
  OrderNumber: "",
  EnglishDate: "",
  NepaliDate: "",
  DueEnglishDate: "",
  DueNepaliDate: "",
  Message: "",
  MessageStatement: "",
  OrderDetails: [
    {
      Id: 0,
      OrderManagementId: 0,
      ItemId: "",
      Qty: 0,
      UnitType: "",
      TotalAmount: 0,
      UnitPrice: 0,
      Discount: 0,
      TaxRate: 0,
      UserName: "",
      FinancialYear: "",
      CompanyCode: 0,
      DepartmentId: 0,
      WarehouseId: 0,
      BranchId: 0,
    },
  ],
  FinancialYear: "",
  CompanyCode: 0,
  BranchCode: 0,
  // DepartmentId: 0,
  // WareHouseId: 0,
  // BranchId: 0,
};

export interface IAdditionalSales {
  salesType: string | null;
  salesDate: string | null;
}

// export interface OrderDetails {
//   // Id: number,
//   OrderManagementId: number,
//   ItemId: string,
//   Qty: number,
//   UnitType: string,
//   TotalAmount: number,
//   UnitPrice: number,
//   // MRPPrice: number;
//   Discount: number,
//   TaxRate: number,
//   UserName: string,
//   FinancialYear: string,
//   CompanyCode: number,
//   UserId: string | number | null;
//   DepartmentId: number | null,
//   WarehouseId: number | null,
//   BranchId: number | null,
// }

// export interface INormalizedOrderMang {
//   Id: number,
//   Name: string;
//   Amount: number;
//   Discount: number;
//   PercentAmount: number;
//   NetAmount: number;
//   VATAmount: number;
//   GrandAmount: number;
//   UserName: string | number;
//   AccountId: number,
//   OrderNumber: string,
//   EnglishDate: string,
//   NepaliDate: string,
//   DueEnglishDate: string,
//   DueNepaliDate: string,
//   Message: string,
//   MessageStatement: string,
//   OrderDetails: OrderDetails[];
//   FinancialYear: string,
//   CompanyCode: number,
//   BranchCode: number,
//   DepartmentId: number | null,
//   WareHouseId: number | null,
//   BranchId: number | null,
// }
