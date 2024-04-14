import {
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Slide,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tabs,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { alpha } from "@mui/material/styles";//added
import MessageIcon from "@mui/icons-material/Message";//added
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
  getAllOrderManagement,
  getAllOrderManagementByBranch,
} from "../../../../services/orderManagementApi";
import { IOrderManagement } from "../../../../interfaces/orderManagement";
import { IsDateVerified } from "../../../../utils/dateVerification";
import { errorMessage, successMessage } from "../../../../utils/messageBox/Messages";
import { useHistory } from "react-router";
import { setDefaultDateAction } from "../../../../features/defaultDateSlice";
import { getNepaliDate } from "../../../../utils/nepaliDate";
import { Box } from "@mui/system";
import { LinearProgress } from "@mui/material";
import { setSortAction } from "../../../../features/sortSlice";
import { updateBraDataAction } from "../../../../features/braSlice";
import { getAllMasterLedger, getAllUnderLedger } from "../../../../services/masterLedgerAPI";
import { IMasterLedger } from "../../../../interfaces/masterLedger";
import { EMLINK } from "constants";
import { TransitionProps } from "@mui/material/transitions";
import axios from "axios";
import { ChildFriendly } from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import { getAllSMSKey } from "../../../../services/smsKeyApi";

interface IDateProps {
  StartDate: string;
  EndDate: string;
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
//added
interface toolbarProps{
  numSelected: number;
}
//added
interface TabPanelProps{
  // name?: string;
  // type?: string;
  // label: string;
  // onChange?: (e: any) => void;
  // helperText?: string;
  // required?: boolean;
  // autoFocus?: boolean;
  // placeholder?: string;
  // inputProps?: any;
  // error?: boolean;
  children?: React.ReactNode;
  index: number;
  value: number;
  // values: string | number;
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
    label:"O. Date",
    sortable:true
  },
  {
    id:'WorkDueNepaliDate',
    label:"Due. Date",
    sortable:true
  },
  {
    id:'DueNepaliDate',
    label:"Expire date",
    sortable:false
  },
  {
    id:'Message',
    label:"O. Message",
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
  numSelected: number;//added
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void; //added
  order: Order;
  orderBy: string;
  rowCount: number;//added
}

const SortableTableHead = ({ order, orderBy, onRequestSort, numSelected, onSelectAllClick, rowCount }:SortableTableProps) =>{
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
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all',
            }}
          />
        </TableCell>
        {mainHeader.map((data, index) => {
          return (
            <TableCell
            align="center"
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
//added dialog animation
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
//sms tab
function allProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}
//sms Tab panel
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{p:3}}>
          {children}
        </Box>
      )}
    </div>
  )
}

