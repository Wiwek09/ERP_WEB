import server from "./../server/server";
export const getAccountDebtorCreditor = async (fromDate: string, toDate: string, TypeId : string ) => {
    const res = await server.get(
        `/api/AccountLedgerView/AccountDebtorCreditor/?fromDate=${fromDate}&toDate=${toDate}&TypeId=${TypeId}`
    );
    return res.data;
  };
  