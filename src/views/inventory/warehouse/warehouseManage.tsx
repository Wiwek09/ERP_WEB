import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useAppSelector } from "../../../app/hooks";
import { SaveProgressDialog } from "../../../components/dialogBox";
import FormHeader from "../../../components/headers/formHeader";
import { IParams } from "../../../interfaces/params";
import { IWarehouse } from "../../../interfaces/warehouse";
import {
  addWarehouseData,
  editWarehouseData,
  getWarehouseData,
} from "../../../services/warehouseApi";
import {
  editMessage,
  errorMessage,
  successMessage,
} from "../../../utils/messageBox/Messages";
import InputFormWarehouse from "./components/inputForm";

const WarehouseManage = () => {
  const { id }: IParams = useParams();
  const [allData, setAllData] = useState<IWarehouse>({
    Name: "",
    SortOrder: "",
    WareHouseTypeId: 0,
    BranchId: 0,
  });
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName);
  const history = useHistory();

  const setWarehouseData = async () => {
    try {
       const res: IWarehouse = await getWarehouseData(id);
        setAllData(res);
      } catch (error) {
        history.push("/404");
      }
  }
  const loadData = async () => {
    if (id === "add") {
      return;
    } else {
      loginedUserRole.includes("WHEdit")
      ?
        setWarehouseData()  
      :
        errorMessage("Sorry, permission denied.");
        history.push("/warehouse");
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setOpenSaveDialog(true);
    if (id === "add") {
      try {
        const res: IWarehouse = await addWarehouseData(allData);
        if (res) {
          setOpenSaveDialog(false);
          successMessage();
          history.push("/warehouse");
        }
      } catch (error) {
        setOpenSaveDialog(false);
        errorMessage();
      }
    } else {
      try {
        await editWarehouseData(id, allData);
        setOpenSaveDialog(false);
        editMessage();
        history.push("/warehouse");
      } catch (error) {
        setOpenSaveDialog(false);
        errorMessage();
      }
    }
  };
  return (
    <>
      <FormHeader
        headerName={id === "add" ? "Add Warehouse" : "Edit Warehouse"}
      />
      <InputFormWarehouse
        allData={allData}
        setAllData={setAllData}
        onSubmit={onSubmit}
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

export default WarehouseManage;
