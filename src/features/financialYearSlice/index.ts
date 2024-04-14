import { IFinancialYear } from "../../interfaces/financialYear";
import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

export const initialState: IFinancialYear = {
  Id: 0,
  Name: "",
  NepaliStartDate: "",
  NepaliEndDate: "",
  StartDate: "",
  EndDate: "",
};

export const currentYearSlice = createSlice({
  name: "currentYear",
  initialState,
  reducers: {
    financialYearAction: (state, { payload }) => {
      return (state = payload);
    },
  },
});
export const { financialYearAction } = currentYearSlice.actions;
export const getCurrentFinancialYear = (state: RootState) =>
  state.financialYear;
export default currentYearSlice.reducer;
