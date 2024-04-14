import server from "../server/server";

export const getProfitAndLossAPI = async (Name: string) => {
  try {
    const res = await server.get(
      `/api/AccountProfitLoss/?FinancialYear=${Name}`
    );
    return res.data;
  } catch (error) {
    return -1;
  }
};
