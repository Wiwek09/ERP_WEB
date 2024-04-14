import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useAppSelector } from "../../../app/hooks";
import { SaveProgressDialog } from "../../../components/dialogBox";
import { IParams } from "../../../interfaces/params";
import { IUnitType } from "../../../interfaces/unitType";
import { getAllUnitType, getUnitType } from "../../../services/unitTypeApi";
import { errorMessage } from "../../../utils/messageBox/Messages";
import SingleInputForm from "../components/SingleInputForm";
import {
  addNewUnitType,
  updateUnitType,
  _deleteUnitType_,
} from "./helperFunctions";

const ManageUnitType = () => {
  const { id }: IParams = useParams();
  const history = useHistory();
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName)
  const [gUnitType, setGUnitType] = useState<IUnitType[]>([]);
  const [unitType, setUnitType] = useState<IUnitType>({
    Id: 0,
    Name: "",
  });
  const [openSaveDialog, setOpenSaveDialog] = useState(false);

  const getData = async () => {
    const response: IUnitType = await getUnitType(id);
    if (response) {
      setUnitType(response);
    }
  };

  const getUnitTypeList = async () => {
    const response = await getAllUnitType();
    setGUnitType(
      response &&
        response.map((unitType: IUnitType) => ({
          Id: unitType.Id,
          Name: unitType.Name
        }))
    );
  };

  useEffect(() => {
    getUnitTypeList();
  }, []);

  useEffect(() => {
    if(loginedUserRole.includes("UTAdd")){
      if (id === "add") {
        return;
      } else {
        getData();
      }
    }else{
      history.push("/unit-type");
      errorMessage("Sorry! permission is denied");
    }
    
  }, [id]);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setOpenSaveDialog(true);
    if (id === "add") {
      if(gUnitType.find((obj:IUnitType) => obj.Name === unitType.Name) || gUnitType.find((obj) => obj.Name.toLowerCase() === unitType.Name)){
        errorMessage(`The name ${unitType.Name} is already used...`);
        setOpenSaveDialog(false);
      }else{
        addNewUnitType(unitType, setUnitType);
        setOpenSaveDialog(false);
      }
    } else {
      const response = await updateUnitType(unitType, id);
      if (response) {
        setOpenSaveDialog(false);
        history.push("/unit-type");
      }
    }
  };

  const deleteUnitType = async () => {
    const response = await _deleteUnitType_(id);
    if (response) {
      history.push("/unit-type");
    }
  };

  return (
    <>
      <SingleInputForm
        headerName="Unit Type"
        data={unitType}
        setData={setUnitType}
        action={id}
        onSubmit={onSubmit}
        deleteFunction={deleteUnitType}
      />
      <SaveProgressDialog
        openDialog={openSaveDialog}
        setOpenDialog={setOpenSaveDialog}
        name={"Saving ..."}
      />
    </>
  );
};

export default ManageUnitType;
