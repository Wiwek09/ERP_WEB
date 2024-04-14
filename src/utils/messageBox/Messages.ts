import { toast } from "react-toastify";
export const LoginSuccess = () => toast.success("Successfully Logged In");
export const LoginFailed = () => toast.error("Sorry, invalid credentials");
export const successMessage = (message?: string) =>
  toast.success(message ? message : "Successfully added");
export const editMessage = () => toast.success("Successfully updated");
export const deleteMessage = () => toast.success("Successfully deleted");
export const errorMessage = (message?: string) => {
  toast.dismiss();
  toast.error(message ? message : "Something went wrong");
};

export const deleteRowMessage = () =>
  toast.success("Item deleted successfully");
export const deletePRMessage = () =>
  toast.success("Price Range deleted successfully");
