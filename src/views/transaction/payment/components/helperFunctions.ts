import { IVoucher } from "../../../../interfaces/voucher";
import {
  addPayment,
  deletePayment,
  editPayment,
} from "../../../../services/payment";
import {
  errorMessage,
  successMessage,
} from "../../../../utils/messageBox/Messages";

export const addNewPayment = async (data: IVoucher) => {
  const response = await addPayment(data);
  if (response > 0) {
    successMessage();
  } else {
    errorMessage();
  }
};

export const updatePayment = async (
  id: number,
  data: IVoucher,
  hideMessage?: boolean
) => {
  const response = await editPayment(id, data);
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

export const _deletePayment_ = async (id: number, data: IVoucher) => {
  const response = await deletePayment(id, data);
  if (response > 0) {
    successMessage();
    return true;
  } else {
    errorMessage();
    return false;
  }
};
