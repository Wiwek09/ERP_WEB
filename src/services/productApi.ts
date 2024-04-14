import { IProduct } from "../interfaces/product";
import server from "../server/server";

export const getAllProducts = async () => {
  const response = await server.get("/api/MenuItemAPI/");
  return response.data;
};
export const getProduct = async (id: string) => {
  const response = await server.get(`/api/MenuItemAPI/?Id=${id}`);
  return response.data[0];
};

export const addProduct = async (data: IProduct) => {
  const response = await server.post("/api/MenuItemAPI/", data);
  if (response.data === -1) {
    throw "Invalid data";
  }
  return response.data;
};

export const addProductPhotoDetails = async (data:any) => {
  const response = await server.post("/api/MenuItemPhotoAPI",data);
  if (response.data === -1) {
    throw "Invalid data";
  }
  return response.data;
}

export const editProduct = async (id: string, data: IProduct) => {
  const response = await server.put(`/api/MenuItemAPI/${id}`, data);
  if (response.data === -1) {
    throw "Invalid data";
  }
  return response.data;
};

export const deleteProduct = async (id: number) => {
  const response = await server.delete(`/api/MenuItemAPI/?Id=${id}`);
  if (response.data === -1) {
    throw "Invalid data";
  }
  return response.data;
};

export const deletePriceRange = async (id : number) =>{

  const response = await server.delete(`/api/MenuItemPortionPriceRangeAPI/?Id=${id}`);
  if(response.data ===-1){
    throw "Invalid data";
  }
  return response.data;
}

export const deleteProductItem = async (id: number) => {
  const response = await server.delete(`/api/MenuItemPortionAPI/?Id=${id}`);
  if (response.data === -1) {
    throw "Invalid data";
  }
  return response.data;
};

export const deleteProductPhotoDetails = async (id:number) => {
  const response = await server.delete(`/api/MenuItemPhotoAPI?Id=${id}`);
  if (response.data === -1) {
    throw "Unable to delete product photo details";
  }
  return response.data;
}
export const editProductPhotoDetails = async (id:number,data:any) => {
  const response = await server.put(`/api/MenuItemPhotoAPI?Id=${id}`,data);
  if (response.data === -1) {
    throw "Unable to update product photo details";
  }
  return response.data;
}

export const editMenuItemPortion = async (id:number,qty:number,price:number) => {
  const response = await server.put(`/api/MenuItemPortionAPI?id=${id}&Qty=${qty}&QPrice=${price}`);
  if (response.data === -1) {
    throw "Invalid data";
  }
  return response.data;
}
export const editMenuItemPortionPriceRange = async (id:number,minQty:number,maxQty:number,price:number) => {
  const response = await server.put(`api/MenuItemPortionPriceRangeAPI?id=${id}&MinQty=${minQty}&MaxQty=${maxQty}&QPrice=${price}`);
  if (response.data === -1) {
    throw "Invalid data";
  }
  return response.data;
}