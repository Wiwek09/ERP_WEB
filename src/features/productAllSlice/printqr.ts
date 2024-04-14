import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface PrintSetting {
  imageSize: number;
  imagesNum: number;
  rowGap: number;
  columnGap: number;
  marginTop: number;
  marginLeft: number;
}
interface initialStateType {
  QrValue: string;
  printSetting: PrintSetting;
  activeTab: string;
}
const initialState: initialStateType = {
  QrValue: "",
  printSetting: {
    imageSize: 120,
    imagesNum: 1,
    rowGap: 10,
    columnGap: 10,
    marginTop: 10,
    marginLeft: 5,
  },
  activeTab: "qrcode",
};

export const printqrSlice = createSlice({
  name: "printqr",
  initialState,
  reducers: {
    toggleQrValue(state, action) {
      state.QrValue = action.payload;
    },
    updatePrintSetting(state, action) {
      state.printSetting = {
        ...state.printSetting,
        imagesNum: +action.payload.imagesNum,
        imageSize: +action.payload.imageSize,
        rowGap: +action.payload.rowGap,
        columnGap: +action.payload.columnGap,
        marginTop: +action.payload.marginTop,
        marginLeft: +action.payload.marginLeft,
      };
    },
    updateActiveTab(state, action) {
      state.activeTab = action.payload;
    },
  },
});

export const { toggleQrValue, updatePrintSetting, updateActiveTab } =
  printqrSlice.actions;
export const selectPrintQrData = (state: RootState) => state.printqrData;

export default printqrSlice.reducer;
