import server from "../server/server";
export const getAllQuotation = async (
  start: string,
  end: string,
  year: string
) => {
  const response = await server.get(
    `/api/QuotationAPI/?dFrom=${start}&dTo=${end}&FinancialYear=${year}`
  );
  try {
    return response.data;
  } catch {
    return -1;
  }
};
export const getAllQuotationByBranch = async (
  start: string,
  end: string,
  year: string,
  branch: number
) => {
  const response = await server.get(
    `/api/QuotationAPI/?dFrom=${start}&dTo=${end}&FinancialYear=${year}&BranchId=${branch}`
  );

  return response.data;
};

export const addQuotation = async (data: any) => {
  const response = await server.post("/api/QuotationAPI/", data);
  try {
    return response.data;
  } catch {
    return -1;
  }
};
export const editQuotation = async (id: string, data: any) => {
  const response = await server.put(`/api/QuotationAPI/?Id=${id}`, data);
  try {
    return response.data;
  } catch {
    return -1;
  }
};
export const deleteQuotation = async (id: string) => {
  const response = await server.delete(`/api/QuotationAPI/?Id=${id}`);
  try {
    return response.data;
  } catch {
    return -1;
  }
};
export const deleteQuotationRow = async (id: string) => {
  const response = await server.delete(`/api/QuotationDetailAPI/?Id=${id}`);
  try {
    return response.data;
  } catch {
    return -1;
  }
};
export const getQuotation = async (start: string, end: string, id: string) => {
  const response = await server.get(
    `/api/QuotationAPI/?fromDate=${start}&toDate=${end}&Id=${id}`
  );
  try {
    return response.data;
  } catch {
    return -1;
  }
};
