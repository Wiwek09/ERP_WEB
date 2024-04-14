import { ISalesReturn } from "../interfaces/salesReturn";
import server from "../server/server";

export const getAllSalesReturn = async (monthName: string, FinYear: string) => {
  try {
    const res = await server.get(
      `api/SaleBookAPI/?sMonth=${monthName}&FinYear=${FinYear}&TransactionTypeId=10`
    );
    // console.log("Hello Yagya Nath Sales Return", res.data);

    return res.data;
  } catch (error) {
    return 0;
  }
};
export const getAllSalesReturnByBranch = async (
  start: string,
  end: string,
  branch: number
) => {
  try {
    const res = await server.get(
      `/api/SaleBillingAPI/?fromDate=${start}&toDate=${end}&TransactionTypeId=10&BranchId=${branch}`
    );
    return res.data;
  } catch (error) {
    return 0;
  }
};
export const getAllSalesReturnDataGird = async (start: string, end: string) => {
  try {
    const res = await server.get(
      `/api/SaleBillingAPI/?fromDate=${start}&toDate=${end}&TransactionTypeId=10`
    );
    return res.data;
  } catch (error) {
    return 0;
  }
};

export const getRefNo = async (id: string, name: string) => {
  try {
    const res = await server.get(
      `/api/SaleBillingAPI/?CustomerId=${id}&FinancialYear=${name}`
    );
    return res.data;
  } catch (error) {
    return 0;
  }
};

export const getAllItems = async (id: string, ref: string, name: string) => {
  try {
    const res = await server.get(
      `/api/SaleBillingAPI/?CustomerId=${id}&InvoiceNo=${ref}&FinancialYear=${name}`
    );
    return res.data;
  } catch (error) {
    return 0;
  }
};
export const getSalesReturn = async (id: string) => {
  try {
    const res = await server.get(`/api/SaleBillingAPI/?TransactionId=${id}`);
    return res.data;
  } catch (error) {
    return 0;
  }
};

export const editSalesReturn = async (id: string, data: ISalesReturn) => {
  try {
    const res = await server.put(`/api/SaleBillingAPI/?Id=${id}`, data);
    return res.data;
  } catch (error) {
    return 0;
  }
};

export const addSalesReturn = async (
  id: string,
  year: string,
  data: ISalesReturn
) => {
  try {
    const res = await server.post(
      `/api/SaleBillingAPI/?CustomerId=${id}&FinancialYear=${year}`,
      data
    );
    return res.data;
  } catch (error) {
    return 0;
  }
};

export const deleteSalesReturn = async (data: any) => {
  try {
    const res = await server.delete(`/api/SaleBillingAPI/`, data);
    return res.data;
  } catch (error) {
    return 0;
  }
};
