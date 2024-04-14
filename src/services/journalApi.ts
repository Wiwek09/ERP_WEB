import { IVoucher } from "../interfaces/voucher";
import server from "../server/server";

export const getAllJournals = async (fromDate: string, toDate: string) => {
  const response = await server.get(
    `/api/AccountTransactionAPI/?fromDate=${fromDate}&toDate=${toDate}&TransactionTypeId=5`
  );
  try {
    return response.data;
  } catch (error) {
    return -1;
  }
};

export const getAllJournalsByBranchFilter = async (
  fromDate: string,
  toDate: string,
  branchId: number
) => {
  const response = await server.get(
    `/api/AccountTransactionAPI/?fromDate=${fromDate}&toDate=${toDate}&TransactionTypeId=5&BranchId=${branchId}`
  );
  try {
    return response.data;
  } catch (error) {
    return -1;
  }
};

export const getJournal = async (id: number) => {
  const response = await server.get(
    `/api/AccountTransactionAPI/?TransactionId=${id}`
  );
  try {
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
export const addJournal = async (data: IVoucher) => {
  const response = await server.post(`/api/AccountTransactionAPI/`, data);
  try {
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const editJournal = async (id: number, data: IVoucher) => {
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

// /api/AccountTransactionAPI/?TransactionId=${params.id}

export const deleteJournal = async (id: number, journalData: IVoucher) => {
  const response = await server.delete(
    `/api/AccountTransactionAPI/?TransactionId=${id}`,
    {
      data: journalData,
    }
  );
  try {
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteJournalRow = async (id: number) => {
  const response = await server.delete(`/api/AccountTransValuesAPI/?Id=${id}`);
  try {
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
