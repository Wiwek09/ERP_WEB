import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

interface IPurStaticData {
  branch: number | 0;
  warehouse: number | 0;
  department: number | 0;
}

type IPurData = {
  data: IPurStaticData;
};

interface IPurIndiv {
  name: string;
  value: number | 0;
}

const initialState: IPurData = {
  data: { branch: 0, warehouse: 0, department: 0 },
};

export const purSlice = createSlice({
  name: "invData",
  initialState,
  reducers: {
    updatePurDataAction: (state, action: PayloadAction<IPurIndiv>) => {
      state.data = {
        ...state.data,
        [action.payload.name]: action.payload.value,
      };
    },
    resetPurDataAction: (state) => {
      state.data = initialState.data;
    },
  },
});
export const { updatePurDataAction, resetPurDataAction } = purSlice.actions;
export const selectPurData = (state: RootState) => state.purData.data;
export default purSlice.reducer;
