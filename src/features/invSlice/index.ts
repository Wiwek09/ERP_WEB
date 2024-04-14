import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

interface IInvStaticData {
  branch: number | null;
  warehouse: number | null;
  department: number | null;
}

type IInvData = {
  data: IInvStaticData;
};

interface IInvIndiv {
  name: string;
  value: number | null;
}

const initialState: IInvData = {
  data: { branch: null, warehouse: null, department: null },
};

export const invSlice = createSlice({
  name: "invData",
  initialState,
  reducers: {
    updateInvDataAction: (state, action: PayloadAction<IInvIndiv>) => {
      state.data = {
        ...state.data,
        [action.payload.name]: action.payload.value,
      };
    },
    resetInvDataAction: (state) => {
      state.data = initialState.data;
    },
  },
});
export const { updateInvDataAction, resetInvDataAction } = invSlice.actions;
export const selectInvData = (state: RootState) => state.invData.data;
export default invSlice.reducer;
