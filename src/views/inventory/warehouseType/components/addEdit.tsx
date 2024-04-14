import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import AddEditForm from "./addEditForm";
import {
  editMessage,
  errorMessage,
  successMessage,
} from "../../../../utils/messageBox/Messages";
import FormHeader from "../../../../components/headers/formHeader";
import { IParams } from "../../../../interfaces/params";
import {
  addWarehouseType,
  editWarehouseType,
  getAllWarehouseTypes,
  getWarehouseType,
} from "../../../../services/warehouseTypeApi";
import { useAppSelector } from "../../../../app/hooks";
import { SaveProgressDialog } from "../../../../components/dialogBox";

export interface IWarehouseType {
  Id: number;
  Name: string;
}

const AddEdit = () => {
  const history = useHistory();
  const { id }: IParams = useParams();
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName)
  const [warehouseTypes, setWarehouseTypes] = useState([]);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [data, setData] = useState<IWarehouseType>({
    Id: 0,
    Name: "",
  });
  const getData = async () => {
    if(loginedUserRole.includes("WHTAdd")){
      if (id === "add") {
        return;
      } else {
        try {
          const response = await getWarehouseType(id);
          setData(response);
        } catch (error) {
          errorMessage();
          history.push("/warehouse-type");
        }
      }
    }else{
      history.push("/warehouse-type");
      errorMessage("Sorry! permission is denied");
    }
    
  };

  const getAllWarehouseData = async () => {
    const datas: any = await getAllWarehouseTypes();
    if (datas) {
      let warehouseTypeData: any = [];
      datas.forEach((element: any, index: any) => {
        warehouseTypeData.push({
          Id: element.Id,
          Name: element.Name,
        });
      });
      setWarehouseTypes(warehouseTypeData);
    }
  };

  useEffect(() => {
    getData();
    getAllWarehouseData();
  }, [id]);

  const addNewWarehouseType = async () => {
    const response = await addWarehouseType(data);
    if (response === 1) {
      setOpenSaveDialog(false);
      history.push("/warehouse-types");
      successMessage();
    } else {
      setOpenSaveDialog(false);
      errorMessage();
    }
  };

  const updateWarehouseType = async () => {
    const response: any = await editWarehouseType(id, {
      Id: id,
      Name: data.Name,
    });
    if (response === 1) {
      setOpenSaveDialog(false);
      editMessage();
      history.push("/warehouse-types");
    } else {
      setOpenSaveDialog(false);
      errorMessage();
    }
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setOpenSaveDialog(true);
    if (id === "add") {
      if(warehouseTypes.find((obj:any) => obj.Name === data.Name) || warehouseTypes.find((obj:any) => obj.Name.toLowerCase() === data.Name)){
        setOpenSaveDialog(false);
        errorMessage(`The name ${data.Name} is already used...`);
      }else{
        addNewWarehouseType();
      }
    } else {
      updateWarehouseType();
    }
  };

  return (
    <>
      <FormHeader
        headerName={id === "add" ? "Add Warehouse type" : "Edit Warehouse type"}
      />
      <AddEditForm onSubmit={onSubmit} data={data} setData={setData} id={id} />
      <SaveProgressDialog
        openDialog={openSaveDialog}
        setOpenDialog={setOpenSaveDialog}
        name={"Saving ..."}
      />
    </>
  );
};

export default AddEdit;
