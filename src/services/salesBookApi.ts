import server from "../server/server";

export const getSalesBook = async (monthName: string, Name: string) => {
  try {
    const res = await server.get(
      `/api/AccountSaleBook/?Month=${monthName}&FinancialYear=${Name}`
    );
    return res.data;
  } catch (error) {
    return -1;
  }
};
