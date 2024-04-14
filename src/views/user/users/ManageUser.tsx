import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import FormHeader from "../../../components/headers/formHeader";
import InputFormUser from "./components/InputFormUser";
import { IUser } from "../../../interfaces/user";
import { getAllUsers, getUserApi } from "../../../services/userApi";
import {
  addNewUser,
  updateUser,
  validPassword,
} from "./components/helperFuncrions";
import { InitialUserData } from "./components/initialState";
import { toast } from "react-toastify";
import { IParams } from "../../../interfaces/params";
import { useAppSelector } from "../../../app/hooks";
import { errorMessage } from "../../../utils/messageBox/Messages";
import { SaveProgressDialog } from "../../../components/dialogBox";

interface IaddedOne {
  Id: string;
  UserName: string;
}

const ManageUser = () => {
  const history = useHistory();
  const { id }: IParams = useParams();
  const [userData, setUserData] = useState<IUser>(InitialUserData);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const loginedUserRole = useAppSelector((state) => state.user.data.RoleName);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [users, setUsers] = useState<IaddedOne[]>([]);
  const getUserData = async () => {
    const response = await getUserApi(id);
    if (response) {
      setUserData(response);
    } else {
      history.push("/404");
    }
  };

  useEffect(() => {
    if (loginedUserRole.includes("UserAdd")) {
      if (id === "add") {
        setUserData({
          ...InitialUserData,
          UserName: "",
          Password: "",
        });
        return;
      } else {
        getUserData();
      }
    } else {
      history.push("/users");
      errorMessage("Sorry! permission is denied");
    }
  }, [id]);

  const getUsers = async () => {
    const response = await getAllUsers();
    setUsers(
      response &&
        response.map((user: IaddedOne) => {
          return {
            Id: user.Id,
            UserName: user.UserName,
          };
        })
    );
  };
  useEffect(() => {
    getUsers();
  }, []);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setOpenSaveDialog(true);
    if (!validPassword(userData.Password, confirmPassword)) {
      setOpenSaveDialog(false);
      toast.error("Invalid password");
    } else {
      if (id === "add") {
        if (
          users.find((obj: IaddedOne) => obj.UserName === userData.UserName) ||
          users.find(
            (obj: IaddedOne) => obj.UserName.toLowerCase() === userData.UserName
          )
        ) {
          setOpenSaveDialog(false);
          errorMessage(`The name ${userData.UserName} is already used...`);
        } else {
          setOpenSaveDialog(false);
          addNewUser(userData, setUserData);
          setConfirmPassword("");
        }
      } else {
        const response = await updateUser(id, userData);
        if (response) {
          setOpenSaveDialog(false);
          history.push("/users");
        }
      }
    }
  };

  return (
    <>
      <FormHeader
        headerName={id === "add" ? "Add User" : "Edit User"}
        path="/users"
      />
      <InputFormUser
        onSubmit={onSubmit}
        userData={userData}
        setUserData={setUserData}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
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

export default ManageUser;
