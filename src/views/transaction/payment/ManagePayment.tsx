import { Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { SaveProgressDialog } from "../../../components/dialogBox";
import { updateBraDataAction } from "../../../features/braSlice";
import { IOnSubmit } from "../../../interfaces/event";
import { IParams } from "../../../interfaces/params";
import { ILedger } from "../../../interfaces/posBiling";
import { IVoucher } from "../../../interfaces/voucher";
import { getAllMasterLedger } from "../../../services/masterLedgerAPI";
import { getPayment } from "../../../services/payment";
import { getAllSourceAcount } from "../../../services/sourceAccount";
import { errorMessage } from "../../../utils/messageBox/Messages";
import { getNepaliDate } from "../../../utils/nepaliDate";
import AddLedgerComponent from "../components/AddLedgerComponent";
import { checkDate } from "../components/helperFunctions";
import TopContent from "../components/TopContentComponent";
import { addNewPayment, updatePayment } from "./components/helperFunctions";
import { InitialPaymentData } from "./components/initialPaymentData";
import PaymentForm from "./components/PaymentForm";

const ManagePayment = () => {
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
  const [branchId, setBranchId] = useState(0);
  const [NVDate, setNVDate] = useState(getNepaliDate());
  const [data, setData] = useState<IVoucher>(InitialPaymentData);
  const [commonDetails, setCommonDetails] = useState({
    UserName: userName,
    CompanyCode: companyId,
    FinancialYear: financial,
  });
  const [debitAmount, setDebitAmount] = useState(0);

  const getPaymentData = async () => {
    const response = await getPayment(parseInt(id));
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
      setDebitAmount(response.DebitAmount);
    } else {
      errorMessage("404 error");
    }
  };

  const [sourceAccountList, setSourceAccountList] = useState<any>([]);
  const getSourceAccountList = async () => {
    const response = await getAllSourceAcount();
    setSourceAccountList(
      response.map((item: ILedger) => ({
        label: item.Name,
        value: item.Id,
      }))
    );
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
      ...InitialPaymentData,
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
    getSourceAccountList();
    if (loginedUserRole.includes("PaymentAdd") && id === "add") {
      return;
    } else if (loginedUserRole.includes("PaymentEdit") && id !== "add") {
      getPaymentData();
    } else {
      history.push("/payment");
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
        ? data?.AccountTransactionValues.filter((item, i) => i !== index)
        : data?.AccountTransactionValues,
      DebitAmount: debitAmount,
      Date: NVDate,
      branchId: selectbranchId.branch,
      UserName: commonDetails.UserName,
      CompanyCode: commonDetails.CompanyCode,
      FinancialYear: commonDetails.FinancialYear,
      drTotal: debitAmount.toString(),
    };
    return Refined;
  };

  const handleUdateDataOnDelete = async (index: number) => {
    const newData = prepareFinalData(index);
    await updatePayment(parseInt(id), newData, true);
  };

  const onSubmit = async (e: IOnSubmit) => {
    e.preventDefault();
    const finalData: IVoucher = prepareFinalData();
    const validDate = await checkDate(NVDate, startDate, endDate);
    if (validDate) {
      if (id === "add") {
        setOpenSaveDialog(true);
        addNewPayment(finalData);
        setData({
          ...InitialPaymentData,
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
        setOpenSaveDialog(false);
        setNVDate(getNepaliDate());
      } else {
        setOpenSaveDialog(true);
        const response = await updatePayment(parseInt(id), finalData);
        if (response) {
          setOpenSaveDialog(false);
          history.push("/payment");
        }
      }
    }
  };
  const [openDialog, setOpenDialog] = useState(false);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  return (
    <>
      <Paper component="form" autoComplete="off" onSubmit={onSubmit}>
        <TopContent
          headerName={id === "add" ? "Add Payment" : "Edit payment"}
          voucherType={id === "add" ? "Payment" : data.Name}
          NVDate={NVDate}
          setNVDate={setNVDate}
          values={selectbranchId.branch}
          onClickHandler={updateSelectedFormData}
        />
        <PaymentForm
          data={data}
          setData={setData}
          debitAmount={debitAmount}
          setDebitAmount={setDebitAmount}
          accountList={accountList}
          sourceAccountList={sourceAccountList}
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

export default ManagePayment;
