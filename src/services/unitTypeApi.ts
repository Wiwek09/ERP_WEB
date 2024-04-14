import { IUnitType } from "../interfaces/unitType";
import server from "../server/server";
const getAllUnitType = async () => {
  const response = await server.get("/api/UnitType/");
  try {
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getUnitType = async (id: string) => {
  const response = await server.get(`/api/UnitType/?id=${id}`);
  try {
    return response.data[0];
  } catch (error) {
    console.error(error);
  }
};

const addUnitType = async (data: IUnitType) => {
  const response = await server.post("/api/UnitType/", data);
  try {
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const editUnitType = async (id: string, data: IUnitType) => {
  const response = await server.put(`/api/UnitType/?id=${id}`, data);
  try {
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const deleteUnitType = async (id: string) => {
  const response = await server.delete(`/api/UnitType/DeleteUnit/?Id=${id}`);
  try {
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export {
  getAllUnitType,
  getUnitType,
  addUnitType,
  editUnitType,
  deleteUnitType,
};
