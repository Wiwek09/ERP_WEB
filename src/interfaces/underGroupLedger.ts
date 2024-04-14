export interface IUnderGroupLedger {
  Id: number;
  Name: string;
  DefaultFilterType: number;
  WorkingRule: number;
  SortOrder: number;
  UserString: string;
  Tags?: any;
  UnderGroupLedger: string;
  NatureofGroup: string;
  GroupSubLedger: boolean;
  DebitCreditBalanceReporting: boolean;
  UsedforCalculation: boolean;
  PurchaseInvoiceAllocation: boolean;
  ISBILLWISEON: boolean;
  ISCOSTCENTRESON: boolean;
  ISADDABLE: boolean;
  ISREVENUE: boolean;
  AFFECTSGROSSPROFIT: boolean;
  ISDEEMEDPOSITIVE: boolean;
  TRACKNEGATIVEBALANCES: boolean;
  ISCONDENSED: boolean;
  AFFECTSSTOCK: boolean;
  SORTPOSITION: boolean;
}
