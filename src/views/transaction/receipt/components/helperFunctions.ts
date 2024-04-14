import { IVoucher } from "../../../../interfaces/voucher";
import {
  addReceipt,
  deleteReceipt,
  editReceipt,
} from "../../../../services/receipt";
import {
  errorMessage,
  successMessage,
} from "../../../../utils/messageBox/Messages";

export const addNewReceipt = async (data: IVoucher) => {
  const response = await addReceipt(data);
  if (response > 0) {
    successMessage();
  } else {
    errorMessage();
  }
};

export const updateReceipt = async (id: number, data: IVoucher) => {
  const response = await editReceipt(id, data);
  if (response > 0) {
    successMessage();
    return true;
  } else {
    errorMessage();
    return false;
  }
};

export const _deleteReceipt_ = async (id: number, data: IVoucher) => {
  const response = await deleteReceipt(id, data);
  if (response > 0) {
    successMessage();
    return true;
  } else {
    errorMessage();
    return false;
  }
};
