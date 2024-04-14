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
import { getAllMasterLedger } from "../../../services/masterLedgerAPI";
import { getReceipt } from "../../../services/receipt";
import { getAllSourceAcount } from "../../../services/sourceAccount";
import { errorMessage } from "../../../utils/messageBox/Messages";
import { getNepaliDate } from "../../../utils/nepaliDate";
import AddLedgerComponent from "../components/AddLedgerComponent";
import { checkDate } from "../components/helperFunctions";
import TopContent from "../components/TopContentComponent";
import { addNewReceipt, updateReceipt } from "./components/helperFunctions";
import ReceiptForm from "./components/ReceiptForm";
import { InitialReceiptData } from "./initialReceiptData";

const ManageReceipt = () => {
  const companyId = useAppSelector((state) => state.company.data.Id);
  const userName = useAppSelector((state) => state.user.data.UserName);
  const financial = useAppSelector((state) => state.financialYear.Name);
  const startDate = useAppSelector(
    (state) => state.financialYear.NepaliStartDate
  );
  const endDate = useAppSelector((state) => state.financialYear.NepaliEndDate);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName);
  const { id }: IParams = useParams();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [NVDate, setNVDate] = useState(getNepaliDate());
  const [branchId, setBranchId] = useState(0);
  //added
  const branch = useAppSelector((state) => state.branchData.data);
  const [selectbranchId, setSelectBranchId] = useState({ ...branch });

  const [data, setData] = useState<IVoucher>(InitialReceiptData);
  const [commonDetails, setCommonDetails] = useState({
    UserName: userName,
    CompanyCode: companyId,
    FinancialYear: financial,
  });
  const [creditAmount, setCreditAmount] = useState(0);
  const getReceiptData = async () => {
    const response = await getReceipt(parseInt(id));
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
      setCreditAmount(response.CreditAmount);
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
      ...InitialReceiptData,
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
    if (loginedUserRole.includes("ReceiptAdd") && id === "add") {
      return;
    } else if (loginedUserRole.includes("ReceiptEdit") && id !== "add") {
      getReceiptData();
    } else {
      history.push("/receipt");
      errorMessage("Sorry! permission is denied");
    }
  }, [id]);
  //for branch
  const updateSelectedFormData = (name: string, value: number | 0) => {
    dispatch(updateBraDataAction({ name: "branch", value: value }));
    setSelectBranchId({ ...selectbranchId, ["branch"]: value });
  };

  const prepareFinalData = (index?: number) => {
    const Refined = {
      ...data,
      DebitAmount: creditAmount,
      Date: NVDate,
      AccountTransactionValues: index
        ? data?.AccountTransactionValues.filter((item, i) => i !== index)
        : data?.AccountTransactionValues,
      branchId: selectbranchId.branch,
      UserName: commonDetails.UserName,
      CompanyCode: commonDetails.CompanyCode,
      FinancialYear: commonDetails.FinancialYear,
      drTotal: creditAmount.toString(),
    };
    return Refined;
  };

  const handleUdateDataOnDelete = async (index: number) => {
    const newData = prepareFinalData(index);
    await updateReceipt(parseInt(id), newData);
  };

  const onSubmit = async (e: IOnSubmit) => {
    e.preventDefault();
    const finalData: IVoucher = prepareFinalData();
    const validDate = await checkDate(NVDate, startDate, endDate);
    if (validDate) {
      if (id === "add") {
        setOpenSaveDialog(true);
        addNewReceipt(finalData);
        setData({
          ...InitialReceiptData,
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
        const response = await updateReceipt(parseInt(id), finalData);
        if (response) {
          setOpenSaveDialog(false);
          history.push("/receipt");
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
          headerName={id === "add" ? "Add Receipt" : "Edit Receipt"}
          voucherType={id === "add" ? "Receipt" : data.Name}
          NVDate={NVDate}
          setNVDate={setNVDate}
          values={selectbranchId.branch}
          onClickHandler={updateSelectedFormData}
        />
        <ReceiptForm
          data={data}
          setData={setData}
          creditAmount={creditAmount}
          setCreditAmount={setCreditAmount}
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

export default ManageReceipt;