const TableComponentOrderManagement = () => {
  const sortOptions = useAppSelector((state)=> state.sort);
  const [order, setOrder] = useState<Order>(sortOptions.order);
  const [orderBy, setOrderBy] = useState<string>(sortOptions.orderBy);

  const dispatch = useAppDispatch();
  const defaultDate = useAppSelector((state) => state.defaultDate);
  const [accountHolder, setAccountHolder] = useState<IAccountHolder[]>([]);
  const [branchDetails, setBranchDetails] = useState<IBranch[]>([]);
  const FinancialYear = useAppSelector(getCurrentFinancialYear);
  const [allData, setAllData] = useState<any[]>([]);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName)

  const branch = useAppSelector((state) => state.branchData.data);
  const [selectbranchId, setSelectBranchId] = useState({...branch});
  const [dateChoose, setDateChoose] = useState<IDateProps>(
    defaultDate.EndDate === ""
      ? {
          StartDate: getNepaliDate(),
          EndDate: FinancialYear.NepaliEndDate,
        }
      : defaultDate
  );

  //on select checkbox
  const [selected, setSelected] = useState<readonly number[]>([]);//added
  const [allDataM, setAllDataM] = useState<IMasterLedger[]>([]);//added
  const [open, setOpen] = React.useState(false);//added
  const theme = useTheme(); //added
  const fullScreen = useMediaQuery(theme.breakpoints.down('md')); //added
  const [sMs, setSMS] = useState("");//added
  const [flashsMs, setFlashSMS] = useState("");//added
  const [unicodesMs, setUnicodeSMS] = useState("");//added
  const [tabValue, setTabValue] = useState(0);//added
  const [storeCredit, setStoreCredit] = useState([]);//added
  const [apikeyvalue, setapikeyvalue] = useState("");
  const [apirouteid, setapirouteid] = useState("");
  const [apisenderid, setapisenderid] = useState("");
  const [credit, setCredit] = useState("");


  // Actions options.
  const actionOptions: IOption[] = [
    { id: "edit", label: "Edit" },
    { id: "view", label: "View" },
    { id: "invoice", label: "Create Invoice" },
    { id: "delete", label: "Delete" },
  ];

  const getData = async () => {
    const getEnglishDateD = await getEnglishDate(dateChoose.StartDate);
    const getEnglishExpireDate = await getEnglishDate(dateChoose.EndDate);
    if(selectbranchId.branch === 0){
      const response = await getAllOrderManagement(
        getEnglishDateD,
        getEnglishExpireDate,
        FinancialYear.Name
      );
      if(response.length > 0){
        setAllData(
          response.map((data: IOrderManagement) => ({
            ...data,
          }))
        );
      } else {
        errorMessage(`No Data between ${dateChoose.StartDate} - ${dateChoose.EndDate}`);
      }
    }
    else if (selectbranchId.branch > 0) {
      const response = await getAllOrderManagementByBranch(
        getEnglishDateD,
        getEnglishExpireDate,
        FinancialYear.Name,
        selectbranchId.branch
      );
      if (response.length > 0) {
        setAllData(
          response.map((data: IOrderManagement) => ({
            ...data,
          }))
        );
      }else{
        errorMessage(`No Data between ${dateChoose.StartDate} - ${dateChoose.EndDate}`);
      }
      dispatch(setDefaultDateAction(dateChoose));
    }
    else{
      const response = await getAllOrderManagement(
        getEnglishDateD,
        getEnglishExpireDate,
        FinancialYear.Name
      );
      if(response.length > 0){
        setAllData(
          response.map((data: IOrderManagement) => ({
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
      const response = await getAllOrderManagement(
        getEnglishDateD,
        getEnglishExpireDate,
        FinancialYear.Name
      );
      if (response.lengh > 0) {
        setAllData(
          response.map((data: IOrderManagement) => ({
            ...data,
          }))
        );
        dispatch(setDefaultDateAction(dateChoose));
      }else{
        errorMessage(`No Data between ${dateChoose.StartDate} - ${dateChoose.EndDate}`);
      }
    }
    else if (selectbranchId.branch > 0) {
      const response = await getAllOrderManagementByBranch(
        getEnglishDateD,
        getEnglishExpireDate,
        FinancialYear.Name,
        selectbranchId.branch
      );
      if (response.length > 0) {
        setAllData(
          response.map((data: IOrderManagement) => ({
            ...data,
          }))
        );
      }else{
        errorMessage(`No Data between ${dateChoose.StartDate} - ${dateChoose.EndDate}`);
      }
      dispatch(setDefaultDateAction(dateChoose));
    }else {
      const response = await getAllOrderManagement(
        getEnglishDateD,
        getEnglishExpireDate,
        FinancialYear.Name
      );
      if (response.lengh > 0) {
        setAllData(
          response.map((data: IOrderManagement) => ({
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
    getMAsterLedger();
    handleGETCredit();
    getSMSApiKey();
  }, []);

  //added
  const getMAsterLedger = async () => {
    const ledgerData = await getAllMasterLedger();
    let data: any = [];
    if (ledgerData) {
      ledgerData.forEach((elm: any, index: any) => {
        data.push({
          Id: elm.Id,
          Name: elm.Name,
          Telephone:elm.Telephone,
        });
      });
    }
    setAllDataM(data);
  }

  const handleGETCredit = async() => {
    await axios.get('https://spellsms.com/login/api/miscapi/26DF202044817B6ECE8220EE9A4CBBB6/getBalance/true',
      {
      headers: { "Access-Control-Allow-Origin": "*" }
      })
      .then((resp) => {
        setCredit(resp.data.credits[0].credits)
      })
      .catch(error => console.error(`Error: ${error}`));
  };

  const getSMSApiKey = async () => {
    const res = await getAllSMSKey();
    if (res) {
      if (res.length === 1) {
        setapikeyvalue(res[0].SMSAPIKey);
        setapisenderid(res[0].Senderid);
        setapirouteid(res[0].Routeid);
      } else {
        setapikeyvalue("")
      }
    } else {
      errorMessage("No SMSAPIKEY set.")
    }
  }

  const history = useHistory();
  const editPage = (id: number) => {
    history.push(`/order-management/${id}`);
  };
  const viewPage = (id: number) => {
    history.push(`/view/order-management/${id}`);
  };
  const creteInvoice = (id: number) => {
    history.push(`/order-management/${id}/create-invoice`);
  };

  const setAction = (actionType: string, id: number) => {
    switch (actionType) {
      case "edit":
        if(loginedUserRole.includes("OMEdit")){
          editPage(id);
          break;
        }else{
          errorMessage("Sorry, permission denied.");
          break;
        }
      case "delete":
        if(loginedUserRole.includes("OMDelete")){
          editPage(id);
          break;
        }else{
          errorMessage("Sorry, permission denied.");
          break;
        }
      case "view":
        if(loginedUserRole.includes("OMView")){
          viewPage(id);
          break;
        }else{
          errorMessage("Sorry, permission denied.");
          break;
        }
      case "invoice":
        if(loginedUserRole.includes("OMInvoice")){
          creteInvoice(id);
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

  //on select checkbox//added
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = allData.map((n) => n.Id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }
  //added
  const isSelected = (id: number) => selected.indexOf(id) !== -1;
  //added
  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  let ormtostore: any = [];
  if (selected.length > 0) {
    for (var i = 0; i < selected.length; i++) {
      let orID = selected[i];
      const getDataFromID = allData.filter((data: any) => {
        return (data.Id === Number(orID));
      });
      const getTel = allDataM.filter((data: any) => {
        return (data.Id === getDataFromID[0].AccountId);
      });
      ormtostore.push(getTel[0].Telephone);
    }
  }
  //added
  const TableToolbar = (props: toolbarProps) => {
    const { numSelected } = props;
    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}
      >
        {numSelected > 0 ?
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>: ""}
        {numSelected > 0 ? 
          <Tooltip title="Send Message">
            <IconButton onClick={sendMessageDialog}>
              <MessageIcon/>
            </IconButton>
          </Tooltip> : 
          null
          }
      </Toolbar>
    );
  }
  const sendMessageDialog = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  //for simple SMS Text
  //261ECF1642B009
  const handleSend = (phone: any, sms: any) => {
    let creditNumber = parseInt(credit);
    creditNumber === 0 ?
      errorMessage("You have no more Credit remain.")
      :
      // axios.post(`https://spellsms.com/login/api/smsapi?key=26DF202044817B6ECE8220EE9A4CBBB6&campaign=6467&routeid=116&type=text&contacts=${phone}&senderid=SMSBit&msg=${sms}`)
      axios.post(`https://spellsms.com/login/api/smsapi?key=${apikeyvalue}&campaign=Test&routeid=${apirouteid}&type=text&contacts=${phone}&senderid=${apisenderid}&msg=${sms}`)
        .then(res => {
          const hah = res.data;
          successMessage("Message send sucessfully");
          setOpen(false);
      })
  };
 //for Flash SMS Text
  const handleSend2 = (phone: any, sms: any) => {
    let creditNumber = parseInt(credit);
    creditNumber === 0 ?
      errorMessage("You have no more Credit remain.")
      :
      axios.post(`https://spellsms.com/login/api/smsapi?key=${apikeyvalue}&routeid=${apirouteid}&type=flash&contacts=${phone}&senderid=${apisenderid}&msg=${sms}`)
        .then(res => {
          const hah = res.data;
      })
      setOpen(false);
  };
  // https://login.spellsms.com/smsapi/index.php?key=261ECF1642B009&campaign=6033&routeid=116&type=unicode&contacts=${phone}&senderid=SMSBit&msg=Hindi++-+%C3%A0%C2%A4%C2%B9%C3%A0%C2%A4%C2%BF%C3%A0%C2%A4%C2%82%C3%A0%C2%A4%C2%A6%C3%A0%C2%A5%C2%80+%2C+Chinese+-++%C3%A7%C2%97%C2%B4%C3%A5%C2%91%C2%A2%C3%A8%C2%89%C2%B2+%C3%AF%C2%BC%C2%8CRussian+-+%C3%91%C2%80%C3%91%C2%83%C3%91%C2%81%C3%91%C2%81%C3%90%C2%B8%C3%90%C2%B0%C3%90%C2%BD
 //for Flash SMS Text
  const handleSend3 = (phone: any, sms: any) => {
    let creditNumber = parseInt(credit);
    creditNumber === 0 ?
      errorMessage("You have no more Credit remain.")
      :
      axios.post(`https://spellsms.com/login/api/smsapi?key=${apikeyvalue}&campaign=6033&routeid=${apirouteid}&type=unicode&contacts=${phone}&senderid=${apisenderid}&msg=${sms}`)
        .then(res => {
          const hah = res.data;
      })
      setOpen(false);
  };
 
  const textsmsMessage = (event: any) => {
    setSMS(event.target.value);
  }
  const flashsmsMessage = (event: any) => {
    setFlashSMS(event.target.value);
  }
  const unicodesmsMessage = (event: any) => {
    setUnicodeSMS(event.target.value);
  }
  // sms tab on click
  const handleCHAnge = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  }
  
  //for branch
  const updateSelectedFormData = (name: string, value: number | 0) => {
    dispatch(updateBraDataAction({ name: "branch", value: value }));
    setSelectBranchId({ ...selectbranchId, ["branch"]: value });
  }

  return (
    <>
    {
      loginedUserRole.includes("OMAdd") ?
      <GridDateHeader
        headerName="Order Management"
        dateChoose={dateChoose}
        setDateChoose={setDateChoose}
        getDataInSearch={getDataInSearch}
        path="/order-management/add"
        onClickHandler={updateSelectedFormData}
        branch={selectbranchId.branch}
        excel="true"
        pdf="true"
        PDF="true"
        fileName={`Order-Management-${dateChoose.StartDate}-${dateChoose.EndDate}`}
      /> :
      <GridDateHeader
        headerName="Order Management"
        dateChoose={dateChoose}
        setDateChoose={setDateChoose}
        getDataInSearch={getDataInSearch}
        path="OMADD"
        onClickHandler={updateSelectedFormData}
        branch={selectbranchId.branch}
        excel="true"
        pdf="true"
        PDF="true"
        fileName={`Order-Management-${dateChoose.StartDate}-${dateChoose.EndDate}`}
      />
    }
      
        <Box>
        <TableToolbar numSelected={selected.length} />
        <Typography variant="h5" component="div" gutterBottom>
          {storeCredit}
        </Typography>
          <Dialog TransitionComponent={Transition} fullScreen={fullScreen} keepMounted open={open} onClose={handleClose}>
            <DialogTitle>Send SMS</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Here you can send SMS to single or multiple person at a time. Just remember that, you should have sufficent credit with validate date.
              </DialogContentText>
              
            <Box
              sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex' }}
            >
              <Tabs
                orientation = "vertical"
                variant = "scrollable"
                value={tabValue}
                onChange={handleCHAnge}
                sx={{ borderRight: 1, borderColor: 'divider' }}
              >
                <Tab label="Simple SMS" {...allProps(0)}/>
                <Tab label="Flash SMS" {...allProps(1)}/>
                <Tab label="Unicode SMS" {...allProps(2)}/>
              </Tabs>
              <TabPanel value={tabValue} index={0}>
                <TextField
                  helperText="Contact No"
                  placeholder="ContactNo"
                  value={ormtostore}
                  name="ContactNo"
                  label="ContactNo"
                  required
                />
                <TextField
                  autoFocus
                  margin="dense"
                  id="message"
                  label="Message"
                  multiline
                  value={sMs}
                  onChange={(e:any) => textsmsMessage(e)}
                  fullWidth
                  required
                  variant="standard"
                />
                <Stack direction="row" spacing={2} sx={{mt: 5, position: "relative", float: "right"}}>
                  <Button variant="outlined" color="error" onClick={handleClose}>
                    cancel
                  </Button>
                  <Button variant="outlined" color="success" endIcon={<SendIcon />} onClick={() => handleSend(ormtostore, sMs)}>
                    Send
                  </Button>
                </Stack>
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <TextField
                  helperText="Contact No"
                  placeholder="ContactNo"
                  value={ormtostore}
                  name="ContactNo"
                  label="ContactNo"
                  required
                />
                <TextField
                  autoFocus
                  margin="dense"
                  id="message"
                  label="Message"
                  multiline
                  value={flashsMs}
                  onChange={(e:any) => flashsmsMessage(e)}
                  fullWidth
                  required
                  variant="standard"
                />
                <Stack direction="row" spacing={2} sx={{mt: 5, position: "relative", float: "right"}}>
                  <Button variant="outlined" color="error" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button variant="outlined" color="success" endIcon={<SendIcon />} onClick={() => handleSend2(ormtostore, flashsMs)}>
                    Send
                  </Button>
                </Stack>
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <TextField
                  helperText="Contact No"
                  placeholder="ContactNo"
                  value={ormtostore}
                  name="ContactNo"
                  label="ContactNo"
                  required
                />
                <TextField
                  autoFocus
                  margin="dense"
                  id="message"
                  label="Message"
                  multiline
                  value={unicodesMs}
                  onChange={(e:any) => unicodesmsMessage(e)}
                  fullWidth
                  required
                  variant="standard"
                />
                <Stack direction="row" spacing={2} sx={{mt: 5, position: "relative", float: "right"}}>
                  <Button variant="outlined" color="error" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button variant="outlined" color="success" endIcon={<SendIcon />} onClick={() => handleSend3(ormtostore, unicodesMs)}>
                    Send
                  </Button>
                </Stack>
              </TabPanel>
            </Box>
            </DialogContent>
            {/* <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={() => handleSend(ormtostore, sMs)}>Send</Button>
            </DialogActions> */}
          </Dialog>
          <TableContainer component={Paper}>
            <DateHeader headerName="Order Management" date={dateChoose} />
            <Table stickyHeader aria-label="sticky table">
              <SortableTableHead 
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              numSelected = {selected.length}//added
              onSelectAllClick = {handleSelectAllClick}//added
              rowCount={allData.length}//added
            />
              <TableBody>
                {stableSort(allData, getComparator(order, orderBy)).map((data:IOrderManagement, index:number) => {
                    const getAccountHolder = accountHolder?.find(
                      (elm) => elm.Id === data.AccountId
                    );
                    const getBranch = branchDetails?.find(
                      (elm) => elm.Id === data.BranchId
                    );
                    //added
                    const isItemSelected = isSelected(data.Id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <>
                        <TableRow
                          hover
                          role="checkbox"
                          id={index + "main"}
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          onClick={(event) => handleClick(event, data.Id)}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isItemSelected}
                              inputProps={{
                                'aria-labelledby': labelId,
                              }}
                            />
                          </TableCell>
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
                            {data.WorkDueNepaliDate?.substring(0, 10)}
                          </TableCell>
                          <TableCell align="center">
                            {data.DueNepaliDate?.substring(0, 10)}
                          </TableCell>
                          <TableCell align="center">{data.Message}</TableCell>

                          <TableCell align="left">
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
        </Box>
    </>
  );
};

export default TableComponentOrderManagement;
