import { useEffect, useState } from "react";
import { InitialState } from "./components/initialState";
import { useHistory, useParams } from "react-router";
import { IParams } from "../../../interfaces/params";
import server from "../../../server/server";
import {
  addMasterLedger,
  editMasterLedger,
  getMasterLedger,
} from "../../../services/masterLedgerAPI";
import FormHeader from "../../../components/headers/formHeader";
import { IOnSubmit } from "../../../interfaces/event";
import LedgerTabs from "./components/tabs";
import {
  editMessage,
  errorMessage,
  successMessage,
} from "../../../utils/messageBox/Messages";
import { useAppSelector } from "../../../app/hooks";
import { SaveProgressDialog } from "../../../components/dialogBox";

const ManageMasterLedger = () => {
  const { id }: IParams = useParams();
  const history = useHistory();
  const [allData, setAllData] = useState(InitialState);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName)
  const loadData = async () => {
    if(loginedUserRole.includes("MLAdd")){
      if (id === "add") {
        setAllData(InitialState);
        return;
      } else {
        const res = await getMasterLedger(id);
        if (res === null || res.length > 1) {
          history.push("/master-ledger");
          errorMessage();
        } else {
          setAllData(res);
        }
      }
    }else{
      history.push("/master-ledger");
      errorMessage("Sorry! permission is denied");
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const onSubmit = async (e: IOnSubmit) => {
    e.preventDefault();
    setOpenSaveDialog(true);
    if (id === "add") {
      const getEnglishDate = await server.get(
        `api/NepaliMonthAPI/NepaliMonthAPI/?NDate=${allData.ExpireMiti}`
      );
      let dataMain = { ...allData };
      if(getEnglishDate.data==null){
        dataMain["ExpireDate"] = "null";
      }else{
      dataMain["ExpireDate"] = getEnglishDate.data.substring(0, 10);
      }
      const res = await addMasterLedger(dataMain);
      if (res === 1) {
        setOpenSaveDialog(false);
        successMessage();
        setAllData(InitialState);
      } else {
        setOpenSaveDialog(false);
        if (res === -1)
        {
          errorMessage(
            `Sorry, this Ledger Master Already Add!`
          );
        }
        errorMessage();
      }
      return;
    } else {
      if(allData.ExpireMiti==null){
        let dataMain = { ...allData };
        dataMain["ExpireDate"] = "null";
        const res = await editMasterLedger(id, dataMain);
        if (res === 1) {
          setOpenSaveDialog(false);
          editMessage();
          history.push("/master-ledger");
        } else {
          setOpenSaveDialog(false);
          if (res === -1)
          {
            errorMessage(
              `Sorry, this Ledger Master Already Add!`
            );
          }
          else
          {
            errorMessage();
          }
        }
        
      }else{
      const getEnglishDate = await server.get(
        `api/NepaliMonthAPI/NepaliMonthAPI/?NDate=${allData.ExpireMiti.substring(
          0,
          10
        ).replaceAll("-", ".")}`
      );
      let dataMain = { ...allData };
    
      dataMain["ExpireDate"] = getEnglishDate.data.substring(0, 10);     

      const res = await editMasterLedger(id, dataMain);
      if (res === 1) {
        setOpenSaveDialog(false);
        editMessage();
        history.push("/master-ledger");
      } else {
        setOpenSaveDialog(false);
        if (res === -1)
        {
          errorMessage(
            `Sorry, this Ledger Master Already Add!`
          );
        }
        else
        {
          errorMessage();
        }
      }
    }
    }
  };
  return (
    <>
      <FormHeader
        headerName={id === "add" ? "Add Ledger" : "Edit Ledger"}
      />
      <LedgerTabs
        onSubmit={onSubmit}
        allData={allData}
        setAllData={setAllData}
        id={id}
      />
      <SaveProgressDialog
        openDialog={openSaveDialog}
        setOpenDialog={setOpenSaveDialog}
        name={"Saving ..."}
      />
    </>
  );
};

export default ManageMasterLedger;
