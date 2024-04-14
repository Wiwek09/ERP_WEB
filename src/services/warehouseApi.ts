import { IWarehouse } from "./../interfaces/warehouse";
import server from "../server/server";

const getAllWarehouseData = async () => {
  const res = await server.get(`/api/WareHouseAPI/`);
  try {
    return res.data;
  } catch (error) {
    return -1;
  }
};

export const getAllWarehouseType = async () => {
  try {
    const res = await server.get(`/api/WareHouseTypeAPI/`);
    return res.data;
  } catch (error) {
    return -1;
  }
};

export const getWarehouseData = async (id: string) => {
  const res = await server.get(`/api/WareHouseAPI/?Id=${id}`);
  return res.data;
};

export const addWarehouseData = async (allData: IWarehouse) => {
  const res = await server.post(`/api/WareHouseAPI/`, allData);
  try {
    return res.data;
  } catch (error) {
    return -1;
  }
};

const editWarehouseData = async (id: string, data: IWarehouse) => {
  const res = await server.put(`/api/WareHouseAPI/?Id=${id}`, data);
  return res.data;
};

const deleteWarehouseData = async (id: any) => {
  const res = await server.post(`/api/WareHouseAPI/?id=${id}`, {
    Id: id,
  });
  try {
    return res.data;
  } catch (error) {
    return -1;
  }
};

export { getAllWarehouseData, editWarehouseData, deleteWarehouseData };
