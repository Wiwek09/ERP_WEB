import { ICompany } from "../interfaces/company";
import server from "../server/server";

export const getCompanyApi = async () => {
  const response = await server.get("/api/company");
  return response.data[0];
};

export const editCompanyApi = async (data: ICompany, id: number) => {
  const response = await server.put(`api/Company/?id=${id}`, data);
  return response.data;
};

export const addCompanyApi = async (data: ICompany) => {
  const response = await server.post("/api/company", data);
  return response.data[0];
};
//
export const deleteCompanyApi = async (id: number) => {
  const response = await server.delete(`/api/company?id=${id}`);
  return response.data;
};
