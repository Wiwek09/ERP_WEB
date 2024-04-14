import { IBillTerm } from "../interfaces/billTerm";
import server from "../server/server";

const getAllBillTerm = async () => {
  const response = await server.get("/api/BillTerm/");
  try {
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getBillTermById = async (id: string) => {
  const response = await server.get(`/api/BillTerm/?Id=${id}`);
  try {
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const addBillTerm = async (data: IBillTerm) => {
  const response = await server.post("/api/BillTerm/", data);
  try {
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const editBillTerm = async (id: string, data: IBillTerm) => {
  const response = await server.put(`/api/BillTerm/?Id=${id}`, data);
  try {
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
const deleteBillTerm = async (id: string) => {
  const response = await server.delete(`/api/BillTerm/?Id=${id}`);
  try {
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export {
  addBillTerm,
  deleteBillTerm,
  editBillTerm,
  getAllBillTerm,
  getBillTermById,
};
