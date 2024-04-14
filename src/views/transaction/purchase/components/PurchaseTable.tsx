import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Autocomplete,
  TextField,
  Typography,
  TableSortLabel,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { setSortAction } from "../../../../features/sortSlice";
import { IGetAllPurchase, IProduct } from "../../../../interfaces/purchase";
import { errorMessage } from "../../../../utils/messageBox/Messages";
import { IDate } from "../../invoice/interfaces";

interface IProps {
  purchaseData: IGetAllPurchase[];
  productData: IProduct[];
  date: IDate;
}
interface IOption {
  id: string;
  label: string;
}

interface HeadCell {
  sortable: boolean;
  id: string;
  label: string;
}

const mainHeader: readonly HeadCell[] = [
  {
    id: "VDate",
    label: "Date",
    sortable: true,
  },
  {
    id: "particular",
    label: "Particular",
    sortable: false,
  },
  {
    id: "VType",
    label: "Voucher Type",
    sortable: false,
  },
  {
    id: "VoucherNo",
    label: "V. No. ",
    sortable: true,
  },
  {
    id: "RefInvoiceNo",
    label: "Invoice No. ",
    sortable: true,
  },
  {
    id: "debit",
    label: "Debit (RS.)",
    sortable: false,
  },
  {
    id: "credit",
    label: "Credit (Rs.)",
    sortable: false,
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

const itemHeader: string[] = [
  "S.N.",
  "Item name",
  "Qty",
  "Rate",
  "Discount",
  "Amount",
  "",
  "",
  "",
];

const actionOptions: IOption[] = [
  { id: "edit", label: "Edit" },
  { id: "delete", label: "Delete" },
  { id: "view", label: "View" },
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
                minWidth:
                  data.label === "Particular"
                    ? "250px"
                    : data.label === "Actions"
                    ? "130px"
                    : "auto",
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

const PurchaseTable = ({ purchaseData, productData, date }: IProps) => {
  const sortOptions = useAppSelector((state) => state.sort);
  const [order, setOrder] = useState<Order>(sortOptions.order);
  const [orderBy, setOrderBy] = useState<string>(sortOptions.orderBy);

  const history = useHistory();
  const companyName = useAppSelector((state) => state.company.data.NameEnglish);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName);

  const [total, setTotal] = useState({ debit: 0, credit: 0 });

  useEffect(() => {
    let debit = 0;
    let credit = 0;

    purchaseData.forEach((element) => {
      element.AccountTransactionValues.forEach((account) => {
        debit += account.DebitAmount;
        credit += account.CreditAmount;
      });
    });

    setTotal({ debit: debit, credit: credit });
  }, [purchaseData]);

  const getProductName = (id: number): string => {
    const productDetails = productData.find((data) => data.Id === id);
    return productDetails ? productDetails.Name : "";
  };

  const getVoucherNo = (bill: string): string => {
    let billNo = "";

    let startPosition = bill.search("#");
    let endPosition = bill.search("]");

    for (let index = startPosition + 1; index < endPosition; index++) {
      billNo += bill[index];
    }
    return billNo;
  };

  const editDeletePurchase = (id: number) => {
    history.push(`/purchase/${id}`);
  };

  const viewPurchase = (id: number) => {
    history.push(`purchase/view/${id}`);
  };

  const setAction = (actionType: string, id: number) => {
    switch (actionType) {
      case "edit":
        if (loginedUserRole.includes("PurEdit")) {
          editDeletePurchase(id);
          break;
        } else {
          errorMessage("Sorry, permission denied.");
          break;
        }
      case "delete":
        if (loginedUserRole.includes("PurDelete")) {
          editDeletePurchase(id);
          break;
        } else {
          errorMessage("Sorry, permission denied.");
          break;
        }
      case "view":
        if (loginedUserRole.includes("PurView")) {
          viewPurchase(id);
          break;
        } else {
          errorMessage("Sorry, permission denied.");
          break;
        }
      default:
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
  const getPurchaseRate = (purchaserate: number, afterexciseamount : number, discount : number): number => {
    let CurrentRate = Number(purchaserate) + Number(afterexciseamount);  
    return CurrentRate ? CurrentRate : 0;
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
            <Typography
              sx={{ textAlign: "center", fontSize: 18, marginTop: 1 }}
            >
              Purchase
            </Typography>
            <Typography
              sx={{ textAlign: "center", fontSize: 15, marginTop: 1 }}
            >
              {`${date.StartDate} - ${date.EndDate}`}
            </Typography>
          </Box>
          <Table stickyHeader id="myPDf">
            <SortableTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />

            <TableBody>
              {stableSort(purchaseData, getComparator(order, orderBy)).map(
                (data: any, index: number) => {
                  return (
                    <>
                      <TableRow
                        sx={{ backgroundColor: "primary.mainTableContent" }}
                        key={`main_row${index}`}
                      >
                        <TableCell>{data.VDate}</TableCell>
                        <TableCell></TableCell>
                        <TableCell>{data.VType}</TableCell>
                        <TableCell>
                          {"#" + getVoucherNo(data.VoucherNo)}
                        </TableCell>
                        <TableCell>{data.RefInvoiceNo}</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>No file</TableCell>
                        <TableCell>
                          <Autocomplete
                            disablePortal
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
                      {data.AccountTransactionValues.map(
                        (accountData: any, accountIndex: number) => {
                          // {console.log(accountData,"Purchase-Bill")}
                          if (
                            accountData.DebitAmount === 0 &&
                            accountData.CreditAmount === 0
                          ) {
                            return;
                          }
                          return (
                            <TableRow
                              sx={{
                                backgroundColor: "primary.mainTableSubContent",
                              }}
                              key={`account${accountIndex}`}
                            >
                              <TableCell></TableCell>
                              <TableCell colSpan={4}>
                                {accountData.Name}
                              </TableCell>
                              <TableCell sx={{ textAlign: "end" }}>
                                {accountData.DebitAmount > 0
                                  ? accountData.DebitAmount.toFixed(2)
                                  : ""}
                              </TableCell>
                              <TableCell sx={{ textAlign: "end" }}>
                                {accountData.CreditAmount > 0
                                  ? accountData.CreditAmount.toFixed(2)
                                  : ""}
                              </TableCell>
                              <TableCell colSpan={2}></TableCell>
                            </TableRow>
                          );
                        }
                      )}

                      {data.PurchaseDetails.length > 0 ? (
                        <TableRow
                          sx={{ backgroundColor: "primary.tableHeader" }}
                        >
                          {itemHeader.map((sub_header, i) => {
                            return (
                              <TableCell
                                key={`sub_item_header${i}`}
                                sx={{
                                  textAlign:
                                    sub_header === "Rate" ||
                                    sub_header === "Discount" ||
                                    sub_header === "Amount"
                                      ? "end"
                                      : "start",
                                }}
                              >
                                {sub_header}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ) : (
                        ""
                      )}

                      {data.PurchaseDetails.map(
                        (purchaseItem: any, itemIndex: number) => {
                          return (
                            <TableRow
                              sx={{ backgroundColor: "primary.tableContent" }}
                              key={`purchaseItem${itemIndex}`}
                            >
                              <TableCell>{itemIndex + 1}</TableCell>
                              <TableCell>
                                {getProductName(purchaseItem.InventoryItemId)}
                              </TableCell>
                              <TableCell>{purchaseItem.Quantity}</TableCell>
                              <TableCell sx={{ textAlign: "end" }}>
                              {getPurchaseRate(purchaseItem.PurchaseRate, purchaseItem.ExciseDuty, purchaseItem.Discount).toFixed(2)}
                              </TableCell>
                              <TableCell sx={{ textAlign: "end" }}>
                                {purchaseItem.Discount.toFixed(2)}
                              </TableCell>
                              <TableCell sx={{ textAlign: "end" }}>
                                {purchaseItem.PurchaseAmount.toFixed(2)}
                              </TableCell>
                              <TableCell colSpan={3}></TableCell>
                            </TableRow>
                          );
                        }
                      )}
                    </>
                  );
                }
              )}
              <TableRow>
                <TableCell
                  colSpan={4}
                  sx={{ textAlign: "end", fontWeight: "bold" }}
                >
                  Total
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {total.debit.toFixed(2)}
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  {total.credit.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default PurchaseTable;
