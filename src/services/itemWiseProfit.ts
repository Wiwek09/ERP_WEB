import server from "../server/server";

export const getAllItemWiseProfit = async (
  startDate: string,
  endDate: string,
  itemId: number
) => {
    const response = await server.get(
        `api/AccountProfitLoss?fromDate=${startDate}&toDate=${endDate}&ItemId=${itemId}&BranchId=0`
    );
    if (response.data === -1) {
      throw "Invalid date";
    }
    return response.data;
};