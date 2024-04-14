import {
  Autocomplete,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import DateHeader from "../../../components/headers/dateHeader";
import { getCurrentFinancialYear } from "../../../features/financialYearSlice";
import {
  ISalesReturn,
  IProductSalesReturn,
} from "../../../interfaces/salesReturn";
import GridDateHeader from "../../../components/headers/gridDateHeader";
import {
  getAllSalesReturn,
  getAllSalesReturnByBranch,
} from "../../../services/salesReturnApi";
import { IsDateVerified } from "../../../utils/dateVerification";
import { errorMessage } from "../../../utils/messageBox/Messages";
import { IAccountHolder } from "../../../interfaces/purchaseOrder";
import { getAllAccountHolder } from "../../../services/purchaseOrderApi";
import { ISelectType } from "../../../interfaces/autoComplete";
import ExcelSalesReturn from "./components/ExcelTable";
import { setDefaultDateAction } from "../../../features/defaultDateSlice";
import { useHistory } from "react-router";
import { getNepaliDate } from "../../../utils/nepaliDate";
import { setSortAction } from "../../../features/sortSlice";
import { ILedgerCalculation } from "../invoice/interfaces";
import { getAllLedgerForCalculation } from "../../../services/invoice";

interface IOption {
  id: string;
  label: string;
}
interface HeadCell {
  sortable: boolean;
  id: string;
  label: string;
}
interface IGrandDetails {
  totalAmount: number;
  totalTaxable: number;
  totalNonTaxable: number;
  totalDiscount: number;
  totalTax: number;
  grandTotal: number;
}
interface IGrandDetailsKey {
  taxable: number;
  nonTaxable: number;
  tax: number;
  discount: number;
  sales: number;
}

const mainHeader: readonly HeadCell[] = [
  {
    id: "NVDate",
    label: "Date",
    sortable: true,
  },
  {
    id: "Name",
    label: "Bill No",
    sortable: true,
  },
  {
    id: "label",
    label: "Customer Name",
    sortable: false,
  },
  {
    id: "Amount",
    label: "Amount",
    sortable: false,
  },
  {
    id: "Discount",
    label: "Discount",
    sortable: false,
  },
  {
    id: "GrandAmount",
    label: "Grand Total",
    sortable: false,
  },
  {
    id: "ref_invoice_number",
    label: "Invoice No.",
    sortable: true,
  },
  {
    id: "IRD_Status_Code",
    label: "IRD Status Code",
    sortable: true,
  },
  {
    id: "file",
    label: "File",
    sortable: false,
  },
  {
    id: "actions",
    label: "Actions",
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
              align="center"
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
const TSalesReturn = ({
  loginedUserRole,
  dateChoose,
  allData,
  accountHolder,
  allLedgerData,
}: any) => {
  const sortOptions = useAppSelector((state) => state.sort);
  const [order, setOrder] = useState<Order>(sortOptions.order);
  const [orderBy, setOrderBy] = useState<string>(sortOptions.orderBy);

  // Actions options.
  const actionOptions: IOption[] = [
    { id: "edit", label: "Edit" },
    { id: "view", label: "View" },
    { id: "delete", label: "Delete" },
  ];

  //total
  const [keys, setKeys] = useState<IGrandDetailsKey>({
    tax: 0,
    taxable: 0,
    nonTaxable: 0,
    discount: 0,
    sales: 0,
  });
  let totalAmount = 0;
  let totalTaxable = 0;
  let totalNonTaxable = 0;
  let totalDiscount = 0;
  let totalTax = 0;
  let grandTotal = 0;

  const setAllKeys = () => {
    const nonTaxableData = allLedgerData.find(
      (data: { Name: string }) => data.Name === "Non Taxable Sales"
    );

    const taxableData = allLedgerData.find(
      (data: { Name: string }) => data.Name === "Taxable Sales"
    );

    const discountData = allLedgerData.find(
      (data: { Name: string }) => data.Name === "Discount"
    );

    const taxData = allLedgerData.find(
      (data: { Name: string }) => data.Name === "Vat 13%"
    );

    const salesData = allLedgerData.find(
      (data: { Name: string }) => data.Name === "Sales"
    );

    setKeys({
      nonTaxable: nonTaxableData ? nonTaxableData.Id : 0,
      taxable: taxableData ? taxableData.Id : 0,
      discount: discountData ? discountData.Id : 0,
      tax: taxData ? taxData.Id : 0,
      sales: salesData ? salesData.Id : 0,
    });
  };

  useEffect(() => {
    setAllKeys();
  }, [allData, allLedgerData]);

  // const [crTotal, setCrTotal] = useState<number>(0);
  // useEffect(() => {
  //   let crTotal = 0;
  //   allData.forEach((elm) => {
  //     elm.SalesOrderDetails.forEach((e: IProductSalesReturn) => {
  //       crTotal += e.TotalAmount;
  //     });
  //   });

  //   setCrTotal(crTotal);
  // }, [allData]);

  const getBillNo = (bill: string): string => {
    let billNo = "";

    let startPosition = bill.search("#");
    let endPosition = bill.search("]");

    for (let index = startPosition + 1; index < endPosition; index++) {
      billNo += bill[index];
    }
    return billNo;
  };

  const history = useHistory();
  const editPage = (id: number) => {
    history.push(`/sales-return/${id}`);
  };
  const viewPage = (id: number) => {
    history.push(`/sales-return/view/${id}`);
  };

  const setAction = (actionType: string, id: number) => {
    switch (actionType) {
      case "edit":
        if (loginedUserRole.includes("SREdit")) {
          if (allData.Print_Copy === 0) {
            editPage(id);
          } else {
            errorMessage("You can't edit it any more.");
          }

          break;
        } else {
          errorMessage("Sorry, permission denied.");
          break;
        }
      case "delete":
        if (loginedUserRole.includes("SRDelete")) {
          editPage(id);
          break;
        } else {
          errorMessage("Sorry, permission denied.");
          break;
        }
      case "view":
        if (loginedUserRole.includes("SRView")) {
          viewPage(id);
          break;
        } else {
          errorMessage("Sorry, permission denied.");
          break;
        }
      default:
      // Do nothing.
    }
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const getGrandDetails = (data: ISalesReturn): IGrandDetails => {
    let amount = 0;
    let taxable = 0;
    let nonTaxable = 0;
    let tax = 0;
    let discount = 0;
    let grand = 0;
    const nonTaxableData = data.AccountTransactionValues.find(
      (data) => data.AccountId === keys.nonTaxable
    );
    const taxableData = data.AccountTransactionValues.find(
      (data) => data.AccountId === keys.taxable
    );
    const taxData = data.AccountTransactionValues.find(
      (data) => data.AccountId === keys.tax
    );
    const discountData = data.AccountTransactionValues.find(
      (data) => data.AccountId === keys.discount
    );
    const salesData = data.AccountTransactionValues.find(
      (data) => data.AccountId === keys.sales
    );

    nonTaxable = nonTaxableData
      ? nonTaxableData.Credit + nonTaxableData.Debit
      : 0;
    taxable = taxableData ? taxableData.Credit + taxableData.Debit : 0;
    amount =
      taxable +
      nonTaxable +
      (salesData ? salesData.Credit + salesData.Debit : 0);
    tax = taxData ? taxData.Credit + taxData.Debit : 0;
    discount = discountData ? discountData.Debit + discountData.Credit : 0;
    grand = amount + tax - discount;

    totalAmount += amount;
    totalTaxable += taxable;
    totalNonTaxable += nonTaxable;
    totalTax += tax;
    totalDiscount += discount;
    grandTotal += grand;

    return {
      totalAmount: amount,
      totalTaxable: taxable,
      totalNonTaxable: nonTaxable,
      totalDiscount: discount,
      totalTax: tax,
      grandTotal: grand,
    };
  };
  return (
    <>
      <Paper>
        <TableContainer component={Paper}>
          <DateHeader headerName="Sales Return" date={dateChoose} />
          <Table stickyHeader aria-label="sticky table">
            <SortableTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(allData, getComparator(order, orderBy)).map(
                (data: ISalesReturn, index: number) => {
                  const grandDetails = getGrandDetails(data);
                  const accountHolderValue =
                    accountHolder &&
                    accountHolder.find(
                      (obj: any) => obj.value === data.SourceAccountTypeId
                    );
                  return (
                    <>
                      <TableRow
                        sx={{ backgroundColor: "primary.mainTableContent" }}
                        id={index + "main"}
                      >
                        <TableCell align="center" sx={{ fontWeight: "500" }}>
                          {data.NVDate}
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "500" }}>
                          {getBillNo(data.Name)}
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "500" }}>
                          {accountHolderValue?.label}
                        </TableCell>

                        <TableCell align="right" sx={{ fontWeight: "500" }}>
                          {/* {data.Amount.toFixed(2)} */}
                          {grandDetails.totalAmount.toFixed(2)}
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "500" }}>
                          {/* {data.Discount.toFixed(2)} */}
                          {grandDetails.totalDiscount.toFixed(2)}
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "500" }}>
                          {/* {data.GrandAmount.toFixed(2)} */}
                          {grandDetails.grandTotal.toFixed(2)}
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "500" }}>
                          {data.ref_invoice_number}
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "500" }}>
                          {data.IRD_Status_Code}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ fontWeight: "500" }}
                        ></TableCell>
                        <TableCell align="center">
                          <Autocomplete
                            options={actionOptions}
                            size="small"
                            value={null}
                            isOptionEqualToValue={(
                              option: IOption,
                              value: IOption
                            ) => option.id === value.id}
                            renderInput={(params) => (
                              <TextField {...params} label="Action" />
                            )}
                            onChange={(
                              event: any,
                              newValue: IOption | null
                            ) => {
                              if (newValue) {
                                setAction(newValue.id, data.Id);
                              }
                            }}
                          />
                        </TableCell>
                      </TableRow>

                      {data.SalesOrderDetails?.length > 0 ? (
                        <TableRow
                          sx={{ backgroundColor: "primary.tableHeader" }}
                          component="th"
                        >
                          <TableCell
                            align="left"
                            colSpan={3}
                            sx={{ fontWeight: "600" }}
                          >
                            Item Name
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: "600" }}>
                            Quantity
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: "600" }}>
                            Rate
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: "600" }}>
                            Amount
                          </TableCell>
                          <TableCell colSpan={4}></TableCell>
                        </TableRow>
                      ) : (
                        ""
                      )}

                      {data.SalesOrderDetails?.map((values, ind) => {
                        return (
                          <>
                            <TableRow
                              sx={{ backgroundColor: "primary.tableContent" }}
                              id={ind + "val"}
                            >
                              <TableCell align="left" colSpan={3}>
                                {values.ItemName}
                              </TableCell>
                              <TableCell align="center">
                                {values.Qty < 0 ? values.Qty * -1 : values.Qty}
                              </TableCell>

                              <TableCell align="center">
                                {values.UnitPrice}
                              </TableCell>
                              <TableCell align="right">
                                {values.TotalAmount < 0
                                  ? Math.abs(values.TotalAmount).toFixed(2)
                                  : values.TotalAmount}
                              </TableCell>
                              <TableCell align="right" colSpan={4}></TableCell>
                            </TableRow>
                          </>
                        );
                      })}
                    </>
                  );
                }
              )}
              <TableRow>
                <TableCell
                  colSpan={1}
                  align="right"
                  sx={{ fontWeight: "500", fontSize: "1.2rem" }}
                >
                  Total :
                </TableCell>
                <TableCell
                  colSpan={2}
                  align="right"
                  sx={{ fontWeight: "500", fontSize: "1.2rem" }}
                ></TableCell>
                <TableCell
                  colSpan={1}
                  align="right"
                  sx={{ fontWeight: "500", fontSize: "1.2rem" }}
                >
                  {/* Rs. {totalAmount.toFixed(2)} */}
                </TableCell>

                <TableCell
                  colSpan={1}
                  align="right"
                  sx={{ fontWeight: "500", fontSize: "1.2rem" }}
                >
                  {/* Rs. {totalDiscount.toFixed(2)} */}
                </TableCell>
                <TableCell
                  colSpan={1}
                  align="right"
                  sx={{ fontWeight: "500", fontSize: "1.2rem" }}
                >
                  {grandTotal.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default TSalesReturn;
