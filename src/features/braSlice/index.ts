import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

interface IPosStaticData {
  branch: number | 0;
}

type IPosData = {
  data: IPosStaticData;
};

interface IPosIndiv {
  name: string;
  value: number | 0;
}

const initialState: IPosData = {
  data: { branch: 0},
};

export const braSlice = createSlice({
  name: "branchData",
  initialState,
  reducers: {
    updateBraDataAction: (state, action: PayloadAction<IPosIndiv>) => {
      state.data = {
        ...state.data,
        [action.payload.name]: action.payload.value,
      };
    },
    resetBraDataAction: (state) => {
      state.data = initialState.data;
    },
  },
});
export const { updateBraDataAction, resetBraDataAction } = braSlice.actions;
export const selectBraData = (state: RootState) => state.branchData.data;
export default braSlice.reducer;
