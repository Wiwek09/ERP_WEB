import server from "../server/server";

const getAllWarehouseTypes = async () => {
  const response = await server.get(`/api/WareHouseTypeAPI/`);
  try {
    return response.data;
  } catch (err) {
    console.error(err);
  }
};
const getWarehouseType = async (id: string) => {
  const response = await server.get(`/api/WareHouseTypeAPI/?
Id=${id}`);
  try {
    return response.data;
  } catch (err) {
    console.error(err);
  }
};
const addWarehouseType = async (data: any) => {
  const response = await server.post("/api/WareHouseTypeAPI/", data);
  try {
    return response.data;
  } catch (err) {
    console.error(err);
  }
};
const editWarehouseType = async (id: string, data: any) => {
  const response = await server.put(`/api/WareHouseTypeAPI/?Id=${id}`, data);
  try {
    return response.data;
  } catch (err) {
    console.error(err);
  }
};
const deleteWarehouseType = async (id: string) => {
  const response = await server.post(`/api/WareHouseTypeAPI/?
Id=${id}`);
  try {
    return response.data;
  } catch (err) {
    console.error(err);
  }
};
export {
  getAllWarehouseTypes,
  getWarehouseType,
  addWarehouseType,
  editWarehouseType,
  deleteWarehouseType,
};
