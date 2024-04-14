import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { IUser } from "../../interfaces/user";

interface IStateProps {
  data: IUser;
}

const initialState: IStateProps = {
  data: {
    Claims: [],
    Logins: [],
    Roles: [],
    FullName: "",
    UserName: "",
    Password: "",
    FirstName: "",
    LastName: "",
    RoleName: "",
    Level: 0,
    Email: "",
    PhoneNumber: "",
    IsActive: false,
    ResetPassword: false,
    JoinDate: "",
    Token: "",
    EmailConfirmed: false,
    PasswordHash: "",
    SecurityStamp: "",
    PhoneNumberConfirmed: false,
    TwoFactorEnabled: false,
    LockoutEndDateUtc: "",
    LockoutEnabled: false,
    AccessFailedCount: 0,
    Id: "",
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserAction: (state, action: PayloadAction<IUser>) => {
      state.data = action.payload;
    },
    clearUserAction: (state) => {
      return initialState;
    },
  },
});

export const { setUserAction, clearUserAction } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.data;
export default userSlice.reducer;
