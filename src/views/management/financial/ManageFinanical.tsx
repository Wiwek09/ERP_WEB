import React, { useEffect, useState } from "react";
import FinancialYearForm from "./components/FinancialYearForm";
import { IFinancialYear } from "../../../interfaces/financialYear";
import FormHeader from "../../../components/headers/formHeader";
import { useHistory, useParams } from "react-router";
import { IParams } from "../../../interfaces/params";
import { getAllFinancialYearApi, getFinancial } from "../../../services/financialYearApi";
import { InitialFinancialData } from "./initialState";
import {
  addNewFinancialYear,
  updateFinanicial,
  _deleteFinancial_,
} from "./components/helperFunctions";
import { errorMessage, successMessage } from "../../../utils/messageBox/Messages";
import { useAppSelector } from "../../../app/hooks";
import { SaveProgressDialog } from "../../../components/dialogBox";

const ManageFinanical = () => {
  const { id }: IParams = useParams();
  const history = useHistory();
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName)
  const [financialYearList, setFinancialYearList] = useState([]);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [finanical, setFinanical] =
    useState<IFinancialYear>(InitialFinancialData);
  const getFinancialData = async () => {
    const response = await getFinancial(id);
    if (response) {
      setFinanical(response);
    } else {
      errorMessage();
    }
  };

  useEffect(() => {
    if(loginedUserRole.includes("FYAdd")){
      if (id === "add") {
        return;
      } else {
        getFinancialData();
      }
    }else{
      history.push("/financial");
      errorMessage("Sorry! permission is denied");
    }
    
  }, [id]);

  const getData = async () => {
    const response = await getAllFinancialYearApi();
    if (response) {
      setFinancialYearList(
        response.map((financial: IFinancialYear) => ({
          Id: financial.Id,
          Name: financial.Name
        }))
      );
    }
    if(financialYearList.find((obj:IFinancialYear) => obj.Name === finanical.Name) || financialYearList.find((obj:IFinancialYear) => obj.Name.toLowerCase() === finanical.Name)){
      errorMessage(`The name ${finanical.Name} is already used...`);
    }
  };

  useEffect(() => {
    getData();
  }, [finanical.Name]);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setOpenSaveDialog(true);
    if (id === "add") {
      addNewFinancialYear(finanical, setFinanical);
      setOpenSaveDialog(false);
      successMessage();
    } else {
      const response = await updateFinanicial(id, finanical);
      if (response) {
        setOpenSaveDialog(false);
        history.push("/financial");
      }
    }
  };

  const deleteFinancial = async () => {
    const response = await _deleteFinancial_(id, finanical);
    if (response) {
      history.push("/financial");
    }
  };

  return (
    <>
      <FormHeader
        headerName={id === "add" ? "Add Financial Year" : "Edit Financial Year"}
        path="/financial"
      />
      <FinancialYearForm
        id={id}
        data={finanical}
        setData={setFinanical}
        onSubmit={onSubmit}
        deleteFunction={deleteFinancial}
      />
      <SaveProgressDialog
        openDialog={openSaveDialog}
        setOpenDialog={setOpenSaveDialog}
        name={"Saving ..."}
      />
    </>
  );
};

export default ManageFinanical;
