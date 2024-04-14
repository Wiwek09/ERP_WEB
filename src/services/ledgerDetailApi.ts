import server from "./../server/server";
export const getAllLedgerOptions = async () => {
  const res = await server.get(`/api/AccountApi/GetAll`);
  return res.data;
};
export const getLedgerDetail = async (id: number, name: string, fromDate: string, toDate: string) => {
  const res = await server.get(
    `/api/AccountLedgerView/?LedgerId=${id}&FinancialYear=${name}&fromDate=${fromDate}&toDate=${toDate}`
  );
  // console.log("Hello Console from My",res.data);
  return res.data;
};

export const getLedgerDetails = async (idBranch: number, id: number, name: string, fromDate: string, toDate: string) => {
  const res = await server.get(
    `/api/AccountLedgerView/?BranchId=${idBranch}&LedgerId=${id}&FinancialYear=${name}&fromDate=${fromDate}&toDate=${toDate}`
  );
  // console.log("Hello Console from My",res.data);
  return res.data;
};
