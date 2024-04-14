import { ISMS } from "../interfaces/sms";
import server from "../server/server";

const addSMSKey = async (data: ISMS) => {
  const response = await server.post("/api/SMSKeyAPI/", data);
  try {
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
const getAllSMSKey = async () => {
  const response = await server.get("/api/SMSKeyAPI/");
  try {
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
// const getCategory = async (id: string) => {
//   const response = await server.get(`/api/MenuCategoryAPI/?Id=${id}`);
//   try {
//     return response.data;
//   } catch (error) {
//     console.error(error);
//   }
// };
const editSMSKey = async (id: number, data: ISMS) => {
  const response = await server.put(`/api/SMSKeyAPI/?Id=${id}`, data);
  try {
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
const deleteSMSKey = async (id: number) => {
  const response = await server.delete(`/api/SMSKeyAPI/?Id=${id}`);
  try {
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
export { addSMSKey, getAllSMSKey, editSMSKey, deleteSMSKey };
