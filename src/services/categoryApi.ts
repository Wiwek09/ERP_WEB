import { ICategory } from "../interfaces/category";
import server from "../server/server";

const getAllCategory = async () => {
  const response = await server.get("/api/MenuCategoryAPI/");
  try {
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getCategory = async (id: string) => {
  const response = await server.get(`/api/MenuCategoryAPI/?Id=${id}`);
  try {
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const addCategory = async (data: ICategory) => {
  const response = await server.post("/api/MenuCategoryAPI/", data);
  try {
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const editCategory = async (id: string, data: ICategory) => {
  const response = await server.put(`/api/MenuCategoryAPI/?Id=${id}`, data);
  try {
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
const deleteCategory = async (id: string) => {
  const response = await server.delete(`/api/MenuCategoryAPI/?Id=${id}`);
  try {
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export {
  getAllCategory,
  getCategory,
  addCategory,
  editCategory,
  deleteCategory,
};
