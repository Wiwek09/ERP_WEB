import server from "./../server/server";
export const getAllAccountBalance = async (startDate: string, endDate: string) => {
  const res = await server.get(
    `/api/accountprofitloss?fromdate=${startDate}&todate=${endDate}&branchid=0`
    // `api/accountprofitloss/?fromdate=2078.12.01&todate=2078.12.28&branchid=0`
    );
  if (res.data === -1) {
      throw "Invalid date";
    }
    return res.data;
};

export const getAllDayAmount = async (startDate: string, endDate: string) => {
  const res = await server.get(
    `/api/AccountProfitLoss?fromDate=${startDate}&toDate=${endDate}`
    // `/api/AccountProfitLoss?fromDate=2078.12.01&toDate=2078.12.28`
    );
  if (res.data === -1) {
      throw "Invalid date";
    }
    return res.data;
};
