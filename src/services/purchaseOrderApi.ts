import server from "../server/server";

export const getAllAccountHolder = async () => {
  const response = await server.get(
    "api/AccountAPI/?AccountTypeId=1&AccountGeneral=1&CustomerId=1&CustomerType=1&PartyAccount=1&PartyType=1/"
    // "api/AccountAPI/?AccountTypeId=1&AccountGeneral=1&CustomerId=1&CustomerType=1&PartyAccount=1&PartyType=1&PartyTypeName=1&PartyLst=1/"
  );
  try {
    return response.data;
  } catch {
    return -1;
  }
};
export const getAllPurchase = async () => {
  const response = await server.get("/api/MenuCategoryItemAPI/");
  try {
    return response.data;
  } catch {
    return -1;
  }
};
export const addPurchaseOrder = async (data: any) => {
  const response = await server.post("/api/PurchaseOrderAPI/", data);
  try {
    return response.data;
  } catch {
    return -1;
  }
};
export const getPurchaseOrder = async (id: string) => {
  const response = await server.get(`/api/PurchaseOrderAPI/?Id=${id}`);
  try {
    return response.data;
  } catch {
    return -1;
  }
};
export const editPurchaseOrder = async (id: string, data: any) => {
  const response = await server.put(`/api/PurchaseOrderAPI/?Id=${id}`, data);
  try {
    return response.data;
  } catch {
    return -1;
  }
};
export const deletePurchaseOrder = async (id: string) => {
  const response = await server.delete(`/api/PurchaseOrderAPI/?Id=${id}`);
  try {
    return response.data;
  } catch {
    return -1;
  }
};
export const deleteSinglePurchaseOrderRow = async (id: number) => {
  const response = await server.delete(`/api/PurchaseOrderAPI/?Id=${id}`);
  try {
    return response.data;
  } catch {
    return -1;
  }
};
export const getAllPurchaseOrder = async (
  start: string,
  end: string,
  year: string
) => {
  const response = await server.get(
    `/api/PurchaseOrderAPI/?dFrom=${start}&dTo=${end}&FinancialYear=${year}`
  );
  try {
    return response.data;
  } catch {
    return -1;
  }
};
export const getAllPurchaseOrderByBranch = async (
  start: string,
  end: string,
  year: string,
  branch: number
) => {
  const response = await server.get(
    `/api/PurchaseOrderAPI/?dFrom=${start}&dTo=${end}&FinancialYear=${year}&BranchId=${branch}`
  );

  return response.data;
};
