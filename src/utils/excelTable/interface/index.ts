export interface IHeader {
  startDate: string;
  endDate: string;
  companyName: string;
  tableType: string;
  style?: any;
}

export interface ITableHead {
  name: string;
  style?: string;
}

interface ITableRow {
  tableCell: string | number;
  colSpan?: number;
  style?: any;
}

export type ITableBody = ITableRow[];
