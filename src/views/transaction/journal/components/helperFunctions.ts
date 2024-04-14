import { IVoucher } from "../../../../interfaces/voucher";
import { getEnglishDate } from "../../../../services/getEnglishDate";
import {
  addJournal,
  deleteJournal,
  editJournal,
} from "../../../../services/journalApi";
import {
  editMessage,
  errorMessage,
  successMessage,
} from "../../../../utils/messageBox/Messages";

export const checkDate = async (
  Ndate: string,
  startDate: any,
  endDate: any
) => {
  // const response: Date = await getEnglishDate(Ndate);
  // if (response) {
  if (Ndate < startDate || Ndate > endDate) {
    errorMessage("Date is out of financial year");
    return false;
  } else {
    return true;
  }
  // }
};

export const addNewJournal = async (data: IVoucher) => {
  const response = await addJournal(data);
  if (response > 0) {
    successMessage();
  } else {
    errorMessage();
  }
};

export const updateJournal = async (
  id: number,
  data: IVoucher,
  hideMessage?: boolean
) => {
  const response = await editJournal(id, data);
  if (!hideMessage) {
    if (response > 0) {
      editMessage();
      return true;
    } else {
      errorMessage("Someting went wrong on updation");
      return false;
    }
  }
};

export const _deleteJournal_ = async (id: number, data: IVoucher) => {
  const response = await deleteJournal(id, data);
  if (response > 0) {
    errorMessage("Journal deleted successfullt");
    return true;
  } else {
    errorMessage("something went wrong");
    return false;
  }
};
