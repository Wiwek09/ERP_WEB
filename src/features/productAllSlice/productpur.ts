import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { ISelectedProduct } from "../../interfaces/purchase";

// type IPurchaseData = {
//     data: ISelectedProduct;
// }
interface IPurchaseIndiv{
    name: string;
    value: any;
}
const initialState: ISelectedProduct = {
    // data: {
        PurchaseId: 0,
        AccountTransactionId: 0,
        AccountTransactionDocumentId: 0,
        Quantity: 0,
        PurchaseRate: 0,
        PurchaseAmount: 0,
        BeforePriceVAT:0,
        UnitType: "",
        CostPrice: 0,
        TotalPurchaseValue:0,
        MRPPrice: 0,
        MarginRate: 0,
        TaxRate: 0,
        ExciseDuty: 0,
        AfterExciseDuty: 0,
        ImportDutyRate: 0,
        ImportDuty: 0,
        AfterImportDuty:0,
        ExciseDutyRate: 0,
        ExtraImportDuty: 0,
        Transportation: 0,
        LabourCharge: 0,
        OtherCharge: 0,  
        AfterVatAmount: 0,
        AfterExchangeAmount: 0,
        Currency: "",
        CurrencyExchangeRate: 0,
        ImportRate: 0,
        ImportAmount: 0,  
        InventoryItemId: 0,
        FinancialYear: "",
        CompanyCode: 0,
        NepaliMonth: "",
        NVDate: "",
        UserName: "",
        Discount: 0,
        DepartmentId: 0,
        WareHouseId: 0,
        BranchId: 0,
        CurrentStock: 0,
    // }
};

export const purproSlice = createSlice({
    name: "invProData",
    initialState,
    reducers: {
        updatePurPorDataAction: (state, action: PayloadAction<IPurchaseIndiv>) => {
            state = {
                ...state,
                [action.payload.name]: action.payload.value,
            };
        },
        resetPurPorDataAction: (state) => {
            state = initialState;
        },
    },
});
export const { updatePurPorDataAction, resetPurPorDataAction } = purproSlice.actions;
export const selectPurData = (state: RootState) => state.purporData;
export default purproSlice.reducer;