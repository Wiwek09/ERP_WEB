import { IProduct } from "../../../../interfaces/product";
import {
  addProduct,
  deleteProduct,
  editProduct,
} from "../../../../services/productApi";
import {
  successMessage,
  editMessage,
  errorMessage,
  deleteMessage,
} from "../../../../utils/messageBox/Messages";

export const addNewProduct = async (data: IProduct) => {
  const response = await addProduct(data);
  if (response > 0) {
    successMessage();
  } else {
    errorMessage();
  }
};

export const updateProduct = async (id: string, data: IProduct) => {
  const response = await editProduct(id, data);
  if (response > 0) {
    editMessage();
    return true;
  } else {
    errorMessage();
    return false;
  }
};

export const _deleteProduct_ = async (id: number) => {
  const response = await deleteProduct(id);
  if (response > 0) {
    deleteMessage();
    return true;
  } else {
    errorMessage();
    return false;
  }
};
