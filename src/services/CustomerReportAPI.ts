import server from "./../server/server";
export const getCustomerReport = async (fromDate: string, toDate: string, TypeId : string ) => {
    const res = await server.get(
        `/api/AccountLedgerView/AccountDebtorCreditor/?fromDate=${fromDate}&toDate=${toDate}&TypeId=${TypeId}&FY=FA`
    );
    return res.data;
  };
