import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface ISelectOtherInvoice {
    salesType: string | null;
    customer: number | null;
    vehicleNo: string | null;
    vehicleLength: string | null;
    vehicleWidth: string | null;
    vehicleHieght: string | null;
    ChallanNo : string | null;
    description: string;
}
type IInvoiceData = {
    data: ISelectOtherInvoice;
}
interface IPurchaseIndiv{
    name: string;
    value: any;
}
const initialState : IInvoiceData = {
    data: {
        salesType: null,
        customer: null,
        vehicleNo: null,
        vehicleLength: null,
        vehicleWidth: null,
        vehicleHieght: null,
        ChallanNo : null,
        description: ""
    }
};

export const invoiceSlice = createSlice({
    name: "invoiceOtherData",
    initialState,
    reducers: {
        updateInvOtherDataAction: (state, action: PayloadAction<IPurchaseIndiv>) => {
            state.data = {
                ...state.data,
                [action.payload.name]: action.payload.value,
            };
        },
        resetInvOtherDataAction: (state) => {
            state.data = initialState.data;
        },
    },
});
export const { updateInvOtherDataAction, resetInvOtherDataAction } = invoiceSlice.actions;
export const selectPurData = (state: RootState) => state.invotherData.data;
export default invoiceSlice.reducer;