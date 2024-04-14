import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { IUserLogin } from "../../interfaces/user";

interface IStateProps {
  data: IUserLogin;
}

const initialState: IStateProps = {
  data: {
    UserName: "",
    Password: "",
    RememberMe: false,
    financialYearValue: 0,
  },
};

export const rememberUserSlice = createSlice({
  name: "userRemember",
  initialState,
  reducers: {
    setRememberUserAction: (state, action: PayloadAction<IUserLogin>) => {
      state.data = action.payload;
    },
    clearRememberUserAction: (state) => {
      return initialState;
    },
  },
});

export const { setRememberUserAction, clearRememberUserAction } =
  rememberUserSlice.actions;

export const selectRememberUser = (state: RootState) => state.userRemember.data;
export default rememberUserSlice.reducer;
