import { IFinancialYear } from "../../interfaces/financialYear";

export const IsDateVerified = (
  startDate: string,
  endDate: string,
  financialYear: IFinancialYear
): boolean => {
  if (startDate > endDate) {
    return false;
  } else if (
    startDate < financialYear.NepaliStartDate ||
    endDate > financialYear.NepaliEndDate
  ) {
    return false;
  } else {
    return true;
  }
};
