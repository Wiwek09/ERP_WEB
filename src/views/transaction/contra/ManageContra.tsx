import { Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { SaveProgressDialog } from "../../../components/dialogBox";
import { updateBraDataAction } from "../../../features/braSlice";
import { IOnSubmit } from "../../../interfaces/event";
import { IParams } from "../../../interfaces/params";
import { ILedger } from "../../../interfaces/posBiling";
import { IVoucher } from "../../../interfaces/voucher";
import { getContra } from "../../../services/contra";
import { getAllSourceAcount } from "../../../services/sourceAccount";
import { errorMessage } from "../../../utils/messageBox/Messages";
import { getNepaliDate } from "../../../utils/nepaliDate";
import AddLedgerComponent from "../components/AddLedgerComponent";
import { checkDate } from "../components/helperFunctions";
import TopContent from "../components/TopContentComponent";
import ContraForm from "./components/ContraForm";
import { addNewContra, updateContra } from "./components/helperFunction";
import { InitialContraData } from "./components/initialContraData";

const ManageContra = () => {
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
  const [data, setData] = useState<IVoucher>(InitialContraData);
  const [commonDetails, setCommonDetails] = useState({
    UserName: userName,
    CompanyCode: companyId,
    FinancialYear: financial,
  });
  const [debitAmount, setDebitAmount] = useState(0);

  const getPaymentData = async () => {
    const response = await getContra(parseInt(id));
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

  useEffect(() => {
    setData({
      ...InitialContraData,
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
    getSourceAccountList();
    if (loginedUserRole.includes("BankAdd") && id === "add") {
      return;
    } else if (loginedUserRole.includes("BankEdit") && id !== "add") {
      getPaymentData();
    } else {
      history.push("/contra");
      errorMessage("Sorry! permission is denied");
    }
  }, [id]);

  //for branch
  const updateSelectedFormData = (name: string, value: number | 0) => {
    dispatch(updateBraDataAction({ name: name, value: value }));
    setSelectBranchId({ ...selectbranchId, [name]: value });
  };

  const prepareFinalData = (index?: number) => {
    let currentData = {
      Debit: 0,
    };

    if (index) {
      currentData = data.AccountTransactionValues[index];
    }

    const Refined = {
      ...data,

      AccountTransactionValues: index
        ? data.AccountTransactionValues.filter((item, i) => i !== index)
        : data.AccountTransactionValues,
      DebitAmount: index ? debitAmount - currentData?.Debit : debitAmount,
      Amount: index
        ? (debitAmount - currentData?.Debit)?.toString()
        : data.Amount,
      Date: NVDate,
      branchId: selectbranchId.branch,
      UserName: commonDetails.UserName,
      CompanyCode: commonDetails.CompanyCode,
      FinancialYear: commonDetails.FinancialYear,
      drTotal: index
        ? (debitAmount - currentData?.Debit).toString()
        : debitAmount.toString(),
    };
    return Refined;
  };

  const handleUdateDataOnDelete = async (index: number) => {
    const newData = prepareFinalData(index);
    await updateContra(parseInt(id), newData, true);
  };

  const onSubmit = async (e: IOnSubmit) => {
    e.preventDefault();
    const finalData: IVoucher = prepareFinalData();
    const validDate = await checkDate(NVDate, startDate, endDate);
    if (validDate) {
      if (id === "add") {
        setOpenSaveDialog(true);
        addNewContra(finalData);
        setData({
          ...InitialContraData,
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
              FinancialYear: commonDetails.FinancialYear,
              IS_Bill_Active: false,
              IS_Bill_Printed: false,
              Id: 0,
              NVDate: NVDate,
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
        const response = await updateContra(parseInt(id), finalData);
        if (response) {
          setOpenSaveDialog(false);
          history.push("/contra");
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
          headerName={id === "add" ? "Add Cash/Bank" : "Edit Cash/Bank"}
          voucherType={id === "add" ? "Contra" : data.Name}
          NVDate={NVDate}
          setNVDate={setNVDate}
          values={selectbranchId.branch}
          onClickHandler={updateSelectedFormData}
        />
        <ContraForm
          data={data}
          setData={setData}
          debitAmount={debitAmount}
          setDebitAmount={setDebitAmount}
          sourceAccountList={sourceAccountList}
          setAddModalDialog={setOpenDialog}
          handleUdateDataOnDelete={handleUdateDataOnDelete}
        />
      </Paper>
      <AddLedgerComponent
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        refreshFunction={getSourceAccountList}
      />
      <SaveProgressDialog
        openDialog={openSaveDialog}
        setOpenDialog={setOpenSaveDialog}
        name={"Saving ..."}
      />
    </>
  );
};

export default ManageContra;
