import { IUser } from "../../../../interfaces/user";
import { addUser, editUser } from "../../../../services/userApi";
import {
  editMessage,
  errorMessage,
  successMessage,
} from "../../../../utils/messageBox/Messages";
import { InitialUserData } from "./initialState";

export const validPassword = (Password: string, cPassword: string) => {
  if (Password.length < 6) {
    return false;
  } else if (Password !== cPassword) {
    return false;
  } else {
    return true;
  }
};

export const addNewUser = async (data: IUser, setUserData: any) => {
  try {
    const response = await addUser(data);
    if (response) {
      setUserData(InitialUserData);
      successMessage();
    } else {
      errorMessage();
      setUserData(InitialUserData);
    }
  } catch {
    errorMessage();
  }
};

export const updateUser = async (id: string, data: IUser) => {
  try {
    const response = await editUser(id, data);
    if (response) {
      editMessage();
      return true;
    } else {
      errorMessage();
    }
  } catch {
    errorMessage();
  }
};
