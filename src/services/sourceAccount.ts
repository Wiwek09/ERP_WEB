import server from "../server/server";

export const getAllSourceAcount = async () => {
  const response = await server.get(
    "/api/AccountAPI/?AccountTypeId=1&AccountGeneral=1&CustomerId=1&CustomerType=1&PartyAccount=1&PartyType=1&PartyTypeBankCash=1"
  );
  try {
    return response.data;
  } catch {
    return -1;
  }
};
