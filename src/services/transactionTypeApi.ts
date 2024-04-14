import server from "../server/server";

const getAllTransactionType = async () => {
  const res = await server.get(`/api/AccountTransactionTypeAPI/`);
  try {
    return res.data;
  } catch (error) {
    return error;
  }
};
const addTransactionType = async (data: any) => {
  const res = await server.post(`/api/AccountTransactionTypeAPI/`, data);
  try {
    return res.data;
  } catch (error) {
    return error;
  }
};
const editTransactionType = async (id: string, data: any) => {
  const res = await server.put(
    `/api/AccountTransactionTypeAPI/?Id=${id}`,
    data
  );

  try {
    return res.data;
  } catch (error) {
    return -1;
  }
};
const deleteTransactionType = async (id: string) => {
  const res = await server.delete(`/api/AccountTransactionTypeAPI/?Id=${id}`);

  try {
    return res.data;
  } catch (error) {
    return -1;
  }
};

export {
  addTransactionType,
  editTransactionType,
  deleteTransactionType,
  getAllTransactionType,
};
