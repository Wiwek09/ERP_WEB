import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { IRoles } from "../../interfaces/roles";

interface IStateProps {
  data: IRoles;
}

const initialState: IStateProps = {
  data: {
    RoleName: "",
    Description: "",
    PermissionList: "",
    Selected: false,
    IsAdd: false,
    IsEdit: false,
    IsDelete: false,
    IsView: false,
    CreatedOn: false,
    CreatedBy: false,
    LastChangedDate: false,
    LastChangedBy: false,
    IsSysAdmin: false,
    Id: "",
    Name: "",
  },
};

export const userRoleSlice = createSlice({
  name: "userRoles",
  initialState,
  reducers: {
    setUserRoleAction: (state, action: PayloadAction<IRoles>) => {
      state.data = action.payload;
    },
    clearUserRoleAction: (state) => {
      return initialState;
    },
  },
});

export const { setUserRoleAction, clearUserRoleAction } = userRoleSlice.actions;
export const selectUserRoles = (state: RootState) => state.userRoles.data;
export default userRoleSlice.reducer;
