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
} from "@mui/material";
import { ICommonObj, IDate, ILedgerCalculation } from "../interfaces";
import { ISales } from "../../../../interfaces/invoice";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { useHistory } from "react-router";
import { errorMessage } from "../../../../utils/messageBox/Messages";
import { setSortAction } from "../../../../features/sortSlice";
import { getSalesData } from "../../../../services/invoice";

interface IProps {
  salesData: ISales[];
  productData: ICommonObj[];
  ledgerData: ICommonObj[];
  ledgerCalculationData: ILedgerCalculation[];
  date: IDate;
}

interface IGrandDetails {
  totalAmount: number;
  totalTaxable: number;
  totlaNonTaxable: number;
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

//Sorting
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

const getProductName = (id: number, productData: ICommonObj[]): string => {
  for (let index = 0; index < productData.length; index++) {
    const element = productData[index];
    if (element.id === id) {
      return element.name;
    }
  }
  return "Undifined";
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
    id:'NVDate',
    label:"Date",
    sortable:true
  },
  {
    id:'Name',
    label:"Bill No.",
    sortable:true
  },
  {
    id:'ledgerData',
    label:"Customer name",
    sortable:false
  },
  {
    id:'Name',
    label:"Sales type",
    sortable:false
  },
  {
    id:'totalAmount',
    label:"Amount (RS.)",
    sortable:false
  },
  {
    id:'totalTaxable',
    label:"Taxable",
    sortable:false
  },
  {
    id:'totlaNonTaxable',
    label:"Non-taxable",
    sortable:false
  },
  {
    id:'totalDiscount',
    label:"Discount",
    sortable:false
  },
  {
    id:'totalTax',
    label:"Tax",
    sortable:false
  },
  {
    id:'grandTotal',
    label:"Grand total",
    sortable:false
  },
  {
    id:'IRD_Status_Code',
    label:"IRD Status Code",
    sortable:false
  },  
  {
    id:'file',
    label:"File",
    sortable:false
  },
  {
    id:'actions',
    label:"Actions",
    sortable:false
  }
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
  orderBy: string,
): (
  a: any ,
  b: any ,
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array: any, comparator: (a: any, b: any) => number) {
  const stabilizedThis = array.map((el:any, index:number) => [el, index] );
  stabilizedThis.sort((a:any, b:any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el:any) => el[0]);
}

type Order = 'asc' | 'desc';

