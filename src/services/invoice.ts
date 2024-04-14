import server from "../server/server";

export const getAllProducts = async () => {
  const response = await server.get("api/MenuCategoryItemAPI/");
  return response.data;
};
export const getAllSaleBook = async (monthName: string, FinYear: string) => {
  const response = await server.get(
    `api/SaleBookAPI/?sMonth=${monthName}&FinYear=${FinYear}&TransactionTypeId=3`
  );
  if (response.data === -1) {
    throw "Invalid date";
  }
  return response.data;
};

export const getAllSales = async (startDate: string, endDate: string) => {
  const response = await server.get(
    `api/SaleBillingAPI/?fromDate=${startDate}&toDate=${endDate}&TransactionTypeId=3`
  );
  if (response.data === -1) {
    throw "Invalid date";
  }
  return response.data;
};

export const getAllSalesFilteredByBranch = async (
  startDate: string,
  endDate: string,
  branchId: number
) => {
  const response = await server.get(
    `api/SaleBillingAPI/?fromDate=${startDate}&toDate=${endDate}&TransactionTypeId=3&BranchId=${branchId}`
  );
  if (response.data === -1) {
    throw "Invalid date";
  }
  return response.data;
};
export const getAllSalesFilteredByBillno = async (
  startDate: string,
  endDate: string,
  branchId: number,
  financialyear: string,
  billno: string
) => {
  const response = await server.get(
    `api/SaleBillingAPI/?fromDate=${startDate}&toDate=${endDate}&TransactionTypeId=3&BranchId=${branchId}&Finyear=${financialyear}&billno=${billno}`
  );
  if (response.data === -1) {
    throw "Invalid date";
  }
  return response.data;
};

export const getAllCustomers = async () => {
  const response = await server.get(
    "api/AccountAPI/?AccountTypeId=1&AccountGeneral=1&CustomerId=1&CustomerType=1&PartyAccount=1&PartyType=1/"
  );
  return response.data;
};

export const postSales = async (data: any) => {
  const response = await server.post("api/SaleBillingAPI/", data);
  if (response.data === -1) {
    throw "Invalid data";
  }
  return response.data;
};

export const getSalesData = async (id: number | string) => {
  const response = await server.get(`api/SaleBillingAPI/?TransactionId=${id}`);
  if (response.data.Id === 0) {
    throw "Invalid Id";
  }
  if (response.data === -1 || response.data === 0) {
    throw "Invalid data";
  }
  return response.data;
};

export const getAllLedgerForCalculation = async () => {
  const response = await server.get("api/AccountAPI/GetAll/");
  return response.data;
};

export const updateSales = async (id: any, data: any) => {
  const response = await server.put(`api/SaleBillingAPI/?Id=${id}`, data);
  if (response.data === -1) {
    throw "Invalid data";
  }
  return response.data;
};

export const deleteAllSales = async (data: any) => {
  const response = await server.delete("api/SaleBillingAPI/", { data: data });
  if (response.data === -1) {
    throw "Invalid data";
  }
  return response.data;
};

export const deleteSales = async (id: number) => {
  const response = await server.delete(`api/SalesBillingDetailsAPI/?Id=${id}`);
  if (response.data === -1) {
    throw "Invalid data";
  }
  return response.data;
};
//for check print
export const getBill = async (id: number | string, printby: string) => {
  const response = await server.get(
    `api/SaleBillingAPI/GetBill/?Id=${id}&PrintedBy=${printby}`
  );
  if (response.data === -1) {
    throw "Invalid data";
  }
  return response.data;
};
export const getBillReprint = async (id: number | string) => {
  const response = await server.get(
    `api/SaleBillingAPI/GetBillReprint/?Id=${id}`
  ); //2486
  if (response.data === -1) {
    throw "Invalid data";
  }
  return response.data;
};
//Sales Reutn
export const getBillReturn = async (id: number | string, printby: string) => {
  const response = await server.get(
    `api/SalesBillingDetailsAPI/GetBillReturn/?Id=${id}&PrintedBy=${printby}`
  );
  if (response.data === -1) {
    throw "Invalid data";
  }
  return response.data;
};
