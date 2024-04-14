import server from "./../server/server";
export const getAllItemWiseProfit = async (fromDate: string, toDate: string) => {
    const res = await server.get(
      `/api/StockInHand/GetItemWiseProfit/?fromDate=${fromDate}&toDate=${toDate}`
    );
    return res.data;
  };
  