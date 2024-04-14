import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

interface IPurOrStaticData {
  DepartmentId: number | 0;
  WareHouseId: number | 0;
  BranchId: number | 0;
}

type IPurOrData = {
  data: IPurOrStaticData;
};

interface IPurOrIndiv {
  name: string;
  value: number | 0;
}

const initialState: IPurOrData = {
  data: { BranchId: 0, WareHouseId: 0, DepartmentId: 0 },
};

export const purorSlice = createSlice({
  name: "purordata",
  initialState,
  reducers: {
    updatePurOrDataAction: (state, action: PayloadAction<IPurOrIndiv>) => {
      state.data = {
        ...state.data,
        [action.payload.name]: action.payload.value,
      };
    },
    resetPurOrDataAction: (state) => {
      state.data = initialState.data;
    },
  },
});
export const { updatePurOrDataAction, resetPurOrDataAction } = purorSlice.actions;
export const selectPurOrData = (state: RootState) => state.purorData.data;
export default purorSlice.reducer;
