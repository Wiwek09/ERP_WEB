import { IFinancialYear } from "../../interfaces/financialYear";

export const IsDateValidation = (
  currentDate: string,
  financialYear: IFinancialYear
): boolean => {
  if (
    currentDate < financialYear.NepaliStartDate ||
    currentDate > financialYear.NepaliEndDate
  ) {
    return false;
  } else {
    return true;
  }
};