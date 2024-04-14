import { IVoucher } from "../interfaces/voucher";
import server from "../server/server";
export const getAllPayments = async (fromDate: string, toDate: string) => {
  const response = await server.get(
    `/api/AccountTransactionAPI/?fromDate=${fromDate}&toDate=${toDate}&TransactionTypeId=6`
  );
  try {
    return response.data;
  } catch {
    return -1;
  }
};

export const getAllPaymentsByBranchFilter = async (
  fromDate: string,
  toDate: string,
  branchId: number
) => {
  const response = await server.get(
    `/api/AccountTransactionAPI/?fromDate=${fromDate}&toDate=${toDate}&TransactionTypeId=6&BranchId=${branchId}`
  );
  try {
    return response.data;
  } catch {
    return -1;
  }
};

export const getPayment = async (id: number) => {
  const response = await server.get(
    `/api/AccountTransactionAPI/?TransactionId=${id}`
  );
  try {
    return response.data;
  } catch {
    return -1;
  }
};

export const addPayment = async (data: IVoucher) => {
  const response = await server.post(`/api/AccountTransactionAPI/`, data);
  try {
    return response.data;
  } catch {
    return -1;
  }
};

export const editPayment = async (id: number, data: IVoucher) => {
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

export const deletePayment = async (id: number, paymentData: IVoucher) => {
  const response = await server.delete(
    `/api/AccountTransactionAPI/?TransactionId=${id}`,
    {
      data: paymentData,
    }
  );
  try {
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
