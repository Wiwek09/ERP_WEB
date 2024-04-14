export interface IAllVoucher {
  PurchaseDetails?: any;
  Id: number;
  VDate: string;
  Name?: any;
  VType: string;
  VoucherNo: string;
  IdentityFile: boolean;
  AccountTransactionValues: IVoucher[];
}

export interface IVoucher {
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
  Amount: string;
  DebitAmount: number;
  CreditAmount: number;
  drTotal: string;
  crTotal: string;
  IdentityFile: boolean;
  TicketReferences: any[];
  AccountTransactionValues: IAccountTransactionValue[];
  InventoryReceiptDetails?: any;
  PurchaseDetails?: any;
  SalesOrderDetails?: any;
  Date?: string;
  UserName?: string;
  CompanyCode?: number;
  FinancialYear?: string;
  BranchId?: number;
}

export interface IAccountTransactionValue {
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
  BranchId?: number;
  CompanyCode: number;
  NepaliMonth: string;
  NVDate: string;
  FinancialYear: string;
  UserName: string;
  LedgetBalance: number;
}
