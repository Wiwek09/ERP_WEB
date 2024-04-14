import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { IOnSubmit } from "../../../interfaces/event";
import { IParams } from "../../../interfaces/params";
import { IUserRolesAssign } from "../../../interfaces/roles";
import {
  getAssignRole,
  updateAssignRole,
} from "../../../services/assignRolesApi";
import { editMessage, errorMessage } from "../../../utils/messageBox/Messages";
import { InitialState } from "./components/initialState";
import InputForm from "./components/inputFields";

const AssignRoleManage = () => {
  const { id }: IParams = useParams();
  const [assignRole, setAssignRole] = useState<IUserRolesAssign>(InitialState);
  const history = useHistory();
  const loadData = async () => {
    const res = await getAssignRole(id);
    if (res) {
      setAssignRole({
        FullName: res.FullName,
        Id: res.Id,
        RoleName: res.RoleName,
      });
    } else {
      errorMessage();
      history.push("/assign-roles");
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const updateRole = async (e: IOnSubmit) => {
    e.preventDefault();
    const res = await updateAssignRole(id, assignRole.RoleName);

    if (res === 1) {
      editMessage();
      history.push("/assign-roles");
    } else {
      errorMessage();
      history.push("/assign-roles");
    }
  };
  return (
    <>
      <InputForm
        assignRole={assignRole}
        setAssignRole={setAssignRole}
        updateRole={updateRole}
      />
    </>
  );
};

export default AssignRoleManage;
