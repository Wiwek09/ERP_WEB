import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { ICompany } from "../../interfaces/company";

interface IStateProps {
  data: ICompany;
}

const initialState: IStateProps = {
  data: {
    Id: 0,
    BillFrontSizeItem: 0,
    BillFrontWeight: 0,
    BillFrontWeightHeader: 0,
    BillFrontWeightItem: 0,
    BillHeaderFront: "",
    BillFrontSizeHeader : 0,
    PrinterType : "",
    NameEnglish: "",
    NameNepali: "",
    Pan_Vat: "",
    Address: "",
    Street: "",
    City: "",
    District: "",
    Phone: "",
    Email: "",
    BranchCode: "",
    IRD_UserName: "",
    IRD_Password: "",
    PhotoIdentity: "",
    IdentityFileType: "",
    IdentityFileName: "",
    ServiceCharge: 0,
    Description: "",
    VATRate: 0,
    ExciseDuty: 0,
    IRD_SYS: "",
    FirstPageRow: 0,
  },
};

export const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setCompanyAction: (state, action: PayloadAction<ICompany>) => {
      state.data = action.payload;
    },
  },
});

export const { setCompanyAction } = companySlice.actions;

export const selectCompany = (state: RootState) => state.company.data;

export default companySlice.reducer;
