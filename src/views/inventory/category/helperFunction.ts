import { ICategory } from "../../../interfaces/category";
import {
  addCategory,
  deleteCategory,
  editCategory,
} from "../../../services/categoryApi";
import {
  deleteMessage,
  editMessage,
  errorMessage,
  successMessage,
} from "../../../utils/messageBox/Messages";

export const addNewCategory = async (category: ICategory, setCategory: any) => {
  const response = await addCategory(category);
  if (response === 1) {
    successMessage();
    setCategory({ ...category, Name: "" });
  } else {
    errorMessage();
  }
};

export const updateCategory = async (id: string, category: ICategory) => {
  const response = await editCategory(id, category);
  if (response === 1) {
    editMessage();
    return true;
  } else {
    errorMessage();
    return false;
  }
};

export const _deleteCategory_ = async (id: string) => {
  const response = await deleteCategory(id);
  if (response === 1) {
    deleteMessage();
    return true;
  } else {
    return false;
  }
};
