import { Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { SaveProgressDialog } from "../../../components/dialogBox";
import FormHeader from "../../../components/headers/formHeader";
import { IOnSubmit } from "../../../interfaces/event";
import { IParams } from "../../../interfaces/params";
import { ITransactionType } from "../../../interfaces/transactionType";
import server from "../../../server/server";
import {
  addTransactionType,
  editTransactionType,
} from "../../../services/transactionTypeApi";
import {
  editMessage,
  errorMessage,
  successMessage,
} from "../../../utils/messageBox/Messages";
import InputForm from "./components/inputForms";

const ManageTt = () => {
  const [allData, setAllData] = useState<ITransactionType>({
    Name: "",
    SourceAccountTypeId: 0,
    TargetAccountTypeId: 0,
    DefaultSourceAccountId: 0,
    DefaultTargetAccountId: 0,
  });
  const { id }: IParams = useParams();
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const history = useHistory();
  const loadData = async () => {
    if (id === "add") {
      return;
    } else {
      await server
        .get(`/api/AccountTransactionTypeAPI/?Id=${id}`)
        .then((res) => {
          if (res.data) {
            setAllData(res.data);
            return;
          } else {
            errorMessage();
            history.push("/transaction-type");
          }
        })
        .catch((err) => {
          errorMessage();
          history.push("/transaction-type");
        });
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const onSubmit = async (e: IOnSubmit) => {
    e.preventDefault();
    setOpenSaveDialog(true);
    if (id === "add") {
      const res = await addTransactionType(allData);
      setAllData({
        Name: "",
        SourceAccountTypeId: 0,
        TargetAccountTypeId: 0,
        DefaultSourceAccountId: 0,
        DefaultTargetAccountId: 0,
      });
      if (res === 1) {
        setOpenSaveDialog(false);
        successMessage();
      } else {
        setOpenSaveDialog(false);
        errorMessage();
      }
    } else {
      const res = await editTransactionType(id, allData);
      if (res === 1) {
        setOpenSaveDialog(false);
        editMessage();
        history.push("/transaction-type");
      } else {
        setOpenSaveDialog(false);
        errorMessage();
      }
    }
  };
  return (
    <>
      <FormHeader
        headerName={
          id === "add" ? "Add Transaction Type" : "Edit Transaction Type"
        }
      />
      <Paper
        component="form"
        autoComplete="off"
        onSubmit={onSubmit}
        sx={{
          py: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          "& > :not(style)": { m: 1 },
        }}
      >
        <InputForm allData={allData} setAllData={setAllData} id={id} />
      </Paper>
      <SaveProgressDialog
        openDialog={openSaveDialog}
        setOpenDialog={setOpenSaveDialog}
        name={"Saving ..."}
      />
    </>
  );
};

export default ManageTt;
