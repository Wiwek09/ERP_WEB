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
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import DateHeader from "../../../../components/headers/dateHeader";
import { getCurrentFinancialYear } from "../../../../features/financialYearSlice";
import { IBranch } from "../../../../interfaces/branch";
import { IAccountHolder } from "../../../../interfaces/purchaseOrder";
import { getAllBranch } from "../../../../services/branchApi";
import { getAllAccountHolder } from "../../../../services/purchaseOrderApi";
import GridDateHeader from "../../../../components/headers/gridDateHeader";
import { getEnglishDate } from "../../../../services/getEnglishDate";
import {
  getAllQuotation,
  getAllQuotationByBranch,
} from "../../../../services/quotationApi";
import { IQuotation } from "../../../../interfaces/quotation";
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
//Sorting
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
    id:'NepaliDate',
    label:"Q. Date",
    sortable:true
  },
  {
    id:'ExpiredNepaliDate',
    label:"Expire date",
    sortable:false
  },
  {
    id:'Message',
    label:"Q. Message",
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

const TableComponentQuotation = () => {
  const sortOptions = useAppSelector((state)=> state.sort);
  const [order, setOrder] = useState<Order>(sortOptions.order);
  const [orderBy, setOrderBy] = useState<string>(sortOptions.orderBy);

  const dispatch = useAppDispatch();
  const defaultDate = useAppSelector((state) => state.defaultDate);
  const [accountHolder, setAccountHolder] = useState<IAccountHolder[]>([]);
  const [branchDetails, setBranchDetails] = useState<IBranch[]>([]);
  // const [selectedBranch, setSelectedBranch] = useState<number>(0);
  const branch = useAppSelector((state) => state.branchData.data);
  const [selectbranchId, setSelectBranchId] = useState({...branch});
  const FinancialYear = useAppSelector(getCurrentFinancialYear);
  const [allData, setAllData] = useState<any[]>([]);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName)

  // Actions options.
  const actionOptions: IOption[] = [
    { id: "edit", label: "Edit" },
    { id: "view", label: "View" },
    { id: "createorder", label: "Place Order" },
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
    const getEnglishDateD = await getEnglishDate(dateChoose.StartDate);
    const getEnglishExpireDate = await getEnglishDate(dateChoose.EndDate);
    if(selectbranchId.branch === 0) {
      const response = await getAllQuotation(
      getEnglishDateD.substring(0, 10),
      getEnglishExpireDate.substring(0, 10),
      FinancialYear.Name
      );
      if(response.length > 0){
        setAllData(
          response.map((data: IQuotation) => ({
            ...data,
          }))
        );
      }else{
        errorMessage(`No Data between ${dateChoose.StartDate} - ${dateChoose.EndDate}`);
      }
    }
    else if (selectbranchId.branch > 0) {
      const response = await getAllQuotationByBranch(
        getEnglishDateD.substring(0, 10),
        getEnglishExpireDate.substring(0, 10),
        FinancialYear.Name,
        selectbranchId.branch
      );
      if (response.length > 0) {
        setAllData(
          response.map((data: IQuotation) => ({
            ...data,
          }))
        );
        dispatch(setDefaultDateAction(dateChoose));
      }
      else{
        errorMessage(`No Data between ${dateChoose.StartDate} - ${dateChoose.EndDate}`);
      }
    }
    else{
      const response = await getAllQuotation(
      getEnglishDateD.substring(0, 10),
      getEnglishExpireDate.substring(0, 10),
      FinancialYear.Name
      );
      if(response.length > 0){
        setAllData(
          response.map((data: IQuotation) => ({
            ...data,
          }))
        );
      }else{
        errorMessage(`No Data between ${dateChoose.StartDate} - ${dateChoose.EndDate}`);
      }
    }
    const accountHolderRes = await getAllAccountHolder();
    setAccountHolder(accountHolderRes);

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

    const BranchRes: IBranch[] = await getAllBranch();
    setBranchDetails(BranchRes);

    const getEnglishDateD = await getEnglishDate(dateChoose.StartDate);
    const getEnglishExpireDate = await getEnglishDate(dateChoose.EndDate);
    if(selectbranchId.branch === 0) {
      const response = await getAllQuotation(
        getEnglishDateD.substring(0, 10),
        getEnglishExpireDate.substring(0, 10),
        FinancialYear.Name
      );
      if (response.length > 0) {
        setAllData(
          response.map((data: IQuotation) => ({
            ...data,
          }))
        );
        dispatch(setDefaultDateAction(dateChoose));
      }else{
        errorMessage(`No Data between ${dateChoose.StartDate} - ${dateChoose.EndDate}`);
      }
    }
    else if (selectbranchId.branch > 0) {
      const response = await getAllQuotationByBranch(
        getEnglishDateD.substring(0, 10),
        getEnglishExpireDate.substring(0, 10),
        FinancialYear.Name,
        selectbranchId.branch
      );
      if (response.length > 0) {
        setAllData(
          response.map((data: IQuotation) => ({
            ...data,
          }))
        );
        dispatch(setDefaultDateAction(dateChoose));
      }else{
        errorMessage(`No Data between ${dateChoose.StartDate} - ${dateChoose.EndDate}`);
      }
    }
    else {
      const response = await getAllQuotation(
        getEnglishDateD.substring(0, 10),
        getEnglishExpireDate.substring(0, 10),
        FinancialYear.Name
      );
      if (response.length > 0) {
        setAllData(
          response.map((data: IQuotation) => ({
            ...data,
          }))
        );
        dispatch(setDefaultDateAction(dateChoose));
      }else{
        errorMessage(`No Data between ${dateChoose.StartDate} - ${dateChoose.EndDate}`);
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

  //for branch
  const updateSelectedFormData = (name: string, value: number | 0) => {
    dispatch(updateBraDataAction({ name: "branch", value: value }));
    setSelectBranchId({ ...selectbranchId, ["branch"]: value });
  }

  const history = useHistory();
  const editPage = (id: number) => {
    history.push(`/quotation/${id}`);
  };
  const viewPage = (id: number) => {
    history.push(`/viewquotation/${id}`);
  };
  const placeOrderPage = (id: number) => {
    history.push(`/quotation/${id}/createorder`);
  };

  const setAction = (actionType: string, id: number) => {
    switch (actionType) {
      case "edit":
        if(loginedUserRole.includes("QuotationEdit")){
          editPage(id);
          break;
        }else{
          errorMessage("Sorry, permission denied.");
          break;
        }
      case "delete":
        if(loginedUserRole.includes("QuotationDelete")){
          editPage(id);
          break;
        }else{
          errorMessage("Sorry, permission denied.");
          break;
        }
      case "view":
        if(loginedUserRole.includes("QuotationView")){
          viewPage(id);
          break;
        }else{
          errorMessage("Sorry, permission denied.");
          break;
        }
      case "createorder":
        if(loginedUserRole.includes("QuotationInvoice")){
          placeOrderPage(id);
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

  return (
    <>
      {
        loginedUserRole.includes("QuotationAdd") ?
        <GridDateHeader
          headerName="Quotation"
          dateChoose={dateChoose}
          setDateChoose={setDateChoose}
          getDataInSearch={getDataInSearch}
          path="/quotation/add"
          pdf="true"
          excel="true"
          PDF="true"
          onClickHandler={updateSelectedFormData}
          branch={selectbranchId.branch}
          fileName={`Quotation-${dateChoose.StartDate}-${dateChoose.EndDate}`}
        /> :
        <GridDateHeader
          headerName="Quotation"
          dateChoose={dateChoose}
          setDateChoose={setDateChoose}
          getDataInSearch={getDataInSearch}
          path="QUOADD"
          pdf="true"
          excel="true"
          PDF="true"
          onClickHandler={updateSelectedFormData}
          branch={selectbranchId.branch}
          fileName={`Quotation-${dateChoose.StartDate}-${dateChoose.EndDate}`}
        />
      }
      
        <Paper>
          <TableContainer component={Paper}>
            <DateHeader headerName="Quotation" date={dateChoose} />
            <Table stickyHeader aria-label="sticky table">
              <SortableTableHead 
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
              <TableBody>
                {stableSort(allData, getComparator(order, orderBy)).map((data:IQuotation, index:number) => {
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
                          <TableCell align="center">
                            {data.NepaliDate?.substring(0, 10)}
                          </TableCell>
                          <TableCell align="center">
                            {data.ExpiredNepaliDate?.substring(0, 10)}
                          </TableCell>
                          <TableCell align="center">{data.Message}</TableCell>

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

export default TableComponentQuotation;
