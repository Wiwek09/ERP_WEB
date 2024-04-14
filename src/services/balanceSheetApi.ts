import server from "../server/server";

export const getBalanceSheetAPI = async (Name: string) => {
  try {
    const res = await server.get(
      `/api/AccountBalanceSheetAPI/?FinancialYear=${Name}`
    );
    return res.data;
  } catch (error) {
    return -1;
  }
};
