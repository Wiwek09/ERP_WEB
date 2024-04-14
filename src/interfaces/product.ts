import { QueryByText } from "@testing-library/dom";

export interface IProduct {
  Id: number;
  Name: string;
  categoryId: number;
  Barcode: string;
  Tag: string;
  UnitTypeBase?: any;
  UnitDivided: any;
  UnitType: string | number;
  DepartmentId: number;
  WareHouseId: number;
  BranchId: number;
  IsProduct: boolean;
  IsService: boolean;
  IsMenuItem: boolean;
  BestSeller :boolean,
  FeaturedSeller:boolean,
  Description?: any;
  MetaDescription?: any;
  PhoteIdentity?: any;
  IdentityFileName?: any;
  IdentityFileType?: any;
  TaxRate: number;
  ExciseDuty: number;
  MarginRate: any;
  CostPrice: any;
  MenuItemPortions: IMenuItemPortion[];
  MenuItemPhotos?: any;
}

interface IMenuItemPortion {
  Id: number;
  Name: string;
  MenuItemPortionId: number;
  Multiplier: number;
  Price: number;
  Discount: number;
  OpeningStockRate: number;
  OpeningStock: number;
  OpeningStockAmount: number;
  StockLimit: number;
  ItemCode: string;
  MenuItemPortionPriceRanges: IPricerange[];
}

export interface IPricerange {
  Id: number;
  PositionId: number;
  QtyMin: number;
  QtyMax: number;
  Price: number;
}
