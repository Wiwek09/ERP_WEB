import {
  Autocomplete,
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
import { useHistory } from "react-router";
import GridDateHeader from "../../../components/headers/gridDateHeader";
import { getAllPurchaseReturn } from "../../../services/purchaseReturnApi";
import {
  IAllPurchaseReturn,
  IProduct,
} from "../../../interfaces/purchaseReturn";
import { getAllProducts } from "../../../services/productApi";
import ExcelTable from "./components/ExcelTable";
import { IPurchaseMenu } from "../../../interfaces/purchaseOrder";
import { ISelectType } from "../../../interfaces/autoComplete";
import { getAllPurchase } from "../../../services/purchaseOrderApi";
import { errorMessage } from "../../../utils/messageBox/Messages";
import { setSortAction } from "../../../features/sortSlice";
import { updateBraDataAction } from "../../../features/braSlice";
interface IDateProps {
  StartDate: string;
  EndDate: string;
}
interface IOption {
  id: string;
  label: string;
}
// Actions options.
const actionOptions: IOption[] = [
  { id: "edit", label: "Edit" },
  { id: "delete", label: "Delete" },
  { id: "view", label: "View" },
];
//for sorting
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
    label: "Voucher No.",
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
const PurchaseReturn = () => {
  const sortOptions = useAppSelector((state) => state.sort);
  const [order, setOrder] = useState<Order>(sortOptions.order);
  const [orderBy, setOrderBy] = useState<string>(sortOptions.orderBy);
  const defaultDate = useAppSelector((state) => state.defaultDate);
  const FinancialYear = useAppSelector((state) => state.financialYear);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName);
  const [allData, setAllData] = useState<IAllPurchaseReturn[]>([]);
  const [productList, setProductList] = useState<IProduct[]>([]);
  const [products, setProducts] = useState<ISelectType[]>([]);
  // const [selectedBranch, setSelectedBranch] = useState<number>(0);
  const dispatch = useAppDispatch();
  const branch = useAppSelector((state) => state.branchData.data);
  const [selectbranchId, setSelectBranchId] = useState({ ...branch });
  const [dateChoose, setDateChoose] = useState<IDateProps>(
    defaultDate.EndDate === ""
      ? {
          StartDate: FinancialYear.NepaliStartDate,
          EndDate: FinancialYear.NepaliEndDate,
        }
      : defaultDate
  );
  const history = useHistory();

  const getData = async () => {
    const response = await getAllPurchaseReturn(
      dateChoose.StartDate,
      dateChoose.EndDate
    );
    if (response.length > 0) {
      setAllData(
        response.map((data: IAllPurchaseReturn) => ({
          ...data,
        }))
      );
    } else {
      errorMessage("No data found");
    }
  };

  const getDataInSearch = async (e: any) => {
    e.preventDefault();
    const response = await getAllPurchaseReturn(
      dateChoose.StartDate,
      dateChoose.EndDate
    );
    if (response) {
      setAllData(
        response.map((data: IAllPurchaseReturn) => ({
          ...data,
        }))
      );
    }
  };

  const getProducts = async () => {
    const res: IPurchaseMenu[] = await getAllPurchase();
    setProducts(
      res.map((item) => {
        return { label: item.Name, value: item.Id };
      })
    );
  };

  const getview = async () => {};

  useEffect(() => {
    getData();
    getProductList();
    getProducts();
    getview();
  }, []);

  const getProductList = async () => {
    const response = await getAllProducts();
    if (response) {
      setProductList(response);
    }
  };

  const getItemName = (id: number) => {};

  const editDeletePurchase = (id: number) => {
    history.push(`/purchase-return/${id}`);
  };
  const viewPurchase = (id: number) => {
    history.push(`purchase-return/view/${id}`);
  };

  const setAction = (actionType: string, id: number) => {
    switch (actionType) {
      case "edit":
        if (loginedUserRole.includes("PREdit")) {
          editDeletePurchase(id);
          break;
        } else {
          errorMessage("Sorry, permission denied.");
          break;
        }
      case "delete":
        if (loginedUserRole.includes("PRDelete")) {
          editDeletePurchase(id);
          break;
        } else {
          errorMessage("Sorry, permission denied.");
          break;
        }
      case "view":
        if (loginedUserRole.includes("PRView")) {
          viewPurchase(id);
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

  //for branch
  const updateSelectedFormData = (name: string, value: number | 0) => {};

  return (
    <>
      {loginedUserRole.includes("PRAdd") ? (
        <GridDateHeader
          headerName="Purchase Return"
          dateChoose={dateChoose}
          setDateChoose={setDateChoose}
          getDataInSearch={getDataInSearch}
          path="/purchase-return/add"
          pdf="true"
          PDF="true"
          excel="true"
          onClickHandler={updateSelectedFormData}
        />
      ) : (
        <GridDateHeader
          headerName="Purchase Return"
          dateChoose={dateChoose}
          setDateChoose={setDateChoose}
          getDataInSearch={getDataInSearch}
          path="PRADD"
          pdf="true"
          PDF="true"
          excel="true"
          onClickHandler={updateSelectedFormData}
        />
      )}

      <ExcelTable
        purchaseData={allData}
        productData={productList}
        date={dateChoose}
      />
      <Paper>
        <TableContainer component={Paper}>
          <DateHeader headerName="Purchase Return" />
          <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 650 }}>
            <SortableTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(allData, getComparator(order, orderBy)).map(
                (data: IAllPurchaseReturn, index: number) => {
                  return (
                    <>
                      <TableRow
                        sx={{ backgroundColor: "primary.mainTableContent" }}
                        id={index + "main"}
                      >
                        <TableCell align="center">{data.VDate}</TableCell>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center">{data.VType}</TableCell>
                        <TableCell align="center">{data.VoucherNo}</TableCell>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center"></TableCell>
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

                      {data &&
                        data.AccountTransactionValues.map((value, index) => {
                          return (
                            <>
                              <TableRow
                                sx={{ backgroundColor: "primary.tableContent" }}
                              >
                                <TableCell align="center"></TableCell>
                                <TableCell align="left" colSpan={3}>
                                  {value.Name}
                                </TableCell>
                                <TableCell align="right">
                                  {value.DebitAmount > 0 &&
                                    value.DebitAmount.toFixed(2)}
                                </TableCell>
                                <TableCell align="right">
                                  {value.CreditAmount > 0 &&
                                    value.CreditAmount.toFixed(2)}
                                </TableCell>
                              </TableRow>
                            </>
                          );
                        })}

                      <TableRow
                        sx={{ backgroundColor: "primary.tableHeader" }}
                        component="th"
                      >
                        <TableCell
                          align="right"
                          sx={{ fontWeight: "500" }}
                        ></TableCell>
                        <TableCell align="center" sx={{ fontWeight: "500" }}>
                          Item Name
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "500" }}>
                          Quantity
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "500" }}>
                          Rate
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ fontWeight: "500" }}
                          colSpan={2}
                        >
                          Amount
                        </TableCell>
                      </TableRow>

                      {data.PurchaseDetails?.map((item, index) => {
                        const productValue = products?.find(
                          (obj) => obj.value === item.InventoryItemId
                        );
                        return (
                          <>
                            <TableRow
                              sx={{ backgroundColor: "primary.tableContent" }}
                              id={index + "val"}
                            >
                              <TableCell align="right"></TableCell>
                              <TableCell align="center">
                                {productValue?.label}
                              </TableCell>
                              <TableCell align="center">
                                {Math.abs(item.Quantity)}
                              </TableCell>
                              <TableCell align="right">
                                {item.PurchaseRate}
                              </TableCell>
                              <TableCell colSpan={2} align="right">
                                {item.PurchaseAmount.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          </>
                        );
                      })}
                      {/* <TableRow>
                        <TableCell colSpan={3} align="center">
                          Total
                        </TableCell>
                        <TableCell colSpan={2} align="right">
                          {total}
                        </TableCell>
                      </TableRow> */}
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

export default PurchaseReturn;
