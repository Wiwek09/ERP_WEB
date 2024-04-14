import { IFinancialYear } from "../../../../interfaces/financialYear";
import {
  addFinancial,
  deleteFinancial,
  editFinancial,
} from "../../../../services/financialYearApi";
import {
  deleteMessage,
  editMessage,
  errorMessage,
  successMessage,
} from "../../../../utils/messageBox/Messages";
import { InitialFinancialData } from "../initialState";

export const addNewFinancialYear = async (
  data: IFinancialYear,
  setData: any
) => {
  const response = await addFinancial(data);
  if (response === 1) {
    successMessage();
    setData(InitialFinancialData);
  } else {
    errorMessage();
  }
};

export const updateFinanicial = async (id: string, data: IFinancialYear) => {
  const response = await editFinancial(id, data);
  if (response === 1) {
    editMessage();
    return true;
  } else {
    errorMessage();
    return false;
  }
};

export const _deleteFinancial_ = async (id: string, data: IFinancialYear) => {
  const response = await deleteFinancial(id, data);
  if (response === 1) {
    deleteMessage();
    return true;
  } else {
    errorMessage();
    return false;
  }
};
