import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

interface IQuoStaticData {
  DepartmentId: number | 0;
  WareHouseId: number | 0;
  BranchId: number | 0;
}

type IQuoData = {
  data: IQuoStaticData;
};

interface IQuoIndiv {
  name: string;
  value: number | 0;
}

const initialState: IQuoData = {
  data: { BranchId: 0, WareHouseId: 0, DepartmentId: 0 },
};

export const quoSlice = createSlice({
  name: "quodata",
  initialState,
  reducers: {
    updateQuoDataAction: (state, action: PayloadAction<IQuoIndiv>) => {
      state.data = {
        ...state.data,
        [action.payload.name]: action.payload.value,
      };
    },
    resetQuoDataAction: (state) => {
      state.data = initialState.data;
    },
  },
});
export const { updateQuoDataAction, resetQuoDataAction } = quoSlice.actions;
export const selectQuoData = (state: RootState) => state.quoData.data;
export default quoSlice.reducer;
