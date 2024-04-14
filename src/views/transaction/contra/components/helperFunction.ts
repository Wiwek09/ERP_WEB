import { IVoucher } from "../../../../interfaces/voucher";
import {
  addContra,
  deleteContra,
  editContra,
} from "../../../../services/contra";
import {
  errorMessage,
  successMessage,
} from "../../../../utils/messageBox/Messages";

export const addNewContra = async (data: IVoucher) => {
  const response = await addContra(data);
  if (response > 0) {
    successMessage();
  } else {
    errorMessage();
  }
};

export const updateContra = async (
  id: number,
  data: IVoucher,
  hideMessage?: boolean
) => {
  const response = await editContra(id, data);
  if (!hideMessage) {
    if (response > 0) {
      successMessage();
      return true;
    } else {
      errorMessage();
      return false;
    }
  }
};

export const _deleteContra_ = async (id: number, data: IVoucher) => {
  const response = await deleteContra(id, data);
  if (response > 0) {
    successMessage();
    return true;
  } else {
    errorMessage();
    return false;
  }
};
