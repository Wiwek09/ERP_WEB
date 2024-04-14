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
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import DateHeader from "../../../../components/headers/dateHeader";
import { getCurrentFinancialYear } from "../../../../features/financialYearSlice";
import { IBranch } from "../../../../interfaces/branch";
import {
  IAccountHolder,
  IPurchaseMenu,
  IPurchaseOrderAllData,
} from "../../../../interfaces/purchaseOrder";
import { getAllBranch } from "../../../../services/branchApi";
import {
  getAllAccountHolder,
  getAllPurchase,
  getAllPurchaseOrder,
  getAllPurchaseOrderByBranch,
} from "../../../../services/purchaseOrderApi";
import GridDateHeader from "../../../../components/headers/gridDateHeader";
import { getEnglishDate } from "../../../../services/getEnglishDate";
import { IsDateVerified } from "../../../../utils/dateVerification";
import { errorMessage } from "../../../../utils/messageBox/Messages";
import { useHistory } from "react-router";
import { setDefaultDateAction } from "../../../../features/defaultDateSlice";
import { getNepaliDate } from "../../../../utils/nepaliDate";
import { setSortAction } from "../../../../features/sortSlice";
import { updateBraDataAction } from "../../../../features/braSlice";
interface IDateProps {
  StartDate: string;
  EndDate: string;
}
interface IOption {
  id: string;
  label: string;
}
//sorting
interface HeadCell {
  sortable: boolean;
  id: string;
  label: string;
}
const mainHeader: readonly HeadCell[] = [
  {
    id:'index',
    label:"S.N",
    sortable:false
  },
  {
    id:'Name',
    label:"Account",
    sortable:false
  },
  {
    id:'NameEnglish',
    label:"Branch",
    sortable:false
  },
  {
    id:'Message',
    label:"Message",
    sortable:false
  },
  {
    id:'ExpiredNepaliDate',
    label:"Expiry date",
    sortable:true
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
                  data.label === "Account"
                    ? "250px"
                    : data.label === "Actions"
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

const TableComponentPurchaseOrder = () => {
  const sortOptions = useAppSelector((state)=> state.sort);
  const [order, setOrder] = useState<Order>(sortOptions.order);
  const [orderBy, setOrderBy] = useState<string>(sortOptions.orderBy);

  const dispatch = useAppDispatch();
  const defaultDate = useAppSelector((state) => state.defaultDate);
  const FinancialYear = useAppSelector(getCurrentFinancialYear);
  const [accountHolder, setAccountHolder] = useState<IAccountHolder[]>([]);
  const [branchDetails, setBranchDetails] = useState<IBranch[]>([]);
  const [products, setProducts] = useState<IPurchaseMenu[]>([]);
  const [allData, setAllData] = useState<IPurchaseOrderAllData[]>([]);
  // const [selectedBranch, setSelectedBranch] = useState<number>(0);
  const branch = useAppSelector((state) => state.branchData.data);
  const [selectbranchId, setSelectBranchId] = useState({...branch});
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName)

  // Actions options.
  const actionOptions: IOption[] = [
    { id: "edit", label: "Edit" },
    { id: "view", label: "View" },
    { id: "delete", label: "Delete" },
  ];

  const [dateChoose, setDateChoose] = useState<IDateProps>(
    defaultDate.EndDate === ""
      ? {
          StartDate: getNepaliDate(),
          EndDate: FinancialYear.NepaliEndDate,
        }
      : defaultDate
  );

  const getData = async () => {
    const getEnglishExpireDate = await getEnglishDate(dateChoose.EndDate);
    const getEnglishDateD = await getEnglishDate(dateChoose.StartDate);
    if (selectbranchId.branch > 0) {
      const response = await getAllPurchaseOrderByBranch(
        getEnglishDateD,
        getEnglishExpireDate,
        FinancialYear.Name,
        selectbranchId.branch
      );
      if (response.length >0) {
        setAllData(
          response.map((data: IPurchaseOrderAllData) => ({
            ...data,
          }))
        );
      }else{
        errorMessage(`No Data between ${dateChoose.StartDate} - ${dateChoose.EndDate}`);
      }
    }else if(selectbranchId.branch === 0) {
      const response= await getAllPurchaseOrder(
        getEnglishDateD,
        getEnglishExpireDate,
        FinancialYear.Name
      );
      if(response.length > 0){
        setAllData(
          response.map((data: IPurchaseOrderAllData) => ({
          ...data,
          }))
        );
      }else{
        errorMessage(`No Data between ${dateChoose.StartDate} - ${dateChoose.EndDate}`);
      }
    }  
    else{
      const response= await getAllPurchaseOrder(
        getEnglishDateD,
        getEnglishExpireDate,
        FinancialYear.Name
      );
      if(response.length > 0){
        setAllData(
          response.map((data: IPurchaseOrderAllData) => ({
          ...data,
          }))
        );
      }else{
        errorMessage(`No Data between ${dateChoose.StartDate} - ${dateChoose.EndDate}`);
      }
    }  

    const accountHolderRes = await getAllAccountHolder();
    setAccountHolder(accountHolderRes);

    const productsRes = await getAllPurchase();
    setProducts(productsRes);

    const BranchRes: IBranch[] = await getAllBranch();
    setBranchDetails(BranchRes);
  };

  const getDataInSearch = async (e: any) => {
    e.preventDefault();
    if (
      !IsDateVerified(dateChoose.StartDate, dateChoose.EndDate, FinancialYear)
    ) {
      errorMessage("Invalid Date !!!");
      return;
    }
    const accountHolderRes = await getAllAccountHolder();
    setAccountHolder(accountHolderRes);

    const productsRes = await getAllPurchase();
    setProducts(productsRes);

    const BranchRes: IBranch[] = await getAllBranch();
    setBranchDetails(BranchRes);

    const getEnglishDateD = await getEnglishDate(dateChoose.StartDate);
    const getEnglishExpireDate = await getEnglishDate(dateChoose.EndDate);
    if(selectbranchId.branch === 0) {
      const response = await getAllPurchaseOrder(
        getEnglishDateD,
        getEnglishExpireDate,
        FinancialYear.Name
      );
      if (response.length > 0) {
        setAllData(
          response.map((data: IPurchaseOrderAllData) => ({
            ...data,
          }))
        );
      }else{
        errorMessage(`No Data between ${dateChoose.StartDate} - ${dateChoose.EndDate}`);
      }
    }
    else if (selectbranchId.branch > 0) {
      const response = await getAllPurchaseOrderByBranch(
        getEnglishDateD,
        getEnglishExpireDate,
        FinancialYear.Name,
        selectbranchId.branch
      );
      if (response.length > 0) {
        setAllData(
          response.map((data: IPurchaseOrderAllData) => ({
            ...data,
          }))
        );
      }else{
        errorMessage(`No Data between ${dateChoose.StartDate} - ${dateChoose.EndDate}`);
      }
    }else {
      const response = await getAllPurchaseOrder(
        getEnglishDateD,
        getEnglishExpireDate,
        FinancialYear.Name
      );
      if (response.length > 0) {
        setAllData(
          response.map((data: IPurchaseOrderAllData) => ({
            ...data,
          }))
        );
      }else{
        errorMessage(`No Data between ${dateChoose.StartDate} - ${dateChoose.EndDate}`);
      }
    }
    dispatch(setDefaultDateAction(dateChoose));
  };

  useEffect(() => {
    getData();
  }, []);

  const history = useHistory();
  const editPage = (id: number) => {
    history.push(`/purchase-order/${id}`);
  };
  const viewPage = (id: number) => {
    history.push(`/purchase-order/view/${id}`);
  };

  const setAction = (actionType: string, id: number) => {
    switch (actionType) {
      case "edit":
        if(loginedUserRole.includes("POEdit")){
          editPage(id);
          break;
        }else{
          errorMessage("Sorry, permission denied.");
          break;
        }
      case "delete":
        if(loginedUserRole.includes("PODelete")){
          editPage(id);
          break;
        }else{
          errorMessage("Sorry, permission denied.");
          break;
        }
      case "view":
        if(loginedUserRole.includes("POView")){
          viewPage(id);
          break;
        }else{
          errorMessage("Sorry, permission denied.");
          break;
        }
      default:
      // Do nothing.
    }
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    
  };

  //for branch
  const updateSelectedFormData = (name: string, value: number | 0) => {
    dispatch(updateBraDataAction({ name: "branch", value: value }));
    setSelectBranchId({ ...selectbranchId, ["branch"]: value });
  }

  return (
    <>
      {
        loginedUserRole.includes("POAdd") ?
        <GridDateHeader
          headerName="Purchase Order"
          dateChoose={dateChoose}
          setDateChoose={setDateChoose}
          getDataInSearch={getDataInSearch}
          path="/purchase-order/add"
          onClickHandler={updateSelectedFormData}
          branch={selectbranchId.branch}
          excel="true"
          pdf="true"
          PDF="true"
          fileName={`Purchase-Order-${dateChoose.StartDate}-${dateChoose.EndDate}`}
        /> :
        <GridDateHeader
          headerName="Purchase Order"
          dateChoose={dateChoose}
          setDateChoose={setDateChoose}
          getDataInSearch={getDataInSearch}
          path="POADD"
          onClickHandler={updateSelectedFormData}
          branch={selectbranchId.branch}
          excel="true"
          pdf="true"
          PDF="true"
          fileName={`Purchase-Order-${dateChoose.StartDate}-${dateChoose.EndDate}`}
        />
      }
        <Paper>
          <TableContainer component={Paper}>
            <DateHeader headerName="Purchase Order" date={dateChoose} />
            <Table stickyHeader aria-label="sticky table">
              <SortableTableHead 
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
              <TableBody>
                {allData &&
                  stableSort(allData, getComparator(order, orderBy)).map((data: IPurchaseOrderAllData, index: number) => {
                    const getAccountHolder = accountHolder?.find(
                      (elm) => elm.Id === data.AccountId
                    );
                    const getBranch = branchDetails?.find(
                      (elm) => elm.Id === data.BranchId
                    );

                    return (
                      <>
                        <TableRow id={index + "main"}>
                          <TableCell align="center">{index + 1}</TableCell>
                          <TableCell align="center">
                            {getAccountHolder ? getAccountHolder.Name : "...."}
                          </TableCell>
                          <TableCell align="center">
                            {getBranch ? getBranch.NameEnglish : "...."}
                          </TableCell>
                          <TableCell align="center">{data.Message}</TableCell>
                          <TableCell align="center">
                            {data.ExpiredNepaliDate &&
                              data.ExpiredNepaliDate.substring(0, 10)}
                          </TableCell>
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

                        <TableRow component="th">
                          <TableCell align="right" sx={{ fontWeight: "500" }}>
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: "500" }}>
                            Item name
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: "500" }}>
                            Quantity
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: "500" }}>
                            Rate
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: "500" }}>
                            Amount
                          </TableCell>
                          <TableCell align="center"></TableCell>
                        </TableRow>

                        {data.PurchaseOrderDetails.map((value, ind) => {
                          const getProductName = products?.find(
                            (elm) => elm.Id === value.ItemId
                          );
                          return (
                            <>
                              <TableRow id={ind + "val"}>
                                <TableCell align="right"></TableCell>
                                <TableCell align="center">
                                  {getProductName
                                    ? getProductName.Name
                                    : "...."}
                                </TableCell>
                                <TableCell align="center">
                                  {value.Qty}
                                </TableCell>
                                <TableCell align="right">
                                  {value.UnitPrice}
                                </TableCell>
                                <TableCell align="right">
                                  {value.TotalAmount}
                                </TableCell>
                                <TableCell align="right"></TableCell>
                              </TableRow>
                            </>
                          );
                        })}
                      </>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
    </>
  );
};

export default TableComponentPurchaseOrder;
