import { IUnitType } from "../../../interfaces/unitType";
import {
  addUnitType,
  deleteUnitType,
  editUnitType,
} from "../../../services/unitTypeApi";
import {
  deleteMessage,
  editMessage,
  errorMessage,
  successMessage,
} from "../../../utils/messageBox/Messages";

export const addNewUnitType = async (unitType: IUnitType, setUnitType: any) => {
  const response = await addUnitType(unitType);
  if (response === 1) {
    successMessage();
    setUnitType({ ...unitType, Name: "" });
  } else {
    errorMessage();
  }
};

export const updateUnitType = async (unitType: IUnitType, id: string) => {
  const response = await editUnitType(id, unitType);
  if (response === 1) {
    editMessage();
    return true;
  } else {
    errorMessage();
    return false;
  }
};

export const _deleteUnitType_ = async (id: string) => {
  const response = await deleteUnitType(id);
  if (response === 1) {
    deleteMessage();
    return true;
  } else {
    errorMessage();
    return false;
  }
};
