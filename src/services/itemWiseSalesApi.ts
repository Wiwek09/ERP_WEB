import server from "../server/server";

export const getAllProducts = async () => {
    const response = await server.get("api/MenuCategoryItemAPI/");
    return response.data;
  };

export const getAllCustomers = async () => {
const response = await server.get(
    "api/AccountAPI/?AccountTypeId=1&AccountGeneral=1&CustomerId=1&CustomerType=1&PartyAccount=1&PartyType=1/"
);
return response.data;
};

export const getAllItemWiseSales = async (startDate: string, endDate: string) => {
    const response = await server.get(
      `api/SaleBillingAPI/GetItem/?fromDate=${startDate}&toDate=${endDate}&TransactionTypeId=3&ReportType=Day`
    );
    if (response.data === -1) {
      throw "Invalid date";
    }
    return response.data;
  };