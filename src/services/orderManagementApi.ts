import server from "../server/server";

export const getAllOrderManagement = async (
  start: string,
  end: string,
  year: string
) => {
  const res = await server.get(
    `/api/OrderManagementAPI/?dFrom=${start}&dTo=${end}&FinancialYear=${year}`
  );
  try {
    return res.data;
  } catch {
    return -1;
  }
};
export const getAllOrderManagementByBranch = async (
  start: string,
  end: string,
  year: string,
  branch: number
) => {
  const res = await server.get(
    `/api/OrderManagementAPI/?dFrom=${start}&dTo=${end}&FinancialYear=${year}&BranchId=${branch}`
  );
  return res.data;
};
export const getOrderManagement = async (id: string) => {
  const res = await server.get(`/api/OrderManagementAPI/?Id=${id}`);
  try {
    return res.data;
  } catch {
    return -1;
  }
};
export const addOrderManagement = async (data: any) => {
  const res = await server.post(`/api/OrderManagementAPI/`, data);
  try {
    if(res.data === -1){
      throw "invalid Data";
    }
    return res.data;
  } catch {
    return -1;
  }
};
//create invoice.
export const createInvoice = async (data: any) => {
  const response = await server.post("api/SaleBillingAPI/", data);
  if (response.data === -1) {
    throw "Invalid data";
  }
  return response.data;
};
export const editOrderManagement = async (id: string, data: any) => {
  const res = await server.put(`/api/OrderManagementAPI/?Id=${id}`, data);
  try {
    return res.data;
  } catch {
    return -1;
  }
};
export const deleteOrderManagementRow = async (id: string) => {
  const res = await server.delete(`/api/OrderManagementDetailAPI/?Id=${id}`);
  try {
    return res.data;
  } catch {
    return -1;
  }
};
export const deleteOrderManagement = async (id: string) => {
  const res = await server.delete(`/api/OrderManagementAPI/${id}`);
  try {
    return res.data;
  } catch {
    return -1;
  }
};