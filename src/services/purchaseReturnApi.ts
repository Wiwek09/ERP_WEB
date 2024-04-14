import { AnyAsyncThunk } from "@reduxjs/toolkit/dist/matchers";
import { IPurchase } from "../interfaces/purchase";
import { IAllAccountTransactionValue } from "../interfaces/purchaseReturn";
import server from "../server/server";

export const getAllPurchaseReturn = async (start: string, end: string) => {
  try {
    const res = await server.get(
      `/api/PurchaseAPI/?fromDate=${start}&toDate=${end}&TransactionTypeId=11`
    );
    return res.data;
  } catch (error) {
    return 0;
  }
};
export const getAllPurchaseReturnBook = async (
  monthName: string,
  FinYear: string
) => {
  try {
    const res = await server.get(
      `/api/PurchaseBookAPI/?sMonth=${monthName}&FinYear=${FinYear}&TransactionTypeId=11`
    );
    return res.data;
  } catch (error) {
    return 0;
  }
};
export const getRefNo = async (id: string, name: string) => {
  try {
    const res = await server.get(
      `/api/PurchaseAPI/?CustomerId=${id}&FinancialYear=${name}`
    );
    return res.data;
  } catch (error) {
    return 0;
  }
};

export const getAccountData = async () => {
  try {
    const res = await server.get(`/api/AccountAPI/GetAll/`);
    return res.data;
  } catch (error) {
    return 0;
  }
};

export const getAllItems = async (id: string, ref: string, name: string) => {
  try {
    const res = await server.get(
      `/api/PurchaseAPI/GetCustomerPurchaseDetail/?CustomerId=${id}&InvoiceNo=${ref}&FinancialYear=${name}`
    );
    return res.data;
  } catch (error) {
    return 0;
  }
};
export const getPurchaseReturn = async (id: string) => {
  try {
    const res = await server.get(`/api/PurchaseAPI/?TransactionId=${id}`);
    return res.data;
  } catch (error) {
    return 0;
  }
};
export const editPurchaseReturn = async (
  id: string,
  data: IAllAccountTransactionValue
) => {
  try {
    const res = await server.put(`/api/PurchaseAPI/?Id=${id}`, data);
    return res.data;
  } catch (error) {
    return 0;
  }
};
export const addPurchaseReturn = async (data: IAllAccountTransactionValue) => {
  try {
    const res = await server.post("/api/PurchaseAPI/", data);
    return res.data;
  } catch (error) {
    return 0;
  }
};
export const deletePurchaseReturn = async (
  id: string,
  purData: IAllAccountTransactionValue
) => {
  try {
    const res = await server.delete(`/api/PurchaseAPI/?Id=${id}`, {
      data: purData,
    });
    return res.data;
  } catch (error) {
    return 0;
  }
};
