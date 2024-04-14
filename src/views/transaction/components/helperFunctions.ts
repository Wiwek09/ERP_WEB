import { getEnglishDate } from "../../../services/getEnglishDate";
import { errorMessage } from "../../../utils/messageBox/Messages";

export const AddData = (list: any[], initialvalue: number): number => {
  const sum = list.reduce((amt: number, pValue: any) => {
    return amt + parseInt(pValue.Debit);
  }, initialvalue);
  return sum;
};

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
