import { IVoucher } from "../interfaces/voucher";
import server from "../server/server";
export const getAllReceipts = async (fromDate: string, toDate: string) => {
  const response = await server.get(
    `/api/AccountTransactionAPI/?fromDate=${fromDate}&toDate=${toDate}&TransactionTypeId=4`
  );
  try {
    return response.data;
  } catch {
    return -1;
  }
};

export const getAllReceiptsByBranchFilter = async (
  fromDate: string,
  toDate: string,
  branchId: number
) => {
  const response = await server.get(
    `/api/AccountTransactionAPI/?fromDate=${fromDate}&toDate=${toDate}&TransactionTypeId=4&BranchId=${branchId}`
  );
  try {
    return response.data;
  } catch {
    return -1;
  }
};

export const getReceipt = async (id: number) => {
  const response = await server.get(
    `/api/AccountTransactionAPI/?TransactionId=${id}`
  );
  try {
    return response.data;
  } catch {
    return -1;
  }
};

export const addReceipt = async (data: IVoucher) => {
  const response = await server.post(`/api/AccountTransactionAPI/`, data);
  try {
    return response.data;
  } catch {
    return -1;
  }
};

export const editReceipt = async (id: number, data: IVoucher) => {
  const response = await server.put(
    `/api/AccountTransactionAPI/?Id=${id}`,
    data
  );
  try {
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteReceipt = async (id: number, receiptData: IVoucher) => {
  const response = await server.delete(
    `/api/AccountTransactionAPI/?TransactionId=${id}`,
    {
      data: receiptData,
    }
  );
  try {
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getTotalDueAmount = async (
  ledgerId: number,
  transactionID: number
) => {
  const response = await server.get(
    `/api/AccountLedgerView/GetLedgerPreviousBalance/?LedgerId=${ledgerId}&TransactionId=${transactionID}`
  );
  try {
    return response.data;
  } catch {
    return -1;
  }
};
