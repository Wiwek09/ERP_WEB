import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface ISelectOtherPurchase {
  voucherType: string;
  customer: number;
  description: string;
}
type IPurchaseData = {
  data: ISelectOtherPurchase;
};
interface IPurchaseIndiv {
  name: string;
  value: any;
}
const initialState: IPurchaseData = {
  data: {
    voucherType: "",
    customer: 0,
    description: "",
  },
};

export const purotherSlice = createSlice({
  name: "invOtherData",
  initialState,
  reducers: {
    updatePurOtherDataAction: (
      state,
      action: PayloadAction<IPurchaseIndiv>
    ) => {
      state.data = {
        ...state.data,
        [action.payload.name]: action.payload.value,
      };
    },
    resetPurOtherDataAction: (state) => {
      state.data = initialState.data;
    },
  },
});
export const { updatePurOtherDataAction, resetPurOtherDataAction } =
  purotherSlice.actions;
export const selectPurData = (state: RootState) => state.purotherData.data;
export default purotherSlice.reducer;
