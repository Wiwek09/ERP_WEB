import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useAppSelector } from "../../../app/hooks";
import { SaveProgressDialog } from "../../../components/dialogBox";
import FormHeader from "../../../components/headers/formHeader";
import { IOnSubmit } from "../../../interfaces/event";
import { IParams } from "../../../interfaces/params";
import { IPermissonList, IUserRole } from "../../../interfaces/userRoles";
import {
  addRoles,
  editRoles,
  getAllRoles,
  getRole,
} from "../../../services/userRoleApi";
import {
  editMessage,
  errorMessage,
  successMessage,
} from "../../../utils/messageBox/Messages";
import { InitialState } from "./components/initialState";
import InputForm from "./components/inputFields";

interface IUserRoles {
  Id: number;
  Name: string;
}

const RolesManage = () => {
  const { id }: IParams = useParams();
  const history = useHistory();

  const [allData, setAllData] = useState<IPermissonList | any>(InitialState);
  const [getAllData, setGetAllData] = useState<IUserRoles[]>([]);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName);

  const loadData = async () => {
    if (loginedUserRole.includes("RoleAdd")) {
      if (id === "add") {
        return;
      } else {
        const res: IUserRole = await getRole(id);
        if (res) {
          let list: any = { ...allData };
          const string = res.PermissionList;
          const usingSplit = string.split(",");

          usingSplit.filter((elm: string) => {
            for (const data in allData) {
              if (elm === data) {
                list["Name"] = res.Name;
                list["Description"] = res.Description;
                list[elm] = true;
              }
            }
          });

          setAllData(list);
        } else {
          history.push("/user-roles");
        }
      }
    } else {
      history.push("/user-roles");
      errorMessage("Sorry! permission is denied");
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    const getRols = async () => {
      const res: IUserRoles[] = await getAllRoles();
      setGetAllData(
        res &&
          res.map((elm: IUserRoles) => {
            return {
              Id: elm.Id,
              Name: elm.Name,
            };
          })
      );
    };
    getRols();
  }, []);

  const onSubmit = async (e: IOnSubmit) => {
    e.preventDefault();
    setOpenSaveDialog(true);
    let checkboxCollection = [];
    for (var key in allData) {
      if (allData[key] === true) {
        checkboxCollection.push(key);
      }
    }
    let ifChecked = {
      checkbox: checkboxCollection.toString(),
    };

    if (ifChecked.checkbox === "") {
      setOpenSaveDialog(false);
      errorMessage("Select At least one roles");
      return;
    } else {
      let data: any = {};
      data["PermissionList"] = ifChecked.checkbox;
      data["Name"] = allData.Name;
      data["Description"] = allData.Description;
      if (id === "add") {
        if (
          getAllData.find((obj: IUserRoles) => obj.Name === allData.Name) ||
          getAllData.find(
            (obj: IUserRoles) => obj.Name.toLowerCase() === allData.Name
          )
        ) {
          setOpenSaveDialog(false);
          errorMessage(`The name ${allData.Name} is already used...`);
        } else {
          const res = await addRoles(data);
          if (res === 1) {
            setOpenSaveDialog(false);
            successMessage();
            history.push("/user-roles");
          } else {
            setOpenSaveDialog(false);
            errorMessage();
          }
        }
      } else {
        const res2 = await editRoles(id, data);
        if (res2 === 1) {
          setOpenSaveDialog(false);
          editMessage();
          history.push("/user-roles");
        } else {
          setOpenSaveDialog(false);
          errorMessage();
        }
      }
    }
  };

  return (
    <>
      <FormHeader
        headerName={id === "add" ? "Add User Roles" : "Edit User Roles"}
        path="/user-roles"
      />

      <InputForm
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

export default RolesManage;
