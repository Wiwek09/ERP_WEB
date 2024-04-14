import { Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { IOnSubmit } from "../../../interfaces/event";
import { IVoucher } from "../../../interfaces/voucher";
import { IParams } from "../../../interfaces/params";
import { getJournal } from "../../../services/journalApi";
import { errorMessage } from "../../../utils/messageBox/Messages";
import TopContent from "../components/TopContentComponent";
import { InitialJournalData } from "./components/InitialJournalData";
import JournalForm from "./components/JournalForm";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  addNewJournal,
  checkDate,
  updateJournal,
} from "./components/helperFunctions";
import AddLedgerComponent from "../components/AddLedgerComponent";
import { getAllMasterLedger } from "../../../services/masterLedgerAPI";
import { ILedger } from "../../../interfaces/posBiling";
import { getNepaliDate } from "../../../utils/nepaliDate";
import { updateBraDataAction } from "../../../features/braSlice";
import { SaveProgressDialog } from "../../../components/dialogBox";

const ManageJournal = () => {
  const companyId = useAppSelector((state) => state.company.data.Id);
  const userName = useAppSelector((state) => state.user.data.UserName);
  const financial = useAppSelector((state) => state.financialYear.Name);
  const startDate = useAppSelector(
    (state) => state.financialYear.NepaliStartDate
  );
  const endDate = useAppSelector((state) => state.financialYear.NepaliEndDate);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName);

  const branch = useAppSelector((state) => state.branchData.data);
  const [selectbranchId, setSelectBranchId] = useState({ ...branch });
  const dispatch = useAppDispatch();

  const { id }: IParams = useParams();
  const history = useHistory();
  const [NVDate, setNVDate] = useState(getNepaliDate());
  const [branchId, setBranchId] = useState(0);
  const [data, setData] = useState<IVoucher>(InitialJournalData);
  const [commonDetails, setCommonDetails] = useState({
    UserName: userName,
    CompanyCode: companyId,
    FinancialYear: financial,
  });
  const [debitAmount, setDebitAmount] = useState(data.DebitAmount);
  const [creditAmount, setCreditAmount] = useState(data.CreditAmount);

  const getJournalData = async () => {
    const response = await getJournal(parseInt(id));
    if (response) {
      setData(response);
      // setBranchId(response.BranchId);
      setSelectBranchId({ ...selectbranchId, ["branch"]: response.BranchId });
      setNVDate(response.AccountTransactionValues[0].NVDate);
      setCommonDetails({
        ...commonDetails,
        ["UserName"]: response.AccountTransactionValues[0].UserName,
        ["CompanyCode"]: response.AccountTransactionValues[0].CompanyCode,
        ["FinancialYear"]: response.AccountTransactionValues[0].FinancialYear,
      });
    } else {
      errorMessage("404 error");
    }
  };

  const [accountList, setAccountList] = useState<any>([]);
  const getAccounts = async () => {
    const response = await getAllMasterLedger();
    setAccountList(
      response.map((item: ILedger) => ({
        label: item.Name,
        value: item.Id,
      }))
    );
  };

  useEffect(() => {
    setData({
      ...InitialJournalData,
      AccountTransactionValues: [
        {
          AccountId: 0,
          AccountTransactionDocumentId: 0,
          AccountTransactionId: 0,
          AccountTypeId: 0,
          CompanyCode: 0,
          Credit: 0,
          Date: "",
          Debit: 0,
          Description: "",
          Exchange: 0,
          FinancialYear: "",
          IS_Bill_Active: false,
          IS_Bill_Printed: false,
          Id: 0,
          NVDate: "",
          Name: "",
          NepaliMonth: "",
          Printed_Time: "",
          Real_Time: false,
          Sync_With_IRD: false,
          UserName: "",
          entityLists: "",
          ref_invoice_number: null,
          LedgetBalance: 0,
        },
      ],
    });
  }, []);
  useEffect(() => {
    getAccounts();
    if (loginedUserRole.includes("JournalAdd") && id === "add") {
      return;
    } else if (loginedUserRole.includes("JournalEdit") && id !== "add") {
      getJournalData();
    } else {
      history.push("/journal");
      errorMessage("Sorry! permission is denied");
    }
  }, [id]);

  //for branch
  const updateSelectedFormData = (name: string, value: number | 0) => {
    dispatch(updateBraDataAction({ name: name, value: value }));
    setSelectBranchId({ ...selectbranchId, [name]: value });
  };

  const prepareFinalData = (index?: number) => {
    const Refined = {
      ...data,
      AccountTransactionValues: index
        ? data.AccountTransactionValues.filter((item, i) => i !== index)
        : data.AccountTransactionValues,
      DebitAmount: debitAmount,
      CreditAmount: creditAmount,
      Date: NVDate,
      branchId: selectbranchId.branch,
      UserName: commonDetails.UserName,
      CompanyCode: commonDetails.CompanyCode,
      FinancialYear: commonDetails.FinancialYear,
      drTotal: debitAmount.toString(),
      crTotal: creditAmount.toString(),
    };
    return Refined;
  };

  const validateData = async () => {
    const validDate = await checkDate(NVDate, startDate, endDate);
    if (validDate) {
      if (debitAmount === creditAmount) {
        return true;
      } else {
        errorMessage("Unbalanced Debit Credit");
        return false;
      }
    }
  };

  const handleUdateDataOnDelete = async (index: number) => {
    const newData = prepareFinalData(index);
    await updateJournal(parseInt(id), newData, true);
  };

  const onSubmit = async (e: IOnSubmit) => {
    e.preventDefault();
    const finalData: IVoucher = prepareFinalData();
    const validDate = await validateData();
    if (validDate) {
      if (id === "add") {
        setOpenSaveDialog(true);
        addNewJournal(finalData);
        setData({
          ...InitialJournalData,
          AccountTransactionValues: [
            {
              AccountId: 0,
              AccountTransactionDocumentId: 0,
              AccountTransactionId: 0,
              AccountTypeId: 0,
              CompanyCode: 0,
              Credit: 0,
              Date: "",
              Debit: 0,
              Description: "",
              Exchange: 0,
              FinancialYear: "",
              IS_Bill_Active: false,
              IS_Bill_Printed: false,
              Id: 0,
              NVDate: "",
              Name: "",
              NepaliMonth: "",
              Printed_Time: "",
              Real_Time: false,
              Sync_With_IRD: false,
              UserName: "",
              entityLists: "",
              ref_invoice_number: null,
              LedgetBalance: 0,
            },
          ],
        });
        setNVDate(getNepaliDate());
        setOpenSaveDialog(false);
      } else {
        setOpenSaveDialog(true);
        const response = await updateJournal(parseInt(id), finalData);
        if (response) {
          setOpenSaveDialog(false);
          history.push("/journal");
        }
      }
    }
  };
  const [openDialog, setOpenDialog] = useState(false);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  return (
    <>
      <Paper
        component="form"
        autoComplete="off"
        onSubmit={onSubmit}
        sx={{
          mx: "auto",
          flexGrow: 1,
          py: 1,
          borderRadius: 1,
          boxShadow: 3,
        }}
      >
        <TopContent
          headerName={id === "add" ? "Add journal" : "Edit journal"}
          voucherType={id === "add" ? "Journal" : data.Name}
          NVDate={NVDate}
          setNVDate={setNVDate}
          values={selectbranchId.branch}
          onClickHandler={updateSelectedFormData}
        />
        <JournalForm
          data={data}
          setData={setData}
          debitAmount={debitAmount}
          creditAmount={creditAmount}
          setDebitAmount={setDebitAmount}
          setCreditAmount={setCreditAmount}
          accountList={accountList}
          setAddModalDialog={setOpenDialog}
          handleUdateDataOnDelete={handleUdateDataOnDelete}
        />
      </Paper>
      <AddLedgerComponent
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        refreshFunction={getAccounts}
      />
      <SaveProgressDialog
        openDialog={openSaveDialog}
        setOpenDialog={setOpenSaveDialog}
        name={"Saving ..."}
      />
    </>
  );
};

export default ManageJournal;
