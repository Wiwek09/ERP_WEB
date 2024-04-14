import server from "../server/server";
import { INormalizedPosData } from "../views/posBilling/interface";

export const getAllProducts = async () => {
  const response = await server.get("/api/MenuCategoryItemAPI/");
  return response.data;
};

export const getAllLedger = async () => {
  const response = await server.get(
    "api/AccountAPI/?AccountTypeId=18&AccountGeneral=0&CustomerId=0"
  );
  return response.data;
};

export const postLedger = async (data: any) => {
  const response = await server.post("api/AccountAPI/", data);
  if (response.data === -1) {
    throw "Invalid data";
  }
  return response.data;
};

export const postPosBilling = async (data: INormalizedPosData) => {
  const response = await server.post("api/SaleBillingAPI/", data);
  if (response.data === -1) {
    throw "Invalid data";
  }
  return response.data;
};
