import server from "./../server/server";
export const getDebtorsAgeingReport = async (name: string) => {
  const res = await server.get(`/api/AccountLedgerView/DebtorAgeingReport/?FinancialYear=${name}&TypeId=18`
  );
  return res.data;
};
