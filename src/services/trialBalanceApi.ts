import server from "./../server/server";
export const getAllTrialBalance = async (name: string) => {
  const res = await server.get(`/api/AccountTrialBalance/?FinancialYear=${name}`);
  return res.data;
};
