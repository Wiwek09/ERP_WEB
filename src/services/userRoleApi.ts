import server from "../server/server";

const getAllRoles = async () => {
  const res = await server.get(`/api/HotelRole/GetRoles/`);
  try {
    return res.data;
  } catch (error) {
    return -1;
  }
};

const addRoles = async (data: any) => {
  const res = await server.post(`/api/HotelRole/PostRole/`, data);
  try {
    return res.data;
  } catch (error) {
    return -1;
  }
};

const getRole = async (id: string) => {
  const res = await server.get(`/api/HotelRole/GetRole/?id=${id}`);
  try {
    return res.data[0];
  } catch (error) {
    return -1;
  }
};

const editRoles = async (id: string, data: any) => {
  const res = await server.put(`/api/HotelRole/EditRole/?id=${id}`, data);
  try {
    return res.data;
  } catch (error) {
    return -1;
  }
};

export const deleteRoles = async (id: string) => {
  const res = await server.delete(`/api/HotelRole/DeleteRole/?Id=${id}`);
  try {
    return res.data;
  } catch (error) {
    return -1;
  }
};

export { getAllRoles, addRoles, getRole, editRoles };