interface SortableTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  order: Order;
  orderBy: string;
}
const SortableTableHead = ({ order, orderBy, onRequestSort }:SortableTableProps) =>{
  const createSortHandler =(property: string) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
  };
  const dispatch = useAppDispatch();
  useEffect(()=> {
    dispatch(setSortAction({order, orderBy}));
  },[order,orderBy,dispatch]);
  return(
    <TableHead>
      <TableRow>
        {mainHeader.map((data, index) => {
          return (
            <TableCell
            sx={{ backgroundColor:'primary.mainTableHeader' }}
              key={data.id}
              style={{
                minWidth:
                  data.label === "Actions"
                    ? "130px"
                    : "auto",
              }}
            >
              {data.sortable?(
                <TableSortLabel
                  active={orderBy === data.id}
                  direction={orderBy === data.id ? order : 'asc'}
                  onClick={createSortHandler(data.id)}
                >
                  {data.label}
                </TableSortLabel>
              ):data.label}
              
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

// Calculation part
const InvoiceTable = ({
  salesData,
  productData,
  ledgerData,
  ledgerCalculationData,
  date,
}: IProps) => {
  const sortOptions = useAppSelector((state)=> state.sort);
  const [order, setOrder] = useState<Order>(sortOptions.order);
  const [orderBy, setOrderBy] = useState<string>(sortOptions.orderBy);
  const history = useHistory();
  const companyName = useAppSelector((state) => state.company.data.NameEnglish);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName)
  const [keys, setKeys] = useState<IGrandDetailsKey>({
    tax: 0,
    taxable: 0,
    nonTaxable: 0,
    discount: 0,
    sales: 0,
  });

  let totalAmount = 0;
  let totalTaxable = 0;
  let totlaNonTaxable = 0;
  let totalDiscount = 0;
  let totalTax = 0;
  let grandTotal = 0;

  const setAllKeys = () => {
    const nonTaxableData = ledgerCalculationData.find(
      (data) => data.Name === "Non Taxable Sales"
    );

    const taxableData = ledgerCalculationData.find(
      (data) => data.Name === "Taxable Sales"
    );

    const discountData = ledgerCalculationData.find(
      (data) => data.Name === "Discount"
    );

    const taxData = ledgerCalculationData.find(
      (data) => data.Name === "Vat 13%"
    );

    const salesData = ledgerCalculationData.find(
      (data) => data.Name === "Sales"
    );

    setKeys({
      nonTaxable: nonTaxableData ? nonTaxableData.Id : 0,
      taxable: taxableData ? taxableData.Id : 0,
      discount: discountData ? discountData.Id : 0,
      tax: taxData ? taxData.Id : 0,
      sales: salesData ? salesData.Id : 0,
    });
  };

  const getGrandDetails = (data: ISales): IGrandDetails => {
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

    nonTaxable = nonTaxableData ? nonTaxableData.Credit : 0;
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
    totlaNonTaxable += nonTaxable;
    totalTax += tax;
    totalDiscount += discount;
    grandTotal += grand;

    return {
      totalAmount: amount,
      totalTaxable: taxable,
      totlaNonTaxable: nonTaxable,
      totalDiscount: discount,
      totalTax: tax,
      grandTotal: grand,
    };
  };

  useEffect(() => {
    setAllKeys();
  }, [salesData, ledgerCalculationData]);

  const editDeleteSales = (id: number) => {
    history.push(`/invoice/${id}`);
  };
  const checkData = async(id: number) => {
    const response = await getSalesData(id);
    if (response.Print_Copy === 0) {
      history.push(`/invoice/${id}`);
    } else {
      errorMessage("Sorry, it can't be edit anymore.");
    }
  }

  const viewInvoice = (id: number) => {
    history.push(`/invoice/view/${id}`);
  };

  const setAction = (actionType: string, id: number) => {
    //added for role verify
    switch (actionType) {
      case "edit":
        if (loginedUserRole.includes("InvEdit")) {
          checkData(id);
          // editDeleteSales(id);
          break;
        }else{
          errorMessage("Sorry, permission denied.");
          break;
        }
      case "delete":
        if(loginedUserRole.includes("InvDelete")){
          editDeleteSales(id);
          break;
        }else{
          errorMessage("Sorry, permission denied.");
          break;
        }
      case "view":
        if(loginedUserRole.includes("InvView")){
          viewInvoice(id);
          break;
        }else{
          errorMessage("Sorry, permission denied.");
          break;
        }        
      default:
      // Do nothing.
    }
  };
  //sorting
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    
  };

  return (
    <>
      <Paper sx={{ marginTop: 2, backgroundColor:'primary.mainTableHeader' }}>
        <TableContainer>
          <Box sx={{ paddingY: 2 }}>
            <Typography
              sx={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
            >
              {companyName}
            </Typography>
            <Typography sx={{ textAlign: "center", fontSize: 18 }}>
              Invoice
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
              {stableSort(salesData, getComparator(order, orderBy)).map((data:any, index:number) => {
                const grandDetails = getGrandDetails(data);
                // const ndate = data.AccountTransactionValues[0];
                return (
                  <>
                    <TableRow sx={{ backgroundColor:'primary.mainTableContent' }} key={index}>
                      <TableCell>
                        {data.NVDate}
                      </TableCell>
                      <TableCell>{parseInt(getBillNo(data.Name))}</TableCell>
                      <TableCell>
                        {getLedgerName(data.SourceAccountTypeId, ledgerData)}
                      </TableCell>
                      <TableCell>{getSaleType(data.Name)}</TableCell>
                      <TableCell sx={{ textAlign: "end" }}>
                        {getFormatedNumber(grandDetails.totalAmount)}
                      </TableCell>
                      <TableCell sx={{ textAlign: "end" }}>
                        {getFormatedNumber(grandDetails.totalTaxable)}
                      </TableCell>
                      <TableCell sx={{ textAlign: "end" }}>
                        {getFormatedNumber(grandDetails.totlaNonTaxable)}
                      </TableCell>
                      <TableCell sx={{ textAlign: "end" }}>
                        {getFormatedNumber(grandDetails.totalDiscount)}
                      </TableCell>
                      <TableCell sx={{ textAlign: "end" }}>
                        {getFormatedNumber(grandDetails.totalTax)}
                      </TableCell>
                      <TableCell sx={{ textAlign: "end" }}>
                        {getFormatedNumber(grandDetails.grandTotal)}
                      </TableCell>
                      <TableCell>{data.IRD_Status_Code}</TableCell>
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
                          onChange={(event: any, newValue: IOption | null) => {
                            if (newValue) {
                              setAction(newValue.id, data.Id);
                            }
                          }}
                        />
                      </TableCell>
                    </TableRow>

                    {data.SalesOrderDetails.length > 0 ? (
                      <TableRow sx={{ backgroundColor:'primary.tableHeader' }}>
                        <TableCell >SN.</TableCell>
                        <TableCell colSpan={3}>Item name</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Rate</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell colSpan={6}></TableCell>
                      </TableRow>
                    ) : (
                      ""
                    )}

                    {data.SalesOrderDetails.map((item:any, i:number) => {
                      return (
                        <TableRow sx={{ backgroundColor:'primary.tableContent' }} key={`item-${i}`}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell colSpan={3}>
                            {getProductName(item.ItemId, productData)}
                          </TableCell>
                          <TableCell>{item.Qty}</TableCell>
                          <TableCell sx={{ textAlign: "end" }}>
                            {getFormatedNumber(item.UnitPrice)}
                          </TableCell>
                          <TableCell sx={{ textAlign: "end" }}>
                            {getFormatedNumber(item.Qty * item.UnitPrice)}
                          </TableCell>
                          <TableCell colSpan={6}></TableCell>
                        </TableRow>
                      );
                    })}
                  </>
                );
              })}
              <TableRow>
                <TableCell
                  colSpan={4}
                  sx={{ textAlign: "end", fontWeight: "bold" }}
                >
                  Total
                </TableCell>
                <TableCell sx={{ textAlign: "end", fontWeight: "bold" }}>
                  {totalAmount.toFixed(2)}
                </TableCell>
                <TableCell sx={{ textAlign: "end", fontWeight: "bold" }}>
                  {totalTaxable.toFixed(2)}
                </TableCell>
                <TableCell sx={{ textAlign: "end", fontWeight: "bold" }}>
                  {totlaNonTaxable.toFixed(2)}
                </TableCell>
                <TableCell sx={{ textAlign: "end", fontWeight: "bold" }}>
                  {totalDiscount.toFixed(2)}
                </TableCell>
                <TableCell sx={{ textAlign: "end", fontWeight: "bold" }}>
                  {totalTax.toFixed(2)}
                </TableCell>
                <TableCell sx={{ textAlign: "end", fontWeight: "bold" }}>
                  {grandTotal.toFixed(2)}
                </TableCell>

                <TableCell colSpan={2}></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default InvoiceTable;
