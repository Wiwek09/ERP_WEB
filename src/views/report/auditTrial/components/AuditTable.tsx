import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Autocomplete,
  TextField,
  TableSortLabel,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { setSortAction } from "../../../../features/sortSlice";
import { ISales } from "../../../../interfaces/invoice";
import {
  ICommonObj,
  IDate,
  ILedgerCalculation,
} from "../../../transaction/invoice/interfaces";

interface IProps {
  salesData: ISales[];
  ledgerData: ICommonObj[];
  ledgerCalculationData: ILedgerCalculation[];
  date: IDate;
}
interface HeadCell {
  sortable: boolean;
  id: string;
  label: string;
}
const getFormatedNumber = (num: any): string => {
  let formatedNum = parseFloat(num).toFixed(2);
  return formatedNum;
};
const getLedgerName = (id: number, ledgerData: ICommonObj[]): string => {
  for (let index = 0; index < ledgerData.length; index++) {
    const element = ledgerData[index];
    if (element.id === id) {
      return element.name;
    }
  }
  return "Undefined";
};
const getBillNo = (bill: string): string => {
  let billNo = "";

  let startPosition = bill.search("#");
  let endPosition = bill.search("]");

  for (let index = startPosition + 1; index < endPosition; index++) {
    billNo += bill[index];
  }
  return billNo;
};
const getSaleType = (saleType: string): string => {
  let saleTypeData = "";

  let endPosition = saleType.search("#") - 1;

  for (let index = 0; index < endPosition; index++) {
    saleTypeData += saleType[index];
  }
  return saleTypeData;
};
const mainHeader: readonly HeadCell[] = [
  {
    id: "NVDate",
    label: "Date",
    sortable: true,
  },
  {
    id: "Name",
    label: "Bill No.",
    sortable: true,
  },
  {
    id: "ledgerData",
    label: "Customer name",
    sortable: false,
  },
  {
    id: "Description",
    label: "Description",
    sortable: false,
  },
  {
    id: "IRD_Status_Code",
    label: "IRD_Status_Code",
    sortable: false,
  },
];
function descendingComparator(a: any, b: any, orderBy: string) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
function getComparator(
  order: Order,
  orderBy: string
): (a: any, b: any) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
function stableSort(array: any, comparator: (a: any, b: any) => number) {
  const stabilizedThis = array.map((el: any, index: number) => [el, index]);
  stabilizedThis.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el: any) => el[0]);
}
type Order = "asc" | "desc";
interface SortableTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  order: Order;
  orderBy: string;
}
const SortableTableHead = ({
  order,
  orderBy,
  onRequestSort,
}: SortableTableProps) => {
  const createSortHandler =
    (property: string) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setSortAction({ order, orderBy }));
  }, [order, orderBy, dispatch]);
  return (
    <TableHead>
      <TableRow>
        {mainHeader.map((data, index) => {
          return (
            <TableCell
              sx={{ backgroundColor: "primary.mainTableHeader" }}
              key={data.id}
              style={{
                minWidth: data.label === "Actions" ? "130px" : "auto",
              }}
            >
              {data.sortable ? (
                <TableSortLabel
                  active={orderBy === data.id}
                  direction={orderBy === data.id ? order : "asc"}
                  onClick={createSortHandler(data.id)}
                >
                  {data.label}
                </TableSortLabel>
              ) : (
                data.label
              )}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};
const AuditTable = ({
  salesData,
  ledgerData,
  ledgerCalculationData,
  date,
}: IProps) => {
  const sortOptions = useAppSelector((state) => state.sort);
  const companyName = useAppSelector((state) => state.company.data.NameEnglish);
  const [order, setOrder] = useState<Order>(sortOptions.order);
  const [orderBy, setOrderBy] = useState<string>(sortOptions.orderBy);

  //sorting
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  return (
    <>
      <Paper sx={{ marginTop: 2, backgroundColor: "primary.mainTableHeader" }}>
        <TableContainer>
          <Box sx={{ paddingY: 2 }}>
            <Typography
              sx={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
            >
              {companyName}
            </Typography>
            <Typography sx={{ textAlign: "center", fontSize: 18 }}>
              Audit
            </Typography>
            <Typography sx={{ textAlign: "center", fontSize: 15 }}>
              {`${date.StartDate} - ${date.EndDate}`}
            </Typography>
          </Box>
          <Table sx={{ minWidth: 800 }} stickyHeader>
            <SortableTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(salesData, getComparator(order, orderBy)).map(
                (data: any, index: number) => {
                  // const ndate = data.AccountTransactionValues[0];
                  return (
                    <>
                      <TableRow
                        sx={{ backgroundColor: "primary.mainTableContent" }}
                        key={index}
                      >
                        <TableCell>{data.Date}</TableCell>
                        <TableCell>{parseInt(getBillNo(data.Name))}</TableCell>
                        <TableCell>
                          {getLedgerName(data.SourceAccountTypeId, ledgerData)}
                        </TableCell>
                        <TableCell>{data.Description}</TableCell>
                        <TableCell sx={{ textAlign: "end" }}>
                          {data.IRD_Status_Code}
                        </TableCell>
                      </TableRow>
                    </>
                  );
                }
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};
export default AuditTable;
