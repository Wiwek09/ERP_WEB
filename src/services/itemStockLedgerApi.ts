import server from "./../server/server";
export const getAllItemStockLedger = async (id: number, date: string) => {
  try {
    const res = await server.get(
      `/api/InventoryItemLedgerAPI/?ItemId=${id}&FinancialYear=${date}`
    );
    return res.data;
  } catch (error) {
    throw new Error("Data Not Found");
  }
};
export const getAllItemStockLedgers = async (id: number | null) => {
  try {
    const res = await server.get(
      `/api/InventoryItemLedgerAPI/?ItemId=${id}`
    );
    return res.data;
  } catch (error) {
    throw new Error("Data Not Found");
  }
};
