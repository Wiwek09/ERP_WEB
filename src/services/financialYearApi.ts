import server from "../server/server";
import { IFinancialYear } from "../interfaces/financialYear";

export const getAllFinancialYearApi = async () => {
  const response = await server.get("/api/FinancialYearAPI/");
  try {
    return response.data;
  } catch {
    return -1;
  }
};

export const getFinancial = async (id: string) => {
  const response = await server.get(`/api/FinancialYearAPI/?id=${id}`);
  try {
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const addFinancial = async (data: IFinancialYear) => {
  const response = await server.post("/api/FinancialYearAPI/", data);
  try {
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const editFinancial = async (id: string, data: IFinancialYear) => {
  const response = await server.put(`/api/FinancialYearAPI/?id=${id}`, data);
  try {
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteFinancial = async (id: string, data: IFinancialYear) => {
  const response = await server.post(`/api/FinancialYearAPI/?id=${id}`, data);
  try {
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
