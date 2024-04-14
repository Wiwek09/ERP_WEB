import server from "../../../server/server";

export const addNewLedger = async (data: any) => {
  const response = await server.post("api/AccountAPI/", data);
  if (response.data === -1) {
    throw "Invalid ledger data";
  }
  return response.data;
};
