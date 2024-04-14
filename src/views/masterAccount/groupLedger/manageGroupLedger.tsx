import { useEffect, useState } from "react";
import { Paper } from "@mui/material";
import { useHistory, useParams } from "react-router";
import { IParams } from "../../../interfaces/params";
import {
  addUnderLedger,
  editUnderLedger,
} from "../../../services/groupLedgerApi";
import FormHeader from "../../../components/headers/formHeader";
import InputForm from "./components/inputFields";
import server from "../../../server/server";
import { InitialState } from "./components/initialState";
import { IOnSubmit } from "../../../interfaces/event";
import {
  editMessage,
  errorMessage,
  successMessage,
} from "../../../utils/messageBox/Messages";
import { SaveProgressDialog } from "../../../components/dialogBox";

const ManageGroupLedger = () => {
  const { id }: IParams = useParams();
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [allData, setAllData] = useState(InitialState);
  const history = useHistory();
  const loadData = async () => {
    if (id === "add") {
      return;
    } else {
      await server
        .get(`/api/AccountTypeAPI/?Id=${id}`)
        .then((res: any) => {
          if (res.data) {
            setAllData(res.data);
            return;
          } else {
            errorMessage();
            history.push("/group-ledger");
          }
        })
        .catch((err: any) => {
          errorMessage();
          history.push("/group-ledger");
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
      const res = await addUnderLedger(allData);
      if (res === 1) {
        setOpenSaveDialog(false);
        setAllData(InitialState);
        successMessage();
        return;
      } else {
        setOpenSaveDialog(false);
        errorMessage();
      }
      return;
    } else {
      const res = await editUnderLedger(id, allData);
      if (res === 1) {
        setOpenSaveDialog(false);
        editMessage();
        history.push("/group-ledger");
        return;
      } else {
        setOpenSaveDialog(false);
        history.push("/group-ledger");
        errorMessage();
      }
    }
  };

  return (
    <>
      <FormHeader
        headerName={id === "add" ? "Add Group Ledger" : "Edit Group Ledger"}
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

export default ManageGroupLedger;
