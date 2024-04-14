import server from "../server/server";

const getAllUnderLedger = async () => {
  const res = await server.get(`/api/AccountTypeAPI/`);
  try {
    return res.data;
  } catch (error) {
    return -1;
  }
};
const addUnderLedger = async (data: any) => {
  const res = await server.post(`/api/AccountTypeAPI/`, data);
  try {
    if (res) {
      return res.data;
    }
    return -1;
  } catch (error) {
    return -1;
  }
};
const getUnderLedger = async (id: string) => {
  const res = await server.get(`/api/AccountTypeAPI/?Id=${id}`);
  try {
    return res.data;
  } catch (error) {
    return -1;
  }
};
const editUnderLedger = async (id: string, data: any) => {
  const res = await server.put(`/api/AccountTypeAPI/?Id=${id}`, data);
  try {
    return res.data;
  } catch (error) {
    return -1;
  }
};
const deleteUnderLedger = async (id: string) => {
  const res = await server.delete(`/api/AccountTypeAPI/?id=${id}`);
  try {
    return res.data;
  } catch (error) {
    return -1;
  }
};

export {
  getAllUnderLedger,
  addUnderLedger,
  editUnderLedger,
  deleteUnderLedger,
  getUnderLedger,
};
