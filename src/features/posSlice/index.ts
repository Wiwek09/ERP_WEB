import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

interface IPosStaticData {
  branch: number | null;
  warehouse: number | null;
  department: number | null;
}

type IPosData = {
  data: IPosStaticData;
};

interface IPosIndiv {
  name: string;
  value: number | null;
}

const initialState: IPosData = {
  data: { branch: null, warehouse: null, department: null },
};

export const posData = createSlice({
  name: "postData",
  initialState,
  reducers: {
    updatePosDataAction: (state, action: PayloadAction<IPosIndiv>) => {
      state.data = {
        ...state.data,
        [action.payload.name]: action.payload.value,
      };
    },
    resetPosDataAction: (state) => {
      state.data = initialState.data;
    },
  },
});
export const { updatePosDataAction, resetPosDataAction } = posData.actions;
export const selectPosData = (state: RootState) => state.posData.data;
export default posData.reducer;
