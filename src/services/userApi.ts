import server from "../server/server";
import { IUser, IUserLogin } from "../interfaces/user";

export const verifyUser = async ({ UserName, Password }: IUserLogin) => {
  const response = await server.post("/api/loginAPI", {
    UserName: UserName,
    Password: Password,
  });
  return response;
};

export const getUserApi = async (id: string) => {
  const response = await server.get(`/api/UserAccountAPI/GetUser/?id=${id}`);
  try {
    return response.data;
  } catch {
    return -1;
  }
};

export const getRolesApi = async (id: string) => {
  const response = await server.get(`/api/HotelRole/GetRole/?id=${id}`);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await server.get("/api/UserAccountAPI/GetUsers/");
  return response.data;
};
export const addUser = async (data: IUser) => {
  const response = await server.post(`/api/UserAccountAPI/CreateUser/`, data);
  try {
    return response.data;
  } catch {
    return -1;
  }
};

export const editUser = async (id: string, data: IUser) => {
  const res = await server.put(`/api/UserAccountAPI/EditUser/?id=${id}`, data);
  try {
    return res.data;
  } catch (error) {
    return -1;
  }
};

export const deleteUser = async (id: string) => {
  const response = await server.delete(
    `/api/UserAccountAPI/DeleteUser/?id=${id}`
  );
  try {
    return response.data;
  } catch {
    return -1;
  }
};
