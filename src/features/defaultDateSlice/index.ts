import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
interface IDefaultDate {
  StartDate: string;
  EndDate: string;
}

export const initialState: IDefaultDate = {
  StartDate: "",
  EndDate: "",
};

export const defaultDateSlice = createSlice({
  name: "defaultDate",
  initialState,
  reducers: {
    setDefaultDateAction: (state, action: PayloadAction<IDefaultDate>) => {
      return (state = action.payload);
    },
  },
});
export const { setDefaultDateAction } = defaultDateSlice.actions;
export const getDefaultDate = (state: RootState) => state.financialYear;
export default defaultDateSlice.reducer;
