export interface IAutoComplete {
  id: number;
  label: string;
}

export interface IVoucherType {
  id: string;
  label: string;
}

export interface IDate {
  StartDate: string;
  EdDate: string;
}

export interface IMinimumLedgerDetails {
  name: string | null;
  address: string | null;
  telephoneNo: string | null;
  email: string | null;
  panvatno: string | null;
}
