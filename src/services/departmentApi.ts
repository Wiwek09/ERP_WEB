import server from "../server/server";
import { IDepartment } from "../interfaces/department";

const getAllDepartments = async () => {
  const response = await server.get("/api/DepartmentAPI/");
  return response.data;
};

const getDepartment = async (id: string | number) => {
  const response = await server.get(`/api/DepartmentAPI/?id=${id}`);
  return response.data;
};

const addDepartment = async (data: IDepartment) => {
  const response = await server.post(`/api/DepartmentAPI/`, data);
  if (response.data === -1) {
    throw "Invalid data";
  }
  return response.data;
};

const updateDepartment = async (id: number | string, data: IDepartment) => {
  const response = await server.put(`/api/DepartmentAPI/?id=${id}`, data);
  if (response.data === -1) {
    throw "Invalid data";
  }
  return response.data;
};

const deleteDepartment = async (id: number | string, data: IDepartment) => {
  const response = await server.post(`/api/DepartmentAPI/?id=${id}`, data);
  if (response.data === -1) {
    throw "Invalid data";
  }
  return response.data;
};

export {
  getAllDepartments,
  getDepartment,
  addDepartment,
  updateDepartment,
  deleteDepartment,
};
