import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

interface IOrMgStaticData {
  DepartmentId: number | 0;
  WareHouseId: number | 0;
  BranchId: number | 0;
}

type IOrMgData = {
  data: IOrMgStaticData;
};

interface IOrMgIndiv {
  name: string;
  value: number | 0;
}

const initialState: IOrMgData = {
  data: { BranchId: 0, WareHouseId: 0, DepartmentId: 0 },
};

export const ormgSlice = createSlice({
  name: "invData",
  initialState,
  reducers: {
    updateOrMgDataAction: (state, action: PayloadAction<IOrMgIndiv>) => {
      state.data = {
        ...state.data,
        [action.payload.name]: action.payload.value,
      };
    },
    resetOrMgDataAction: (state) => {
      state.data = initialState.data;
    },
  },
});
export const { updateOrMgDataAction, resetOrMgDataAction } = ormgSlice.actions;
export const selectOrMgData = (state: RootState) => state.ormgData.data;
export default ormgSlice.reducer;
