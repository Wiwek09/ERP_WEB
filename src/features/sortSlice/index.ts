import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cpuUsage } from "process";
import type { RootState } from "../../app/store";


type Order = 'asc' | 'desc';

interface ISortProps {
    order: Order,
    orderBy: string
}

const initialState: ISortProps = {
    order:'asc',
    orderBy:'VDate'
}

export const sortSlice = createSlice({
    name: "sort",
    initialState,
    reducers: {
      setSortAction: (state, action: PayloadAction<ISortProps>) => {
        return(state = action.payload);
      },
    },
  });

  export const { setSortAction } = sortSlice.actions;
  export const getSort = (state: RootState) => state.sort;
  export default sortSlice.reducer;