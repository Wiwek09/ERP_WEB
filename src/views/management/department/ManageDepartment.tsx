import FormHeader from "../../../components/headers/formHeader";
import { useHistory, useParams } from "react-router";
import { IDepartment } from "../../../interfaces/department";
import { useEffect, useState } from "react";
import {
  addDepartment,
  deleteDepartment,
  getDepartment,
  updateDepartment,
} from "../../../services/departmentApi";
import { toast } from "react-toastify";
import { IOnChange, IOnSubmit } from "../../../interfaces/event";
import DepartmentForm from "./components/DepartmentForm";
import { errorMessage } from "../../../utils/messageBox/Messages";
import { useAppSelector } from "../../../app/hooks";
import { PermissionDialog } from "../../../components/dialogBox";

interface IParams {
  id: string;
}

const getInitialDepartmentData = () => {
  const data: IDepartment = {
    Id: 0,
    Name: "",
    SortOrder: 0,
    UserString: "",
    PriceTag: "",
    WarehouseId: 0,
    TicketTypeId: 0,
    DepartmentTypeId: 0,
    ScreenMenuId: 0,
    TicketCreationMethod: 0,
  };
  return data;
};

const ManageDepartment = () => {
  const history = useHistory();
  const { id }: IParams = useParams();
  const [department, setDepartment] = useState<IDepartment>(
    getInitialDepartmentData()
  );
  const [showDeleteModal, setShowDeleteModel] = useState<boolean>(false);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName);

  const setDepartmentData = async () => {
    try {
      const response: IDepartment = await getDepartment(id);
      setDepartment(response);
    } catch (error: any) {
      errorMessage(`Invalid department id (${id})`);
      history.push("/department");
    }
  };

  useEffect(() => {
    if (id !== "add"){
        loginedUserRole.includes("DeEdit")
        ?
          setDepartmentData()
        :
          errorMessage("Sorry, permission denied.");
          history.push("/department");
      } else {
      setDepartment(getInitialDepartmentData());
    }
  }, []);

  const updateDepartmentField = (e: IOnChange) => {
    setDepartment({ ...department, [e.target.name]: e.target.value });
  };

  const addNewDepartment = async (e: IOnSubmit) => {
    e.preventDefault();
    try {
      await addDepartment(department);
      toast.success("Successfully added.");
    } catch (error) {
      toast.error("Opeation failed.");
    }
  };

  const updateDepartmentData = async (e: IOnSubmit) => {
    e.preventDefault();
    try {
      await updateDepartment(id, department);
      toast.success("Successfully updated.");
      history.push("/department");
    } catch (error) {
      toast.error("Operation failed.");
    }
  };

  const deleteDepartmentData = async () => {
    try {
      await deleteDepartment(id, department);
      toast.success("Operation successful.");
      history.push("/department");
    } catch (error) {
      toast.error("Opeation failed. Please try again later.");
    }
  };

  return (
    <>
      <FormHeader
        headerName={id === "add" ? "Add department" : "Edit department"}
      />
      <DepartmentForm
        actionType={id}
        department={department}
        updateDepartmentField={updateDepartmentField}
        addDepartment={addNewDepartment}
        updateDepartment={updateDepartmentData}
        deleteDepartment={deleteDepartmentData}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModel}
      />
    </>
  );
};

export default ManageDepartment;
