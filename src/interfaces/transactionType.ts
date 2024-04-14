export interface ITransactionType {
  Id?: number;
  Name: string;
  SortOrder?: number;
  UserString?: string;
  SourceAccountTypeId: number;
  TargetAccountTypeId: number;
  DefaultSourceAccountId: number;
  DefaultTargetAccountId: number;
  ForeignCurrencyId?: number;
}
