import server from "../server/server";

const getAllMasterLedger = async () => {
  const res = await server.get(`/api/AccountAPI/getAll`);
  try {
    return res.data;
  } catch (error) {
    return -1;
  }
};
const getMasterLedger = async (id: any) => {
  const res = await server.get(`/api/AccountAPI/?id=${id}`);
  try {
    return res.data;
  } catch (error) {
    return -1;
  }
};

const getAllUnderLedger = async () => {
  const res = await server.get(`/api/AccountTypeAPI/`);
  try {
    if (res.data === null) {
      return -1;
    }
    return res.data;
  } catch (error) {
    return -1;
  }
};

const deleteMasterLedger = async (id: string) => {
  const res = await server.delete(`/api/AccountAPI/?Id=${id}`);
  try {
    return res.data;
  } catch (error) {
    return -1;
  }
};

const editMasterLedger = async (id: string, data: any) => {
  const res = await server.put(`/api/AccountAPI/?Id=${id}`, data);
  try {
    return res.data;
  } catch (error) {
    return -1;
  }
};
const addMasterLedger = async (data: any) => {
  const res = await server.post(`/api/AccountAPI/`, data);
  try {
    return res.data;
  } catch (error) {
    return -1;
  }
};

export {
  getAllMasterLedger,
  getAllUnderLedger,
  getMasterLedger,
  addMasterLedger,
  deleteMasterLedger,
  editMasterLedger,
};
