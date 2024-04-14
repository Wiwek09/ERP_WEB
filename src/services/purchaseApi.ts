import { IPurchase } from "../interfaces/purchase";
import server from "../server/server";
import { errorMessage } from "../utils/messageBox/Messages";

export const getAllLedger = async () => {
  const response = await server.get(
    "api/AccountAPI/?AccountTypeId=1&AccountGeneral=1&CustomerId=1&CustomerType=1&PartyAccount=1&PartyType=1&PartyTypeName=1&PartyLst=1/"
  );
  return response.data;
};

export const getAllProducts = async () => {
  const response = await server.get("/api/MenuCategoryItemAPI/");
  return response.data;
};

export const getAllAccount = async () => {
  const response = await server.get("/api/AccountAPI/GetAll/");
  return response.data;
};

export const getAllPurchase = async (startDate: string, endDate: string) => {
  const response = await server.get(
    `api/PurchaseAPI/?fromDate=${startDate}&toDate=${endDate}&TransactionTypeId=9`
  );
  // console.log("All-Api-heck",response)
  return response.data;
};
export const getAllPurchaseBook = async (monthName: string, FinYear: string) => {
  const response = await server.get(
    `api/PurchaseBookAPI/?sMonth=${monthName}&FinYear=${FinYear}&TransactionTypeId=9`
  );
  return response.data;
};

export const getAllPurchaseFilteredByBranch = async (
  startDate: string,
  endDate: string,
  branchId: number
) => {
  const response = await server.get(
    `api/PurchaseAPI/?fromDate=${startDate}&toDate=${endDate}&TransactionTypeId=9&BranchId=${branchId}`//API for getting purchase details(Implementation of function in index.tsx)
  );
  return response.data;
};

export const getPurchase = async (id: any) => {
  const response = await server.get(`api/PurchaseAPI/?TransactionId=${id}`);
  // console.log("Fetch:",response.data)
  if (response.data === -1) {
    throw "Invalid purchase id";
  }
  return response.data;
};

export const addPurchase = async (data: IPurchase) => {
  const response = await server.post("api/PurchaseAPI/", data);
  if (response.data === -1) {
    throw "Invalid purchase id";
  }
  return response.data;
};

export const updatePurchase = async (id: any, data: any) => {
  const response = await server.put(`api/PurchaseAPI/?Id=${id}`, data);
  if (response.data === -1) {
    throw "Operation failed.";
  }
  return response.data;
};

export const deleteIndividualPurchase = async (id: number) => {
  const response = await server.delete(`api/PurchaseDetailsAPI/?Id=${id}`);
  if (response.data === -1) {
    throw "Opeation failed";
  }
  return response.data;
};

export const deletePurchase = async (data: any) => {
  const response = await server.delete(`api/PurchaseDetailsAPI/`, {
    data: data,
  });
  if (response.data === -1) {
    throw "Opeation failed";
  }
  return response.data;
};
export const checkInvoice = async (
  CustomerId: number,
  InvoiceNo: String,
  FinancialYear: String,
  StatusId:string
) => {
    const response = await server.get(
      `api/PurchaseAPI/GetCustomerPurchaseDetail/?CustomerId=${CustomerId}&InvoiceNo=${InvoiceNo}&FinancialYear=${FinancialYear}&StatusId=${StatusId}`
    );
    if (response.data !=0) {
      errorMessage("This Customer Invoice already entered");
      return false;
    } else {
      return true;
    }
  // }
};
