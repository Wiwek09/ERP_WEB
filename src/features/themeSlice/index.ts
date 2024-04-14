import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

interface ThemeState {
  value: string;
}

export const initialState: ThemeState = {
  value: "light",
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    changeTheme: (state, action: PayloadAction<"dark" | "light">) => {
      state.value = action.payload;
    },
  },
});
export const { changeTheme } = themeSlice.actions;
export const selectTheme = (state: RootState) => state.theme.value;
export default themeSlice.reducer;
