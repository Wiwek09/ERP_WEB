import server from "./../server/server";
export const getAllStockInHands = async (sEndDate : string, FYear: string) => {
  try {
    const res: any = await server.get(
      `/api/stockinhand/?sToDate=${sEndDate}&FinancialYear=${FYear}`
    );
    return res.data;
  } catch (error) {
    throw new Error("Data Not Found");
  }
};
