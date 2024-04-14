import server from "./../server/server";
export const getStockAgeingReport = async (name: string) => {
  const res = await server.get(`/api/StockInHand/GetItemWiseProfit/?FinancialYear=${name}&TypeId=18`
  );
  return res.data;
};
